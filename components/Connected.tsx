import { Button, Container, Heading, HStack, Text, VStack, Image } from "@chakra-ui/react";
import { CandyMachine, Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";

const Connected: FC = () => {

    const { connection } = useConnection()
    const walletAdapter = useWallet()
    const [candyMachine, setCandyMachine] = useState<CandyMachine>()

    const metaplex = useMemo(() => {
        return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    }, [connection, walletAdapter])

    useEffect(() => {
        if(!metaplex) return

        metaplex.
        candyMachines()
        .findByAddress({address: new PublicKey("72wgu6cY72qLXNXk1sw7KBwqupgJLb4zkbS1ATgdtvWz")})
        .run()
        .then((candyMachine) => {
            console.log(candyMachine)
            setCandyMachine(candyMachine)
        })
        .catch((error) => {
            alert(error)
        })
    },[metaplex])

    const router = useRouter()

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback( 
        (event) => {
            if (event.defaultPrevented) return
            if (!candyMachine || !walletAdapter.connected) return

            console.log("Mint!")
            metaplex.candyMachines().mint({ candyMachine } ).run()
                .then((nft) => {
                    console.log(nft)
                    router.push(`/newMint?mint=${nft.nft.address.toBase58()}`) 
                })
                .catch((error) => {
                    alert(error)
                    console.error(error)
                })
    }
    , [candyMachine, metaplex, router, walletAdapter.connected])

    return (
        <VStack spacing={20}>
            <Container>
                <VStack spacing={8}>
                    <Heading color='white' as='h1' size='2xl' noOfLines={1} textAlign='center'>
                        Welcome Buildoor.
                    </Heading>
                    <Text color='bodyText' fontSize='xl' textAlign='center'>
                        Each buildoor is randomly generated and can be staked to receive <Text as='b'>$BLD</Text>. Use your <Text as='b'>$BLD</Text> to upgrade your buildoor and receive perks within the community!
                    </Text>
                </VStack>
            </Container>

            <HStack spacing={10}>
                <Image src='avatar1.png' alt='' />
                <Image src='avatar2.png' alt='' />
                <Image src='avatar3.png' alt='' />
                <Image src='avatar4.png' alt='' />
                <Image src='avatar5.png' alt='' />
            </HStack>

            <Button bgColor='accent' color='white' maxW='380px' onClick={handleClick} ><Text>mint buildoor</Text></Button>
        </VStack>
    ) 
}

export default Connected