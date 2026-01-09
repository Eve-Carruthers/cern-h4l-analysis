// Sample H->ZZ*->4l candidate events from CMS Open Data
// Each event shows the 4 leptons that reconstruct to ~125 GeV

export interface Track {
  id: string;
  type: 'muon' | 'electron';
  charge: 1 | -1;
  pt: number;      // transverse momentum (GeV)
  eta: number;     // pseudorapidity
  phi: number;     // azimuthal angle (radians)
  energy: number;  // GeV
  // 3D trajectory points (simplified)
  trajectory: [number, number, number][];
}

export interface ZBoson {
  id: string;
  mass: number;    // GeV
  tracks: [string, string];  // pair of track IDs
  isOnShell: boolean;  // true for Z, false for Z*
}

export interface HiggsEvent {
  id: string;
  runNumber: number;
  eventNumber: number;
  lumiSection: number;
  channel: '4mu' | '4e' | '2e2mu';
  mass: number;    // reconstructed Higgs mass (GeV)
  tracks: Track[];
  zBosons: [ZBoson, ZBoson];
  date: string;
}

// Generate trajectory points from track parameters
function generateTrajectory(
  pt: number,
  eta: number,
  phi: number,
  charge: number,
  type: 'muon' | 'electron'
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const numPoints = 50;

  // Convert eta to theta
  const theta = 2 * Math.atan(Math.exp(-eta));

  // Starting direction
  const dx = Math.cos(phi) * Math.sin(theta);
  const dy = Math.sin(phi) * Math.sin(theta);
  const dz = Math.cos(theta);

  // Curvature from magnetic field (simplified)
  // CMS has 3.8T field, higher pt = less curvature
  const curvature = (charge * 0.3) / (pt + 10);

  // Max radius depends on particle type
  // Muons go through entire detector, electrons stop at ECAL
  const maxRadius = type === 'muon' ? 7 : 2;

  let x = 0, y = 0, z = 0;
  let vx = dx, vy = dy, vz = dz;

  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * maxRadius;

    // Helical motion in magnetic field (along z)
    const angle = curvature * t;
    const rotatedVx = vx * Math.cos(angle) - vy * Math.sin(angle);
    const rotatedVy = vx * Math.sin(angle) + vy * Math.cos(angle);

    x = t * rotatedVx;
    y = t * rotatedVy;
    z = t * vz;

    // Stop if outside detector
    const r = Math.sqrt(x * x + y * y);
    if (r > maxRadius || Math.abs(z) > 11) break;

    points.push([x, y, z]);
  }

  return points;
}

