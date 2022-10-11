export type BuildoorsLootBoxAnchor = {
  "version": "0.1.0",
  "name": "buildoors_loot_box_anchor",
  "instructions": [
    {
      "name": "openLootBox",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lootBox",
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
                "kind": "const",
                "type": "string",
                "value": "openv5"
              }
            ]
          }
        },
        {
          "name": "bldTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userBldAta",
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
      "args": [
        {
          "name": "lootBoxPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getLoot",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lootBox",
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
                "kind": "const",
                "type": "string",
                "value": "openv5"
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
                "value": "gear_tokens_mint_auth"
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
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
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
      "name": "lootBox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hasGear",
            "type": "bool"
          },
          {
            "name": "gearMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidLootBoxState",
      "msg": "Loot box state is invalid"
    },
    {
      "code": 6001,
      "name": "InsufficientFundsAvailable",
      "msg": "Insufficient funds available"
    },
    {
      "code": 6002,
      "name": "InvalidLootBox",
      "msg": "Invalid loot box"
    }
  ]
};

export const IDL: BuildoorsLootBoxAnchor = {
  "version": "0.1.0",
  "name": "buildoors_loot_box_anchor",
  "instructions": [
    {
      "name": "openLootBox",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lootBox",
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
                "kind": "const",
                "type": "string",
                "value": "openv5"
              }
            ]
          }
        },
        {
          "name": "bldTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userBldAta",
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
      "args": [
        {
          "name": "lootBoxPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getLoot",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lootBox",
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
                "kind": "const",
                "type": "string",
                "value": "openv5"
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
                "value": "gear_tokens_mint_auth"
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
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
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
      "name": "lootBox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hasGear",
            "type": "bool"
          },
          {
            "name": "gearMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidLootBoxState",
      "msg": "Loot box state is invalid"
    },
    {
      "code": 6001,
      "name": "InsufficientFundsAvailable",
      "msg": "Insufficient funds available"
    },
    {
      "code": 6002,
      "name": "InvalidLootBox",
      "msg": "Invalid loot box"
    }
  ]
};
