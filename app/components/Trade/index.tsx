"use client";


import { useReadContracts, useBalance, useAccount, useSimulateContract, useWriteContract, usePublicClient } from 'wagmi'
import { useCallback, useState, useEffect, useContext } from "react";
import { CoinContext } from "@/contexts/coin";
import {
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { tradeCoinCall, getOnchainCoinDetails } from "@zoralabs/coins-sdk";
import { parseEther, erc20Abi, formatUnits, Address, formatEther } from 'viem'

type TradePanelProps = {
  coin: any;
  setActiveTab: (tab: string) => void;
};

export function TradePage({ coin, setActiveTab }: TradePanelProps) {

  const [ poolAddress, setPoolAddress] = useState<any>("")

  const publicClient: any = usePublicClient()

  const { } = useContext(CoinContext)

  const account = useAccount()
  const address = account?.address

  const balance = useBalance({
    address: address,
  })

  let contractParams: any = []  

  if (address && coin) { 
    contractParams = [
      {
        address: coin.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: coin.address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: poolAddress,
        abi: [{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"} ],
        functionName: 'token0',
      }
    ] 
  }

  const result: any = useReadContracts({
    allowFailure: false,
    contracts:  contractParams
  }) 
 
  const tokenBalance = result?.data ? formatUnits(result?.data[0], result?.data[1]) : 0 

  let tokenNotSupported = false

  if (result?.data && result?.data[2]) { 
    tokenNotSupported = result.data[2] !== "0x4200000000000000000000000000000000000006"
  }

  const openUrl = useOpenUrl();

  const [amount, setAmount] = useState<string>("0.001");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const tradeParams = {
    direction: action,
    target: (coin.address) as Address,
    args: {
      recipient: address as Address,
      orderSize: parseEther(`${amount}`),
      minAmountOut: 0n,
      sqrtPriceLimitX96: 0n,
      tradeReferrer: address as Address
    }
  }

  console.log("trade params", tradeParams)

  // Create configuration for wagmi
  const contractCallParams = tradeCoinCall(tradeParams);

  console.log("contractCallParams: ", contractCallParams)

  const { data, error: swapError }  = useSimulateContract({
    ...contractCallParams,
    value: action === "buy" ? tradeParams.args.orderSize : 0n,
  });
 
  console.log("simulate data:", data)
  console.log("simulate error:", swapError)

  const { status, writeContract } = useWriteContract()

  useEffect(() => {
    if (coin && coin.address) {
      (async () => { 
        const output = await getOnchainCoinDetails({
          coin: coin.address,
          publicClient
        }) 
        setPoolAddress(output.pool) 
      })()
    }
  },[coin])

  useEffect(() => {
    if (status && status === "success") {
      // Redirect to portfolio after success
      setTimeout(() => {
        setActiveTab("mycoins");
      }, 2000);
    }
  }, [status])

  // Format date in a readable way: "May 15, 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDescription = (description: string) => {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return description.replace(urlRegex, '<a href="$1" class="text-blue-500 underline" target="_blank">$1</a>');
  };

  if (!coin) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">No coin data</h2>
        <p className="text-gray-600 mb-4">Please select a coin from the home page again.</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          onClick={() => setActiveTab("home")}
        >
          Browse Coins
        </button>
      </div>
    );
  }
 

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="   bg-white border-b px-4 py-3 flex items-center">
        <button
          className="flex items-center text-gray-600"
          onClick={() => setActiveTab("home")}
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-lg font-bold ml-4 flex-1 truncate">{coin.name}</h1>
      </div>

      <div className="overflow-auto flex-1 p-4 pb-20">
        {/* Coin main image */}
        <div className="rounded-xl overflow-hidden bg-gray-100">
          <img
            src={coin.mediaContent?.previewImage?.medium || 'https://via.placeholder.com/400'}
            alt={coin.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Creator info */}
        <div className="mt-4 flex items-center">
          <img
            src={coin.creatorProfile?.avatar?.previewImage?.small || 'https://via.placeholder.com/40'}
            alt={coin.creatorProfile?.handle}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <div>
            <div className="text-sm font-medium">Created by @{coin.creatorProfile?.handle}</div>
            <div className="text-xs text-gray-500">{formatDate(coin.createdAt)}</div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white border rounded-xl p-3">
            <div className="text-sm text-gray-500">Market Cap</div>
            <div className="font-bold text-lg">${Number(coin.marketCap).toLocaleString()}</div>
            <div className={`text-xs mt-1 ${Number(coin.marketCapDelta24h) >= 0
              ? 'text-green-500'
              : 'text-red-500'
              }`}>
              {Number(coin.marketCapDelta24h) >= 0 ? '+' : ''}{Number(coin.marketCapDelta24h).toFixed(2)}%
            </div>
          </div>

          <div className="bg-white border rounded-xl p-3">
            <div className="text-sm text-gray-500">24h Volume</div>
            <div className="font-bold text-lg">${Number(coin.volume24h).toLocaleString()}</div>
            <div className="text-xs mt-1 text-gray-500">
              Total: ${Number(coin.totalVolume).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Additional stats */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-white border rounded-xl p-3">
            <div className="text-sm text-gray-500">Holders</div>
            <div className="font-bold text-lg">{coin.uniqueHolders}</div>
          </div>

          <div className="bg-white border rounded-xl p-3">
            <div className="text-sm text-gray-500">Transfers</div>
            <div className="font-bold text-lg">{coin.transfers.count}</div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Description</h2>
            <button
              className="text-blue-500 text-sm"
              onClick={() => setShowDescription(!showDescription)}
            >
              {showDescription ? "Show Less" : "Show More"}
            </button>
          </div>

          <div className={`text-sm text-gray-700 ${showDescription ? '' : 'line-clamp-3'}`}>
            <div dangerouslySetInnerHTML={{ __html: formatDescription(coin.description) }} />
          </div>
        </div>

        {/* Creator earnings */}
        <div className="mt-4 bg-white border rounded-xl p-4">
          <h2 className="font-bold mb-2">Creator Earnings</h2>

          {coin.creatorEarnings.length === 0 ? (
            <div className="text-sm text-gray-500">No earnings yet</div>
          ) : (
            <div className="space-y-2">
              {coin.creatorEarnings.map((earning: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>Earned:</span>
                  <span className="font-medium">${earning.amountUsd.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contract info */}
        <div className="mt-4 bg-white border rounded-xl p-4">
          <h2 className="font-bold mb-2">Contract Info</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Symbol:</span>
              <span className="font-mono">{coin.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Supply:</span>
              <span>{Number(coin.totalSupply).toLocaleString()} {coin?.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Token Contract:</span>
              <div className="flex items-center">
                <span onClick={() => openUrl(`https://basescan.org/address/${coin.address}`)} className="font-mono text-xs hover:underline cursor-pointer truncate max-w-[140px]">
                  {coin.address}
                </span>
                <button
                  className="ml-1 text-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(coin.address);
                    // Show copy notification
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pool Type:</span>
              <span className="font-mono">Uniswap V3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pool Contract:</span>
              <div className="flex items-center">
                <span onClick={() => openUrl(`https://basescan.org/address/${poolAddress}`)} className="font-mono text-xs hover:underline cursor-pointer truncate max-w-[140px]">
                  {poolAddress}
                </span>
                <button
                  className="ml-1 text-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(poolAddress);
                    // Show copy notification
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {!address && (
          <div className=" my-4 mb-0 bg-amber-50 border border-amber-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-amber-800">Wallet not connected</h3>
                  <div className="mt-1 text-sm text-amber-700">
                    Connect your wallet to trade tokens
                  </div>
                </div>
              </div>
            </div>

          </div>)}

        { tokenNotSupported && (
          <div className="  my-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm overflow-hidden">
  <div className="p-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-amber-800">Warning</h3>
        <div className="mt-1 text-sm text-amber-700">
          We only support ETH for buying content coins. Other tokens like ZORA are not supported at the moment.
        </div>
      </div>
    </div>
  </div>
</div>
          )

        }

        {/* Trading section - in the normal document flow */}
        <div className="mt-6 bg-white border rounded-xl overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center font-medium ${action === "buy"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
                  }`}
                onClick={() => {
                  setAction("buy")
                  setAmount("0.001")
                }}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${action === "sell"
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-500"
                  }`}
                onClick={() => {
                  setAction("sell")
                  setAmount("1000")
                }}
              >
                Sell
              </button>
            </div>
          </div>

          <div className="p-4">  
             <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Current Price</span>
              <span className="font-medium">{(coin && coin.currentPrice) ? Number(coin.currentPrice / 2500).toFixed(9) : 0} ETH per token</span>
            </div>

            {/* Amount input with max button */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative rounded-md">
                <input
                  type="number"
                  className="block w-full pr-20 border border-gray-300 rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    className="h-full inline-flex items-center px-3 border-l border-gray-300 bg-gray-50 text-blue-500 text-sm font-medium rounded-r-lg hover:bg-gray-100"
                    onClick={() => { 
                      // TODO: correct this
                      setAmount(action === "buy" ? "1" : "1000"); 
                    }}
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Token to Swap</span>
                <span> 
                  {action === "buy" && (tokenNotSupported ? `ZORA ERC-20` : `ETH`)}
                  {action === "sell" && `${coin?.symbol} ERC-20`}
                </span>
              </div> 
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Amount Received</span>
                <span>{ (data && data?.result[1]) ? Number(formatEther(data?.result[1])).toLocaleString() : "N/A" } {` `}
                  { action === "buy" ? coin?.symbol : "ETH"} 
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Slippage</span>
                <span> 
                    { (data && data?.result[1] && coin && coin.currentPrice)  ? Math.abs(100-(100 * (Number(coin.currentPrice / 2500))) /(Number(amount) / Number(formatEther(data?.result[1])) ) ).toFixed(2) : "N/A" }%
                </span>
              </div> 
            </div>

            {/* Balance info for context */}
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              {action === "buy" ? (
                <>
                  <span>Wallet Balance:</span>
                  <span>{balance?.data?.formatted || 0} ETH</span>
                </>
              ) : (
                <>
                  <span>Your {coin.name} Balance:</span>
                  <span>{Number(tokenBalance).toFixed(3)} {coin?.symbol}</span>
                </>
              )}
            </div>

            {/* Action button */}
            {!address && (
              <button className="w-full py-3 rounded-lg font-medium cursor-default bg-gray-300 text-gray-500">
                Wallet Not Connected
              </button>
            )}

           {/* {((action ==="sell" && ( Number(tokenBalance) > 0 )) &&  !tokenNotApproved) && (
              <ApproveToken maxBalance={result && result?.data && result?.data[0] } coinAddress={coin.address} poolAddress={poolAddress} />
            )}*/}

            {address && (
              <button
                className={`w-full py-3 rounded-lg font-medium ${!amount || parseFloat(amount) <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : status === "pending"
                    ? "bg-gray-400 cursor-not-allowed"
                    : action === "buy"
                      ? "bg-blue-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                onClick={() => writeContract(data!.request)}
                disabled={!amount || parseFloat(amount) <= 0 || status === "pending"}
              >
                {status === "pending" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `${action === "buy" ? "Buy" : "Sell"} ${coin.name} Tokens`
                )}
              </button>)}

            {/* Transaction status */}
            {status === "success" && (
              <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-center text-sm">
                Transaction successful! Redirecting to your portfolio...
              </div>
            )}

            {status === "error" && (
              <div className="mt-3 p-2 bg-red-100 text-red-800 rounded text-center text-sm">
                Transaction failed. Please try again.
              </div>
            )}
          </div>
        </div>

        {/* Add some spacing at the bottom */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}

// const ApproveToken = ({ poolAddress, coinAddress, maxBalance } : any) => {

//   const { data } = useSimulateContract({
//     abi: erc20Abi,
//   address: coinAddress,
//   functionName: 'approve',
//   args: [
//     "0x7266895aca76bedf84cc63810494019f043056c3",
//     maxBalance
//   ]
//   });

//   const { status, writeContract } = useWriteContract()

//   return (
//     <button onClick={() => writeContract(data!.request)} className="w-full cursor-pointer mb-1 py-3 rounded-lg font-medium cursor-default bg-red-500 text-white">
//                  {status === "pending" ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   `Approve Token`
//                 )}

                
//               </button>)
// }