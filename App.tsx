
import React from 'react';
import Header from './components/Header';
import RobloxGameForge from './pages/NarrativeStudio'; // Repurposing NarrativeStudio as the main page

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
      {/* The sidebar is removed for a cleaner, single-page application feel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-4">
          <img src="/favicon.svg" alt="Forge Icon" className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Roblox Game <span className="text-indigo-400">Forge</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">AI-Powered Game Generation</p>
          </div>
        </div>
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <RobloxGameForge />
        </div>
      </main>
    </div>
  );
};

export default App;
