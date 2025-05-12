Get Quotes#
Get the best quote for a swap through OKX DEX.

Request URL#
GET https://web3.okx.com/api/v5/dex/aggregator/quote

Request Parameters#
Parameter	Type	Required	Description
chainIndex	String	No	Unique identifier for the chain.
e.g., 1: Ethereum.
See more here.
chainId	String	No	Unique identifier for the chain.
It will be deprecated in the future.
amount	String	Yes	The input amount of a token to be sold (set in minimal divisible units, e.g., 1.00 USDT set as 1000000, 1.00 DAI set as 1000000000000000000), you could get the minimal divisible units from Tokenlist
.
fromTokenAddress	String	Yes	The contract address of a token to be sold (e.g., 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee)
toTokenAddress	String	Yes	The contract address of a token to be bought (e.g., 0xa892e1fef8b31acc44ce78e7db0a2dc610f92d00)
dexIds	String	No	DexId of the liquidity pool for limited quotes, multiple combinations separated by , (e.g.,1,50,180, see liquidity list for more)
directRoute	Boolean	No	The default setting is false. When enabled, Direct Routes restrict our routing to a single liquidity pool only. Currently, this feature is only active for Solana swaps.
priceImpactProtectionPercentage	String	No	(Optional. The default is 90%.) The percentage (between 0 - 1.0) of the price impact allowed.

When the priceImpactProtectionPercentage is set, if the estimated price impact is above the percentage indicated, an error will be returned. For example, if PriceImpactProtectionPercentage = .25 (25%), any quote with a price impact higher than 25% will return an error.

This is an optional feature, and the default value is 0.9. When it’s set to 1.0 (100%), the feature will be disabled, which means that every transaction will be allowed to pass.

Note: If we’re unable to calculate the price impact, we’ll return null, and the price impact protection will be disabled.
feePercent	String	No	The percentage of fromTokenAmount will be sent to the referrer's address, the rest will be set as the input amount to be sold. min percentage：0
max percentage： 10 for Solana, 3 for all other chains
By configuring this parameter, you can obtain the final amount of totoken provided to the user after deducting the commission from fromtoken.
A maximum of two decimal places is allowed. If more decimals are entered, the system will automatically round up.
Response Parameters#
Parameter	Type	Description
chainIndex	String	Unique identifier for the chain.
chainId	String	Unique identifier for the chain.
It will be deprecated in the future.
dexRouterList	Array	Quote path data set
fromTokenAmount	String	The input amount of a token to be sold (e.g., 500000000000000000000000)
toTokenAmount	String	The resulting amount of a token to be bought (e.g., 168611907733361)
tradeFee	String	Estimated network fee (USD) of the quote route
estimateGasFee	String	Estimated gas consumption is returned in the smallest units of each chain, such as wei.
router	String	One of the main paths for the token swap
routerPercent	String	The percentage of assets handled by the main path (e.g., 5)
subRouterList	Array	DEX Router information
dexProtocol	Array	Liquidity protocols used on the main path (e.g., Verse)
percent	String	The percentage of assets handled by the protocol (e.g., 100)
dexName	String	The name of the liquidity protocol
fromToken	Object	The information of a token to be sold
tokenContractAddress	String	Token contract address (e.g., 0xa892e1fef8b31acc44ce78e7db0a2dc610f92d00)
tokenSymbol	String	Token symbol (e.g., 0xa892e1fef8b31acc44ce78e7db0a2dc610f92d00)
tokenUnitPrice	String	The token unit price returned by this interface is a general USD real time price based on data from on-chain sources. Note: This price is only a recommended price. For some special cases, the token unit price may be 'null'
decimal	String	The decimal number defines the smallest unit into which a single currency token can be divided. For example, if the decimal number of a token is 8, it means that a single such token can be divided into 100,000,000 of its smallest units. Note: This parameter is for reference only. It may change due to reasons such as settings adjustments by the contract owner.
isHoneyPot	Boolean	If the token is a honeypot token. yes：true no：false
taxRate	String	Token tax rate for selling: Applicable to tokens with configurable tax mechanisms (e.g., SafeMoon, SPL2022 tokens). Returns 0 for regular tokens without tax. The value ranges from 0 to 1, where 0.01 represents 1%.
toToken	Object	The information of a token to be bought
tokenContractAddress	String	Token contract address (e.g., 0xa892e1fef8b31acc44ce78e7db0a2dc610f92d00)
tokenSymbol	String	Token symbol (e.g., 0xa892e1fef8b31acc44ce78e7db0a2dc610f92d00)
tokenUnitPrice	String	The token unit price returned by this interface is a general USD price based on data from on-chain, exchange, and other third-party sources. Note: This price is only a recommended price. For some special cases, the token unit price may be 'null'
decimal	String	The decimal number defines the smallest unit into which a single currency token can be divided. For example, if the decimal number of a token is 8, it means that a single such token can be divided into 100,000,000 of its smallest units. Note: This parameter is for reference only. It may change due to reasons such as settings adjustments by the contract owner.
isHoneyPot	Boolean	If the token is a honeypot token. yes：true no：false
taxRate	String	Token tax rate for buying: Applicable to tokens with configurable tax mechanisms (e.g., SafeMoon, SPL2022 tokens). Returns 0 for regular tokens without tax. The value ranges from 0 to 1, where 0.01 represents 1%.
quoteCompareList	Array	Comparison of quote routes
dexName	String	DEX name of the quote route
dexLogo	String	DEX logo of the quote route
tradeFee	String	Estimated network fee (USD) of the quote route
amountOut	String	Received amount of the quote route
priceImpactPercentage	String	Percentage = (Received value – Paid value) / Paid value. The swap amount will affect the depth of the liquidity pool, causing a value difference. This percentage can be positive if the received value exceeds the paid value.
Request Example#
shell
curl --location --request GET 'https://web3.okx.com/api/v5/dex/aggregator/quote?amount=10000000000000000000&chainIndex=1&toTokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' \

