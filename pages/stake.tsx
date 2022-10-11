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
import { useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { ItemBox } from "../components/ItemBox";
import StakeOptionsDisplay from "../components/StakeOptionsDisplay";
import { GEAR_TOKEN_MINTS } from "../utils/constants";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { GearItem } from "../components/GearItem";
import { LootBox } from "../components/LootBox";

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
  const [gear, setGear] = useState<PublicKey[]>([]);

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

  // this code would be if gear persisted across reloads
  // useEffect(() => {
  //   const findCollectedGear = async () => {
  //     if (!walletAdapter.publicKey) return;
  //     for (const mint of GEAR_TOKEN_MINTS) {
  //       const userGearAta = await getAssociatedTokenAddress(
  //         mint,
  //         walletAdapter.publicKey
  //       );
  //       const userGearAtaAccountInfo = await connection.getAccountInfo(
  //         userGearAta
  //       );

  //       if (!userGearAtaAccountInfo) {
  //         // create ATA
  //         const transaction = new Transaction().add(
  //           createAssociatedTokenAccountInstruction(
  //             walletAdapter.publicKey,
  //             userGearAta,
  //             walletAdapter.publicKey,
  //             mint
  //           )
  //         );
  //         await sendAndConfirmTransaction(transaction);
  //       }

  //       const gearAtaBalance = (
  //         await connection.getTokenAccountBalance(userGearAta)
  //       ).value.amount;

  //       if (Number(gearAtaBalance) > 0) {
  //         setGear([...gear, mint]);
  //       }
  //     }
  //   };
  //   findCollectedGear();
  // }, [connection, walletAdapter]);

  // const sendAndConfirmTransaction = useCallback(
  //   async (transaction: Transaction) => {
  //     console.log("Sending transaction ...");
  //     const signature = await walletAdapter.sendTransaction(
  //       transaction,
  //       connection
  //     );
  //     const latestBlockhash = await connection.getLatestBlockhash();
  //     await connection.confirmTransaction(
  //       {
  //         blockhash: latestBlockhash.blockhash,
  //         lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  //         signature: signature,
  //       },
  //       "finalized"
  //     );
  //     console.log(
  //       `Transaction submitted successfully: https://explorer.solana.com/tx/${signature}?cluster=devnet`
  //     );
  //   },
  //   [walletAdapter, connection]
  // );

  const addGear = (mint: PublicKey) => {
    setGear([...gear, mint]);
  };

  return (
    <MainLayout>
      <VStack spacing={7} justify="flex-start" align="flex-start">
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
                  {gear.map((mint) => (
                    <GearItem
                      key={mint.toBase58()}
                      bgColor="#d3d3d3"
                      mint={mint}
                    />
                  ))}
                </HStack>
              </VStack>
              <VStack alignItems="flex-start">
                <Text color="white" as="b" fontSize="2xl">
                  Loot Boxes
                </Text>
                <HStack>
                  <LootBox bgColor="#d3d3d3" addGear={addGear} price={10} />
                  <LootBox bgColor="#d3d3d3" addGear={addGear} price={20} />
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
