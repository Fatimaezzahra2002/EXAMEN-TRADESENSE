
import { AISignal } from "../types";

export const getAISignals = async (symbol: string, currentPrice: number): Promise<AISignal> => {
  try {
    const response = await fetch('http://localhost:5000/api/gemini/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol, price: currentPrice })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      symbol,
      direction: data.direction,
      confidence: data.confidence,
      reason: data.reason,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      entryPoint: data.entryPoint
    };
  } catch (error) {
    console.error('Error fetching AI signals:', error);
    
    // Fallback to simulated response if API fails
    const directions = ['BUY', 'SELL', 'NEUTRAL'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
    // Calculer des valeurs de stop loss et take profit basées sur le prix courant
    const stopLoss = randomDirection === 'BUY' 
      ? currentPrice * 0.99 
      : currentPrice * 1.01;
    const takeProfit = randomDirection === 'BUY'
      ? currentPrice * 1.02
      : currentPrice * 0.98;
    const entryPoint = currentPrice;
    
    return {
      symbol,
      direction: randomDirection as 'BUY' | 'SELL' | 'NEUTRAL',
      confidence: Math.random(),
      reason: "Analyse indisponible temporairement.",
      stopLoss,
      takeProfit,
      entryPoint
    };
  }
};
