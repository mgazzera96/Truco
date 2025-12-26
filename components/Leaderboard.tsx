
import React, { useState } from 'react';
import { Team, GameRecord } from '../types';
import { ArrowLeft, Trophy, List } from 'lucide-react';

interface LeaderboardProps {
  teams: Team[];
  history: GameRecord[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ teams, history, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'history'>('ranking');
  const sortedTeams = [...teams].sort((a, b) => b.wins - a.wins);
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('es-AR', { 
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 animate-in fade-in duration-300">
      <header className="flex items-center gap-4 mb-8 px-2">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold tracking-tight">Leaderboard</h2>
      </header>

      <div className="flex p-1 bg-white/5 rounded-lg border border-white/5 mb-6">
        <button 
          onClick={() => setActiveTab('ranking')} 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'ranking' ? 'bg-[#333] text-white' : 'text-gray-500'}`}
        >
          <Trophy size={14} /> Ranking
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-[#333] text-white' : 'text-gray-500'}`}
        >
          <List size={14} /> Historial
        </button>
      </div>

      <div className="space-y-4 px-2">
        {activeTab === 'ranking' ? (
          <div className="app-card overflow-hidden">
            {sortedTeams.map((team, idx) => (
              <div key={team.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`text-sm font-bold w-6 text-center ${idx === 0 ? 'text-blue-400' : 'text-gray-600'}`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{team.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{team.players.join(', ')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-400">{team.wins}</div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">Victs</div>
                </div>
              </div>
            ))}
            {sortedTeams.length === 0 && <div className="p-12 text-center text-gray-500 text-sm">No hay equipos registrados</div>}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedHistory.map((game) => (
              <div key={game.id} className="app-card p-4">
                <div className="flex justify-between items-center mb-4 text-[11px] text-gray-500 font-medium">
                  <span>{formatDate(game.timestamp)}</span>
                  <span>A {game.maxPoints} pts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center min-w-0">
                    <div className={`text-xs font-bold truncate mb-1 ${game.winnerName === game.team1Name ? 'text-blue-400' : 'text-gray-500'}`}>{game.team1Name}</div>
                    <div className="text-2xl font-bold">{game.score1}</div>
                  </div>
                  <div className="text-gray-800 font-bold text-xs italic">vs</div>
                  <div className="flex-1 text-center min-w-0">
                    <div className={`text-xs font-bold truncate mb-1 ${game.winnerName === game.team2Name ? 'text-blue-400' : 'text-gray-500'}`}>{game.team2Name}</div>
                    <div className="text-2xl font-bold">{game.score2}</div>
                  </div>
                </div>
              </div>
            ))}
            {sortedHistory.length === 0 && <div className="p-12 text-center text-gray-500 text-sm">No hay historial de juegos</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
