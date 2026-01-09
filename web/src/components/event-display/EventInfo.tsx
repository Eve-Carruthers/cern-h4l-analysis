'use client';

import { HiggsEvent, Track, getChannelLabel, getTrackColor } from '@/lib/events';

interface EventInfoProps {
  event: HiggsEvent;
  selectedTrack: string | null;
  onTrackSelect: (trackId: string | null) => void;
}

export function EventInfo({ event, selectedTrack, onTrackSelect }: EventInfoProps) {
  const selectedTrackData = selectedTrack
    ? event.tracks.find(t => t.id === selectedTrack)
    : null;

  return (
    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs border border-white/10">
      {/* Event header */}
      <div className="border-b border-white/20 pb-3 mb-3">
        <h3 className="text-lg font-bold text-cyan-400">Event Display</h3>
        <p className="text-sm text-gray-400">H &rarr; ZZ* &rarr; {getChannelLabel(event.channel)}</p>
      </div>

      {/* Event metadata */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Run:</span>
          <span className="font-mono">{event.runNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Event:</span>
          <span className="font-mono">{event.eventNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Lumi Section:</span>
          <span className="font-mono">{event.lumiSection}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date:</span>
          <span className="font-mono">{event.date}</span>
        </div>
      </div>

      {/* Reconstructed masses */}
      <div className="border-t border-white/20 pt-3 mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Reconstructed Masses</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-yellow-400">m&#x2084;&#x2097; (Higgs):</span>
            <span className="font-mono font-bold text-yellow-400">
              {event.mass.toFixed(1)} GeV
            </span>
          </div>
          {event.zBosons.map((z) => (
            <div key={z.id} className="flex justify-between items-center">
              <span className="text-gray-400">
                m{z.isOnShell ? 'Z' : 'Z*'} ({z.tracks.join(', ')}):
              </span>
              <span className="font-mono">
                {z.mass.toFixed(1)} GeV
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Track list */}
      <div className="border-t border-white/20 pt-3">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Tracks</h4>
        <div className="space-y-1">
          {event.tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => onTrackSelect(selectedTrack === track.id ? null : track.id)}
              className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                selectedTrack === track.id
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getTrackColor(track) }}
                />
                <span className="font-mono">{track.id}</span>
                <span className="text-gray-500">
                  {track.type === 'muon' ? '\u03BC' : 'e'}{track.charge === 1 ? '\u207A' : '\u207B'}
                </span>
              </div>
              <span className="text-gray-400 font-mono text-xs">
                {track.pt.toFixed(1)} GeV
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected track details */}
      {selectedTrackData && (
        <div className="border-t border-white/20 pt-3 mt-3">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Track Details: {selectedTrackData.id}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-1 font-mono">
                {selectedTrackData.type === 'muon' ? 'Muon' : 'Electron'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Charge:</span>
              <span className="ml-1 font-mono">
                {selectedTrackData.charge === 1 ? '+1' : '-1'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">pT:</span>
              <span className="ml-1 font-mono">{selectedTrackData.pt.toFixed(2)} GeV</span>
            </div>
            <div>
              <span className="text-gray-500">E:</span>
              <span className="ml-1 font-mono">{selectedTrackData.energy.toFixed(2)} GeV</span>
            </div>
            <div>
              <span className="text-gray-500">&eta;:</span>
              <span className="ml-1 font-mono">{selectedTrackData.eta.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-gray-500">&phi;:</span>
              <span className="ml-1 font-mono">{selectedTrackData.phi.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
