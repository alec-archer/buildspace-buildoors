export type BuildoorsStakingAnchor = {
  "version": "0.1.0",
  "name": "buildoors_staking_anchor",
  "instructions": [
    {
      "name": "stake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftPublickey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEditionPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_publickey"
              }
            ]
          }
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_publickey"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuth",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bld_token_mint_auth"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftPublickey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEditionPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_publickey"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuth",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bld_token_mint_auth"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakingAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userPubkey",
            "type": "publicKey"
          },
          {
            "name": "nftAccount",
            "type": "publicKey"
          },
          {
            "name": "stakeStartTime",
            "type": "i64"
          },
          {
            "name": "lastStakeRedeemed",
            "type": "i64"
          },
          {
            "name": "stakedState",
            "type": {
              "defined": "StakedState"
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakedState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unstaked"
          },
          {
            "name": "Staked"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NFTAlreadyStaked",
      "msg": "NFT already staked"
    },
    {
      "code": 6001,
      "name": "NFTNotStaked",
      "msg": "NFT not staked"
    },
    {
      "code": 6002,
      "name": "InvalidStakeAccountState",
      "msg": "Stake account state is invalid"
    }
  ]
};

export const IDL: BuildoorsStakingAnchor = {
  "version": "0.1.0",
  "name": "buildoors_staking_anchor",
  "instructions": [
    {
      "name": "stake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftPublickey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEditionPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_publickey"
              }
            ]
          }
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_publickey"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuth",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bld_token_mint_auth"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftPublickey",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMintPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftEditionPublickey",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "authority"
              }
            ]
          }
        },
        {
          "name": "stakingAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "type": "publicKey",
                "path": "user"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "TokenAccount",
                "path": "nft_publickey"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuth",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bld_token_mint_auth"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakingAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userPubkey",
            "type": "publicKey"
          },
          {
            "name": "nftAccount",
            "type": "publicKey"
          },
          {
            "name": "stakeStartTime",
            "type": "i64"
          },
          {
            "name": "lastStakeRedeemed",
            "type": "i64"
          },
          {
            "name": "stakedState",
            "type": {
              "defined": "StakedState"
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakedState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unstaked"
          },
          {
            "name": "Staked"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NFTAlreadyStaked",
      "msg": "NFT already staked"
    },
    {
      "code": 6001,
      "name": "NFTNotStaked",
      "msg": "NFT not staked"
    },
    {
      "code": 6002,
      "name": "InvalidStakeAccountState",
      "msg": "Stake account state is invalid"
    }
  ]
};