// Sample Higgs candidate events (based on real CMS data patterns)
export const higgsEvents: HiggsEvent[] = [
  {
    id: 'evt-001',
    runNumber: 194108,
    eventNumber: 71986,
    lumiSection: 43,
    channel: '4mu',
    mass: 125.4,
    tracks: [
      {
        id: 'mu1',
        type: 'muon',
        charge: -1,
        pt: 52.3,
        eta: 0.21,
        phi: 1.24,
        energy: 53.1,
        trajectory: generateTrajectory(52.3, 0.21, 1.24, -1, 'muon'),
      },
      {
        id: 'mu2',
        type: 'muon',
        charge: 1,
        pt: 38.7,
        eta: -0.89,
        phi: -1.87,
        energy: 48.2,
        trajectory: generateTrajectory(38.7, -0.89, -1.87, 1, 'muon'),
      },
      {
        id: 'mu3',
        type: 'muon',
        charge: -1,
        pt: 21.4,
        eta: 1.42,
        phi: 2.31,
        energy: 42.8,
        trajectory: generateTrajectory(21.4, 1.42, 2.31, -1, 'muon'),
      },
      {
        id: 'mu4',
        type: 'muon',
        charge: 1,
        pt: 8.9,
        eta: -0.34,
        phi: -0.52,
        energy: 9.3,
        trajectory: generateTrajectory(8.9, -0.34, -0.52, 1, 'muon'),
      },
    ],
    zBosons: [
      { id: 'Z1', mass: 91.2, tracks: ['mu1', 'mu2'], isOnShell: true },
      { id: 'Z2', mass: 23.8, tracks: ['mu3', 'mu4'], isOnShell: false },
    ],
    date: '2012-06-18',
  },
  {
    id: 'evt-002',
    runNumber: 194699,
    eventNumber: 432841,
    lumiSection: 127,
    channel: '4e',
    mass: 124.8,
    tracks: [
      {
        id: 'e1',
        type: 'electron',
        charge: -1,
        pt: 44.1,
        eta: 0.67,
        phi: 0.89,
        energy: 48.2,
        trajectory: generateTrajectory(44.1, 0.67, 0.89, -1, 'electron'),
      },
      {
        id: 'e2',
        type: 'electron',
        charge: 1,
        pt: 32.5,
        eta: -1.21,
        phi: -2.14,
        energy: 55.7,
        trajectory: generateTrajectory(32.5, -1.21, -2.14, 1, 'electron'),
      },
      {
        id: 'e3',
        type: 'electron',
        charge: -1,
        pt: 18.9,
        eta: 0.12,
        phi: 1.78,
        energy: 19.1,
        trajectory: generateTrajectory(18.9, 0.12, 1.78, -1, 'electron'),
      },
      {
        id: 'e4',
        type: 'electron',
        charge: 1,
        pt: 11.2,
        eta: -0.78,
        phi: -0.91,
        energy: 14.1,
        trajectory: generateTrajectory(11.2, -0.78, -0.91, 1, 'electron'),
      },
    ],
    zBosons: [
      { id: 'Z1', mass: 88.4, tracks: ['e1', 'e2'], isOnShell: true },
      { id: 'Z2', mass: 28.1, tracks: ['e3', 'e4'], isOnShell: false },
    ],
    date: '2012-07-04',
  },
  {
    id: 'evt-003',
    runNumber: 198230,
    eventNumber: 89421,
    lumiSection: 56,
    channel: '2e2mu',
    mass: 125.9,
    tracks: [
      {
        id: 'mu1',
        type: 'muon',
        charge: -1,
        pt: 48.7,
        eta: -0.45,
        phi: 2.67,
        energy: 51.2,
        trajectory: generateTrajectory(48.7, -0.45, 2.67, -1, 'muon'),
      },
      {
        id: 'mu2',
        type: 'muon',
        charge: 1,
        pt: 41.2,
        eta: 0.98,
        phi: -0.78,
        energy: 58.9,
        trajectory: generateTrajectory(41.2, 0.98, -0.78, 1, 'muon'),
      },
      {
        id: 'e1',
        type: 'electron',
        charge: -1,
        pt: 15.4,
        eta: -1.67,
        phi: 1.23,
        energy: 38.2,
        trajectory: generateTrajectory(15.4, -1.67, 1.23, -1, 'electron'),
      },
      {
        id: 'e2',
        type: 'electron',
        charge: 1,
        pt: 9.8,
        eta: 0.23,
        phi: -2.89,
        energy: 10.1,
        trajectory: generateTrajectory(9.8, 0.23, -2.89, 1, 'electron'),
      },
    ],
    zBosons: [
      { id: 'Z1', mass: 91.8, tracks: ['mu1', 'mu2'], isOnShell: true },
      { id: 'Z2', mass: 19.7, tracks: ['e1', 'e2'], isOnShell: false },
    ],
    date: '2012-08-21',
  },
  {
    id: 'evt-004',
    runNumber: 199608,
    eventNumber: 156732,
    lumiSection: 89,
    channel: '4mu',
    mass: 126.1,
    tracks: [
      {
        id: 'mu1',
        type: 'muon',
        charge: 1,
        pt: 61.2,
        eta: 0.34,
        phi: -1.12,
        energy: 63.8,
        trajectory: generateTrajectory(61.2, 0.34, -1.12, 1, 'muon'),
      },
      {
        id: 'mu2',
        type: 'muon',
        charge: -1,
        pt: 45.8,
        eta: -0.67,
        phi: 2.01,
        energy: 52.4,
        trajectory: generateTrajectory(45.8, -0.67, 2.01, -1, 'muon'),
      },
      {
        id: 'mu3',
        type: 'muon',
        charge: 1,
        pt: 24.1,
        eta: 1.89,
        phi: 0.45,
        energy: 67.2,
        trajectory: generateTrajectory(24.1, 1.89, 0.45, 1, 'muon'),
      },
      {
        id: 'mu4',
        type: 'muon',
        charge: -1,
        pt: 12.3,
        eta: -0.12,
        phi: -2.34,
        energy: 12.4,
        trajectory: generateTrajectory(12.3, -0.12, -2.34, -1, 'muon'),
      },
    ],
    zBosons: [
      { id: 'Z1', mass: 92.1, tracks: ['mu1', 'mu2'], isOnShell: true },
      { id: 'Z2', mass: 31.2, tracks: ['mu3', 'mu4'], isOnShell: false },
    ],
    date: '2012-09-15',
  },
  {
    id: 'evt-005',
    runNumber: 200992,
    eventNumber: 234567,
    lumiSection: 112,
    channel: '2e2mu',
    mass: 124.2,
    tracks: [
      {
        id: 'e1',
        type: 'electron',
        charge: -1,
        pt: 55.6,
        eta: 0.89,
        phi: 1.56,
        energy: 72.4,
        trajectory: generateTrajectory(55.6, 0.89, 1.56, -1, 'electron'),
      },
      {
        id: 'e2',
        type: 'electron',
        charge: 1,
        pt: 39.4,
        eta: -0.45,
        phi: -1.78,
        energy: 42.1,
        trajectory: generateTrajectory(39.4, -0.45, -1.78, 1, 'electron'),
      },
      {
        id: 'mu1',
        type: 'muon',
        charge: -1,
        pt: 19.8,
        eta: 1.23,
        phi: 2.89,
        energy: 33.4,
        trajectory: generateTrajectory(19.8, 1.23, 2.89, -1, 'muon'),
      },
      {
        id: 'mu2',
        type: 'muon',
        charge: 1,
        pt: 7.6,
        eta: -0.56,
        phi: -0.23,
        energy: 8.2,
        trajectory: generateTrajectory(7.6, -0.56, -0.23, 1, 'muon'),
      },
    ],
    zBosons: [
      { id: 'Z1', mass: 89.7, tracks: ['e1', 'e2'], isOnShell: true },
      { id: 'Z2', mass: 21.4, tracks: ['mu1', 'mu2'], isOnShell: false },
    ],
    date: '2012-10-08',
  },
];

export function getChannelLabel(channel: '4mu' | '4e' | '2e2mu'): string {
  switch (channel) {
    case '4mu': return '4\u03BC';
    case '4e': return '4e';
    case '2e2mu': return '2e2\u03BC';
  }
}

export function getTrackColor(track: Track): string {
  if (track.type === 'muon') {
    return track.charge === 1 ? '#ef4444' : '#3b82f6';  // red/blue
  } else {
    return track.charge === 1 ? '#f97316' : '#22c55e';  // orange/green
  }
}
