'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { higgsEvents } from '@/lib/events';
import { EventInfo } from '@/components/event-display/EventInfo';
import { DetectorControls } from '@/components/event-display/DetectorControls';
import { EventSelector } from '@/components/event-display/EventSelector';
import { ViewControls } from '@/components/event-display/ViewControls';

// Dynamic import for Three.js scene (no SSR)
const Scene = dynamic(
  () => import('@/components/event-display/Scene').then(mod => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading 3D Event Display...</p>
        </div>
      </div>
    ),
  }
);

export default function EventDisplayPage() {
  // Event selection
  const [selectedEventId, setSelectedEventId] = useState(higgsEvents[0].id);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  // Detector layer visibility
  const [showTracker, setShowTracker] = useState(true);
  const [showECAL, setShowECAL] = useState(true);
  const [showHCAL, setShowHCAL] = useState(true);
  const [showMuon, setShowMuon] = useState(true);
  const [opacity, setOpacity] = useState(0.15);

  // View controls
  const [currentView, setCurrentView] = useState<'perspective' | 'xy' | 'xz' | 'yz'>('perspective');
  const [autoRotate, setAutoRotate] = useState(false);

  const selectedEvent = higgsEvents.find(e => e.id === selectedEventId) || higgsEvents[0];

  const handleEventSelect = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setSelectedTrack(null); // Reset track selection on event change
  }, []);

  const handleTrackSelect = useCallback((trackId: string | null) => {
    setSelectedTrack(trackId);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">3D Event Display</h1>
            <p className="text-gray-400 text-sm">
              Interactive visualization of H &rarr; ZZ* &rarr; 4&#8467; candidate events
            </p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
          >
            &larr; Back to Dashboard
          </a>
        </div>
      </header>

      {/* 3D Canvas (full screen) */}
      <div className="w-full h-screen">
        <Scene
          event={selectedEvent}
          selectedTrack={selectedTrack}
          showTracker={showTracker}
          showECAL={showECAL}
          showHCAL={showHCAL}
          showMuon={showMuon}
          opacity={opacity}
        />
      </div>

      {/* Overlay UI */}
      <EventInfo
        event={selectedEvent}
        selectedTrack={selectedTrack}
        onTrackSelect={handleTrackSelect}
      />

      <DetectorControls
        showTracker={showTracker}
        showECAL={showECAL}
        showHCAL={showHCAL}
        showMuon={showMuon}
        opacity={opacity}
        onToggleTracker={() => setShowTracker(!showTracker)}
        onToggleECAL={() => setShowECAL(!showECAL)}
        onToggleHCAL={() => setShowHCAL(!showHCAL)}
        onToggleMuon={() => setShowMuon(!showMuon)}
        onOpacityChange={setOpacity}
      />

      <EventSelector
        events={higgsEvents}
        selectedEventId={selectedEventId}
        onEventSelect={handleEventSelect}
      />

      <ViewControls
        currentView={currentView}
        onViewChange={setCurrentView}
        autoRotate={autoRotate}
        onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
      />

      {/* Physics explanation tooltip */}
      <div className="absolute bottom-20 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-white/10 max-w-xs">
        <h4 className="text-xs font-semibold text-cyan-400 mb-1">About This Display</h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          This simplified CMS detector shows particle tracks from Higgs boson decays.
          Muons (&mu;) penetrate all layers while electrons (e) stop at the ECAL.
          Track colors indicate charge: positive (red/orange) and negative (blue/green).
        </p>
      </div>
    </div>
  );
}
