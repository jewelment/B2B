export interface BullionRates {
  gold24K: number; // Current spot rate for 24K per gram in INR
  silver: number;  // Current spot rate for Silver per gram in INR
}

export function calculateDynamicPrice(product: any, liveRates: BullionRates) {
  let metalPricePerGram = 0;
  const purity = product.metalPurity?.toUpperCase() || '18KT';

  // 1. Compute exact Karatage value based on standard Indian market purity yields
  if (purity === '24KT') metalPricePerGram = liveRates.gold24K;
  else if (purity === '22KT') metalPricePerGram = liveRates.gold24K * 0.916; 
  else if (purity === '18KT') metalPricePerGram = liveRates.gold24K * 0.750; 
  else if (purity === '14KT') metalPricePerGram = liveRates.gold24K * 0.585; 
  else if (purity === '9KT')  metalPricePerGram = liveRates.gold24K * 0.375; 
  else if (purity === 'SILVER') metalPricePerGram = liveRates.silver;

  const grossWeight = Number(product.grossWeight) || 5.0;
  const pureWeight = Number(product.pureWeight) || grossWeight * 0.75;

  let calculatedComponents: any[] = [];
  let totalMetalCost = 0;
  let totalDiamondCost = 0;
  let totalGemstoneCost = 0;
  let totalLaborCost = 0;

  // 2. Loop through and re-rate individual components dynamically
  if (product.components && product.components.length > 0) {
    calculatedComponents = product.components.map((comp: any) => {
      let finalCost = Number(comp.finalCost);
      let currentRate = Number(comp.rate);

      switch (comp.type) {
        case 'Metal':
          currentRate = Math.round(metalPricePerGram);
          finalCost = Math.round(pureWeight * metalPricePerGram);
          totalMetalCost = finalCost;
          break;
        case 'Diamond':
          totalDiamondCost += finalCost;
          break;
        case 'Gemstone':
          totalGemstoneCost += finalCost;
          break;
        case 'Labor':
          // Identify if making charges are flat or per-gram based on DB strings
          const isPerGram = comp.details?.toLowerCase().includes('per gram') || 
                            comp.details?.toLowerCase().includes('/g');
          
          // Strict calculation constraint to protect against data-entry errors
          finalCost = isPerGram 
            ? Math.round(grossWeight * currentRate) 
            : Number(comp.finalCost || currentRate);
            
          totalLaborCost += finalCost;
          break;
      }

      return {
        ...comp,
        rate: currentRate,
        finalCost: finalCost
      };
    });
  }

  // 3. Aggregate calculated vectors into the final wholesale valuation
  const derivedTotalPrice = totalMetalCost + totalDiamondCost + totalGemstoneCost + totalLaborCost;

  return {
    ...product,
    estimatedPrice: Math.round(derivedTotalPrice),
    components: calculatedComponents
  };
}