import type { NextPage } from "next";
import { VStack, Container, Heading, Text, Image, HStack, Button } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

const NewMint: NextPage<NewMintProps> = ({mint}) => {
    const walletAdapter = useWallet()
    const {connection} = useConnection()
    const [metadata, setMetadata] = useState<any>()
    const metaplex = useMemo(() => {
      return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    },[connection, walletAdapter])

    useEffect(() => {
      metaplex
        .nfts()
        .findByMint({ mintAddress: mint })
        .run()
        .then((nft) => {
          fetch(nft.uri)
            .then((res) => res.json())
            .then((metadata) => {
              setMetadata(metadata)
            })
        }).catch((error) => console.error(error))
    }, [mint, metaplex, walletAdapter])

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(()=> console.log('mmmh, stake'),[])

    return (
        <MainLayout>
      <VStack spacing={20}>
        <Container>
          <VStack spacing={8}>
            <Heading color="white" as="h1" size="2xl" textAlign="center">
              😮 A new buildoor has appeared!
            </Heading>

            <Text color="bodyText" fontSize="xl" textAlign="center">
              Congratulations, you minted a lvl 1 buildoor! <br />
              Time to stake your character to earn rewards and level up.
            </Text>
          </VStack>
        </Container>

        <Image src={metadata?.image ?? ""} alt="" />

        <Button
          bgColor="accent"
          color="white"
          maxW="380px"
          onClick={handleClick}
        >
          <HStack>
            <Text>stake my buildoor</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
</MainLayout>
    )
}

interface NewMintProps {
  mint: PublicKey
}

NewMint.getInitialProps = async( {query}) => {
  const {mint} = query

  if (!mint) throw { error: "no mint" }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey }
  } catch {
    throw { error: "invalid mint" }
  }
}

export default NewMint