'use client';

import { HiggsEvent, getChannelLabel } from '@/lib/events';

interface EventSelectorProps {
  events: HiggsEvent[];
  selectedEventId: string;
  onEventSelect: (eventId: string) => void;
}

export function EventSelector({
  events,
  selectedEventId,
  onEventSelect
}: EventSelectorProps) {
  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white border border-white/10">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">Select Event:</label>

        <div className="flex gap-2">
          {events.map((event, index) => (
            <button
              key={event.id}
              onClick={() => onEventSelect(event.id)}
              className={`px-3 py-2 rounded text-sm transition-all ${
                selectedEventId === event.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              <div className="font-mono text-xs">{index + 1}</div>
              <div className="text-xs opacity-75">{getChannelLabel(event.channel)}</div>
            </button>
          ))}
        </div>

        {selectedEvent && (
          <div className="ml-4 pl-4 border-l border-white/20 text-sm">
            <span className="text-gray-400">Mass: </span>
            <span className="font-mono text-yellow-400 font-bold">
              {selectedEvent.mass.toFixed(1)} GeV
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
