// Claude AI Service for Coin Analysis and Recommendations using Official SDK
import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = process.env.NEXT_PUBLIC_CLAUDE_API_KEY

export interface CoinAnalysis {
  aiScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: 'BUY' | 'HOLD' | 'WATCH' | 'SELL';
  reasoning: string;
  category: string;
  strengths: string[];
  weaknesses: string[];
  shortTerm: string;
  longTerm: string;
}

export interface AISettings {
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  aiRecommendationsEnabled: boolean;
}

export class ClaudeAIService {
  private static instance: ClaudeAIService;
  private anthropic: Anthropic;

  private constructor() {
    this.anthropic = new Anthropic({
      apiKey: CLAUDE_API_KEY, 
      dangerouslyAllowBrowser: true
    });
  }

  public static getInstance(): ClaudeAIService {
    if (!ClaudeAIService.instance) {
      ClaudeAIService.instance = new ClaudeAIService();
    }
    return ClaudeAIService.instance;
  }

  async analyzeCoin(coin: any, settings: AISettings): Promise<CoinAnalysis> {
    try {
      const prompt = this.createAnalysisPrompt(coin, settings);

      const message = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      // Extract text content from the response
      const textContent: any = message.content.find(block => block.type === 'text');
      if (!textContent) {
        throw new Error('No text content in Claude response');
      }

      return this.parseAnalysisResponse(textContent.text, coin);
    } catch (error) {
      console.error('Error analyzing coin with Claude:', error);
      return this.generateFallbackAnalysis(coin, settings);
    }
  }

  private createAnalysisPrompt(coin: any, settings: AISettings): string {
    return `
Analyze this cryptocurrency/token as a crypto investment advisor. Provide a JSON response with the following structure:

{
  "aiScore": number (1-100),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "recommendation": "BUY" | "HOLD" | "WATCH" | "SELL",
  "reasoning": "brief explanation in 1-2 sentences",
  "category": "classification",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "shortTerm": "1-3 month outlook",
  "longTerm": "6-12 month outlook"
}

Token Data:
- Name: ${coin.name}
- Symbol: ${coin.symbol}
- Market Cap: $${coin.marketCap}
- 24h Change: ${coin.marketCapDelta24h}%
- Volume 24h: $${coin.volume24h}
- Total Supply: ${coin.totalSupply}
- Unique Holders: ${coin.uniqueHolders}
- Creator: ${coin.creatorProfile?.handle || 'anonymous'}
- Description: ${coin.description?.substring(0, 200)}
- Created: ${coin.createdAt}

User Preferences:
- Risk Tolerance: ${settings.riskTolerance}

Analysis Guidelines:
1. Market momentum and volume trends
2. Holder distribution and community strength  
3. Creator reputation and project quality
4. Market cap relative to total supply
5. Innovation and uniqueness in the space
6. Risk factors and potential volatility
7. Compliance with user's risk tolerance

Provide only the JSON response, no additional text.
`;
  }

