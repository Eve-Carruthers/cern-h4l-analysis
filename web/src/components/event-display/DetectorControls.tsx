'use client';

interface DetectorControlsProps {
  showTracker: boolean;
  showECAL: boolean;
  showHCAL: boolean;
  showMuon: boolean;
  opacity: number;
  onToggleTracker: () => void;
  onToggleECAL: () => void;
  onToggleHCAL: () => void;
  onToggleMuon: () => void;
  onOpacityChange: (value: number) => void;
}

export function DetectorControls({
  showTracker,
  showECAL,
  showHCAL,
  showMuon,
  opacity,
  onToggleTracker,
  onToggleECAL,
  onToggleHCAL,
  onToggleMuon,
  onOpacityChange,
}: DetectorControlsProps) {
  const layers = [
    { label: 'Tracker', color: '#fbbf24', active: showTracker, toggle: onToggleTracker },
    { label: 'ECAL', color: '#22c55e', active: showECAL, toggle: onToggleECAL },
    { label: 'HCAL', color: '#3b82f6', active: showHCAL, toggle: onToggleHCAL },
    { label: 'Muon', color: '#ef4444', active: showMuon, toggle: onToggleMuon },
  ];

  return (
    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white border border-white/10">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Detector Layers</h3>

      <div className="space-y-2 mb-4">
        {layers.map((layer) => (
          <button
            key={layer.label}
            onClick={layer.toggle}
            className={`flex items-center gap-2 w-full px-2 py-1 rounded text-sm transition-colors ${
              layer.active ? 'bg-white/10' : 'opacity-50 hover:opacity-75'
            }`}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: layer.active ? layer.color : '#666' }}
            />
            <span>{layer.label}</span>
            <span className="ml-auto text-xs text-gray-500">
              {layer.active ? 'ON' : 'OFF'}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-white/20 pt-3">
        <label className="text-sm text-gray-400 block mb-2">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={opacity * 100}
          onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
          className="w-full accent-cyan-500"
        />
      </div>

      <div className="border-t border-white/20 pt-3 mt-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>&mu;&#x207A;</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>&mu;&#x207B;</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span>e&#x207A;</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>e&#x207B;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
