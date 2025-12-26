
import React, { useState, useEffect } from 'react';
import { Team, GameView, GameRecord } from './types';
import TeamSetup from './components/TeamSetup';
import ScoreBoard from './components/ScoreBoard';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [view, setView] = useState<GameView>(GameView.SETUP);
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('truco-app-v5-teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<GameRecord[]>(() => {
    const saved = localStorage.getItem('truco-app-v5-history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentGame, setCurrentGame] = useState<{
    team1: Team;
    team2: Team;
    score1: number;
    score2: number;
    maxPoints: 15 | 30;
    alreadyRecorded?: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('truco-app-v5-current');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => localStorage.setItem('truco-app-v5-teams', JSON.stringify(teams)), [teams]);
  useEffect(() => localStorage.setItem('truco-app-v5-history', JSON.stringify(history)), [history]);
  useEffect(() => {
    if (currentGame) localStorage.setItem('truco-app-v5-current', JSON.stringify(currentGame));
    else localStorage.removeItem('truco-app-v5-current');
  }, [currentGame]);

  const handleStartGame = (t1: Team, t2: Team, max: 15 | 30) => {
    setCurrentGame({ team1: t1, team2: t2, score1: 0, score2: 0, maxPoints: max, alreadyRecorded: false });
    setView(GameView.PLAYING);
  };

  const updateScore = (teamIndex: 1 | 2, delta: number) => {
    if (!currentGame) return;
    setCurrentGame(prev => {
      if (!prev) return null;
      const newScore1 = teamIndex === 1 ? Math.max(0, prev.score1 + delta) : prev.score1;
      const newScore2 = teamIndex === 2 ? Math.max(0, prev.score2 + delta) : prev.score2;
      const isFinishing = (newScore1 >= prev.maxPoints || newScore2 >= prev.maxPoints);
      
      if (isFinishing && !prev.alreadyRecorded) {
        const winner = newScore1 >= prev.maxPoints ? prev.team1 : prev.team2;
        recordMatch(winner, newScore1, newScore2, prev.maxPoints);
        return { ...prev, score1: newScore1, score2: newScore2, alreadyRecorded: true };
      }
      return { ...prev, score1: newScore1, score2: newScore2 };
    });
  };

  const recordMatch = (winner: Team, s1: number, s2: number, max: number) => {
    if (!currentGame) return;
    setTeams(prev => prev.map(t => (t.id === winner.id) ? { ...t, wins: t.wins + 1 } : t));
    const newRecord: GameRecord = {
      id: 'game-' + Date.now(),
      team1Name: currentGame.team1.name,
      team2Name: currentGame.team2.name,
      score1: s1,
      score2: s2,
      winnerName: winner.name,
      maxPoints: max,
      timestamp: Date.now()
    };
    setHistory(prev => [newRecord, ...prev].slice(0, 50));
  };

  const resetGame = () => currentGame && setCurrentGame({ ...currentGame, score1: 0, score2: 0, alreadyRecorded: false });
  const handleFinishGame = () => { setCurrentGame(null); setView(GameView.SETUP); };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="w-full max-w-lg px-6 py-10 flex-1 flex flex-col justify-center min-h-screen">
        
        {view === GameView.SETUP && !currentGame && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <header className="text-center">
              <h1 className="text-7xl font-bold tracking-tight mb-2">Truco</h1>
            </header>

            <div className="space-y-4">
              <button 
                onClick={() => setView(GameView.PLAYING)}
                className="w-full py-5 btn-primary text-sm font-semibold tracking-wider"
              >
                NUEVA PARTIDA
              </button>
              <button 
                onClick={() => setView(GameView.LEADERBOARD)}
                className="w-full py-5 btn-secondary text-sm font-semibold tracking-wider"
              >
                LEADERBOARD
              </button>
            </div>

            <div className="flex justify-center gap-12 pt-8 text-gray-500">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">{teams.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Equipos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white">{history.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1">Partidas</div>
              </div>
            </div>
          </div>
        )}

        {view === GameView.SETUP && currentGame && (
          <div className="space-y-10 animate-in zoom-in duration-300">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Partida Activa</p>
              <div className="app-card p-8 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-4xl font-bold text-blue-400 mb-1">{currentGame.score1}</div>
                    <div className="text-[11px] font-medium text-gray-500 truncate">{currentGame.team1.name}</div>
                  </div>
                  <div className="text-gray-700 font-bold italic">VS</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-4xl font-bold text-blue-400 mb-1">{currentGame.score2}</div>
                    <div className="text-[11px] font-medium text-gray-500 truncate">{currentGame.team2.name}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500 font-medium tracking-wide">A {currentGame.maxPoints} puntos</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button onClick={() => setView(GameView.PLAYING)} className="w-full py-5 btn-primary font-semibold tracking-widest text-sm">CONTINUAR</button>
              <button onClick={() => setCurrentGame(null)} className="w-full py-3 text-xs font-semibold text-gray-600 hover:text-red-400 transition-colors uppercase tracking-widest">Descartar</button>
            </div>
          </div>
        )}

        {view === GameView.PLAYING && !currentGame && (
          <TeamSetup 
            existingTeams={teams} 
            onStart={handleStartGame} 
            onSaveTeam={(t) => setTeams(prev => {
              const idx = prev.findIndex(item => item.id === t.id);
              if (idx > -1) { const n = [...prev]; n[idx] = t; return n; }
              return [...prev, t];
            })} 
            onBack={() => setView(GameView.SETUP)} 
            onDeleteTeam={(id) => confirm('¿Borrar equipo?') && setTeams(prev => prev.filter(t => t.id !== id))} 
          />
        )}

        {view === GameView.PLAYING && currentGame && (
          <ScoreBoard 
            team1={currentGame.team1} 
            team2={currentGame.team2} 
            score1={currentGame.score1} 
            score2={currentGame.score2} 
            maxPoints={currentGame.maxPoints} 
            onUpdateScore={updateScore} 
            onReset={resetGame} 
            onHome={() => setView(GameView.SETUP)} 
            onFinish={handleFinishGame} 
          />
        )}

        {view === GameView.LEADERBOARD && (
          <Leaderboard teams={teams} history={history} onBack={() => setView(GameView.SETUP)} />
        )}
      </main>
    </div>
  );
};

export default App;
