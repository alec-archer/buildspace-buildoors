import { Center, Text, Image, VStack } from "@chakra-ui/react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

export const GearItem = ({
  mint,
  count,
  bgColor,
}: {
  mint: PublicKey;
  bgColor?: string;
  count: number;
}) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [metadata, setMetadata] = useState<any>();
  const [metaplex, setMetaplex] = useState<Metaplex>();

  useEffect(() => {
    setMetaplex(
      Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    );
  }, [walletAdapter, connection]);

  useEffect(() => {
    if (!metaplex) return;
    metaplex
      .nfts()
      .findByMint({ mintAddress: mint })
      .run()
      .then((nft) => {
        fetch(nft.uri)
          .then((res) => res.json())
          .then((metadata) => {
            setMetadata(metadata);
          });
      })
      .catch((error) => console.error(error));
  }, [mint, metaplex, walletAdapter]);
  return (
    <VStack>
      <Center
        height="120px"
        width="120px"
        bgColor={bgColor || "containerBg"}
        borderRadius="10px"
      >
        <Image src={metadata?.image ?? ""} alt="gear item image" padding={4} />
      </Center>
      <Text color="white" as="b" fontSize="md" width="100%" textAlign="center">
        {`x${count}`}
      </Text>
    </VStack>
  );
};
