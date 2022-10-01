import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import {
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  bundlrStorage,
  findMetadataPda,
  keypairIdentity,
  Metaplex,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";

const tokenName = "BUILD";
const tokenSymbol = "BLD";
const tokenDescription = "A token for buildoors";
const tokenImagePath = "tokens/bld/assets/unicorn.png";
const tokenImageFileName = "unicorn.png";

const createBldToken = async (
  connection: web3.Connection,
  user: web3.Keypair,
  programId: web3.PublicKey
) => {
  const mintKeypair = web3.Keypair.generate();

  const transaction = new web3.Transaction();

  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  const [mintAuthority] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("bld_token_mint_auth")],
    programId
  );

  transaction.add(
    web3.SystemProgram.createAccount({
      fromPubkey: user.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: token.MINT_SIZE,
      lamports,
      programId: token.TOKEN_PROGRAM_ID,
    })
  );

  const mintInstruction = token.createInitializeMintInstruction(
    mintKeypair.publicKey,
    2,
    user.publicKey,
    user.publicKey,
    TOKEN_PROGRAM_ID
  );

  transaction.add(mintInstruction);

  //metadata
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  const imageBuffer = fs.readFileSync(tokenImagePath);
  const file = toMetaplexFile(imageBuffer, tokenImageFileName);
  const imageUri = await metaplex.storage().upload(file);
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: tokenName,
      description: tokenDescription,
      image: imageUri,
    })
    .run();

  const metadataPDA = findMetadataPda(mintKeypair.publicKey);

  const tokenMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  const metadataInstruction = createCreateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      mint: mintKeypair.publicKey,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey,
    },
    {
      createMetadataAccountArgsV2: {
        data: tokenMetadata,
        isMutable: true,
      },
    }
  );

  transaction.add(metadataInstruction);

  const sig = await web3.sendAndConfirmTransaction(connection, transaction, [
    user,
    mintKeypair,
  ]);

  console.log(
    `You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`
  );

  //TODO look at removing this and replacing mint auth in above calls
  await token.setAuthority(
    connection,
    user,
    mintKeypair.publicKey,
    user.publicKey,
    token.AuthorityType.MintTokens,
    mintAuthority
  );

  fs.writeFileSync(
    "tokens/bld/cache.json",
    JSON.stringify({
      mint: mintKeypair.publicKey.toBase58(),
      imageUri: imageUri,
      metadataUri: uri,
      tokenMetadata: metadataPDA.toBase58(),
      metadataTransaction: sig,
    })
  );
};

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const user = await initializeKeypair(connection);
  const stakingProgramId = new web3.PublicKey(
    "945nh2YTAoier9Ua42GVWHpckXK1GVXGZoHpCnDtJDP1"
  );

  console.log("PublicKey:", user.publicKey.toBase58());

  await createBldToken(connection, user, stakingProgramId);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
