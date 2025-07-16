
import React from 'react';
import { EntityProfile } from '../types';
import Card from './Card';

interface EntityProfileCardProps {
  entity: EntityProfile;
}

const EntityProfileCard: React.FC<EntityProfileCardProps> = ({ entity }) => {
  const typeColor = entity.type === 'Enemy' ? 'text-red-400' : 'text-green-400';
  const borderColor = entity.type === 'Enemy' ? 'border-red-500/50' : 'border-green-500/50';

  return (
    <Card className={`p-5 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{entity.name}</h3>
          <p className="text-sm font-medium text-indigo-300">{entity.profile}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full bg-slate-900 ${typeColor}`}>{entity.type}</span>
      </div>
      <p className="text-slate-400 text-sm my-3">{entity.description}</p>
      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-2">Tactical Behaviors:</h4>
        <div className="flex flex-wrap gap-2">
            {entity.behaviors.map(behavior => (
                <span key={behavior} className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded-md">
                    {behavior}
                </span>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default EntityProfileCard;
