"use client";

import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, Users, DollarSign, Brain, Star, Filter, SortAsc, X } from 'lucide-react';

interface FavoritesPageProps {
  setActiveTab: (tab: string) => void;
  setCoin: (coin: any) => void;
  likedCoins?: any[];
}

// Mock data for demonstration - in real app this would come from local storage or context
const mockFavoriteCoins = [
  {
    id: '1',
    name: 'CryptoKitties Revival',
    symbol: 'CKTR',
    description: 'The beloved NFT collection is back as a content coin, riding the nostalgia wave',
    image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop',
    creator: 'nostalgia_dev',
    marketCap: 1250000,
    volume24h: 45000,
    holders: 892,
    currentPrice: 0.00234,
    change24h: 23.5,
    aiScore: 85,
    riskLevel: 'LOW',
    category: 'Gaming & NFTs',
    likedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    aiInsights: {
      momentum: 'Strong upward momentum with 23.5% gain',
      social: 'High engagement, trending on social media',
      technical: 'Breaking resistance levels, good volume',
      recommendation: 'BUY'
    }
  },
  {
    id: '2',
    name: 'AI Art Collective',
    symbol: 'AIAC',
    description: 'Community-driven AI art platform token featuring exclusive generative collections',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=400&fit=crop',
    creator: 'ai_artist_dao',
    marketCap: 850000,
    volume24h: 32000,
    holders: 654,
    currentPrice: 0.00187,
    change24h: -5.2,
    aiScore: 72,
    riskLevel: 'MEDIUM',
    category: 'AI & Art',
    likedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    aiInsights: {
      momentum: 'Temporary pullback, fundamentals strong',
      social: 'Growing community, active Discord',
      technical: 'Support holding at $0.0018 level',
      recommendation: 'HOLD'
    }
  },
  {
    id: '3',
    name: 'DeFi Education Hub',
    symbol: 'DEFI',
    description: 'Educational content platform teaching DeFi concepts through interactive experiences',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop',
    creator: 'defi_teacher',
    marketCap: 680000,
    volume24h: 28000,
    holders: 445,
    currentPrice: 0.00123,
    change24h: 12.3,
    aiScore: 78,
    riskLevel: 'LOW',
    category: 'Education & Finance',
    likedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    aiInsights: {
      momentum: 'Steady growth, educational bull market',
      social: 'High retention, quality community',
      technical: 'Consistent uptrend, low volatility',
      recommendation: 'BUY'
    }
  },
  {
    id: '4',
    name: 'Music Metaverse',
    symbol: 'MUSIC',
    description: 'Virtual concerts and music NFTs in an immersive metaverse experience',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    creator: 'meta_musician',
    marketCap: 1580000,
    volume24h: 56000,
    holders: 789,
    currentPrice: 0.00345,
    change24h: 8.7,
    aiScore: 76,
    riskLevel: 'MEDIUM',
    category: 'Music & Entertainment',
    likedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    aiInsights: {
      momentum: 'Building momentum, partnership news',
      social: 'Music community growing, artist onboarding',
      technical: 'Above moving averages, bullish pattern',
      recommendation: 'BUY'
    }
  },
  {
    id: '5',
    name: 'Viral Factory',
    symbol: 'VIRAL',
    description: 'Community-driven meme creation and monetization platform',
    image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop',
    creator: 'meme_lord_420',
    marketCap: 2100000,
    volume24h: 89000,
    holders: 1337,
    currentPrice: 0.00456,
    change24h: 67.8,
    aiScore: 91,
    riskLevel: 'HIGH',
    category: 'Memes & Viral',
    likedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    aiInsights: {
      momentum: 'Explosive growth, riding viral wave',
      social: 'Viral on TikTok, celebrity endorsements',
      technical: 'Parabolic move, watch for correction',
      recommendation: 'WATCH'
    }
  }
];

export function FavoritesPage({ setActiveTab, setCoin, likedCoins = [] }: FavoritesPageProps) {
  const [favorites, setFavorites] = useState<any[]>(mockFavoriteCoins);
  const [sortBy, setSortBy] = useState<'recent' | 'aiScore' | 'performance' | 'marketCap'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'Gaming & NFTs', 'AI & Art', 'Education & Finance', 'Music & Entertainment', 'Memes & Viral'];

  // Combine mock data with actual liked coins from Tinder interface
  useEffect(() => {
    if (likedCoins.length > 0) {
      const combinedFavorites = [...likedCoins, ...mockFavoriteCoins];
      // Remove duplicates based on id
      const uniqueFavorites = combinedFavorites.filter((coin, index, self) => 
        index === self.findIndex(c => c.id === coin.id)
      );
      setFavorites(uniqueFavorites);
    }
  }, [likedCoins]);

  const handleRemoveFavorite = (coinId: string) => {
    setFavorites(prev => prev.filter(coin => coin.id !== coinId));
  };

  const handleTradeClick = (coin: any) => {
    setCoin(coin);
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
          onClick={() => setActiveTab('ai-swipe')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          <Brain size={16} />
          <span>Start AI Swiping</span>
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
            <Heart className="text-red-500" size={20} />
            <h1 className="text-xl font-bold">My Favorites</h1>
          </div>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
            {favorites.length}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
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

          <button
            onClick={() => setActiveTab('ai-swipe')}
            className="text-purple-600 text-sm flex items-center space-x-1"
          >
            <span>Find More</span>
            <Brain size={14} />
          </button>
        </div>

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
      <div className="bg-white border-b px-4 py-3">
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
      </div>

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
                      <Brain className="text-purple-500" size={14} />
                      <span className="text-sm font-medium">AI: {coin.aiScore}</span>
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
                  <div className="font-medium">${coin.currentPrice?.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-gray-500">24h Change</div>
                  <div className={`font-medium ${coin.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.change24h > 0 ? '+' : ''}{coin.change24h?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Market Cap</div>
                  <div className="font-medium">${(coin.marketCap / 1000000).toFixed(1)}M</div>
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
                <button
                  onClick={() => {
                    setCoin(coin);
                    // Could open a detailed view modal here
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom action */}
      <div className="bg-white border-t p-4">
        <button
          onClick={() => setActiveTab('ai-swipe')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <Heart size={16} />
          <span>Discover More Coins</span>
        </button>
      </div>
    </div>
  );
}