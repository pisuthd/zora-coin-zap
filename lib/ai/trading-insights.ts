// AI Trading Insights Engine
// Analyzes coin performance metrics and generates trading recommendations

export interface TradingSignal {
  type: 'momentum' | 'volume' | 'social' | 'technical';
  strength: number; // 0-100
  direction: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export interface TradingInsight {
  coinId: string;
  aiScore: number; // 0-100
  confidence: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedAction: 'BUY' | 'SELL' | 'HOLD' | 'WATCH';
  signals: TradingSignal[];
  priceTargets: {
    bullish: number;
    bearish: number;
    support: number;
    resistance: number;
  };
  insights: {
    momentum: string;
    social: string;
    technical: string;
    recommendation: string;
  };
  category: string;
  marketContext: string;
}

export class TradingInsightsEngine {
  private readonly MOMENTUM_WEIGHT = 0.3;
  private readonly VOLUME_WEIGHT = 0.25;
  private readonly SOCIAL_WEIGHT = 0.25;
  private readonly TECHNICAL_WEIGHT = 0.2;

  async analyzeCoin(coin: any, userPreferences: any = {}): Promise<TradingInsight> {
    const signals = this.generateSignals(coin);
    const aiScore = this.calculateAIScore(signals, userPreferences);
    const riskLevel = this.assessRisk(coin, signals);
    const recommendedAction = this.getRecommendation(aiScore, riskLevel);
    const confidence = this.calculateConfidence(signals, coin);
    
    return {
      coinId: coin.id,
      aiScore,
      confidence,
      riskLevel,
      recommendedAction,
      signals,
      priceTargets: this.calculatePriceTargets(coin),
      insights: this.generateInsights(coin, signals, recommendedAction),
      category: this.categorizeToken(coin),
      marketContext: this.getMarketContext(coin)
    };
  }

  private generateSignals(coin: any): TradingSignal[] {
    const signals: TradingSignal[] = [];

    // Momentum Signal
    const priceChange = Number(coin.marketCapDelta24h) || 0;
    const momentumStrength = Math.min(100, Math.abs(priceChange) * 2);
    signals.push({
      type: 'momentum',
      strength: momentumStrength,
      direction: priceChange > 5 ? 'bullish' : priceChange < -5 ? 'bearish' : 'neutral',
      description: `${priceChange > 0 ? 'Positive' : 'Negative'} momentum with ${Math.abs(priceChange).toFixed(1)}% 24h change`
    });

    // Volume Signal  
    const volume24h = Number(coin.volume24h) || 0;
    const volumeStrength = Math.min(100, volume24h / 1000);
    signals.push({
      type: 'volume',
      strength: volumeStrength,
      direction: volume24h > 50000 ? 'bullish' : volume24h > 10000 ? 'neutral' : 'bearish',
      description: `${volume24h > 50000 ? 'High' : volume24h > 10000 ? 'Moderate' : 'Low'} trading volume at $${volume24h.toLocaleString()}`
    });

    // Social Signal
    const holders = Number(coin.uniqueHolders) || 0;
    const socialStrength = Math.min(100, holders / 10);
    signals.push({
      type: 'social',
      strength: socialStrength,
      direction: holders > 500 ? 'bullish' : holders > 100 ? 'neutral' : 'bearish',
      description: `${holders > 500 ? 'Strong' : holders > 100 ? 'Growing' : 'Small'} community with ${holders} holders`
    });

    // Technical Signal
    const marketCap = Number(coin.marketCap) || 0;
    const technicalStrength = Math.min(100, marketCap / 50000);
    signals.push({
      type: 'technical',
      strength: technicalStrength,
      direction: marketCap > 1000000 ? 'bullish' : marketCap > 200000 ? 'neutral' : 'bearish',
      description: `${marketCap > 1000000 ? 'Large' : marketCap > 200000 ? 'Medium' : 'Small'} market cap at $${(marketCap / 1000000).toFixed(2)}M`
    });

    return signals;
  }

  private calculateAIScore(signals: TradingSignal[], userPreferences: any): number {
    let weightedScore = 0;

    signals.forEach(signal => {
      const directionMultiplier = signal.direction === 'bullish' ? 1 : signal.direction === 'bearish' ? -1 : 0;
      const weightedStrength = signal.strength * directionMultiplier;

      switch (signal.type) {
        case 'momentum':
          weightedScore += weightedStrength * this.MOMENTUM_WEIGHT;
          break;
        case 'volume':
          weightedScore += weightedStrength * this.VOLUME_WEIGHT;
          break;
        case 'social':
          weightedScore += weightedStrength * this.SOCIAL_WEIGHT;
          break;
        case 'technical':
          weightedScore += weightedStrength * this.TECHNICAL_WEIGHT;
          break;
      }
    });

    // Normalize to 0-100 scale
    return Math.max(0, Math.min(100, weightedScore + 50));
  }

