"use client";

import { useState, useEffect } from "react";
import { useBalance, useAccount } from 'wagmi'

type PortfolioPageProps = {
  setActiveTab: (tab: string) => void;
};

type Coin = {
  id: string;
  name: string;
  description: string;
  address: string;
  symbol: string;
  totalSupply: string;
  totalVolume: string;
  volume24h: string;
  createdAt: string;
  creatorAddress: string;
  creatorEarnings: Array<{
    amount: {
      currencyAddress: string;
      amountRaw: string;
      amountDecimal: number;
    };
    amountUsd: string;
  }>;
  marketCap: string;
  marketCapDelta24h: string;
  chainId: number;
  tokenUri: string;
  creatorProfile: {
    id: string;
    handle: string;
    avatar: {
      previewImage: {
        blurhash: string;
        medium: string;
        small: string;
      };
    };
  };
  mediaContent: {
    mimeType: string;
    originalUri: string;
    previewImage: {
      small: string;
      medium: string;
      blurhash: string;
    };
  };
  transfers: {
    count: number;
  };
  uniqueHolders: number;
  // Additional fields for portfolio
  holdings?: number;
  value?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
};

export function PortfolioPage({ setActiveTab }: PortfolioPageProps) {

  const account = useAccount()
  const address = account?.address

  const balance = useBalance({
    address: address,
  })

  const [portfolio, setPortfolio] = useState<{
    coins: Coin[];
    totalValue: number;
    totalProfitLoss: number;
    walletBalance: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"all" | "created" | "collected">("all");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        // Mock data based on the latest coin structure
        // In a real implementation, you would fetch portfolio data from your API or blockchain
        const mockPortfolio = {
          coins: [
            {
              // Base coin data using the provided structure
              id: "R3JhcGhRTFpvcmEyMFRva2VuOkJBU0UtTUFJTk5FVC4weGJkOGVkYThkY2FiMTNiYzk1NmQyZjI5ZjRhYmIyMTNmMzc0ODg2Yjk=",
              name: "Sheep",
              description: "Uploaded via art.fun\n\nArtist: rinisme\nDate: May 15, 2025\nToken created on art.fun, trading burns $ZORA and $ART\nhttps://art.fun/c/1117z7",
              address: "0xbd8eda8dcab13bc956d2f29f4abb213f374886b9",
              symbol: "Sheep",
              totalSupply: "1000000000",
              totalVolume: "1.150888",
              volume24h: "1.15",
              createdAt: "2025-05-14T20:44:21",
              creatorAddress: "0xbd42f3ee51bf5afd7b7b218f1cf5478494254dc5",
              creatorEarnings: [
                {
                  amount: {
                    currencyAddress: "0x1111111111166b7fe7bd91427724b487980afc69",
                    amountRaw: "249744649191348832",
                    amountDecimal: 0.24974464919134884
                  },
                  amountUsd: "0.00"
                }
              ],
              marketCap: "11825.11",
              marketCapDelta24h: "11825.020708135306",
              chainId: 8453,
              tokenUri: "ar://smDpKYDm6ej_SoLEN9Cc1sqZaIjVXMFPaf1Mmqqz0Qs",
              creatorProfile: {
                id: "R3JhcGhRTEFjY291bnRQcm9maWxlOjY3Yzk3MWM2MzRiZWFiOTU0ODUxZDczMg==",
                handle: "rinisme",
                avatar: {
                  previewImage: {
                    blurhash: "eFKTl9InBDVYRO4.n3VYt6x]~DrZ$$R*Nd-Ww|rqXSRj-5MxaLMyxt",
                    medium: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:1200:1200/f:best/aHR0cHM6Ly9tYWdpYy5kZWNlbnRyYWxpemVkLWNvbnRlbnQuY29tL2lwZnMvYmFmeWJlaWNwMmtwaHljYXNseHhvdGVubmM1NjR5ZG8zMjRkcGloaTNvY2JlYzIydG93cDdqdWpwZmU=",
                    small: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:600:600/f:best/aHR0cHM6Ly9tYWdpYy5kZWNlbnRyYWxpemVkLWNvbnRlbnQuY29tL2lwZnMvYmFmeWJlaWNwMmtwaHljYXNseHhvdGVubmM1NjR5ZG8zMjRkcGloaTNvY2JlYzIydG93cDdqdWpwZmU="
                  }
                }
              },
              mediaContent: {
                mimeType: "image/jpeg",
                originalUri: "ar://qQu13wiG54s5TY9UFarhZ9tSKV-yt5gBCpDa_Uj6Buw",
                previewImage: {
                  small: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:600:600/f:best/aHR0cHM6Ly9hcndlYXZlLm5ldC9xUXUxM3dpRzU0czVUWTlVRmFyaFo5dFNLVi15dDVnQkNwRGFfVWo2QnV3",
                  medium: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:1200:1200/f:best/aHR0cHM6Ly9hcndlYXZlLm5ldC9xUXUxM3dpRzU0czVUWTlVRmFyaFo5dFNLVi15dDVnQkNwRGFfVWo2QnV3",
                  blurhash: "eTK_Bw4mOGRkIAb_smxuD%WU4:R:xuRPM|oextxuWBoJs+t7WBR%a{"
                }
              },
              transfers: {
                count: 27
              },
              uniqueHolders: 5,
              // Portfolio-specific fields
              holdings: 5000,
              value: 0.059,
              profitLoss: 0.015,
              profitLossPercentage: 34.1
            },
            // Add more coins with similar structure
            {
              id: "R3JhcGhRTFpvcmEyMFRva2VuOkJBU0UtTUFJTk5FVC4weGQ4ZDQ1NGViMWRhMThlNDMxZTEyMmQyYTcxOWJjNzE3NTRiZGNmNDY=",
              name: "Sunset Ocean",
              description: "A beautiful sunset over the ocean",
              address: "0xd8d454eb1da18e431e122d2a719bc71754bdcf46",
              symbol: "SUNSET",
              totalSupply: "1000000000",
              totalVolume: "0.87552",
              volume24h: "0.08",
              createdAt: "2025-05-12T15:23:11",
              creatorAddress: "0x2a55f434f2c369adbc841caa6f54014a16c5fbd9",
              creatorEarnings: [],
              marketCap: "8245.56",
              marketCapDelta24h: "-243.12",
              chainId: 8453,
              tokenUri: "ar://sZ4pS9Hw7s2YOkI9fHlRaTrGhWVYaXFaK1QqpUz2Rvs",
              creatorProfile: {
                id: "R3JhcGhRTEFjY291bnRQcm9maWxlOjZhMmNkOWIzMmFiMjFhZmRjNDEyZTEyNQ==",
                handle: "oceanartist",
                avatar: {
                  previewImage: {
                    blurhash: "eLIrV0OGaFVYMO4.o3VYt6~DrX$$R*Na-Xt-WOurXuRj-5MxaLAcxt",
                    medium: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:1200:1200/f:best/oHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIuanBn",
                    small: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:600:600/f:best/oHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIuanBn"
                  }
                }
              },
              mediaContent: {
                mimeType: "image/jpeg",
                originalUri: "ar://aEpS9Yw7r2YOkI9fHlRaTrGhWVYaXFaK1QqpUz2Rvs",
                previewImage: {
                  small: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:600:600/f:best/aHR0cHM6Ly9leGFtcGxlLmNvbS9zdW5zZXQuanBn",
                  medium: "https://scontent-iad4-1.choicecdn.com/-/rs:fit:1200:1200/f:best/aHR0cHM6Ly9leGFtcGxlLmNvbS9zdW5zZXQuanBn",
                  blurhash: "eTK_Bw4mOGskwAe_VYzut6x]~DrZ$$R*Nj-WtxuWBoJt-5MxaLMzxt"
                }
              },
              transfers: {
                count: 15
              },
              uniqueHolders: 3,
              // Portfolio-specific fields
              holdings: 12000,
              value: 0.099,
              profitLoss: -0.023,
              profitLossPercentage: -18.8
            }
          ],
          totalValue: 0.158,
          totalProfitLoss: -0.008,
          walletBalance: 0.324
        };

        setPortfolio(mockPortfolio);
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  const handleCoinClick = (coin: Coin) => {
    // Store the selected coin and navigate to trade
    localStorage.setItem("selectedCoin", JSON.stringify(coin));
    setActiveTab("trade");
  };

  const getFilteredCoins = () => {
    if (!portfolio) return [];

    switch (activeView) {
      case "created":
        // Show coins where the user is the creator
        return portfolio.coins.filter(coin =>
          // This is a simplified check - in a real app, you'd compare with the user's wallet address
          coin.creatorProfile?.handle === "myusername"
        );
      case "collected":
        // Show coins that the user didn't create but owns
        return portfolio.coins.filter(coin =>
          coin.creatorProfile?.handle !== "myusername"
        );
      case "all":
      default:
        return portfolio.coins;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no coins in portfolio
  if (!portfolio || portfolio.coins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">No coins yet</h2>
        <p className="text-gray-600 mb-4">Start your collection by buying your first content coin</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          onClick={() => setActiveTab("discover")}
        >
          Discover Coins
        </button>
      </div>
    );
  }

  const filteredCoins = getFilteredCoins();

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
            <div className="font-bold text-lg">{balance?.data?.formatted || 0} ETH</div>
          </div>
        </div>

        {/* Portfolio summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 mb-4">
          <h2 className="text-lg font-medium mb-1">Portfolio Value</h2>
          <div className="text-2xl font-bold">{portfolio.totalValue.toFixed(3)} ETH</div>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${portfolio.totalProfitLoss >= 0
                ? 'text-green-200'
                : 'text-red-200'
              }`}>
              {portfolio.totalProfitLoss >= 0 ? '+' : ''}{portfolio.totalProfitLoss.toFixed(3)} ETH
            </span>
            <span className="text-xs ml-1 text-white/70">All time</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-2 overflow-x-auto mb-4 hide-scrollbar">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeView === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setActiveView("all")}
          >
            All Coins
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeView === "created"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setActiveView("created")}
          >
            Created
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeView === "collected"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => setActiveView("collected")}
          >
            Collected
          </button>
        </div>
      </div>

      {/* Coin list */}
      <div className="flex-1 overflow-auto px-4 pb-20">
        {filteredCoins.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No coins in this category
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCoins.map((coin) => (
              <div
                key={coin.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                onClick={() => handleCoinClick(coin)}
              >
                <div className="flex p-3">
                  {/* Coin image */}
                  <div className="w-16 h-16 mr-3 flex-shrink-0">
                    <img
                      src={coin.mediaContent?.previewImage?.small || 'https://via.placeholder.com/100'}
                      alt={coin.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Coin details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium truncate">{coin.name}</h3>
                      {coin.creatorProfile?.handle === "myusername" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Creator</span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mt-0.5">
                      <span>@{coin.creatorProfile?.handle}</span>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <div className="text-xs text-gray-500">Holdings</div>
                        <div className="font-medium">{coin.holdings?.toLocaleString()} coins</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Value</div>
                        <div className="font-medium">{coin.value?.toFixed(3)} ETH</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profit/Loss stats */}
                <div className={`px-3 py-2 ${coin.profitLoss && coin.profitLoss >= 0
                    ? 'bg-green-50'
                    : 'bg-red-50'
                  }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Profit/Loss</span>
                    <div className="flex items-center">
                      <span className={`font-medium ${coin.profitLoss && coin.profitLoss >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                        }`}>
                        {coin.profitLoss && coin.profitLoss >= 0 ? '+' : ''}{coin.profitLoss?.toFixed(3)} ETH
                      </span>
                      <span className={`ml-2 text-xs ${coin.profitLossPercentage && coin.profitLossPercentage >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                        }`}>
                        {coin.profitLossPercentage && coin.profitLossPercentage >= 0 ? '+' : ''}{coin.profitLossPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}