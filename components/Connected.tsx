import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import {
  CandyMachine,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback, useEffect, useState } from "react";
import { CANDY_MACHINE_ID } from "../utils/constants";

const Connected: FC = () => {
  const { connection } = useConnection();
  const walletAdapter = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [metaplex, setMetaplex] = useState<Metaplex>();

  useEffect(() => {
    console.log("metaplex");
    setMetaplex(
      Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    );
  }, [connection, walletAdapter]);

  useEffect(() => {
    console.log("candymachine");
    if (!metaplex) return;
    metaplex
      .candyMachines()
      .findByAddress({ address: CANDY_MACHINE_ID })
      .run()
      .then((candyMachine) => {
        setCandyMachine(candyMachine);
      })
      .catch((error) => {
        alert(error);
      });
  }, [metaplex]);

  const router = useRouter();

  // TODO useCallback necessary?
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (!candyMachine || !walletAdapter.connected || !metaplex) return;

      console.log("Mint!");
      metaplex
        .candyMachines()
        .mint({ candyMachine })
        .run()
        .then((nft) => {
          console.log(nft);
          router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    },
    [candyMachine, metaplex, router, walletAdapter.connected]
  );

  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Buildoor.
          </Heading>
          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive{" "}
            <Text as="b">$BLD</Text>. Use your <Text as="b">$BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px" onClick={handleClick}>
        <Text>mint buildoor</Text>
      </Button>
    </VStack>
  );
};

export default Connected;
