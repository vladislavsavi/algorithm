import React from 'react';

// Icons defined as separate components within the same file for simplicity
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" /></svg>
);

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onNewArray: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isPlaying, onPlayPause, onReset, speed, onSpeedChange, onNewArray }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onNewArray} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Новый массив
        </button>
        <button onClick={onReset} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="Сброс">
          <ResetIcon />
        </button>
        <button onClick={onPlayPause} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors" title={isPlaying ? "Пауза" : "Воспроизвести"}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <span className="text-sm">Скорость:</span>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full sm:w-32 cursor-pointer"
        />
        <span className="text-sm w-12 text-center">{speed.toFixed(2)}x</span>
      </div>
    </div>
  );
};

export default ControlPanel;
