"use client";

import { useState, useEffect } from "react";

type PortfolioPageProps = {
    setActiveTab: (tab: string) => void;
};

export function PortfolioPage({ setActiveTab }: PortfolioPageProps) {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadPortfolio() {
            try {
                // Mock data - replace with actual API call
                const data = {
                    totalValue: "0.125",
                    totalProfit: "+0.032",
                    coins: [
                        {
                            id: "1",
                            name: "Cool Cat Photo",
                            amount: "100",
                            value: "0.05",
                            profit: "+0.02",
                            imageUrl: "https://picsum.photos/200/300"
                        },
                        {
                            id: "3",
                            name: "Pixel Art",
                            amount: "75",
                            value: "0.075",
                            profit: "+0.012",
                            imageUrl: "https://picsum.photos/200/302"
                        }
                    ]
                };

                setPortfolio(data);
            } catch (error) {
                console.error("Failed to load portfolio:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPortfolio();
    }, []);

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

    return (
        <div className="flex flex-col h-full p-4">
            <h1 className="text-xl font-bold mb-4">My Portfolio</h1>

            {/* Portfolio summary */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 mb-6">
                <h2 className="text-lg font-medium mb-1">Total Value</h2>
                <div className="text-2xl font-bold">{portfolio.totalValue} ETH</div>
                <div className="flex items-center mt-2">
                    <span className={`text-sm ${portfolio.totalProfit.startsWith('+')
                            ? 'text-green-200'
                            : 'text-red-200'
                        }`}>
                        {portfolio.totalProfit} ETH
                    </span>
                    <span className="text-xs ml-1 text-white/70">All time</span>
                </div>
            </div>

            {/* Coin list */}
            <div className="space-y-4">
                <h2 className="font-medium text-gray-700">My Coins</h2>

                {portfolio.coins.map((coin: any) => (
                    <div
                        key={coin.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 flex items-center"
                        onClick={() => {
                            // Navigate to trade page with this coin
                            setActiveTab("trade");
                            // Pass coin ID to trade page
                        }}
                    >
                        <img
                            src={coin.imageUrl}
                            alt={coin.name}
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium">{coin.name}</h3>
                            <div className="text-sm text-gray-500">{coin.amount} coins</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="font-medium">{coin.value} ETH</div>
                            <div className={`text-xs ${coin.profit.startsWith('+')
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }`}>
                                {coin.profit} ETH
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}