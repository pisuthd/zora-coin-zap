"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import { Heart, X, TrendingUp, Users, DollarSign, Zap, Settings, Brain, Star, Shield, AlertTriangle } from 'lucide-react';
import { CoinContext } from "@/contexts/coin";

// AI-powered mock data generator
const generateAIRecommendations = (coins: any[], userPreferences: any) => {
  return coins.map((coin: any) => {
    // Calculate AI score based on various factors
    const momentumScore = Math.max(0, Math.min(100, 50 + coin.marketCapDelta24h * 2));
    const volumeScore = Math.min(100, (coin.volume24h / 100000) * 30);
    const socialScore = Math.min(100, coin.uniqueHolders / 10);
    const marketCapScore = Math.min(100, coin.marketCap / 50000);
    
    const aiScore = Math.round(
      (momentumScore * 0.3 + volumeScore * 0.25 + socialScore * 0.25 + marketCapScore * 0.2)
    );

    // Determine risk level
    const volatility = Math.abs(coin.marketCapDelta24h);
    let riskLevel = 'LOW';
    if (volatility > 50) riskLevel = 'HIGH';
    else if (volatility > 20) riskLevel = 'MEDIUM';

    // Generate AI insights
    const insights = {
      momentum: coin.marketCapDelta24h > 0 
        ? `Strong upward momentum with ${Number(coin.marketCapDelta24h).toFixed(1)}% gain`
        : `Temporary pullback of ${Math.abs(Number(coin.marketCapDelta24h)).toFixed(1)}%, fundamentals may be strong`,
      social: `${coin.uniqueHolders} holders, ${coin.uniqueHolders > 500 ? 'growing' : 'emerging'} community`,
      technical: coin.volume24h > 50000 
        ? 'High volume suggests strong interest'
        : 'Moderate volume, watch for breakout',
      recommendation: aiScore > 75 ? 'BUY' : aiScore > 60 ? 'HOLD' : aiScore > 40 ? 'WATCH' : 'PASS'
    };

    // Determine category based on name/description
    let category = 'Other';
    const name = coin.name.toLowerCase();
    if (name.includes('ai') || name.includes('artificial')) category = 'AI & Tech';
    else if (name.includes('game') || name.includes('nft')) category = 'Gaming & NFTs';
    else if (name.includes('meme') || name.includes('fun')) category = 'Memes & Viral';
    else if (name.includes('music') || name.includes('art')) category = 'Art & Music';
    else if (name.includes('defi') || name.includes('finance')) category = 'DeFi & Finance';

    const currentPrice = Number(coin.marketCap) / Number(coin.totalSupply);

    return {
      ...coin,
      currentPrice,
      aiScore,
      riskLevel,
      category,
      aiInsights: insights
    };
  });
};

const defaultAISettings = {
  riskTolerance: 'MEDIUM',
  categories: ['AI & Tech', 'Gaming & NFTs', 'Memes & Viral', 'Art & Music', 'DeFi & Finance', 'Other'],
  preferredCategories: ['AI & Tech', 'Gaming & NFTs'],
  minMarketCap: 100000,
  maxMarketCap: 10000000,
  aiRecommendationsEnabled: true,
  socialSignalsWeight: 0.7,
  technicalSignalsWeight: 0.8,
  momentumSignalsWeight: 0.9
};

type TinderSwipeProps = {
  setCoin: (coin: any) => void;
  setActiveTab: (tab: string) => void;
};

