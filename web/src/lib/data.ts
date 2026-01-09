import { MassBin, Channel } from "@/types";

// Physics constants
export const HIGGS_MASS = 125;
export const Z_MASS = 91;

// Channel data for H -> ZZ* -> 4l analysis
export const channels: Channel[] = [
  {
    id: "4mu",
    name: "4μ",
    latexName: "H \to ZZ^* \to 4\mu",
    observed: 7,
    background: 2.5,
    signal: 3.2,
    efficiency: 0.42,
    resolution: 1.5,
    color: "#3b82f6",
  },
  {
    id: "4e",
    name: "4e",
    latexName: "H \to ZZ^* \to 4e",
    observed: 5,
    background: 1.8,
    signal: 2.1,
    efficiency: 0.28,
    resolution: 2.5,
    color: "#22c55e",
  },
  {
    id: "2e2mu",
    name: "2e2μ",
    latexName: "H \to ZZ^* \to 2e2\mu",
    observed: 9,
    background: 3.2,
    signal: 4.8,
    efficiency: 0.38,
    resolution: 1.8,
    color: "#f59e0b",
  },
];

// Get total statistics across all channels
export function getTotalStats() {
  return {
    totalObserved: channels.reduce((sum, ch) => sum + ch.observed, 0),
    totalBackground: channels.reduce((sum, ch) => sum + ch.background, 0),
    totalSignal: channels.reduce((sum, ch) => sum + ch.signal, 0),
  };
}

// Mass distribution data (m4l in GeV, 2 GeV bins from 70-150 GeV)
export const massData: MassBin[] = [
  { mass: 71, observed: 2, zzBackground: 1.8, otherBackground: 0.3, signal: 0.0 },
  { mass: 73, observed: 3, zzBackground: 2.1, otherBackground: 0.4, signal: 0.0 },
  { mass: 75, observed: 2, zzBackground: 2.4, otherBackground: 0.4, signal: 0.0 },
  { mass: 77, observed: 4, zzBackground: 2.8, otherBackground: 0.5, signal: 0.0 },
  { mass: 79, observed: 3, zzBackground: 3.2, otherBackground: 0.5, signal: 0.0 },
  { mass: 81, observed: 5, zzBackground: 4.0, otherBackground: 0.6, signal: 0.0 },
  { mass: 83, observed: 6, zzBackground: 5.2, otherBackground: 0.7, signal: 0.0 },
  { mass: 85, observed: 8, zzBackground: 7.0, otherBackground: 0.8, signal: 0.0 },
  { mass: 87, observed: 12, zzBackground: 10.5, otherBackground: 1.0, signal: 0.0 },
  { mass: 89, observed: 18, zzBackground: 16.0, otherBackground: 1.2, signal: 0.0 },
  { mass: 91, observed: 25, zzBackground: 22.0, otherBackground: 1.5, signal: 0.0 },
  { mass: 93, observed: 16, zzBackground: 14.5, otherBackground: 1.2, signal: 0.0 },
  { mass: 95, observed: 10, zzBackground: 9.0, otherBackground: 0.9, signal: 0.0 },
  { mass: 97, observed: 6, zzBackground: 5.5, otherBackground: 0.6, signal: 0.0 },
  { mass: 99, observed: 4, zzBackground: 3.8, otherBackground: 0.5, signal: 0.0 },
  { mass: 101, observed: 3, zzBackground: 2.8, otherBackground: 0.4, signal: 0.0 },
  { mass: 103, observed: 2, zzBackground: 2.2, otherBackground: 0.3, signal: 0.0 },
  { mass: 105, observed: 2, zzBackground: 1.8, otherBackground: 0.3, signal: 0.0 },
  { mass: 107, observed: 1, zzBackground: 1.5, otherBackground: 0.2, signal: 0.0 },
  { mass: 109, observed: 2, zzBackground: 1.3, otherBackground: 0.2, signal: 0.0 },
  { mass: 111, observed: 1, zzBackground: 1.2, otherBackground: 0.2, signal: 0.1 },
  { mass: 113, observed: 2, zzBackground: 1.1, otherBackground: 0.2, signal: 0.2 },
  { mass: 115, observed: 1, zzBackground: 1.0, otherBackground: 0.2, signal: 0.4 },
  { mass: 117, observed: 2, zzBackground: 1.0, otherBackground: 0.2, signal: 0.8 },
  { mass: 119, observed: 3, zzBackground: 1.0, otherBackground: 0.2, signal: 1.5 },
  { mass: 121, observed: 4, zzBackground: 1.0, otherBackground: 0.2, signal: 2.8 },
  { mass: 123, observed: 6, zzBackground: 1.0, otherBackground: 0.2, signal: 3.5 },
  { mass: 125, observed: 8, zzBackground: 1.0, otherBackground: 0.2, signal: 4.0 },
  { mass: 127, observed: 5, zzBackground: 1.0, otherBackground: 0.2, signal: 3.2 },
  { mass: 129, observed: 3, zzBackground: 1.0, otherBackground: 0.2, signal: 2.0 },
  { mass: 131, observed: 2, zzBackground: 1.0, otherBackground: 0.2, signal: 1.0 },
  { mass: 133, observed: 1, zzBackground: 1.0, otherBackground: 0.2, signal: 0.5 },
  { mass: 135, observed: 2, zzBackground: 1.0, otherBackground: 0.2, signal: 0.2 },
  { mass: 137, observed: 1, zzBackground: 1.0, otherBackground: 0.2, signal: 0.1 },
  { mass: 139, observed: 1, zzBackground: 1.1, otherBackground: 0.2, signal: 0.0 },
  { mass: 141, observed: 2, zzBackground: 1.1, otherBackground: 0.2, signal: 0.0 },
  { mass: 143, observed: 1, zzBackground: 1.2, otherBackground: 0.2, signal: 0.0 },
  { mass: 145, observed: 1, zzBackground: 1.2, otherBackground: 0.2, signal: 0.0 },
  { mass: 147, observed: 2, zzBackground: 1.3, otherBackground: 0.2, signal: 0.0 },
  { mass: 149, observed: 1, zzBackground: 1.3, otherBackground: 0.2, signal: 0.0 },
];
