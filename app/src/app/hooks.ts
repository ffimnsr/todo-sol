import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';
import { AnchorProvider, Idl, Program, setProvider } from "@coral-xyz/anchor";
import IDL from "./generated/idl/todo_sol.json";

export function useTodo() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [todos, setTodos] = useState([]);
  const [lastTodo, setLastTodo] = useState(0);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
      setProvider(provider);
      return new Program<Idl>(IDL as Idl, provider);
    }
  }, [connection, anchorWallet]);
}
