"use client";

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, Target, AlertTriangle, Star, Lightbulb, Users } from 'lucide-react';
import { contentCoinEngine } from '@/lib/ai/content-coin-creator';

interface AICoinCreatorProps {
  onSuggestionSelect: (suggestion: any) => void;
  userPreferences?: any;
}

export function AICoinCreator({ onSuggestionSelect, userPreferences = {} }: AICoinCreatorProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);

  useEffect(() => {
    loadAIData();
  }, [userPreferences]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      const [aiSuggestions, trendData] = await Promise.all([
        contentCoinEngine.generateCoinSuggestions(5, userPreferences),
        contentCoinEngine.analyzeTrends()
      ]);
      setSuggestions(aiSuggestions);
      setTrends(trendData.slice(0, 6));
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'IMMEDIATE': return 'text-green-600 bg-green-100';
      case 'SOON': return 'text-yellow-600 bg-yellow-100';
      case 'WAIT': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMomentumIcon = (momentum: string) => {
    if (momentum === 'rising') return <TrendingUp className="text-green-500" size={16} />;
    if (momentum === 'declining') return <TrendingUp className="text-red-500 transform rotate-180" size={16} />;
    return <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="text-purple-500 animate-pulse" size={24} />
          <h2 className="text-xl font-bold">AI Content Coin Creator</h2>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Brain className="text-purple-500" size={24} />
          <h2 className="text-xl font-bold">AI Content Coin Creator</h2>
        </div>
        <p className="text-gray-600 text-sm">
          AI-powered suggestions based on current trends and market opportunities
        </p>
      </div>

      {/* Trending Categories */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <h3 className="font-medium mb-3 flex items-center">
          <TrendingUp className="text-purple-500 mr-2" size={16} />
          Hot Trends Right Now
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {trends.map((trend, index) => (
            <div key={index} className="bg-white rounded p-2 border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{trend.category}</span>
                {getMomentumIcon(trend.momentum)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Score: {trend.score}</span>
                <span className="text-purple-600">🔥 {trend.marketOpportunity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center">
          <Lightbulb className="text-yellow-500 mr-2" size={16} />
          AI-Generated Coin Ideas
        </h3>
        
        {suggestions.map((suggestion, index) => (
          <div key={suggestion.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-lg">{suggestion.name}</h4>
                  <span className="text-gray-500">${suggestion.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500" size={16} />
                    <span className="font-medium">{suggestion.trendScore}</span>
                  </div>
                  <span className="text-xs text-gray-500">Trend Score</span>
                </div>
              </div>
              
              {/* Category and timing */}
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
                  {suggestion.category}
                </span>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTimingColor(suggestion.recommendedTiming)}`}>
                    <Clock size={12} className="inline mr-1" />
                    {suggestion.recommendedTiming}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCompetitionColor(suggestion.competitionLevel)}`}>
                    {suggestion.competitionLevel} Competition
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-gray-700 text-sm">{suggestion.description}</p>
              
              {/* Market opportunity */}
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                <div>
                  <div className="text-sm font-medium text-blue-700">Market Opportunity</div>
                  <div className="text-xs text-blue-600">
                    Expected: ${(suggestion.expectedMarketCap.conservative / 1000000).toFixed(1)}M - ${(suggestion.expectedMarketCap.optimistic / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{suggestion.marketOpportunity}%</div>
                  <div className="text-xs text-blue-500">Opportunity</div>
                </div>
              </div>

              {/* Key features */}
              <div>
                <h5 className="text-sm font-medium mb-2">Key Features:</h5>
                <div className="flex flex-wrap gap-1">
                  {suggestion.keyFeatures.map((feature: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Target audience */}
              <div className="bg-green-50 p-2 rounded">
                <div className="flex items-center space-x-1 mb-1">
                  <Users size={12} className="text-green-600" />
                  <span className="text-xs font-medium text-green-700">Target Audience</span>
                </div>
                <p className="text-xs text-green-600">{suggestion.targetAudience}</p>
              </div>

              {/* Collapsible details */}
              {selectedSuggestion === suggestion.id && (
                <div className="space-y-3 border-t pt-3">
                  {/* Marketing strategy */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Marketing Strategy:</h5>
                    <div className="space-y-1">
                      {suggestion.marketingStrategy.map((strategy: string, idx: number) => (
                        <div key={idx} className="text-xs text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Success factors */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 text-green-700">Success Factors:</h5>
                    <div className="space-y-1">
                      {suggestion.successFactors.map((factor: string, idx: number) => (
                        <div key={idx} className="text-xs text-green-600 flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  <div>
                    <h5 className="text-sm font-medium mb-2 text-red-700 flex items-center">
                      <AlertTriangle size={12} className="mr-1" />
                      Risks to Consider:
                    </h5>
                    <div className="space-y-1">
                      {suggestion.risks.map((risk: string, idx: number) => (
                        <div key={idx} className="text-xs text-red-600 flex items-start">
                          <span className="mr-2">⚠</span>
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex space-x-2 pt-3 border-t">
                <button
                  onClick={() => setSelectedSuggestion(
                    selectedSuggestion === suggestion.id ? null : suggestion.id
                  )}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {selectedSuggestion === suggestion.id ? 'Show Less' : 'Show Details'}
                </button>
                <button
                  onClick={() => onSuggestionSelect(suggestion)}
                  className="flex-1 bg-purple-500 text-white py-2 rounded text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  Use This Idea
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh button */}
      <div className="text-center pt-4">
        <button
          onClick={loadAIData}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
          disabled={loading}
        >
          <Brain size={16} />
          <span>{loading ? 'Generating...' : 'Generate New Ideas'}</span>
        </button>
      </div>
    </div>
  );
}