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
import { useCallback, useEffect, useState } from "react";
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
import StakeOptionsDisplay from "../components/StakeOptionsDisplay";
import { BLD_TOKEN_MINT, GEAR_TOKEN_MINTS } from "../utils/constants";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { GearItem } from "../components/GearItem";
import { LootBox } from "../components/LootBox";

export interface Gear {
  [index: string]: number;
}

const Stake: NextPage<StakeProps> = ({ mintAddress, imageSrc }) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [nftData, setNftData] = useState<
    Nft | NftWithToken | Sft | SftWithToken
  >();
  const [metaplex, setMetaplex] = useState<Metaplex>();
  const [isStaked, setIsStaked] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [gear, setGear] = useState<Gear>({});
  const [bldBalance, setBldBalance] = useState<number>(0);

  const stake = () => setIsStaked(true);
  const unstake = () => setIsStaked(false);
  const lootBoxes = [10, 20, 50, 100];

  useEffect(() => {
    setMetaplex(
      Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    );

    const findCollectedGear = async () => {
      console.log("finding collected gear ...");
      if (!walletAdapter.publicKey) return;
      const newGear = { ...gear };
      for (const mint of GEAR_TOKEN_MINTS) {
        const userGearAta = await getAssociatedTokenAddress(
          mint,
          walletAdapter.publicKey
        );

        try {
          const gearAtaBalance = (
            await connection.getTokenAccountBalance(userGearAta)
          ).value.amount;
          newGear[mint.toBase58()] = Number(gearAtaBalance);
        } catch (error) {}
      }
      console.log(newGear);
      setGear(newGear);
    };
    findCollectedGear();
  }, [connection, walletAdapter]);

  useEffect(() => {
    getBldBalance();
  }, [gear, connection, walletAdapter]);

  useEffect(() => {
    console.log("get NFT data ...");
    if (!metaplex) return;
    const mint = new PublicKey(mintAddress);
    metaplex
      .nfts()
      .findByMint({ mintAddress: mint })
      .run()
      .then((nft) => {
        setNftData(nft);
      })
      .catch((error) => console.error(error));
  }, [mintAddress, metaplex]);

  const getBldBalance = () => {
    console.log("getting $BLD balance ...");
    if (!walletAdapter.publicKey) return;
    getAssociatedTokenAddress(BLD_TOKEN_MINT, walletAdapter.publicKey).then(
      (userBldAta) => {
        connection
          .getTokenAccountBalance(userBldAta)
          .then((response) =>
            // divide by 100 b/c $BLD has two decimals
            // TODO refactor so 100 isn't hardcoded; use decimal value from response?
            setBldBalance(Number(response.value.amount) / 100)
          )
          .catch((error) => {});
      }
    );
  };

  const addGear = useCallback(
    (newGearMint: PublicKey) => {
      const newGear = { ...gear };
      newGear[newGearMint.toBase58()]
        ? (newGear[newGearMint.toBase58()] += 1)
        : (newGear[newGearMint.toBase58()] = 1);
      setGear(newGear);
    },
    [gear]
  );

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
              totalEarned={bldBalance}
              bldBalanceCallback={getBldBalance}
            />
            <HStack spacing={10} align="start">
              {Object.keys(gear).length > 0 && (
                <VStack alignItems="flex-start">
                  <Text color="white" as="b" fontSize="2xl">
                    Gear
                  </Text>
                  <HStack>
                    {Object.keys(gear).map((mint) => (
                      <GearItem
                        key={mint}
                        bgColor="#d3d3d3"
                        mint={new PublicKey(mint)}
                        count={gear[mint]}
                      />
                    ))}
                  </HStack>
                </VStack>
              )}
              <VStack alignItems="flex-start">
                <Text color="white" as="b" fontSize="2xl">
                  Loot Boxes
                </Text>
                <HStack>
                  {lootBoxes.map((price) => (
                    <LootBox
                      key={price}
                      bgColor="#d3d3d3"
                      addGear={addGear}
                      price={price}
                      bldBalance={bldBalance}
                    />
                  ))}
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
  mintAddress: string;
  imageSrc: any;
}

Stake.getInitialProps = async ({ query }) => {
  const { mint, imageSrc } = query;

  if (!mint) throw { error: "no mint" };

  return { mintAddress: mint as string, imageSrc };
};

export default Stake;
