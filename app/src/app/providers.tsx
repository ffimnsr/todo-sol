"use client"

import { useMemo } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export function Providers({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) return "https://api.devnet.solana.com";

    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
  ], [network]);
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode="light" />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ChakraProvider>
  );
}
