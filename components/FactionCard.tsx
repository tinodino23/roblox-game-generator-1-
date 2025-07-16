
import React from 'react';
import { Faction } from '../types';
import Card from './Card';

interface FactionCardProps {
  faction: Faction;
}

const ParameterBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1 text-xs">
      <span className="font-medium text-slate-300">{label}</span>
      <span className="text-indigo-300 font-bold">{value}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const FactionCard: React.FC<FactionCardProps> = ({ faction }) => {
  return (
    <Card className={`flex flex-col border-t-4 ${faction.color}`}>
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-bold text-white">{faction.name}</h3>
        <p className="text-sm font-medium text-indigo-300 mb-3">{faction.archetype}</p>
        <p className="text-slate-400 text-sm mb-4">{faction.description}</p>
        
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-2">Base Goals:</h4>
            <ul className="space-y-1">
                {faction.baseGoals.map(goal => (
                    <li key={goal} className="flex items-center text-xs text-slate-300">
                        <svg className="w-3 h-3 mr-2 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {goal}
                    </li>
                ))}
            </ul>
        </div>
      </div>
      <div className="bg-slate-800 p-5 rounded-b-xl mt-auto space-y-3">
        <ParameterBar label="Aggression" value={faction.parameters.aggression} />
        <ParameterBar label="Resource Priority" value={faction.parameters.resourcePriority} />
        <ParameterBar label="Expansion Rate" value={faction.parameters.expansionRate} />
      </div>
    </Card>
  );
};

export default FactionCard;
