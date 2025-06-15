import React from 'react';
import { X, Brain, TrendingUp, TrendingDown, AlertTriangle, Shield, Star, Target, Eye, DollarSign } from 'lucide-react';
import { CoinAnalysis } from '@/lib/ai/claude-service';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: any & CoinAnalysis;
}

export function AIInsightsModal({ isOpen, onClose, coin }: AIInsightsModalProps) {
  if (!isOpen || !coin) return null;

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-600 bg-green-100';
      case 'SELL': return 'text-red-600 bg-red-100';
      case 'HOLD': return 'text-yellow-600 bg-yellow-100';
      case 'WATCH': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return <TrendingUp size={16} />;
      case 'SELL': return <TrendingDown size={16} />;
      case 'HOLD': return <DollarSign size={16} />;
      case 'WATCH': return <Eye size={16} />;
      default: return <Target size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={coin.mediaContent?.previewImage?.small || 'https://via.placeholder.com/40x40'}
              alt={coin.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{coin.name}</h2>
              <p className="text-sm text-gray-600">${coin.symbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Score and Recommendation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Brain size={16} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">AI Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(coin.aiScore)}`}>
                {coin.aiScore}/100
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                {getRecommendationIcon(coin.recommendation)}
                <span className="text-sm font-medium text-gray-700">Recommendation</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center space-x-1 ${getRecommendationColor(coin.recommendation)}`}>
                <span>{coin.recommendation}</span>
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Risk Level</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getRiskColor(coin.riskLevel)}`}>
                <Shield size={12} />
                <span>{coin.riskLevel}</span>
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">AI Analysis</h3>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">{coin.reasoning}</p>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Category</h3>
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              <Star size={12} />
              <span>{coin.category}</span>
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Strengths</h3>
            <div className="space-y-2">
              {coin.strengths?.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Weaknesses</h3>
            <div className="space-y-2">
              {coin.weaknesses?.map((weakness, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">{weakness}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outlook */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Short Term (1-3 months)</h3>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{coin.shortTerm}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Long Term (6-12 months)</h3>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{coin.longTerm}</p>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500">Market Cap</div>
                <div className="font-medium">${(Number(coin.marketCap) / 1000000).toFixed(2)}M</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500">Holders</div>
                <div className="font-medium">{coin.uniqueHolders?.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500">24h Volume</div>
                <div className="font-medium">${Number(coin.volume24h)?.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500">24h Change</div>
                <div className={`font-medium ${Number(coin.marketCapDelta24h) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(coin.marketCapDelta24h) >= 0 ? '+' : ''}{Number(coin.marketCapDelta24h)?.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">AI Analysis Disclaimer</p>
                <p>This analysis is for informational purposes only and should not be considered financial advice. Always do your own research and consider consulting with a financial advisor before making investment decisions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
