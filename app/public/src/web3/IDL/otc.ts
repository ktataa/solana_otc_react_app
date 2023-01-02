export type OtcProgram ={
  "version": "0.1.0",
  "name": "otc_program",
  "instructions": [
    {
      "name": "createOtc",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "otcAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "otcBaseTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "quoteTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseTokenMint",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "space",
          "type": "u64"
        },
        {
          "name": "baseAmount",
          "type": "u64"
        },
        {
          "name": "quoteAmount",
          "type": "u64"
        },
        {
          "name": "baseQuoteRate",
          "type": "u64"
        },
        {
          "name": "whiteList",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "makeTrade",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "otcAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerQuoteTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "otcBaseTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerBaseTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "otcAuthorityAccount",
          "isMut": false,
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
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "makerAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "otcAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "baseTokenMint",
            "type": "publicKey"
          },
          {
            "name": "quoteTokenMint",
            "type": "publicKey"
          },
          {
            "name": "baseTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "baseAmount",
            "type": "u64"
          },
          {
            "name": "quoteAmount",
            "type": "u64"
          },
          {
            "name": "sold",
            "type": "u64"
          },
          {
            "name": "baseQuoteRate",
            "type": "u64"
          },
          {
            "name": "otcBaseTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "ownerQuoteTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "whiteList",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuthorityAccount",
      "msg": "Invalid Authority Account"
    },
    {
      "code": 6001,
      "name": "AddressNotFound",
      "msg": "Maker address not found"
    }
  ],
  "metadata": {
    "address": "2LG6Wv5UkCWcVx3d8MGXA2v7cbhHnHedYMw74n3gokRV"
  }
}
  export const IDL: OtcProgram ={
    "version": "0.1.0",
    "name": "otc_program",
    "instructions": [
      {
        "name": "createOtc",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "otcAccount",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "otcBaseTokenAccount",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "quoteTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quoteTokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "baseTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "baseTokenMint",
            "isMut": false,
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
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "space",
            "type": "u64"
          },
          {
            "name": "baseAmount",
            "type": "u64"
          },
          {
            "name": "quoteAmount",
            "type": "u64"
          },
          {
            "name": "baseQuoteRate",
            "type": "u64"
          },
          {
            "name": "whiteList",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      },
      {
        "name": "makeTrade",
        "accounts": [
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "otcAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quoteTokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quoteTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ownerQuoteTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "baseTokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "otcBaseTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ownerBaseTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "otcAuthorityAccount",
            "isMut": false,
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
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "makerAmount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "otcAccount",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "baseTokenMint",
              "type": "publicKey"
            },
            {
              "name": "quoteTokenMint",
              "type": "publicKey"
            },
            {
              "name": "baseTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "baseAmount",
              "type": "u64"
            },
            {
              "name": "quoteAmount",
              "type": "u64"
            },
            {
              "name": "sold",
              "type": "u64"
            },
            {
              "name": "baseQuoteRate",
              "type": "u64"
            },
            {
              "name": "otcBaseTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "ownerQuoteTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "whiteList",
              "type": {
                "vec": {
                  "array": [
                    "u8",
                    32
                  ]
                }
              }
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidAuthorityAccount",
        "msg": "Invalid Authority Account"
      },
      {
        "code": 6001,
        "name": "AddressNotFound",
        "msg": "Maker address not found"
      }
    ],
    "metadata": {
      "address": "2LG6Wv5UkCWcVx3d8MGXA2v7cbhHnHedYMw74n3gokRV"
    }
  }