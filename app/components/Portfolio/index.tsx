"use client";

import { useState, useEffect, useContext } from "react";
import { useBalance, useAccount } from 'wagmi'
import { CoinContext } from "@/contexts/coin";
import { formatEther } from "viem";

type PortfolioPageProps = {
  setCoin: (coin: any) => void;
  setActiveTab: (tab: string) => void;
};


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

        {/* Wallet Balance */}
        <div className="bg-white border rounded-xl p-4 mb-4 flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-gray-500">Wallet Balance</div>
            <div className="font-bold text-lg">{Number(balance?.data?.formatted || 0).toFixed(6) || 0} ETH</div>
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
            <span className="text-xs ml-1 text-white/70">Changes</span>
          </div>
        </div>
      </div>

      {/* Coin list */}
      <div className="flex-1 overflow-auto px-4 pb-20">
        {myTokens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No any coins on this account
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
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => handleCoinClick({
                    ...coin.coin,
                    currentBalance,
                    currentPrice,
                    currentValue,
                    priceChanges: delta
                  })}
                >
                  <div className="flex p-3">
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
                      <div className="flex items-center">
                        <h3 className="font-medium truncate">{coin?.coin?.name}</h3>
                        {/* {coin.creatorProfile?.handle === "myusername" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Creator</span>
                      )} */}
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <span>@{coin?.coin?.creatorProfile?.handle}</span>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <div className="text-xs text-gray-500">Holdings</div>
                          <div className="font-medium">{Number(currentBalance).toLocaleString()} {` ${coin?.coin?.symbol}`}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Value</div>
                          <div className="font-medium">${currentValue.toFixed(3)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profit/Loss stats */}
                  <div className={`px-3 py-2 ${delta && delta >= 0
                    ? 'bg-green-50'
                    : 'bg-red-50'
                    }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit/Loss</span>
                      <div className="flex items-center">
                        {/* <span className={`font-medium ${coin.profitLoss && coin.profitLoss >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                          }`}>
                          {coin.profitLoss && coin.profitLoss >= 0 ? '+' : ''}{coin.profitLoss?.toFixed(3)} ETH
                        </span> */}
                        <span className={`ml-2 text-xs ${delta && delta >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                          }`}>
                          {delta && delta >= 0 ? '+' : ''}{delta.toFixed(3)}%
                        </span>
                      </div>
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