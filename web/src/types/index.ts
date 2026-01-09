export interface MassBin {
  mass: number;
  observed: number;
  zzBackground: number;
  otherBackground: number;
  signal: number;
}

export interface Channel {
  id: string;
  name: string;
  latexName: string;
  observed: number;
  background: number;
  signal: number;
  efficiency: number;
  resolution: number;
  color: string;
}

export interface SignificanceResult {
  observed: number;
  background: number;
  signal: number;
  excess: number;
  localPValue: number;
  localSignificance: number;
  globalPValue?: number;
  globalSignificance?: number;
}
