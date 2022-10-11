import { Center, Image } from "@chakra-ui/react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

export const GearItem = ({
  mint,
  bgColor,
}: {
  mint: PublicKey;
  bgColor?: string;
}) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [metadata, setMetadata] = useState<any>();
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

  useEffect(() => {
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
    <Center
      height="120px"
      width="120px"
      bgColor={bgColor || "containerBg"}
      borderRadius="10px"
    >
      <Image src={metadata?.image ?? ""} alt="gear item image" />
    </Center>
  );
};
