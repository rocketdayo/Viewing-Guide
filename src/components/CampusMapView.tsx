import React from 'react';
import { ClassProject } from '../types';

interface CampusMapViewProps {
  projects?: ClassProject[];
  onSelectProject?: (projectId: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = () => {
  return (
    <div className="w-full min-h-[85vh] h-[calc(100vh-120px)] bg-white rounded-lg shadow-xs overflow-hidden border border-slate-200">
      <iframe
        src="/map/index.html"
        title="校内マップ"
        className="w-full h-full border-0 min-h-[85vh]"
        allow="fullscreen"
      />
    </div>
  );
};
