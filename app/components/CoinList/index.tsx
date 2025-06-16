"use client";

import { CoinContext } from "@/contexts/coin";
import { useState, useEffect, useContext } from "react"; 

type CoinListProps = {
  setCoin: (coin: any) => void;
  setActiveTab: (tab: string) => void;
};

export function CoinList({ setActiveTab, setCoin }: CoinListProps) {

  const { loadMore, fetchCoins, trending, topByMarketCap, newest, trendingNext, topNext, newestNext }: any = useContext(CoinContext);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("trending");

  useEffect(() => {

    (async () => {
      await fetchCoins();
      setLoading(false);
    })()

  }, []);

  const handleCoinClick = (coin: any) => {
    setCoin(coin)
    setActiveTab("trade")
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };


  const onLoadMore = async (activeView: string) => {

    setLoading(true);
    await loadMore(activeView)
    setLoading(false);

  }

  const getCoinsToDisplay = () => {

    let coins = [];

    switch (activeView) {
      case "trending":
        coins = trending
        break;
      case "market-cap":
        coins = topByMarketCap
        break;
      case "newest":
        coins = newest;
        break;
    }

    // Filter based on search query
    if (searchQuery) {
      return coins.filter((coin: any) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.creatorProfile?.handle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return coins;
  };


  return (
    <div className="flex flex-col h-full">

      {/*{coin && <TradePanel coin={coin} close={() => setCoin(null)} />}*/}

      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg my-4 text-center">
        <h2 className="text-lg font-bold mb-1">
          Discover & Trade Content Coins
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          The fastest way to interact with Zora coins on Base
        </p>
        <div className="flex gap-2 justify-center">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-1"
            onClick={() => setActiveTab("ai-swipe")}
          >
            🤖 AI Swipe
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
            onClick={() => setActiveTab("favorites")}
          >
            ❤️ Favorites
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
            onClick={() => setActiveTab("create")}
          >
            Create a Coin
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="  mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search coins..."
            className="w-full px-4 py-2 pl-9 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* View toggle */}
      <div className=" mb-2">
        <div className="grid grid-cols-3 pb-2 hide-scrollbar">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeView === "trending"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setActiveView("trending")}
          >
            🔥 Trending
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeView === "market-cap"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setActiveView("market-cap")}
          >
            🪙 Top
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeView === "newest"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setActiveView("newest")}
          >
            🆕 Newest
          </button>
        </div>
      </div>

      {/* Loading state */}
      {(trending.length === 0 && loading) ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className=" flex-1 overflow-auto pb-16">
          {getCoinsToDisplay().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No coins found
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {getCoinsToDisplay().map((coin: any, index: number) => {

                const currentPrice = Number(coin.marketCap) / Number(coin.totalSupply)

                return (
                  <div
                    key={coin.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => handleCoinClick({
                      ...coin,
                      currentPrice
                    })}
                  >
                    {/* Main card content */}
                    <div className="flex p-3">
                      {/* Coin image */}
                      <div className="w-14 h-14 mr-3 flex-shrink-0">
                        <img
                          src={coin.mediaContent?.previewImage?.small || 'https://via.placeholder.com/100'}
                          alt={coin.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Coin details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{coin.name}</h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {activeView === "newest" ? <>{formatTimeAgo(coin.createdAt)}</> : <> #{index + 1}</>}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mt-0.5">
                          <span className="truncate">by {coin.creatorProfile?.handle || 'Unknown'}</span>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          <div>
                            <div className="text-xs text-gray-500">Volume 24h</div>
                            <div className="font-medium">${Number(coin.volume24h).toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Market Cap</div>
                            <div className="font-medium">${Number(coin.marketCap).toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Current Price</div>
                            <div className="font-medium">${currentPrice > 0.00001 ? currentPrice.toFixed(6) : currentPrice.toFixed(9)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer stats */}
                    <div className="border-t px-3 py-2 flex justify-between text-xs text-gray-500">
                      <div>Holders: {coin.uniqueHolders}</div>
                      {/* <div>Transfers: {coin.transfers.count}</div> */}
                      <div>
                        {Number(coin.marketCapDelta24h) > 0
                          ? <span className="text-green-500">+{Number(coin.marketCapDelta24h).toFixed(2)}%</span>
                          : <span className="text-red-500">{Number(coin.marketCapDelta24h).toFixed(2)}%</span>
                        }
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {(trending.length > 0 && loading) ? (
            <div className="flex-1 mt-6  flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>) :
            <>
              {(activeView === "trending" && trendingNext) && (
                <button
                  className="bg-white  mt-4 mx-auto border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors px-6 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
                  onClick={() => { onLoadMore("trending") }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load More
                </button>)

              }
              {(activeView === "market-cap" && topNext) && (
                <button
                  className="bg-white  mt-4 mx-auto border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors px-6 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
                  onClick={() => { onLoadMore("market-cap") }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load More
                </button>)

              }
              {(activeView === "newest" && newestNext) && (
                <button
                  className="bg-white  mt-4 mx-auto border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors px-6 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
                  onClick={() => { onLoadMore("newest") }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load More
                </button>)}
            </>

          }


        </div>
      )}




    </div>
  );
}
