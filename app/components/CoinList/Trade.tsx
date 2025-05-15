

import { useState, useEffect, useContext } from "react";
import { CoinContext } from "@/contexts/coin";
import { useBalance, useAccount } from 'wagmi'

type TradePanelProps = {
  coin: any;
  close: () => void;

};


export default function TradePanel({ coin, close }: TradePanelProps) {

  const {  } = useContext(CoinContext)

  const account = useAccount()

  console.log("account:", account)

  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("1");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState<boolean>(false);


  const handleTrade = async () => {
    if (!coin) return;

    setTransactionStatus("processing");

    try {
      // Mock transaction - replace with actual transaction logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTransactionStatus("success");
      // Redirect to portfolio after success
      // setTimeout(() => {
      //   setActiveTab("portfolio");
      // }, 2000);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionStatus("failed");
    }
  };

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

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  if (!coin) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">No coin data</h2>
        <p className="text-gray-600 mb-4">Please select a coin from the home page again.</p>
        {/*<button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          onClick={() => setActiveTab("discover")}
        >
          Browse Coins
        </button>*/}
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center">
        <button
          className="flex items-center text-gray-600"
          onClick={() => close()}
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
            <div className="font-bold text-lg">{Number(coin.marketCap).toFixed(2)} ETH</div>
            <div className={`text-xs mt-1 ${Number(coin.marketCapDelta24h) >= 0
              ? 'text-green-500'
              : 'text-red-500'
              }`}>
              {Number(coin.marketCapDelta24h) >= 0 ? '+' : ''}{Number(coin.marketCapDelta24h).toFixed(2)}%
            </div>
          </div>

          <div className="bg-white border rounded-xl p-3">
            <div className="text-sm text-gray-500">24h Volume</div>
            <div className="font-bold text-lg">{Number(coin.volume24h).toFixed(3)} ETH</div>
            <div className="text-xs mt-1 text-gray-500">
              Total: {Number(coin.totalVolume).toFixed(3)} ETH
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
                  <span>ETH Earned:</span>
                  <span className="font-medium">{earning.amount.amountDecimal.toFixed(6)} ETH</span>
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
              <span>{Number(coin.totalSupply).toLocaleString()} coins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contract:</span>
              <div className="flex items-center">
                <span className="font-mono text-xs truncate max-w-[140px]">{coin.address}</span>
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
          </div>
        </div>

        {/* Trading section - in the normal document flow */}
        <div className="mt-6 bg-white border rounded-xl overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center font-medium ${action === "buy"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
                  }`}
                onClick={() => setAction("buy")}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium ${action === "sell"
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-500"
                  }`}
                onClick={() => setAction("sell")}
              >
                Sell
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Current price info */}
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Current Price</span>
              <span className="font-medium">0.00001182 ETH per token</span>
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
                      // Set max amount based on wallet balance or available tokens
                      // setAmount(action === "buy" ? "10000" : "500"); // Example values
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
                <span className="text-gray-600">Subtotal</span>
                <span>{(parseFloat(amount || "0") * 0.00001182).toFixed(6)} ETH</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Network Fee (est.)</span>
                <span>0.000025 ETH</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{(parseFloat(amount || "0") * 0.00001182 + 0.000025).toFixed(6)} ETH</span>
              </div>
            </div>

            {/* Balance info for context */}
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              {action === "buy" ? (
                <>
                  <span>Wallet Balance:</span>
                  <span>0.245 ETH</span>
                </>
              ) : (
                <>
                  <span>Your {coin.name} Balance:</span>
                  <span>500 tokens</span>
                </>
              )}
            </div>

            {/* Action button */}
            <button
              className={`w-full py-3 rounded-lg font-medium ${!amount || parseFloat(amount) <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : transactionStatus === "processing"
                  ? "bg-gray-400 cursor-not-allowed"
                  : action === "buy"
                    ? "bg-blue-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              onClick={handleTrade}
              disabled={!amount || parseFloat(amount) <= 0 || transactionStatus === "processing"}
            >
              {transactionStatus === "processing" ? (
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
            </button>

            {/* Transaction status */}
            {transactionStatus === "success" && (
              <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-center text-sm">
                Transaction successful! Redirecting to your portfolio...
              </div>
            )}

            {transactionStatus === "failed" && (
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