import { SignificanceResult } from "@/types";

/**
 * Convert p-value to significance in standard deviations
 * Uses the one-sided Gaussian convention
 */
export function pvalueToSignificance(pvalue: number): number {
  if (pvalue <= 0) return Infinity;
  if (pvalue >= 1) return 0;

  // Approximation of inverse normal CDF
  // Using Abramowitz and Stegun approximation
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.383577518672690e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239e0;

  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798598866e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;

  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838e0;
  const c4 = -2.549732539343734e0;
  const c5 = 4.374664141464968e0;
  const c6 = 2.938163982698783e0;

  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996e0;
  const d4 = 3.754408661907416e0;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;

  if (pvalue < pLow) {
    q = Math.sqrt(-2 * Math.log(pvalue));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
           ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  } else if (pvalue <= pHigh) {
    q = pvalue - 0.5;
    const r = q * q;
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - pvalue));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
           ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
}

/**
 * Calculate Poisson probability P(X >= observed)
 */
export function poissonPValue(observed: number, expected: number): number {
  if (expected <= 0) return observed === 0 ? 1 : 0;

  // P(X >= k) = 1 - P(X < k) = 1 - sum(P(X=i) for i=0 to k-1)
  let cumulativeProb = 0;
  let term = Math.exp(-expected);

  for (let i = 0; i < observed; i++) {
    cumulativeProb += term;
    term *= expected / (i + 1);
  }

  return 1 - cumulativeProb;
}

/**
 * Simple Gaussian significance: Z = (N_obs - N_bg) / sqrt(N_bg)
 */
export function gaussianSignificance(observed: number, background: number): number {
  if (background <= 0) return observed > 0 ? Infinity : 0;
  return (observed - background) / Math.sqrt(background);
}

/**
 * Calculate statistical significance
 */
export function calculateSignificance(
  observed: number,
  background: number,
  signal: number = 0,
  lookElsewhereFactor: number = 1
): SignificanceResult {
  const excess = observed - background;

  // Local p-value (Poisson)
  const localPValue = poissonPValue(observed, background);
  const localSignificance = pvalueToSignificance(localPValue);

  // Global significance (with look-elsewhere effect)
  let globalPValue: number | undefined;
  let globalSignificance: number | undefined;

  if (lookElsewhereFactor > 1) {
    globalPValue = Math.min(1, localPValue * lookElsewhereFactor);
    globalSignificance = pvalueToSignificance(globalPValue);
  }

  return {
    observed,
    background,
    signal,
    excess,
    localPValue,
    localSignificance,
    globalPValue,
    globalSignificance,
  };
}

/**
 * Format p-value for display
 */
export function formatPValue(pvalue: number): string {
  if (pvalue < 1e-10) return "< 10⁻¹⁰";
  if (pvalue < 0.001) return pvalue.toExponential(2);
  return pvalue.toFixed(4);
}

/**
 * Format significance for display
 */
export function formatSignificance(sigma: number): string {
  if (!isFinite(sigma)) return ">10σ";
  return `${sigma.toFixed(2)}σ`;
}