  private assessRisk(coin: any, signals: TradingSignal[]): 'LOW' | 'MEDIUM' | 'HIGH' {
    const volatility = Math.abs(Number(coin.marketCapDelta24h) || 0);
    const volume = Number(coin.volume24h) || 0;
    const marketCap = Number(coin.marketCap) || 0;

    let riskScore = 0;

    // Volatility risk
    if (volatility > 50) riskScore += 3;
    else if (volatility > 20) riskScore += 2;
    else riskScore += 1;

    // Liquidity risk
    if (volume < 10000) riskScore += 3;
    else if (volume < 50000) riskScore += 2;
    else riskScore += 1;

    // Market cap risk
    if (marketCap < 200000) riskScore += 3;
    else if (marketCap < 1000000) riskScore += 2;
    else riskScore += 1;

    if (riskScore >= 7) return 'HIGH';
    if (riskScore >= 5) return 'MEDIUM';
    return 'LOW';
  }

  private getRecommendation(aiScore: number, riskLevel: string): 'BUY' | 'SELL' | 'HOLD' | 'WATCH' {
    if (riskLevel === 'HIGH' && aiScore < 70) return 'WATCH';
    if (aiScore >= 75) return 'BUY';
    if (aiScore >= 60) return 'HOLD';
    if (aiScore >= 40) return 'WATCH';
    return 'WATCH';
  }

  private calculateConfidence(signals: TradingSignal[], coin: any): number {
    const signalConsistency = this.calculateSignalConsistency(signals);
    const dataQuality = this.assessDataQuality(coin);
    
    return Math.round((signalConsistency + dataQuality) / 2);
  }

  private calculateSignalConsistency(signals: TradingSignal[]): number {
    const bullishSignals = signals.filter(s => s.direction === 'bullish').length;
    const bearishSignals = signals.filter(s => s.direction === 'bearish').length;
    const neutralSignals = signals.filter(s => s.direction === 'neutral').length;

    const totalSignals = signals.length;
    const maxDirection = Math.max(bullishSignals, bearishSignals, neutralSignals);
    
    return (maxDirection / totalSignals) * 100;
  }

  private assessDataQuality(coin: any): number {
    let qualityScore = 0;
    
    // Check data completeness
    if (coin.marketCap && Number(coin.marketCap) > 0) qualityScore += 25;
    if (coin.volume24h && Number(coin.volume24h) > 0) qualityScore += 25;
    if (coin.uniqueHolders && Number(coin.uniqueHolders) > 0) qualityScore += 25;
    if (coin.marketCapDelta24h !== undefined) qualityScore += 25;

    return qualityScore;
  }

  private calculatePriceTargets(coin: any): any {
    const currentPrice = Number(coin.marketCap) / Number(coin.totalSupply) || 0;
    const volatility = Math.abs(Number(coin.marketCapDelta24h) || 10) / 100;

    return {
      bullish: currentPrice * (1 + volatility * 2),
      bearish: currentPrice * (1 - volatility * 1.5),
      support: currentPrice * 0.9,
      resistance: currentPrice * 1.1
    };
  }

  private generateInsights(coin: any, signals: TradingSignal[], recommendation: string): any {
    const momentumSignal = signals.find(s => s.type === 'momentum');
    const socialSignal = signals.find(s => s.type === 'social');
    const technicalSignal = signals.find(s => s.type === 'technical');

    return {
      momentum: momentumSignal?.description || 'No momentum data available',
      social: socialSignal?.description || 'No social data available',
      technical: technicalSignal?.description || 'No technical data available',
      recommendation: this.getRecommendationReason(recommendation, signals)
    };
  }

  private getRecommendationReason(recommendation: string, signals: TradingSignal[]): string {
    const bullishSignals = signals.filter(s => s.direction === 'bullish').length;
    const bearishSignals = signals.filter(s => s.direction === 'bearish').length;

    switch (recommendation) {
      case 'BUY':
        return `Strong bullish signals (${bullishSignals}/${signals.length}) indicate good entry opportunity`;
      case 'SELL':
        return `Bearish signals (${bearishSignals}/${signals.length}) suggest reducing position`;
      case 'HOLD':
        return `Mixed signals suggest maintaining current position`;
      case 'WATCH':
        return `Insufficient clear signals, monitor for better entry point`;
      default:
        return 'AI analysis in progress';
    }
  }

  private categorizeToken(coin: any): string {
    const name = (coin.name || '').toLowerCase();
    const symbol = (coin.symbol || '').toLowerCase();
    
    if (name.includes('ai') || name.includes('artificial') || symbol.includes('ai')) return 'AI & Tech';
    if (name.includes('game') || name.includes('nft') || name.includes('gaming')) return 'Gaming & NFTs';
    if (name.includes('meme') || name.includes('fun') || name.includes('doge')) return 'Memes & Viral';
    if (name.includes('music') || name.includes('art') || name.includes('creative')) return 'Art & Music';
    if (name.includes('defi') || name.includes('finance') || name.includes('yield')) return 'DeFi & Finance';
    if (name.includes('social') || name.includes('community')) return 'Social & Community';
    
    return 'Other';
  }

  private getMarketContext(coin: any): string {
    const marketCap = Number(coin.marketCap) || 0;
    const volume = Number(coin.volume24h) || 0;
    
    if (marketCap > 10000000) return 'Established project with significant market presence';
    if (marketCap > 1000000) return 'Growing project with moderate market traction';
    if (marketCap > 100000) return 'Early-stage project with initial market validation';
    return 'Emerging project in early development phase';
  }
}

// Singleton instance
export const tradingInsightsEngine = new TradingInsightsEngine();