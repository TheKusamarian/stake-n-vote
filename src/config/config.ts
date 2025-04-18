// Desc: Configuration file for the app

export const isDev = process.env.NODE_ENV === "development"

export const CACHE_INVALIDATION_TIME = 60 * 30 // in seconds, equals 30min

// Kusamarian Delegators
export const POLKADOT_DELEGATOR =
  "15KHTWdJyzyxaQbBNRmQN89KmFr1jPXXsPHM5Rxvd1Tkb2XZ"

export const KUSAMA_DELEGATOR =
  "JHTfbt39EL1CcbKteN6hG5L5pWo9XWi9XFiyuS9q24cAc8u"

// Kusamarian Validators
export const POLKADOT_VALIDATOR =
  "13zRKESAgaKG4xyYrZnAA4Qdu1iVVMsrdiAnhnnnd4CB6TpU"

export const KUSAMA_VALIDATOR =
  "FZjqDWyTA4iP5nUfdYCurwVBz15bj8u1bH3wA5PYmP9fE3j"

export const CHAIN_CONFIG: {
  [key: string]: {
    ss58Format: number
    tokenDecimals: number
    tokenSymbol: string
    maxNominators: number
    delegator: string
    validator: string
    validator_set: string[]
    poolId?: number
  }
} = {
  Polkadot: {
    ss58Format: 0,
    tokenDecimals: 10,
    tokenSymbol: "DOT",
    maxNominators: 16,
    delegator: POLKADOT_DELEGATOR,
    validator: POLKADOT_VALIDATOR,
    poolId: 34, //subwallet pool,
    validator_set: [
      "14hM4oLJCK6wtS7gNfwTDhthRjy5QJ1t3NAcoPjEepo9AH67",
      "153YD8ZHD9dRh82U419bSCB5SzWhbdAFzjj4NtA5pMazR2yC",
      "16SpacegeUTft9v3ts27CEC3tJaxgvE4uZeCctThFH3Vb24p",
      "14N5nJ4oR4Wj36DsBcPLh1JqjvrM2Uf23No2yc2ojjCvSC24",
      "12dGS1zjyiUqj7GuxDDwv9i72RMye1mT7tSWNaSx7QVeJ32H",
      "13zRKESAgaKG4xyYrZnAA4Qdu1iVVMsrdiAnhnnnd4CB6TpU",
      "15wepZh1jWNqxBjsgErm8HmYiE21n79c5krQJeTsYAjHddeM",
      "123kFHVth2udmM79sn3RPQ81HukrQWCxA1vmTWkGHSvkR4k1",
      "126RwaHn4MDekLWfUYfiqcVbiQHapwDSAT9vZZS15HLqfDJh",
      "1jqkeJhuoRudNTVL5dV1qZf8RQtyzcf6ZT4yyvUQbKFktr8",
      "16g43B7VPfTmpXQujSz3aKbqY9twSrDreHFWtwp4P7bLkQPp",
      "1y6CPLgccsysCEii3M7jQF834GZsz9A3HMcZz3w7RjGPpBL",
      "16ce9zrmiuAtdi9qv1tuiQ1RC1xR6y6NgnBcRtMoQeAobqpZ",
      "124RsxuvWs31iWyUMvDsnoRUgLQfntxeBXnwWJd8eC7EVe1L",
      "1QNkyKDqdjYn3vHiSLwXPT5hMgy12W4BinGe5Z3sQVxqJaA",
      "14AakQ4jAmr2ytcrhfmaiHMpj5F9cR6wK1jRrdfC3N1oTbUz",
    ],
  },
  Kusama: {
    ss58Format: 2,
    tokenDecimals: 12,
    tokenSymbol: "KSM",
    maxNominators: 24,
    delegator: KUSAMA_DELEGATOR,
    validator: KUSAMA_VALIDATOR,
    validator_set: [
      "FZjqDWyTA4iP5nUfdYCurwVBz15bj8u1bH3wA5PYmP9fE3j",
      "HWyLYmpW68JGJYoVJcot6JQ1CJbtUQeTdxfY1kUTsvGCB1r",
      "GLSikJaXTVWvWtUhzB3Bj6xb5TcnhTUp6EuAkxaCohT9UBv",
      "J6HxQniipCQLVAJxzC1pn2DphoN3za9eAq1bhkBtMhZ9sid",
      "CibcGcwnThunMNYrStEWHYdr5WDuy8QnMgT3Vr39JeWCcQs",
      "DfHkfoKa6xzNMWTNGL8SH8VyY69gajen4ijgmegeU4cZm1H",
      "Czy1KnZV1DqSPcHd6k1WL6fe4nsyhAuiJ9ALZtVvyomdc8y",
      "Dfg9gbTwG6aghwLYTfYoV4dXyhCRBLbRyFwENADHmg4zfDF",
      "HngUT2inDFPBwiey6ZdqhhnmPKHkXayRpWw9rFj55reAqvi",
      "FVAFUJhJy9tj1X4PaEXX3tDzjaBEVsVunABAdsDMD4ZYmWA",
      "JBmYvpebasxckBsohyyWse7yggsowfgt5xRJvkzu2txUJdi",
      "Dn1EdwSDeqmvxy4STJxJuWqHWFMEZyg3rm9Ko1L2fJG26mc",
      "D6NNbc18fTh4WVQtmrTyLRHGv8SKVtjKFY8uV34k5ydBMaV",
      "FyL5TJXFEWDHC1yuBGwtngo3LRg4nEQ4ua47p1szMQdh8HR",
    ],
  },
  Rococo: {
    ss58Format: 2,
    tokenDecimals: 12,
    tokenSymbol: "ROC",
    maxNominators: 24,
    delegator: KUSAMA_DELEGATOR,
    validator: KUSAMA_VALIDATOR,
    validator_set: [],
  },
}
