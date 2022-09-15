import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from '@solana/web3.js'
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider: FC<{children: ReactNode}> = ({children}) => {
    const endpoint = useMemo(() => web3.clusterApiUrl('devnet'), [])
    const phantom = useMemo(() => new walletAdapterWallets.PhantomWalletAdapter(),[])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[phantom]} autoConnect={true} >
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletContextProvider