
export interface Faction {
  name: string;
  archetype: string;
  description: string;
  color: string;
  baseGoals: string[];
  parameters: {
    aggression: number;
    resourcePriority: number;
    expansionRate: number;
  };
}

export interface EntityProfile {
  name: string;
  profile: string;
  type: 'Enemy' | 'Ally' | 'Neutral';
  description: string;
  behaviors: string[];
}

export interface WorldEvent {
  title: string;
  type: 'Resource' | 'Creature' | 'Political' | 'Environmental' | 'Discovery';
  description: string;
  impact: string;
}

export interface GameScript {
  fileName: string;
  description: string;
  code: string;
}

export interface SetupStep {
  stepTitle: string;
  stepContent: string;
}

export interface MapBuilder {
  description: string;
  code: string;
}

export interface RobloxGame {
  gameTitle: string;
  gameDescription: string;
  setupGuide: SetupStep[];
  gameScripts: GameScript[];
  mapBuilderScript: MapBuilder;
}
