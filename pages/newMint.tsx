import type { NextPage } from "next";
import {
  VStack,
  Container,
  Heading,
  Text,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useRouter } from "next/router";

const NewMint: NextPage<NewMintProps> = ({ mintAddress }) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [metadata, setMetadata] = useState<any>();
  const [metaplex, setMetaplex] = useState<Metaplex>();
  const router = useRouter();

  useEffect(() => {
    setMetaplex(
      Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    );
  }, [connection, walletAdapter]);

  useEffect(() => {
    if (!metaplex) return;
    const mint = new PublicKey(mintAddress);
    metaplex
      .nfts()
      .findByMint({ mintAddress: mint })
      .run()
      .then((nft) => {
        fetch(nft.uri)
          .then((res) => res.json())
          .then((metadata) => {
            console.log(`after metadata=${metadata}, mint=${mint}`);
            setMetadata(metadata);
          });
      })
      .catch((error) => console.error(error));
  }, [mintAddress, metaplex]);

  // TODO useCallback necessary?
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    console.log("stake button");
    if (!metaplex || !walletAdapter.connected) return;

    router.push(`/stake?mint=${mintAddress}&imageSrc=${metadata?.image}`);
  };

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
  );
};

interface NewMintProps {
  mintAddress: string;
}
// TODO is there a way to use new PublicKey and have page still work on reload?
// getServerSideProps requires props to be JSON serializable -- which would mean passing in a string type to the page
// getStaticProps requires info to be known at build time -- which the mint address will not be known at build time
// getInitialProps runs on the server side initially -- like getServerSideProps; so the props must be JSON serializable. The function will then run on the client side.
NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query;

  if (!mint) throw { error: "no mint" };

  return { mintAddress: mint as string };
};

export default NewMint;
