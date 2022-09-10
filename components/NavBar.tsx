import { FC } from "react";
import { HStack, Spacer } from "@chakra-ui/react";
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui'

const NavBar: FC = () => {
    return (
        <HStack width="full" padding={4}>
            <Spacer />
            <WalletMultiButton></WalletMultiButton>
        </HStack>
    )
}

export default NavBar