  private parseAnalysisResponse(response: string, coin: any): CoinAnalysis {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate and sanitize the response
      return {
        aiScore: Math.max(1, Math.min(100, analysis.aiScore || 50)),
        riskLevel: ['LOW', 'MEDIUM', 'HIGH'].includes(analysis.riskLevel) ? analysis.riskLevel : 'MEDIUM',
        recommendation: ['BUY', 'HOLD', 'WATCH', 'SELL'].includes(analysis.recommendation) ? analysis.recommendation : 'WATCH',
        reasoning: analysis.reasoning || 'AI analysis based on market data and trends.',
        category: analysis.category || this.categorizeToken(coin),
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 4) : ['Community growth', 'Market presence'],
        weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses.slice(0, 4) : ['Market volatility', 'Limited track record'],
        shortTerm: analysis.shortTerm || 'Monitor for market signals',
        longTerm: analysis.longTerm || 'Evaluate based on project development'
      };
    } catch (error) {
      console.error('Error parsing Claude response:', error);
      return this.generateFallbackAnalysis(coin, {} as AISettings);
    }
  }

  public generateFallbackAnalysis(coin: any, settings: AISettings): CoinAnalysis {
    // Generate analysis based on available data when Claude API fails
    const marketCap = Number(coin.marketCap) || 0;
    const holders = coin.uniqueHolders || 0;
    const volume24h = Number(coin.volume24h) || 0;
    const marketCapDelta = Number(coin.marketCapDelta24h) || 0;

    // Calculate AI score based on metrics
    let score = 50; // Base score

    // Market cap scoring (0-20 points)
    if (marketCap > 10000000) score += 20;
    else if (marketCap > 5000000) score += 15;
    else if (marketCap > 1000000) score += 10;
    else if (marketCap > 100000) score += 5;

    // Holder scoring (0-20 points)
    if (holders > 50000) score += 20;
    else if (holders > 10000) score += 15;
    else if (holders > 1000) score += 10;
    else if (holders > 100) score += 5;

    // Volume scoring (0-15 points)
    if (volume24h > 500000) score += 15;
    else if (volume24h > 100000) score += 10;
    else if (volume24h > 10000) score += 5;

    // Delta scoring (0-15 points)
    if (marketCapDelta > 50) score += 15;
    else if (marketCapDelta > 20) score += 10;
    else if (marketCapDelta > 0) score += 5;
    else if (marketCapDelta < -20) score -= 10;
    else if (marketCapDelta < -50) score -= 15;

    // Creator bonus (0-10 points)
    if (coin.creatorProfile?.handle) score += 5;
    if (coin.description && coin.description.length > 100) score += 5;

    // Risk assessment
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    if (marketCap > 5000000 && holders > 5000 && volume24h > 100000) {
      riskLevel = 'LOW';
    } else if (marketCap < 100000 || holders < 100 || Math.abs(marketCapDelta) > 100) {
      riskLevel = 'HIGH';
    }

    // Recommendation logic
    let recommendation: 'BUY' | 'HOLD' | 'WATCH' | 'SELL' = 'WATCH';
    if (score > 80 && riskLevel !== 'HIGH') recommendation = 'BUY';
    else if (score > 65) recommendation = 'HOLD';
    else if (score < 25 || riskLevel === 'HIGH') recommendation = 'SELL';

    return {
      aiScore: Math.max(1, Math.min(100, score)),
      riskLevel,
      recommendation,
      reasoning: this.generateReasoning(coin, score, riskLevel, marketCapDelta),
      category: this.categorizeToken(coin),
      strengths: this.generateStrengths(coin, marketCap, holders, volume24h),
      weaknesses: this.generateWeaknesses(coin, marketCap, holders, riskLevel),
      shortTerm: this.generateShortTermOutlook(marketCapDelta, volume24h),
      longTerm: this.generateLongTermOutlook(score, marketCap, holders)
    };
  }

  private generateReasoning(coin: any, score: number, riskLevel: string, delta: number): string {
    const reasons = [];

    if (score > 75) {
      reasons.push('Strong market fundamentals');
    } else if (score < 35) {
      reasons.push('Weak market metrics');
    }

    if (coin.uniqueHolders > 5000) {
      reasons.push('solid community base');
    } else if (coin.uniqueHolders < 100) {
      reasons.push('limited community adoption');
    }

    if (delta > 20) {
      reasons.push('strong recent momentum');
    } else if (delta < -20) {
      reasons.push('recent downward pressure');
    }

    if (riskLevel === 'HIGH') {
      reasons.push('but carries high volatility risk');
    } else if (riskLevel === 'LOW') {
      reasons.push('with relatively stable risk profile');
    }

    return reasons.length > 0
      ? `${reasons.join(', ')}.`
      : 'Analysis based on current market data and community metrics.';
  }

  private categorizeToken(coin: any): string {
    const name = coin.name?.toLowerCase() || '';
    const description = coin.description?.toLowerCase() || '';
    const symbol = coin.symbol?.toLowerCase() || '';
    const content = `${name} ${description} ${symbol}`;

    // AI & Tech keywords
    if (content.includes('ai') || content.includes('artificial intelligence') ||
      content.includes('machine learning') || content.includes('neural') ||
      content.includes('tech') || content.includes('protocol')) {
      return 'AI & Tech';
    }

    // Gaming & NFTs keywords
    if (content.includes('game') || content.includes('gaming') ||
      content.includes('nft') || content.includes('collectible') ||
      content.includes('metaverse') || content.includes('play')) {
      return 'Gaming & NFTs';
    }

    // Memes & Viral keywords
    if (content.includes('meme') || content.includes('dog') ||
      content.includes('cat') || content.includes('moon') ||
      content.includes('rocket') || content.includes('ape')) {
      return 'Memes & Viral';
    }

    // Art & Music keywords
    if (content.includes('art') || content.includes('music') ||
      content.includes('creative') || content.includes('artist') ||
      content.includes('culture') || content.includes('aesthetic')) {
      return 'Art & Music';
    }

    // DeFi & Finance keywords
    if (content.includes('defi') || content.includes('finance') ||
      content.includes('trading') || content.includes('yield') ||
      content.includes('liquidity') || content.includes('swap')) {
      return 'DeFi & Finance';
    }

    return 'Other';
  }

  private generateStrengths(coin: any, marketCap: number, holders: number, volume24h: number): string[] {
    const strengths = [];

    if (holders > 10000) strengths.push('Large active community');
    else if (holders > 1000) strengths.push('Growing community base');

    if (marketCap > 5000000) strengths.push('Established market presence');
    else if (marketCap > 1000000) strengths.push('Solid market foundation');

    if (volume24h > 100000) strengths.push('High trading activity');
    else if (volume24h > 10000) strengths.push('Active trading interest');

    if (coin.creatorProfile?.handle) strengths.push('Known creator identity');

    if (coin.description && coin.description.length > 100) {
      strengths.push('Clear project vision');
    }

    if (Number(coin.marketCapDelta24h) > 10) {
      strengths.push('Recent positive momentum');
    }

    // Ensure we always have at least 2 strengths
    if (strengths.length === 0) {
      strengths.push('Community interest', 'Market participation');
    } else if (strengths.length === 1) {
      strengths.push('Market activity');
    }

    return strengths.slice(0, 4);
  }

  private generateWeaknesses(coin: any, marketCap: number, holders: number, riskLevel: string): string[] {
    const weaknesses = [];

    if (marketCap < 100000) weaknesses.push('Very low market cap');
    else if (marketCap < 1000000) weaknesses.push('Limited market size');

    if (holders < 100) weaknesses.push('Very small community');
    else if (holders < 1000) weaknesses.push('Limited community size');

    if (riskLevel === 'HIGH') weaknesses.push('High volatility risk');

    if (!coin.description || coin.description.length < 50) {
      weaknesses.push('Limited project information');
    }

    if (Number(coin.marketCapDelta24h) < -10) {
      weaknesses.push('Recent negative performance');
    }

    if (!coin.creatorProfile?.handle) {
      weaknesses.push('Anonymous creator');
    }

    // Ensure we always have at least 2 weaknesses
    if (weaknesses.length === 0) {
      weaknesses.push('Market volatility', 'Early stage risk');
    } else if (weaknesses.length === 1) {
      weaknesses.push('Market uncertainty');
    }

    return weaknesses.slice(0, 4);
  }

  private generateShortTermOutlook(delta: number, volume: number): string {
    if (delta > 20 && volume > 50000) {
      return 'Strong momentum with high activity expected';
    } else if (delta > 10) {
      return 'Positive momentum likely to continue';
    } else if (delta < -20) {
      return 'Potential for volatility and price pressure';
    } else if (volume > 100000) {
      return 'High activity may drive price discovery';
    } else {
      return 'Sideways movement with gradual changes expected';
    }
  }

  private generateLongTermOutlook(score: number, marketCap: number, holders: number): string {
    if (score > 75 && marketCap > 1000000) {
      return 'Strong fundamentals suggest good growth potential';
    } else if (score > 60) {
      return 'Moderate potential with careful monitoring recommended';
    } else if (holders > 5000) {
      return 'Community strength may drive future development';
    } else if (marketCap < 100000) {
      return 'High growth potential but requires significant adoption';
    } else {
      return 'Long-term success depends on project execution';
    }
  }

  async analyzeCoinsInBatches(coins: any[], settings: AISettings, batchSize: number = 5): Promise<(any & CoinAnalysis)[]> {
    const analyzedCoins = [];

    for (let i = 0; i < coins.length; i += batchSize) {
      const batch = coins.slice(i, i + batchSize);

      // Process batch with some parallelism but respect rate limits
      const batchPromises = batch.map((coin, index) =>
        new Promise<any & CoinAnalysis>((resolve) => {
          // Stagger requests within batch to avoid rate limiting
          setTimeout(async () => {
            try {
              const analysis = await this.analyzeCoin(coin, settings);
              resolve({ ...coin, ...analysis });
            } catch (error) {
              console.error(`Error analyzing coin ${coin.name}:`, error);
              const fallback = this.generateFallbackAnalysis(coin, settings);
              resolve({ ...coin, ...fallback });
            }
          }, index * 200); // 200ms delay between requests in same batch
        })
      );

      try {
        const batchResults = await Promise.all(batchPromises);
        analyzedCoins.push(...batchResults);

        // Add delay between batches
        if (i + batchSize < coins.length) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between batches
        }
      } catch (error) {
        console.error('Error analyzing batch:', error);
        // Add fallback analysis for failed batch
        for (const coin of batch) {
          const fallback = this.generateFallbackAnalysis(coin, settings);
          analyzedCoins.push({ ...coin, ...fallback });
        }
      }
    }

    return analyzedCoins;
  }

  filterAndRankCoins(analyzedCoins: (any & CoinAnalysis)[], settings: AISettings): (any & CoinAnalysis)[] {
    // Start with all coins sorted by AI score
    let allCoins = [...analyzedCoins].sort((a, b) => {
      const recommendationPriority: any = { 'BUY': 4, 'HOLD': 3, 'WATCH': 2, 'SELL': 1 };
      const scoreA = a.aiScore + (recommendationPriority[a.recommendation] * 5);
      const scoreB = b.aiScore + (recommendationPriority[b.recommendation] * 5);
      return scoreB - scoreA;
    });

    let filtered = allCoins;

    // Filter by risk tolerance
    if (settings.riskTolerance === 'LOW') {
      const riskFiltered = filtered.filter(coin => coin.riskLevel !== 'HIGH');
      if (riskFiltered.length >= 5) {
        filtered = riskFiltered;
      }
    } else if (settings.riskTolerance === 'MEDIUM') {
      const riskFiltered = filtered.filter(coin => 
        coin.riskLevel !== 'HIGH' || coin.aiScore > 60
      );
      if (riskFiltered.length >= 5) {
        filtered = riskFiltered;
      }
    }

    // Ensure minimum quality - only exclude very low scores if we have enough
    const qualityFiltered = filtered.filter(coin => coin.aiScore > 25);
    if (qualityFiltered.length >= 5) {
      filtered = qualityFiltered;
    }

    // Ensure we have at least 5 coins, take top ones if needed
    if (filtered.length < 5) {
      filtered = allCoins.slice(0, Math.max(5, allCoins.length));
    }

    // Limit to reasonable max (15-20 coins)
    return filtered.slice(0, 15);
  }

  generateRecommendationSummary(coins: (any & CoinAnalysis)[]): string {
    if (coins.length === 0) return 'No coins analyzed yet.';

    const buyCount = coins.filter(c => c.recommendation === 'BUY').length;
    const holdCount = coins.filter(c => c.recommendation === 'HOLD').length;
    const watchCount = coins.filter(c => c.recommendation === 'WATCH').length;
    const sellCount = coins.filter(c => c.recommendation === 'SELL').length;
    const avgScore = Math.round(coins.reduce((sum, c) => sum + c.aiScore, 0) / coins.length);

    const topCategories = coins
      .reduce((acc, coin) => {
        acc[coin.category] = (acc[coin.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(topCategories)
      .sort(([, a]: any, [, b]:any) => b - a)[0]?.[0] || 'Mixed';

    return `AI analyzed ${coins.length} coins (avg score: ${avgScore}/100). ${buyCount} BUY, ${holdCount} HOLD, ${watchCount} WATCH, ${sellCount} SELL. Top category: ${topCategory}.`;
  }
}

export const aiService = ClaudeAIService.getInstance();
