'use client';

interface ViewControlsProps {
  onViewChange: (view: 'perspective' | 'xy' | 'xz' | 'yz') => void;
  currentView: string;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
}

export function ViewControls({
  onViewChange,
  currentView,
  autoRotate,
  onAutoRotateToggle,
}: ViewControlsProps) {
  const views = [
    { id: 'perspective', label: '3D', icon: '\u{1F3B2}' },
    { id: 'xy', label: 'X-Y', icon: '\u2299' },
    { id: 'xz', label: 'X-Z', icon: '\u2194' },
    { id: 'yz', label: 'Y-Z', icon: '\u2195' },
  ] as const;

  return (
    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400">View:</span>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              currentView === view.id
                ? 'bg-cyan-600 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={view.label}
          >
            {view.icon}
          </button>
        ))}
      </div>

      <button
        onClick={onAutoRotateToggle}
        className={`w-full px-2 py-1 rounded text-xs transition-colors ${
          autoRotate
            ? 'bg-cyan-600 text-white'
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {autoRotate ? '\u23F8 Stop Rotation' : '\u25B6 Auto Rotate'}
      </button>
    </div>
  );
}
