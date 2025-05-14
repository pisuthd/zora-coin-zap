"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // If you're using Next.js

type TradePageProps = {
    setActiveTab: (tab: string) => void;
    coinId?: string; // Optional coin ID if coming from a specific coin
};

export function TradePage({ setActiveTab, coinId }: TradePageProps) {
    const [coin, setCoin] = useState<any>(null);
    const [amount, setAmount] = useState<string>("1");
    const [action, setAction] = useState<"buy" | "sell">("buy");
    const [loading, setLoading] = useState<boolean>(true);
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

    useEffect(() => {
        // Fetch coin details if coinId is provided
        async function loadCoinDetails() {
            if (!coinId) {
                setLoading(false);
                return;
            }

            try {
                // Mock data - replace with actual API call
                const data = {
                    id: coinId,
                    name: "Cool Cat Photo",
                    price: "0.005",
                    priceChange: "+12.5%",
                    imageUrl: "https://picsum.photos/200/300",
                    description: "A cool cat photo that became viral",
                    creator: "0x1234...5678",
                    volume24h: "2.45 ETH"
                };

                setCoin(data);
            } catch (error) {
                console.error("Failed to load coin details:", error);
            } finally {
                setLoading(false);
            }
        }

        loadCoinDetails();
    }, [coinId]);

    const handleTrade = async () => {
        setTransactionStatus("processing");

        try {
            // Mock transaction - replace with actual transaction logic
            await new Promise(resolve => setTimeout(resolve, 1500));

            setTransactionStatus("success");
            // You would redirect to portfolio after success
            setTimeout(() => {
                setActiveTab("portfolio");
            }, 2000);
        } catch (error) {
            console.error("Transaction failed:", error);
            setTransactionStatus("failed");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!coinId && !coin) {
        return (
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Trade</h1>
                <p className="text-gray-600">Please select a coin from the discover page to trade.</p>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setActiveTab("home")}
                >
                    Browse Coins
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            {/* Back button */}
            <div className="mb-4">
                <button
                    className="flex items-center text-gray-600"
                    onClick={() => setActiveTab("home")}
                >
                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Coin details */}
            <div className="flex items-center mb-6">
                <img
                    src={coin?.imageUrl}
                    alt={coin?.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                    <h1 className="text-xl font-bold">{coin?.name}</h1>
                    <div className="flex items-center">
                        <span className="text-lg font-medium">{coin?.price} ETH</span>
                        <span className={`ml-2 text-sm ${coin?.priceChange?.startsWith('+')
                                ? 'text-green-500'
                                : 'text-red-500'
                            }`}>
                            {coin?.priceChange}
                        </span>
                    </div>
                </div>
            </div>

            {/* Trade options */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 rounded-l-lg ${action === "buy"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setAction("buy")}
                    >
                        Buy
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-r-lg ${action === "sell"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setAction("sell")}
                    >
                        Sell
                    </button>
                </div>

                {/* Amount input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="number"
                            className="block w-full pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">Coins</span>
                        </div>
                    </div>
                </div>

                {/* Price estimate */}
                <div className="bg-white p-3 rounded-md mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price per coin:</span>
                        <span>{coin?.price} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Quantity:</span>
                        <span>{amount} coins</span>
                    </div>
                    <div className="border-t my-2"></div>
                    <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>{(parseFloat(amount) * parseFloat(coin?.price || "0")).toFixed(6)} ETH</span>
                    </div>
                </div>

                {/* Action button */}
                <button
                    className={`w-full py-3 rounded-lg font-medium ${transactionStatus === "processing"
                            ? "bg-gray-400 cursor-not-allowed"
                            : action === "buy"
                                ? "bg-blue-500 text-white"
                                : "bg-red-500 text-white"
                        }`}
                    onClick={handleTrade}
                    disabled={transactionStatus === "processing"}
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
                        `${action === "buy" ? "Buy" : "Sell"} Coins`
                    )}
                </button>

                {/* Transaction status */}
                {transactionStatus === "success" && (
                    <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-center">
                        Transaction successful! Redirecting to your portfolio...
                    </div>
                )}

                {transactionStatus === "failed" && (
                    <div className="mt-3 p-2 bg-red-100 text-red-800 rounded text-center">
                        Transaction failed. Please try again.
                    </div>
                )}
            </div>

            {/* Additional coin info */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-medium mb-2">About this coin</h2>
                <p className="text-sm text-gray-600 mb-3">{coin?.description}</p>

                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Creator:</span>
                    <span className="font-mono">{coin?.creator}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">24h Volume:</span>
                    <span>{coin?.volume24h}</span>
                </div>
            </div>
        </div>
    );
}