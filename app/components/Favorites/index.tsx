"use client";

import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, Users, DollarSign, Brain, Star, Filter, SortAsc, X } from 'lucide-react';

interface FavoritesPageProps {
  setActiveTab: (tab: string) => void;
  setCoin: (coin: any) => void;
  likedCoins?: any[];
  setLikedCoins?: (coins: any[]) => void;
}

// Transform Zora coin data to favorites format
const transformCoinData = (coin: any) => {
  const currentPrice = coin.marketCap && coin.totalSupply 
    ? Number(coin.marketCap) / Number(coin.totalSupply) 
    : 0;
    
  // Calculate percentage change from marketCapDelta24h
  const change24h = coin.marketCapDelta24h && coin.marketCap 
    ? (Number(coin.marketCapDelta24h) / (Number(coin.marketCap) - Number(coin.marketCapDelta24h))) * 100
    : 0;
    
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    description: coin.description || `A content coin created by ${coin.creatorProfile?.handle || 'anonymous'} on the Zora protocol.`,
    image: coin.mediaContent?.previewImage?.small || coin.mediaContent?.previewImage?.medium || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(coin.name || 'Coin'),
    creator: coin.creatorProfile?.handle || 'anonymous',
    marketCap: Number(coin.marketCap) || 0,
    volume24h: Number(coin.volume24h) || 0,
    holders: coin.uniqueHolders || 0,
    currentPrice,
    change24h,
    aiScore: coin.aiScore || 0,
    riskLevel: coin.riskLevel || 'MEDIUM',
    category: coin.category || 'Content',
    likedAt: coin.likedAt || new Date(),
    recommendation: coin.recommendation || 'HOLD',
    aiInsights: {
      momentum: coin.aiAnalysis?.momentum || 'Analysis pending',
      social: coin.aiAnalysis?.social || 'Community data updating',
      technical: coin.aiAnalysis?.technical || 'Technical analysis in progress',
      recommendation: coin.recommendation || 'HOLD'
    },
    // Keep original Zora data for trading
    originalData: coin
  };
};

export function FavoritesPage({ setActiveTab, setCoin, likedCoins = [], setLikedCoins }: FavoritesPageProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'aiScore' | 'performance' | 'marketCap'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from actual liked coins
  const categories = ['all', ...Array.from(new Set(likedCoins.map(coin => {
    const transformed = transformCoinData(coin);
    return transformed.category;
  })))];

  // Transform and set liked coins as favorites
  useEffect(() => {
    if (likedCoins.length > 0) {
      const transformedFavorites = likedCoins.map(transformCoinData);
      setFavorites(transformedFavorites);
    } else {
      setFavorites([]);
    }
  }, [likedCoins]);

  const handleRemoveFavorite = (coinId: string) => {
    // Remove from local state
    setFavorites(prev => prev.filter(coin => coin.id !== coinId));
    // Remove from parent state
    if (setLikedCoins) {
      setLikedCoins(likedCoins.filter(coin => coin.id !== coinId));
    }
  };

  const handleTradeClick = (coin: any) => {
    // Use original Zora data for trading
    setCoin(coin.originalData || coin);
    setActiveTab('trade');
  };

  const getSortedAndFilteredFavorites = () => {
    let filtered = favorites;

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(coin => coin.category === filterCategory);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.likedAt || 0).getTime() - new Date(a.likedAt || 0).getTime();
        case 'aiScore':
          return (b.aiScore || 0) - (a.aiScore || 0);
        case 'performance':
          return (b.change24h || 0) - (a.change24h || 0);
        case 'marketCap':
          return (b.marketCap || 0) - (a.marketCap || 0);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-500 bg-green-100';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-100';
      case 'HIGH': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100';
      case 'HOLD': return 'text-yellow-600 bg-yellow-100';
      case 'WATCH': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  const displayedFavorites = getSortedAndFilteredFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="text-red-500" size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">No Favorites Yet</h2>
        <p className="text-gray-600 mb-6">
          Start swiping in AI Discovery to build your collection of favorite coins!
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          {/* <Brain size={16} /> */}
          <span>Start Discovering</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2"> 
            <h1 className="text-xl font-bold">My Favorites</h1>
          </div>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
            {favorites.length}
          </span>
        </div>

        {/* Controls */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                showFilters ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1 bg-white"
            >
              <option value="recent">Recent</option>
              <option value="aiScore">AI Score</option>
              <option value="performance">Performance</option>
              <option value="marketCap">Market Cap</option>
            </select>
          </div>

          
        </div> */}

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterCategory === category
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-600 border'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {/* <div className="bg-white border-b px-4 py-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {favorites.filter(coin => coin.aiInsights?.recommendation === 'BUY').length}
            </div>
            <div className="text-xs text-gray-500">Buy Signals</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {Math.round(favorites.reduce((sum, coin) => sum + (coin.aiScore || 0), 0) / favorites.length)}
            </div>
            <div className="text-xs text-gray-500">Avg AI Score</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              ${(favorites.reduce((sum, coin) => sum + (coin.marketCap || 0), 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-500">Total Market Cap</div>
          </div>
        </div>
      </div> */}

      {/* Favorites list */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {displayedFavorites.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">No coins match your filters</div>
            <button
              onClick={() => setFilterCategory('all')}
              className="text-purple-600 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          displayedFavorites.map((coin) => (
            <div key={coin.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Header with remove button */}
              <div className="relative">
                <div className="flex p-4">
                  {/* Coin image */}
                  <div className="w-16 h-16 mr-3 flex-shrink-0">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Coin details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{coin.name}</h3>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-500">${coin.symbol}</span>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            {coin.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{coin.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveFavorite(coin.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* AI Score and Risk */}
              <div className="px-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {/* <Brain className="text-purple-500" size={14} /> */}
                      <span className="text-sm font-medium">Score: {coin.aiScore}%</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(coin.riskLevel)}`}>
                      {coin.riskLevel}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Liked {formatTimeAgo(coin.likedAt || new Date())}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 px-4 pb-3 text-sm">
                <div>
                  <div className="text-gray-500">Price</div>
                  <div className="font-medium">
                    ${coin.currentPrice > 0.00001 
                      ? coin.currentPrice.toFixed(6) 
                      : coin.currentPrice.toFixed(9)
                    }
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">24h Change</div>
                  <div className={`font-medium ${coin.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.change24h > 0 ? '+' : ''}{coin.change24h?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Market Cap</div>
                  <div className="font-medium">
                    ${coin.marketCap > 1000000 
                      ? `${(coin.marketCap / 1000000).toFixed(1)}M`
                      : coin.marketCap > 1000
                      ? `${(coin.marketCap / 1000).toFixed(1)}K`
                      : `${coin.marketCap.toFixed(0)}`
                    }
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className={`mx-4 mb-3 p-2 rounded ${getRecommendationColor(coin.aiInsights?.recommendation)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Recommendation</span>
                  <span className="font-bold">{coin.aiInsights?.recommendation}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 p-4 pt-0">
                <button
                  onClick={() => handleTradeClick(coin)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
                >
                  Trade Now
                </button>
                {/* <button
                  onClick={() => {
                    setCoin(coin);
                    // Could open a detailed view modal here
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                >
                  Details
                </button> */}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom action */}
      <div className="bg-white border-t p-4">
        <button
          onClick={() => setActiveTab('home')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <Heart size={16} />
          <span>Discover More Coins</span>
        </button>
      </div>
    </div>
  );
}