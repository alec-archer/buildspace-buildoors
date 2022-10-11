import { createContext, useContext } from "react";
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor";
import {
  BuildoorsStakingAnchor,
  IDL as StakingIDL,
} from "../utils/buildoors_staking_anchor";
import {
  BuildoorsLootBoxAnchor,
  IDL as LootBoxIDL,
} from "../utils/buildoors_loot_box_anchor";
import { Connection } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import MockWallet from "./MockWallet";
import { PROGRAM_ID, LOOT_BOX_PROGRAM_ID } from "../utils/constants";

const WorkspaceContext = createContext({});

interface Workspace {
  connection?: Connection;
  provider?: AnchorProvider;
  stakingProgram?: Program<BuildoorsStakingAnchor>;
  lootBoxProgram?: Program<BuildoorsLootBoxAnchor>;
}

const WorkspaceProvider = ({ children }: any) => {
  const wallet = useAnchorWallet() || MockWallet;
  const { connection } = useConnection();

  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);

  const stakingProgram = new Program(StakingIDL as Idl, PROGRAM_ID);
  const lootBoxProgram = new Program(LootBoxIDL as Idl, LOOT_BOX_PROGRAM_ID);
  const workspace = {
    connection,
    provider,
    stakingProgram,
    lootBoxProgram,
  };

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};

const useWorkspace = (): Workspace => {
  return useContext(WorkspaceContext);
};

export { WorkspaceProvider, useWorkspace };
