"use client";

import { useState, useEffect, useContext } from "react";
import { useBalance, useAccount, useReadContract } from 'wagmi'
import { CoinContext } from "@/contexts/coin";
import { formatEther, formatUnits, erc20Abi } from "viem";

type PortfolioPageProps = {
  setCoin: (coin: any) => void;
  setActiveTab: (tab: string) => void;
};

const ZORA_TOKEN_ADDRESS = "0x1111111111166b7FE7bd91427724B487980aFc69";

export function PortfolioPage({ setCoin, setActiveTab }: PortfolioPageProps) {

  const account = useAccount()
  const address = account?.address

  const { fetchMyTokens, myTokens, myTokensNext }: any = useContext(CoinContext)
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      (async () => {
        setLoading(true);
        await fetchMyTokens(address);
        setLoading(false);
      })()
    }
  }, [address])

  const balance = useBalance({
    address: address,
  })

  // Get ZORA token balance
  const { data: zoraBalance } = useReadContract({
    address: ZORA_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Get ZORA token decimals
  const { data: zoraDecimals } = useReadContract({
    address: ZORA_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const handleCoinClick = (coin: any) => { 
    setCoin(coin) 
    setActiveTab("trade");
  };

  let portfolioValue = 0
  let deltas = []

  for (let token of myTokens) {
    const currentBalance = formatEther(BigInt(token?.balance || 0))
    const currentPrice = Number(token.coin.marketCap) / Number(token.coin.totalSupply)
    const currentValue = Number(currentBalance) * currentPrice
    portfolioValue += currentValue

    const delta = (100 * Number(token.coin.marketCapDelta24h)) / Number(token.coin.marketCap)
    deltas.push(delta)
  }

  const portfolioDelta = calculateAverage(deltas)

  // Format ZORA balance
  const formattedZoraBalance = zoraBalance && zoraDecimals 
    ? formatUnits(zoraBalance, zoraDecimals)
    : "0";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 pb-0">
        <h1 className="text-xl font-bold mb-4">Portfolio</h1>

        {!address && (
          <div className=" my-4 mt-0 bg-amber-50 border border-amber-200 rounded-lg shadow-sm overflow-hidden">
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
                    Connect your wallet to view your portfolio
                  </div>
                </div>
              </div>
            </div>
          </div>)}

        {/* Token Balances */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* ETH Balance */}
          <div className="bg-white border rounded-xl p-4 flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">ETH Balance</div>
              <div className="font-bold text-lg">{Number(balance?.data?.formatted || 0).toFixed(4)}</div>
            </div>
          </div>

          {/* ZORA Balance */}
          <div className="bg-white border rounded-xl p-4 flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">ZORA Balance</div>
              <div className="font-bold text-lg">{Number(formattedZoraBalance).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Portfolio summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 mb-4">
          <h2 className="text-lg font-medium mb-1">Portfolio Value</h2>
          <div className="text-2xl font-bold">${portfolioValue.toFixed(3)}</div>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${portfolioDelta >= 0
              ? 'text-green-200'
              : 'text-red-200'
              }`}>
              {portfolioDelta >= 0 ? '+' : ''}{portfolioDelta.toFixed(3)} %
            </span>
            <span className="text-xs ml-1 text-white/70">24h Change</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            className="bg-blue-500 text-white p-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
            onClick={() => setActiveTab("create")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Coin</span>
          </button>
          
          <button
            className="bg-purple-500 text-white p-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-purple-600 transition-colors"
            onClick={() => setActiveTab("home")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Discover</span>
          </button>
        </div>
      </div>

      {/* Coin Holdings List */}
      <div className="flex-1 overflow-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Coins</h2>
          <span className="text-sm text-gray-500">{myTokens.length} coins</span>
        </div>

        {myTokens.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No coins yet</h3>
            <p className="text-gray-500 mb-4">Start by creating your first coin or buying existing ones</p>
            <div className="flex space-x-3 justify-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                onClick={() => setActiveTab("create")}
              >
                Create Coin
              </button>
              <button
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                onClick={() => setActiveTab("home")}
              >
                Browse Coins
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {myTokens.map((coin: any) => {

              const currentBalance = formatEther(BigInt(coin?.balance || 0))
              const currentPrice = Number(coin.coin.marketCap) / Number(coin.coin.totalSupply)
              const currentValue = Number(currentBalance) * currentPrice

              const delta = (100 * Number(coin.coin.marketCapDelta24h)) / Number(coin.coin.marketCap)

              return (
                <div
                  key={coin.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleCoinClick({
                    ...coin.coin,
                    currentBalance,
                    currentPrice,
                    currentValue,
                    priceChanges: delta
                  })}
                >
                  <div className="flex p-4">
                    {/* Coin image */}
                    <div className="w-16 h-16 mr-3 flex-shrink-0">
                      <img
                        src={coin?.coin?.mediaContent?.previewImage?.small || 'https://via.placeholder.com/100'}
                        alt={coin?.coin?.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Coin details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium truncate">{coin?.coin?.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-0.5">
                            <span>@{coin?.coin?.creatorProfile?.handle}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Value</div>
                          <div className="font-bold">${currentValue.toFixed(3)}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-3">
                        <div>
                          <div className="text-xs text-gray-500">Holdings</div>
                          <div className="font-medium text-sm">{Number(currentBalance).toLocaleString()} {coin?.coin?.symbol}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">24h Change</div>
                          <div className={`font-medium text-sm ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {delta >= 0 ? '+' : ''}{delta.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions footer */}
                  <div className="border-t bg-gray-50 px-4 py-2">
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Market Cap: ${Number(coin?.coin?.marketCap).toLocaleString()}</span>
                      <span>Holders: {coin?.coin?.uniqueHolders}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {loading && (
          <div className="flex mt-8 items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateAverage(arr: any) {
  if (arr.length === 0) {
    return 0; // Return 0 for an empty array to avoid division by zero
  }
  const sum = arr.reduce((acc: any, val: any) => acc + val, 0); // Sum all elements
  return sum / arr.length; // Divide the sum by the number of elements
}