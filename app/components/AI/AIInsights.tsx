"use client";

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, DollarSign, AlertTriangle, Shield, Star } from 'lucide-react';
import { tradingInsightsEngine } from '@/lib/ai/trading-insights';

interface AIInsightsProps {
  coin: any;
  compact?: boolean;
}

export function AIInsights({ coin, compact = false }: AIInsightsProps) {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coin) {
      generateInsight();
    }
  }, [coin]);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const aiInsight = await tradingInsightsEngine.analyzeCoin(coin);
      setInsight(aiInsight);
    } catch (error) {
      console.error('Failed to generate AI insight:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="text-purple-500 animate-pulse" size={16} />
          <span className="text-sm font-medium">AI Analysis</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <Brain className="text-gray-400 mx-auto mb-2" size={20} />
        <p className="text-sm text-gray-500">AI analysis unavailable</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Brain className="text-purple-500" size={16} />
            <span className="text-sm font-medium">AI Score: {insight.aiScore}</span>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getRecommendationColor(insight.recommendedAction)}`}>
            {insight.recommendedAction}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Confidence: {insight.confidence}%</span>
          <span className={`px-2 py-1 rounded ${getRiskColor(insight.riskLevel)}`}>
            {insight.riskLevel} Risk
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="text-purple-500" size={20} />
          <h3 className="font-medium">AI Trading Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-500" size={16} />
          <span className="text-sm font-medium">{insight.aiScore}/100</span>
        </div>
      </div>

      {/* Main recommendation */}
      <div className={`p-3 rounded-lg ${getRecommendationColor(insight.recommendedAction)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Recommendation: {insight.recommendedAction}</div>
            <div className="text-sm opacity-80">Confidence: {insight.confidence}%</div>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${getRiskColor(insight.riskLevel)}`}>
            {insight.riskLevel} Risk
          </div>
        </div>
      </div>

      {/* Signals */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Signal Analysis</h4>
        <div className="grid grid-cols-2 gap-3">
          {insight.signals.map((signal: any, index: number) => (
            <div key={index} className="bg-gray-50 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium capitalize">{signal.type}</span>
                <div className="flex items-center space-x-1">
                  {signal.direction === 'bullish' && <TrendingUp size={12} className="text-green-500" />}
                  {signal.direction === 'bearish' && <TrendingUp size={12} className="text-red-500 transform rotate-180" />}
                  {signal.direction === 'neutral' && <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                  <span className="text-xs">{signal.strength}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Key Insights</h4>
        <div className="space-y-2 text-sm">
          <div><strong>Momentum:</strong> {insight.insights.momentum}</div>
          <div><strong>Social:</strong> {insight.insights.social}</div>
          <div><strong>Technical:</strong> {insight.insights.technical}</div>
        </div>
      </div>

      {/* Price targets */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Price Targets</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-600 font-medium">Bullish Target</div>
            <div>${insight.priceTargets.bullish.toFixed(6)}</div>
          </div>
          <div className="bg-red-50 p-2 rounded">
            <div className="text-red-600 font-medium">Bearish Target</div>
            <div>${insight.priceTargets.bearish.toFixed(6)}</div>
          </div>
        </div>
      </div>

      {/* Market context */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-medium text-sm text-blue-700 mb-1">Market Context</h4>
        <p className="text-sm text-blue-600">{insight.marketContext}</p>
      </div>

      {/* Category */}
      <div className="text-center">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
          {insight.category}
        </span>
      </div>
    </div>
  );
}