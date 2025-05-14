"use client";

import { useState, useEffect } from "react";

type CoinListProps = {
    setActiveTab: (tab: string) => void;
    setCoinId: (coinId: string) => void;
};

export async function fetchTrendingCoins() {
    // In a real implementation, you would call the ZORA API here
    return [
        {
            id: '1',
            name: 'Cool Cat Photo',
            price: '0.005',
            priceChange: '+12.5%',
            imageUrl: 'https://picsum.photos/200/300'
        },
        {
            id: '2',
            name: 'Sunset Vibes',
            price: '0.012',
            priceChange: '-3.2%',
            imageUrl: 'https://picsum.photos/200/301'
        },
        {
            id: '3',
            name: 'Pixel Art',
            price: '0.008',
            priceChange: '+5.7%',
            imageUrl: 'https://picsum.photos/200/302'
        },
    ];
}

export function CoinList({ setActiveTab , setCoinId }: CoinListProps) {

    const [coins, setCoins] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadCoins() {
            try {
                const data = await fetchTrendingCoins();
                setCoins(data);
            } catch (error) {
                console.error("Failed to load coins:", error);
            } finally {
                setLoading(false);
            }
        }

        loadCoins();
    }, []);

    const filteredCoins = coins.filter((coin: any) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );



    return (
        <div className="flex flex-col h-full">
            {/* Header with logo */}
            {/* <div className="flex justify-center py-4 border-b">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white font-bold">Z</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        ZoraCoinZap
                    </h1>
                </div>
            </div> */}

            {/* Hero section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg my-4 text-center">
                <h2 className="text-lg font-bold mb-1">Discover & Trade Content Coins</h2>
                <p className="text-sm text-gray-600 mb-3">The fastest way to interact with Zora coins on Base</p>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                    onClick={() => setActiveTab("create")}
                >
                    Create a Coin
                </button>
            </div>

            {/* Search bar */}
            <div className="px-4 mb-4">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Trending section */}
            <div className="px-4 mb-2">
                <h2 className="font-bold text-lg mb-2">🔥 Trending Now</h2>
            </div>

            {/* Coin list */}
            {loading ? (
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="px-4 space-y-4 flex-1 overflow-auto">
                    {filteredCoins.map((coin: any) => (
                        <div
                            key={coin.id}
                            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex items-center"
                            onClick={() => {
                                // Handle coin selection
                                setCoinId(coin.id)
                                setActiveTab("trade")
                            }}
                        >
                            <img
                                src={coin.imageUrl}
                                alt={coin.name}
                                className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium">{coin.name}</h3>
                                <div className="text-sm text-gray-500">#{coin.id}</div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="font-medium">{coin.price} ETH</div>
                                <div
                                    className={`text-xs ${coin.priceChange.startsWith('+')
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                        }`}
                                >
                                    {coin.priceChange}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
 
            
        </div>
    )
}