export function TinderSwipe({ setActiveTab, setCoin }: TinderSwipeProps) {

  const { trending, topByMarketCap, newest } = useContext(CoinContext);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [aiSettings, setAiSettings] = useState(defaultAISettings);
  const [likedCoins, setLikedCoins] = useState<any[]>([]);
  const [passedCoins, setPassedCoins] = useState<any[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiEnhancedCoins, setAiEnhancedCoins] = useState<any[]>([]);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  // Generate AI-enhanced coin data when coins are loaded
  useEffect(() => {
    const allCoins = [...trending, ...topByMarketCap, ...newest];
    console.log("allCoins", allCoins)
    if (allCoins.length > 0) {
      const enhancedCoins = generateAIRecommendations(allCoins, aiSettings);
      console.log("enhancedCoins:", enhancedCoins)
      // Filter and sort based on AI preferences
      const filteredCoins = enhancedCoins
        .filter(coin => {
          const meetsRiskTolerance = 
            aiSettings.riskTolerance === 'HIGH' || 
            (aiSettings.riskTolerance === 'MEDIUM' && coin.riskLevel !== 'HIGH') ||
            (aiSettings.riskTolerance === 'LOW' && coin.riskLevel === 'LOW');
          
          const meetsMarketCap = 
            coin.marketCap >= aiSettings.minMarketCap && 
            coin.marketCap <= aiSettings.maxMarketCap;
          
          const meetsCategory = 
            aiSettings.preferredCategories.length === 0 || 
            aiSettings.preferredCategories.includes(coin.category);
          
          return meetsRiskTolerance && meetsMarketCap && meetsCategory;
        })
        .sort((a, b) => b.aiScore - a.aiScore); // Sort by AI score descending
      
        console.log("filteredCoins:", filteredCoins)

      setAiEnhancedCoins(enhancedCoins);
      setCurrentIndex(0);
    }
  }, [trending, topByMarketCap, newest, aiSettings]);

  const currentCoin = aiEnhancedCoins[currentIndex];

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (isAnimating || !currentCoin) return;
    
    setIsAnimating(true);
    
    if (direction === 'like') {
      setLikedCoins(prev => [...prev, currentCoin]);
    } else {
      setPassedCoins(prev => [...prev, currentCoin]);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateY(${deltaY}px) rotate(${deltaY * 0.1}deg)`;
      cardRef.current.style.opacity = String(Math.max(0.3, 1 - Math.abs(deltaY) / 200));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const deltaY = currentY.current - startY.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.opacity = '';
    }
    
    if (Math.abs(deltaY) > 100) {
      handleSwipe(deltaY < 0 ? 'like' : 'pass');
    }
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

  const handleTradeClick = () => {
    if (currentCoin) {
      setCoin(currentCoin);
      setActiveTab('trade');
    }
  };

  if (aiEnhancedCoins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <h2 className="text-lg font-medium mb-2">AI is analyzing coins...</h2>
        <p className="text-gray-600 text-sm">
          Our AI is processing market data to find the best opportunities for you.
        </p>
      </div>
    );
  }

  if (currentIndex >= aiEnhancedCoins.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
          <Zap className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
        <p className="text-gray-600 mb-6">
          You've reviewed all AI-recommended coins. Check back later for new opportunities!
        </p>
        <div className="space-y-3 w-full max-w-sm">
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Your Activity</h3>
            <div className="flex justify-between text-sm">
              <span>💚 Liked: {likedCoins.length}</span>
              <span>❌ Passed: {passedCoins.length}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setLikedCoins([]);
              setPassedCoins([]);
            }}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
          >
            Review Again
          </button>
          <button 
            onClick={() => setActiveTab('home')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Brain className="text-purple-500" size={20} />
          <span className="font-medium">AI Discovery</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`p-2 rounded-full ${showAIInsights ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <Star size={16} />
          </button>
          <button
            onClick={() => setShowAISettings(true)}
            className="p-2 rounded-full bg-gray-100 text-gray-600"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / aiEnhancedCoins.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {currentIndex + 1} of {aiEnhancedCoins.length} AI-recommended coins
        </div>
      </div>

      {/* Main card area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm">
          {/* Card */}
          <div
            ref={cardRef}
            className={`bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden transition-all duration-300 ${
              isAnimating ? 'scale-95 opacity-50' : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={currentCoin?.mediaContent?.previewImage?.small || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(currentCoin?.name || 'Coin')}
                alt={currentCoin?.name}
                className="w-full h-full object-cover"
              />
              
              {/* AI Score Badge */}
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Brain size={12} />
                <span>AI: {currentCoin?.aiScore}</span>
              </div>

              {/* Risk Level Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(currentCoin?.riskLevel)}`}>
                <div className="flex items-center space-x-1">
                  {currentCoin?.riskLevel === 'HIGH' && <AlertTriangle size={12} />}
                  {currentCoin?.riskLevel === 'MEDIUM' && <Shield size={12} />}
                  {currentCoin?.riskLevel === 'LOW' && <Shield size={12} />}
                  <span>{currentCoin?.riskLevel}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Title and Symbol */}
              <div>
                <h2 className="text-xl font-bold">{currentCoin?.name}</h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">${currentCoin?.symbol}</span>
                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {currentCoin?.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm line-clamp-2">
                {currentCoin?.description || `A content coin created by ${currentCoin?.creatorProfile?.handle || 'anonymous'} on the Zora protocol.`}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-green-500" />
                  <div>
                    <div className="text-gray-500">Price</div>
                    <div className="font-medium">${currentCoin?.currentPrice > 0.00001 ? currentCoin?.currentPrice?.toFixed(6) : currentCoin?.currentPrice?.toFixed(9)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} className="text-blue-500" />
                  <div>
                    <div className="text-gray-500">24h Change</div>
                    <div className={`font-medium ${currentCoin?.marketCapDelta24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {currentCoin?.marketCapDelta24h > 0 ? '+' : ''}{Number(currentCoin?.marketCapDelta24h)?.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-purple-500" />
                  <div>
                    <div className="text-gray-500">Holders</div>
                    <div className="font-medium">{currentCoin?.uniqueHolders?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="text-gray-500">Market Cap</div>
                    <div className="font-medium">${(Number(currentCoin?.marketCap) / 1000000).toFixed(1)}M</div>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className={`p-3 rounded-lg ${getRecommendationColor(currentCoin?.aiInsights?.recommendation)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain size={16} />
                    <span className="font-medium">AI Recommendation</span>
                  </div>
                  <span className="font-bold">{currentCoin?.aiInsights?.recommendation}</span>
                </div>
              </div>

              {/* AI Insights (expandable) */}
              {showAIInsights && (
                <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-lg">
                  <div><strong>Momentum:</strong> {currentCoin?.aiInsights?.momentum}</div>
                  <div><strong>Social:</strong> {currentCoin?.aiInsights?.social}</div>
                  <div><strong>Technical:</strong> {currentCoin?.aiInsights?.technical}</div>
                </div>
              )}

              {/* Creator */}
              <div className="text-xs text-gray-500">
                Created by @{currentCoin?.creatorProfile?.handle || 'anonymous'}
              </div>

              {/* Trade Button */}
              <button
                onClick={handleTradeClick}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Trade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center items-center space-x-8 p-6">
        <button
          onClick={() => handleSwipe('pass')}
          className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-200 transition-colors"
          disabled={isAnimating}
        >
          <X size={28} />
        </button>
        
        <button
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-200 transition-colors"
          disabled={isAnimating}
        >
          <Heart size={28} />
        </button>
      </div>

      {/* Activity summary */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-lg p-3 border flex justify-between text-sm">
          <span className="text-green-600">💚 {likedCoins.length} liked</span>
          <span className="text-red-600">❌ {passedCoins.length} passed</span>
        </div>
      </div>

      {/* AI Settings Modal */}
      {showAISettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">AI Preferences</h3>
                <button onClick={() => setShowAISettings(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Risk Tolerance */}
              <div>
                <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
                <div className="grid grid-cols-3 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH'].map(risk => (
                    <button
                      key={risk}
                      onClick={() => setAiSettings(prev => ({ ...prev, riskTolerance: risk }))}
                      className={`p-2 rounded text-sm ${
                        aiSettings.riskTolerance === risk 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Categories */}
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Categories</label>
                <div className="space-y-2">
                  {aiSettings.categories.map(category => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={aiSettings.preferredCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAiSettings(prev => ({
                              ...prev,
                              preferredCategories: [...prev.preferredCategories, category]
                            }));
                          } else {
                            setAiSettings(prev => ({
                              ...prev,
                              preferredCategories: prev.preferredCategories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Market Cap Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Market Cap Range</label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600">Minimum: ${(aiSettings.minMarketCap / 1000).toFixed(0)}K</label>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={aiSettings.minMarketCap}
                      onChange={(e) => setAiSettings(prev => ({ 
                        ...prev, 
                        minMarketCap: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Maximum: ${(aiSettings.maxMarketCap / 1000000).toFixed(1)}M</label>
                    <input
                      type="range"
                      min="1000000"
                      max="50000000"
                      step="1000000"
                      value={aiSettings.maxMarketCap}
                      onChange={(e) => setAiSettings(prev => ({ 
                        ...prev, 
                        maxMarketCap: parseInt(e.target.value)
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setShowAISettings(false)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}