
export interface Team {
  id: string;
  name: string;
  players: string[];
  wins: number;
}

export interface GameRecord {
  id: string;
  team1Name: string;
  team2Name: string;
  score1: number;
  score2: number;
  winnerName: string;
  maxPoints: number;
  timestamp: number;
}

export enum GameView {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  LEADERBOARD = 'LEADERBOARD',
  HISTORY = 'HISTORY'
}
