import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import anchor, { AnchorProvider, Idl, Program, setProvider } from "@coral-xyz/anchor";
import { utf8 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@chakra-ui/react';
import { TodoSol } from "./generated/todo_sol";
import IDL from "./generated/idl/todo_sol.json";

const USER_TAG = "USER_STATE";
const TODO_TAG = "TODO_STATE";

export function useTodo() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const toast = useToast();

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [todos, setTodos] = useState([]);
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
    setProvider(provider);
    // return new Program<TodoSol>(IDL as TodoSol, provider);
    return anchor.workspace.TodoSol as Program<TodoSol>;
  }, [connection, anchorWallet]);

  // useEffect(() => {
  //   const findProfileAccounts = async () => {
  //     if (!program || !publicKey || transactionPending) return;

  //     try {
  //       setLoading(true);
  //       const [pda, bump] = PublicKey.findProgramAddressSync(
  //         [utf8.encode(USER_TAG), publicKey.toBuffer()],
  //         program.programId,
  //       );
  //       const profileAccount = await program.account.userProfile.fetch(pda);
  //       if (!profileAccount) {
  //         setInitialized(false);
  //         return;
  //       }

  //       setLastTodo(profileAccount.lastTodo);
  //       setInitialized(true);
  //       const todoAccounts = await program.account.todoAccount.all(
  //         [authorOnly(publicKey.toBase58())]
  //       );
  //       setTodos(todoAccounts);
  //     } catch (err) {
  //       setInitialized(false);
  //       setTodos([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   findProfileAccounts();
  // }, [publicKey, program, transactionPending]);

  // const initializeUser = async () => {
  //   if (!program || !publicKey) return;

  //   try {
  //     setTransactionPending(true);
  //     const [pda, bump] = PublicKey.findProgramAddressSync(
  //       [utf8.encode(USER_TAG), publicKey.toBuffer()],
  //       program.programId,
  //     );

  //     const tx = await program.methods
  //       .initialize()
  //       .accounts({
  //         authority: publicKey,
  //         userProfile: pda,
  //         systemProgram: SYSTEM_PROGRAM_ID,
  //       })
  //       .rpc()
  //     setInitialized(true);
  //     toast({
  //       title: "User initialized",
  //       description: `Successfully initialized user. Transaction: ${tx}`,
  //       status: "success",
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Error initializing user",
  //       description: (err as Error).toString(),
  //       status: "error",
  //       isClosable: true,
  //     });
  //   } finally {
  //     setTransactionPending(false);
  //   }
  // };

  // const addTodo = async () => {
  //   if (!program || !publicKey) return;

  //   try {
  //     setTransactionPending(true);
  //     const [profilePda, profileBump] = PublicKey.findProgramAddressSync(
  //       [utf8.encode(USER_TAG), publicKey.toBuffer()],
  //       program.programId,
  //     );
  //     const [todoPda, todoBump] = PublicKey.findProgramAddressSync(
  //       [utf8.encode(TODO_TAG), publicKey.toBuffer(), Buffer.from([lastTodo])],
  //       program.programId,
  //     );
  //     const content = prompt("Enter todo content");
  //     if (!content) {
  //       setTransactionPending(false);
  //       return;
  //     }

  //     await program.methods
  //       .addTodo(content)
  //       .accounts({
  //         userProfile: profilePda,
  //         todoAccount: todoPda,
  //         authority: publicKey,
  //         systemProgram: SYSTEM_PROGRAM_ID,
  //       })
  //       .rpc()

  //     toast({
  //       title: "Todo added",
  //       description: `Successfully added todo.`,
  //       status: "success",
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Error adding todo",
  //       description: (err as Error).toString(),
  //       status: "error",
  //       isClosable: true,
  //     });
  //   } finally {
  //     setTransactionPending(false);
  //   }
  // };

  // const markTodo = async (todoPda: PublicKey, todoIdx: number) => {
  //   if (!program || !publicKey) return;

  //   try {
  //     setTransactionPending(true);
  //     setLoading(true);
  //     const [pda, bump] = PublicKey.findProgramAddressSync(
  //       [utf8.encode(USER_TAG), publicKey.toBuffer()],
  //       program.programId,
  //     );

  //     await program.methods
  //       .markTodo(todoIdx)
  //       .accounts({
  //         userProfile: pda,
  //         todoAccount: todoPda,
  //         authority: publicKey,
  //         systemProgram: SYSTEM_PROGRAM_ID,
  //       })
  //       .rpc();

  //     toast({
  //       title: "Marking todo",
  //       description: "Successfully marked todo.",
  //       status: "info",
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Error marking todo",
  //       description: (err as Error).toString(),
  //       status: "error",
  //       isClosable: true,
  //     });
  //   } finally {
  //     setLoading(false);
  //     setTransactionPending(false);
  //   }
  // };

  // const removeTodo = async (todoPda: PublicKey, todoIdx: number) => {
  //   if (!program || !publicKey) return;

  //   try {
  //     setTransactionPending(true);
  //     setLoading(true);
  //     const [pda, bump] = PublicKey.findProgramAddressSync(
  //       [utf8.encode(USER_TAG), publicKey.toBuffer()],
  //       program.programId,
  //     );

  //     await program.methods
  //       .removeTodo(todoIdx)
  //       .accounts({
  //         userProfile: pda,
  //         todoAccount: todoPda,
  //         authority: publicKey,
  //         systemProgram: SYSTEM_PROGRAM_ID,
  //       })
  //       .rpc();

  //     toast({
  //       title: "Removing todo",
  //       description: "Successfully removed todo.",
  //       status: "info",
  //       isClosable: true,
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Error removing todo",
  //       description: (err as Error).toString(),
  //       status: "error",
  //       isClosable: true,
  //     });
  //   } finally {
  //     setLoading(false);
  //     setTransactionPending(false);
  //   }
  // };

  // const notCompletedTodos = useMemo(() => todos.filter((todo) => !todo.account.marked), [todos]);
  // const completedTodos = useMemo(() => todos.filter((todo) => todo.account.marked), [todos]);

  return {
    // initializeUser,
    // addTodo,
    // markTodo,
    // removeTodo,
    // notCompletedTodos,
    // completedTodos,
  };
}
