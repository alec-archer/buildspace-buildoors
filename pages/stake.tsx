import type { NextPage } from "next";
import {
  VStack,
  Container,
  Heading,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import Unstaked from "../components/Unstaked";
import Staked from "../components/Staked";

const Stake: NextPage<StakeProps> = ({ mint, imageSrc }) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [nftData, setNftData] = useState<
    Nft | NftWithToken | Sft | SftWithToken
  >();
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);
  const [isStaked, setIsStaked] = useState<boolean>(false);

  const stake = () => setIsStaked(true);
  const unstake = () => setIsStaked(false);

  useEffect(() => {
    metaplex
      .nfts()
      .findByMint({ mintAddress: mint })
      .run()
      .then((nft) => {
        setNftData(nft);
      })
      .catch((error) => console.error(error));
  }, [mint, metaplex, walletAdapter]);

  return (
    <MainLayout>
      <VStack spacing={20} justify="flex-start" align="flex-start">
        <Heading color="white" as="h1" size="2xl">
          Level up your buildoor
        </Heading>

        <Text color="bodyText" fontSize="xl" textAlign="left">
          Stake your buildoor to earn 10 $BLD per day and to get access to a
          randomized loot box full of upgrades for your buildoor
        </Text>
        <Container>
          <HStack>
            <Image src={imageSrc} alt="buildoor image" />
            {isStaked ? (
              <Staked onClick={unstake} nftData={nftData} />
            ) : (
              <Unstaked onClick={stake} nftData={nftData} />
            )}
          </HStack>
        </Container>
      </VStack>
    </MainLayout>
  );
};

interface StakeProps {
  mint: PublicKey;
  imageSrc: any;
}

Stake.getInitialProps = async ({ query }) => {
  const { mint, imageSrc } = query;

  if (!mint) throw { error: "no mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey, imageSrc };
  } catch {
    throw { error: "invalid mint" };
  }
};

export default Stake;
