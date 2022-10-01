import type { NextPage } from "next";
import {
  VStack,
  Heading,
  Text,
  Image,
  HStack,
  Flex,
  Center,
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
import { ItemBox } from "../components/ItemBox";
import StakeOptionsDisplay from "../components/StakeOptionsDisplay";

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
  const [level, setLevel] = useState<number>(1);

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
        <HStack spacing={20} alignItems="flex-start">
          <VStack align="flex-start" minWidth="200px">
            <Flex direction="column">
              <Image src={imageSrc ?? ""} alt="buildoor nft" zIndex="1" />
              <Center
                bgColor="secondaryPurple"
                borderRadius="0 0 8px 8px"
                marginTop="-8px"
                zIndex="2"
                height="32px"
              >
                <Text
                  color="white"
                  as="b"
                  fontSize="md"
                  width="100%"
                  textAlign="center"
                >
                  {isStaked ? "STAKING" : "UNSTAKED"}
                </Text>
              </Center>
            </Flex>
            <Text fontSize="2xl" as="b" color="white">
              LEVEL {level}
            </Text>
          </VStack>
          <VStack alignItems="flex-start" spacing={10}>
            <StakeOptionsDisplay
              stake={stake}
              unstake={unstake}
              nftData={nftData}
              isStaked={isStaked}
              daysStaked={4}
              totalEarned={60}
              claimable={20}
            />
            <HStack spacing={10}>
              <VStack alignItems="flex-start">
                <Text color="white" as="b" fontSize="2xl">
                  Gear
                </Text>
                <HStack>
                  <ItemBox>mock</ItemBox>
                  <ItemBox>mock</ItemBox>
                </HStack>
              </VStack>
              <VStack alignItems="flex-start">
                <Text color="white" as="b" fontSize="2xl">
                  Loot Boxes
                </Text>
                <HStack>
                  <ItemBox>mock</ItemBox>
                  <ItemBox>mock</ItemBox>
                  <ItemBox>mock</ItemBox>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </HStack>
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
