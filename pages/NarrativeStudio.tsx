import React, { useState, useCallback, useRef } from 'react';
import { generateRobloxGame } from '../services/geminiService';
import { RobloxGame, GameScript } from '../types';
import Card from '../components/Card';
import { Spinner } from '../components/icons/Spinner';
import { GuideIcon } from '../components/icons/EventIcon';
import { CodeIcon } from '../components/icons/NarrativeIcon';
import { MapIcon } from '../components/icons/EntityIcon';

type OutputTabs = 'guide' | 'scripts' | 'map';

const CodeBlock: React.FC<{ script: GameScript | { fileName: string; description: string; code: string; } }> = ({ script }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(script.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950/70 rounded-lg border border-slate-700 my-4">
      <div className="px-4 py-2 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-indigo-300">{script.fileName}</h4>
          <p className="text-xs text-slate-400">{script.description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs font-medium rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
        <code>{script.code}</code>
      </pre>
    </div>
  );
};

const RobloxGameForge: React.FC = () => {
  const [gameIdea, setGameIdea] = useState<string>("A simple obby game with a volcano theme, low-gravity, and a timer.");
  const [generatedGame, setGeneratedGame] = useState<RobloxGame | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OutputTabs>('guide');
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!gameIdea) {
        setError("Please enter a game idea.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedGame(null);
    try {
      const result = await generateRobloxGame(gameIdea);
      setGeneratedGame(result);
      setActiveTab('guide');
       setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [gameIdea]);

  const TabButton = ({ tab, label, icon }: { tab: OutputTabs, label: string, icon: React.ReactNode }) => (
      <button
          onClick={() => setActiveTab(tab)}
          className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
              activeTab === tab
                  ? 'bg-slate-800 text-indigo-300 border-indigo-500'
                  : 'text-slate-400 hover:bg-slate-800/50 border-transparent hover:border-slate-600'
          }`}
      >
          {icon}
          <span>{label}</span>
      </button>
  );

  const renderOutput = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <Spinner />
          <p className="mt-4 text-slate-400 animate-pulse">Processing...</p>
        </div>
      );
    }
    if (error) {
      return <div className="p-4 text-red-400 bg-red-900/50 rounded-lg m-4">{error}</div>;
    }
    if (!generatedGame) {
      return (
        <div className="text-center p-8 text-slate-500 min-h-[400px] flex items-center justify-center">
            <p>Your game assets will appear here after generating a package.</p>
        </div>
      );
    }
    
    return (
        <div>
            <div className="px-6 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{generatedGame.gameTitle}</h2>
                    <p className="text-slate-400 mt-1">{generatedGame.gameDescription}</p>
                  </div>
                </div>
            </div>
            <div className="border-b border-slate-700 px-4 mt-4">
                <div className="flex space-x-2">
                    <TabButton tab="guide" label="Setup Guide" icon={<GuideIcon className="h-5 w-5" />} />
                    <TabButton tab="scripts" label="Game Scripts" icon={<CodeIcon className="h-5 w-5" />} />
                    <TabButton tab="map" label="Map Builder" icon={<MapIcon className="h-5 w-5" />} />
                </div>
            </div>
            <div className="p-6">
                {activeTab === 'guide' && (
                    <div className="space-y-4">
                        {generatedGame.setupGuide.map((step, i) => (
                            <div key={i} className="p-4 bg-slate-800/60 rounded-lg">
                                <h3 className="font-bold text-lg text-teal-300 mb-2">Step {i + 1}: {step.stepTitle}</h3>
                                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{step.stepContent}</p>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'scripts' && (
                    <div>
                        {generatedGame.gameScripts.map((script) => (
                            <CodeBlock key={script.fileName} script={script} />
                        ))}
                    </div>
                )}
                {activeTab === 'map' && (
                    <div>
                        <CodeBlock script={{
                          fileName: "MapBuilder.lua",
                          description: generatedGame.mapBuilderScript.description,
                          code: generatedGame.mapBuilderScript.code
                        }} />
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Describe Your Roblox Game</h3>
        <p className="text-slate-400 mb-4 text-sm">
          Enter a description of the game you want to build. Be as descriptive as you like. Mention the genre, key mechanics, and theme.
        </p>
        <textarea
          value={gameIdea}
          onChange={(e) => setGameIdea(e.target.value)}
          className="w-full h-32 p-4 bg-slate-950 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          placeholder="e.g., A tycoon game where you build a space station..."
        />
        <div className="mt-4">
          <button 
            onClick={handleGenerate} 
            disabled={isLoading} 
            className="w-full px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading && <Spinner className="h-5 w-5" />}
            <span>Generate Game Package</span>
          </button>
        </div>
      </Card>

      <div ref={outputRef}>
        <h3 className="text-lg font-semibold text-white mb-2">Your Game Package</h3>
        <Card className="min-h-[400px]">
          {renderOutput()}
        </Card>
      </div>
    </div>
  );
};

export default RobloxGameForge;