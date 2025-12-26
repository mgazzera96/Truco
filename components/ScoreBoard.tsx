
import React from 'react';
import { Team } from '../types';
import Fosforos from './Fosforos';
import { Plus, Minus, Home, RotateCcw } from 'lucide-react';

interface ScoreBoardProps {
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  maxPoints: number;
  onUpdateScore: (teamIndex: 1 | 2, delta: number) => void;
  onReset: () => void;
  onHome: () => void;
  onFinish: () => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  team1, team2, score1, score2, maxPoints, onUpdateScore, onReset, onHome, onFinish
}) => {
  const isGameOver = score1 >= maxPoints || score2 >= maxPoints;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full space-y-4 px-2">
      <header className="flex items-center justify-between p-4 glass-card mt-2">
        <button onClick={onHome} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Home size={20} /></button>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Partida a {maxPoints}</p>
        </div>
        <button onClick={onReset} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><RotateCcw size={20} /></button>
      </header>

      <div className="flex-1 grid grid-cols-2 gap-3 pb-4">
        {/* Team 1 */}
        <div className={`flex flex-col glass-card p-4 transition-all ${score1 >= maxPoints ? 'border-blue-500/50 bg-blue-500/5' : ''}`}>
          <div className="text-center">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider truncate px-1">{team1.name}</h3>
            <div className="text-7xl font-extrabold my-2">{score1}</div>
          </div>
          <div className="flex-1 flex items-center justify-center py-4">
            <Fosforos points={score1} colorClass="bg-blue-500" />
          </div>
          <div className="space-y-2 mt-auto">
            <button 
              disabled={isGameOver}
              onClick={() => onUpdateScore(1, 1)}
              className="w-full py-6 btn-primary rounded-xl flex items-center justify-center disabled:opacity-0"
            >
              <Plus size={32} />
            </button>
            <button 
              disabled={isGameOver || score1 === 0}
              onClick={() => onUpdateScore(1, -1)}
              className="w-full py-3 btn-outline rounded-xl flex items-center justify-center text-gray-400 hover:text-white"
            >
              <Minus size={20} />
            </button>
          </div>
        </div>

        {/* Team 2 */}
        <div className={`flex flex-col glass-card p-4 transition-all ${score2 >= maxPoints ? 'border-red-500/50 bg-red-500/5' : ''}`}>
          <div className="text-center">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider truncate px-1">{team2.name}</h3>
            <div className="text-7xl font-extrabold my-2">{score2}</div>
          </div>
          <div className="flex-1 flex items-center justify-center py-4">
            <Fosforos points={score2} colorClass="bg-red-500" />
          </div>
          <div className="space-y-2 mt-auto">
            <button 
              disabled={isGameOver}
              onClick={() => onUpdateScore(2, 1)}
              className="w-full py-6 btn-primary rounded-xl flex items-center justify-center disabled:opacity-0"
            >
              <Plus size={32} />
            </button>
            <button 
              disabled={isGameOver || score2 === 0}
              onClick={() => onUpdateScore(2, -1)}
              className="w-full py-3 btn-outline rounded-xl flex items-center justify-center text-gray-400 hover:text-white"
            >
              <Minus size={20} />
            </button>
          </div>
        </div>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-sm glass-card p-8 text-center space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ganador</p>
              <h2 className="text-3xl font-extrabold truncate">{score1 >= maxPoints ? team1.name : team2.name}</h2>
              <p className="text-5xl font-black mt-4 text-blue-500">{Math.max(score1, score2)} — {Math.min(score1, score2)}</p>
            </div>
            <div className="pt-4 space-y-3">
              <button onClick={onReset} className="w-full py-4 btn-primary rounded-xl font-bold uppercase tracking-wider">Reiniciar</button>
              <button onClick={onFinish} className="w-full py-4 btn-outline rounded-xl font-bold uppercase tracking-wider text-gray-400">Menú Principal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
