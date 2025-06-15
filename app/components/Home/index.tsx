"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import { CoinContext } from "@/contexts/coin";
import { Heart, X, TrendingUp, Users, DollarSign, Zap, Settings, Brain, Star, Shield, AlertTriangle } from 'lucide-react';

type HomeProps = {
    setCoin: (coin: any) => void;
    setActiveTab: (tab: string) => void;
    likedCoins: any[];
    setLikedCoins: (coins: any[]) => void;
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

export function HomePage({ setActiveTab, setCoin, likedCoins, setLikedCoins }: HomeProps) {

    const { trending, topByMarketCap, newest, fetchCoins }: any = useContext(CoinContext);

    const [coinList, setCoinList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [passedCoins, setPassedCoins] = useState<any[]>([]);
    const [localLikedCoins, setLocalLikedCoins] = useState<any[]>([]);
    const [showAISettings, setShowAISettings] = useState(false);
    const [aiSettings, setAiSettings] = useState(defaultAISettings);
    const [showAIInsights, setShowAIInsights] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);

    useEffect(() => {
        fetchCoins()
    }, []);

    useEffect(() => {

        const allCoins = [...trending, ...topByMarketCap, ...newest];
        setCoinList(allCoins)

    }, [trending, topByMarketCap, newest])

    const handleSwipe = (direction: 'like' | 'pass') => {
        if (isAnimating || !currentCoin) return;

        setIsAnimating(true);

        if (direction === 'like') {
            const updatedLikedCoins = [...likedCoins, { ...currentCoin, likedAt: new Date() }];
            setLikedCoins(updatedLikedCoins);
            setLocalLikedCoins(prev => [...prev, currentCoin]);
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

    const currentCoin = coinList[currentIndex];


    return (
        <div className="flex flex-col h-full">
            {/* Hero section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg my-4 text-center">
                <h2 className="text-lg font-bold mb-1">
                    Your AI Companion for Zora Coins
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                    The fastest way to interact with content coins on Base
                </p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                        onClick={() => setActiveTab("create")}
                    >
                        Create a Coin
                    </button>
                </div>
            </div>

            {coinList.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <h2 className="text-lg font-medium mb-2">AI is analyzing coins...</h2>
                    <p className="text-gray-600 text-sm">
                        Our AI is processing market data to find the best opportunities for you.
                    </p>
                </div>
            )}

            {currentIndex >= coinList.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                        <Zap className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">All caught up!</h2>

                    <div className="space-y-3 w-full max-w-sm">
                        <div className="bg-white rounded-lg p-4 border">
                            <h3 className="font-medium mb-2">Your Activity</h3>
                            <div className="flex justify-between text-sm">
                                <span>❤️ Liked: {likedCoins.length}</span>
                                <span>❌ Passed: {passedCoins.length}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setCurrentIndex(0);
                                setLocalLikedCoins([]);
                                setPassedCoins([]);
                            }}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
                        >
                            Review Again
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium"
                        >
                            View My Favorites ({likedCoins.length})
                        </button>

                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full ">

                    {/* Progress indicator */}
                    <div className="px-4 py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / coinList.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                            {currentIndex + 1} of {coinList.length} AI-recommended coins
                        </div>
                    </div>

                    {/* Main card area */}
                    <div className="flex-1 flex pt-2 items-center justify-center p-4 px-0">
                        <div className="relative w-full max-w-sm">
                            {/* Card */}
                            <div
                                ref={cardRef}
                                className={`bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : ''
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
                    <div className="flex justify-center items-center space-x-8 p-6 pt-2">
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

                </div>
            )}

        </div>
    )
}