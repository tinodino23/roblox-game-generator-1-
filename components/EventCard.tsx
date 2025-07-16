
import React from 'react';
import { WorldEvent } from '../types';

interface EventCardProps {
    event: WorldEvent;
    isPotential?: boolean;
}

const typeColors: { [key: string]: string } = {
    Resource: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    Creature: 'bg-red-500/20 text-red-300 border-red-500/50',
    Political: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    Environmental: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    Discovery: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
};

const EventCard: React.FC<EventCardProps> = ({ event, isPotential = false }) => {
    return (
        <div className={`p-4 rounded-lg bg-slate-800 border ${isPotential ? 'border-slate-700' : 'border-slate-600'}`}>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white">{event.title}</h4>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${typeColors[event.type]}`}>
                    {event.type}
                </span>
            </div>
            <p className="text-sm text-slate-400">{event.description}</p>
            {!isPotential && (
                 <p className="text-xs text-slate-500 mt-2 italic">Impact: {event.impact}</p>
            )}
        </div>
    );
};

export default EventCard;
