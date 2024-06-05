import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import { AnchorProvider, Program, ProgramAccount } from "@coral-xyz/anchor";
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@chakra-ui/react';
import { TodoSol } from "./generated/todo_sol";
import IDL from "./generated/idl/todo_sol.json";

const USER_TAG = "USER_STATE";
const TODO_TAG = "TODO_STATE";

export type Todo = {
  bump: number;
  idx: number;
  content: string;
  marked: boolean;
};

export function useTodo() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const toast = useToast();

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [todos, setTodos] = useState<ProgramAccount<Todo>[]>([]);
  const [lastTodo, setLastTodo] = useState(0);

  const authorOnly = (pubkey: string) => ({
    memcmp: {
      offset: 8,
      bytes: pubkey,
    },
  });

  const program = useMemo(() => {
    if (!anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
    return new Program<TodoSol>(IDL as TodoSol, provider);
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findProfileAccounts = async () => {
      if (!program || !anchorWallet || transactionPending) return;

      try {
        setLoading(true);
        const [pda, bump] = PublicKey.findProgramAddressSync(
          [utf8.encode(USER_TAG), anchorWallet.publicKey.toBuffer()],
          program.programId,
        );
        const profileAccount = await program.account.userProfile.fetch(pda);
        if (!profileAccount) {
          setInitialized(false);
          return;
        }

        console.log(pda.toBase58());
        console.log(profileAccount.lastTodo);
        console.log(profileAccount.todoCount);
        setLastTodo(profileAccount.lastTodo);
        setInitialized(true);
        const todoAccounts = await program.account.todoAccount.all(
          [authorOnly(anchorWallet.publicKey.toBase58())]
        );
        setTodos(todoAccounts);
      } catch (err) {
        setInitialized(false);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    findProfileAccounts();
  }, [anchorWallet, program, transactionPending]);

  const initializeUser = async () => {
    if (!program || !anchorWallet) return;

    try {
      setTransactionPending(true);
      const [pda, bump] = PublicKey.findProgramAddressSync(
        [utf8.encode(USER_TAG), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );

      const tx = await program.methods
        .initialize()
        .accounts({
          authority: anchorWallet.publicKey,
        })
        .rpc()
      setInitialized(true);
      toast({
        title: "User initialized",
        description: `Successfully initialized user. Transaction: ${tx}`,
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error initializing user",
        description: (err as Error).toString(),
        status: "error",
        isClosable: true,
      });
    } finally {
      setTransactionPending(false);
    }
  };

  const addTodo = async () => {
    if (!program || !anchorWallet) return;

    try {
      setTransactionPending(true);
      const [profilePda, profileBump] = PublicKey.findProgramAddressSync(
        [utf8.encode(USER_TAG), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );
      const [todoPda, todoBump] = PublicKey.findProgramAddressSync(
        [utf8.encode(TODO_TAG), anchorWallet.publicKey.toBuffer(), Buffer.from([lastTodo])],
        program.programId,
      );
      const content = prompt("Enter todo content");
      if (!content) {
        setTransactionPending(false);
        return;
      }

      await program.methods
        .addTodo(content)
        .accounts({
          todoAccount: todoPda,
          authority: anchorWallet.publicKey,
        })
        .rpc()

      toast({
        title: "Todo added",
        description: `Successfully added todo.`,
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error adding todo",
        description: (err as Error).toString(),
        status: "error",
        isClosable: true,
      });
    } finally {
      setTransactionPending(false);
    }
  };

  const markTodo = async (todoPda: PublicKey, todoIdx: number) => {
    if (!program || !anchorWallet) return;

    try {
      setTransactionPending(true);
      setLoading(true);
      const [pda, bump] = PublicKey.findProgramAddressSync(
        [utf8.encode(USER_TAG), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .markTodo(todoIdx)
        .accounts({
          todoAccount: todoPda,
          authority: anchorWallet.publicKey,
        })
        .rpc();

      toast({
        title: "Marking todo",
        description: "Successfully marked todo.",
        status: "info",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error marking todo",
        description: (err as Error).toString(),
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setTransactionPending(false);
    }
  };

  const removeTodo = async (todoPda: PublicKey, todoIdx: number) => {
    if (!program || !anchorWallet) return;

    try {
      setTransactionPending(true);
      setLoading(true);
      const [pda, bump] = PublicKey.findProgramAddressSync(
        [utf8.encode(USER_TAG), anchorWallet.publicKey.toBuffer()],
        program.programId,
      );

      await program.methods
        .removeTodo(todoIdx)
        .accounts({
          todoAccount: todoPda,
          authority: anchorWallet.publicKey,
        })
        .rpc();

      toast({
        title: "Removing todo",
        description: "Successfully removed todo.",
        status: "info",
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error removing todo",
        description: (err as Error).toString(),
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setTransactionPending(false);
    }
  };

  const notCompletedTodos = useMemo(() => todos.filter((todo) => !todo.account.marked), [todos]);
  const completedTodos = useMemo(() => todos.filter((todo) => todo.account.marked), [todos]);

  return {
    initialized,
    loading,
    transactionPending,
    initializeUser,
    addTodo,
    markTodo,
    removeTodo,
    notCompletedTodos,
    completedTodos,
  };
}

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