--header 'OK-ACCESS-KEY: 37c541a1-****-****-****-10fe7a038418' \
--header 'OK-ACCESS-SIGN: leaV********3uw=' \
--header 'OK-ACCESS-PASSPHRASE: 1****6' \
--header 'OK-ACCESS-TIMESTAMP: 2023-10-18T12:21:41.274Z'
Response Example#
200
{
    "code": "0",
    "data": [
  {
    "chainIndex": "1",
    "chainId": "1",
    "chainIndex":"1",
    "dexRouterList": [
  {
    "router": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee--0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "routerPercent": "100",
    "subRouterList": [
  {
    "dexProtocol": [
  {
    "dexName": "Uniswap V3",
    "percent": "100"
  }
    ],
    "fromToken": {
    "decimal": "18",
    "isHoneyPot": false,
    "taxRate": "0",
    "tokenContractAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "tokenSymbol": "WETH",
    "tokenUnitPrice": "3606.94"
  },
    "toToken": {
    "decimal": "6",
    "isHoneyPot": false,
    "taxRate": "0",
    "tokenContractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "tokenSymbol": "USDC",
    "tokenUnitPrice": "0.9999"
  }
  }
    ]
  }
    ],
    "estimateGasFee": "135000",
    "fromToken": {
    "decimal": "18",
    "isHoneyPot": false,
    "taxRate": "0",
    "tokenContractAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "tokenSymbol": "ETH",
    "tokenUnitPrice": "3606.94"
  },
    "fromTokenAmount": "1000000000000000",
    "originToTokenAmount": "3608628",
    "priceImpactPercentage": "0.04",
    "quoteCompareList": [
  {
    "amountOut": "35984",
    "dexLogo": "https://static.okx.com/cdn/wallet/logo/DODO.png",
    "dexName": "DODO",
    "tradeFee": "13.609993622490384"
  },
  {
    "amountOut": "3586381",
    "dexLogo": "https://static.okx.com/cdn/wallet/logo/balancer.png",
    "dexName": "Balancer V1",
    "tradeFee": "16.319948104844664"
  },
  {
    "amountOut": "3580447",
    "dexLogo": "https://static.okx.com/cdn/wallet/logo/UNI.png",
    "dexName": "Uniswap V1",
    "tradeFee": "8.018574649654157568"
  },
  {
    "amountOut": "3585311",
    "dexLogo": "https://static.okx.com/cdn/web3/dex/logo/Fluid.png",
    "dexName": "Fluid",
    "tradeFee": "7.957841558644062204"
  },
  {
    "amountOut": "3591031",
    "dexLogo": "https://static.okx.com/cdn/wallet/logo/balancer.png",
    "dexName": "Balancer V2",
    "tradeFee": "7.286766496997064"
  }
    ],
    "toToken": {
    "decimal": "6",
    "isHoneyPot": false,
    "taxRate": "0",
    "tokenContractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "tokenSymbol": "USDC",
    "tokenUnitPrice": "0.9999"
  },
    "toTokenAmount": "3608628",
    "tradeFee": "4.1057406791269083"
  }
    ],
    "msg": ""
  }
