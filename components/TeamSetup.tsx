
import React, { useState } from 'react';
import { Team } from '../types';
import { Plus, Trash2, X, ArrowLeft, Edit2 } from 'lucide-react';

interface TeamSetupProps {
  existingTeams: Team[];
  onStart: (team1: Team, team2: Team, maxPoints: 15 | 30) => void;
  onBack: () => void;
  onDeleteTeam?: (id: string) => void;
  onSaveTeam: (team: Team) => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({ existingTeams, onStart, onBack, onDeleteTeam, onSaveTeam }) => {
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
  const [maxPoints, setMaxPoints] = useState<15 | 30>(30);
  const [isEditing, setIsEditing] = useState(false);
  const [editTeam, setEditTeam] = useState<Team>({ id: '', name: '', players: [], wins: 0 });
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleStartEditing = (team?: Team) => {
    setEditTeam(team ? { ...team } : { id: 'team-' + Date.now(), name: '', players: [], wins: 0 });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="w-full max-w-md mx-auto py-4 animate-in fade-in duration-300">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-lg"><ArrowLeft size={20} /></button>
          <h2 className="text-lg font-bold">Gestionar Equipo</h2>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Equipo</label>
            <input 
              autoFocus
              className="w-full glass-card p-4 outline-none border-0 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              placeholder="Ej: Truqueros Unidos"
              value={editTeam.name}
              onChange={e => setEditTeam({ ...editTeam, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jugadores</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 glass-card p-4 outline-none border-0 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="Nombre del jugador..."
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') { 
                  if(newPlayerName.trim()) setEditTeam(prev => ({ ...prev, players: [...prev.players, newPlayerName.trim()] }));
                  setNewPlayerName('');
                }}}
              />
              <button onClick={() => {
                if(newPlayerName.trim()) setEditTeam(prev => ({ ...prev, players: [...prev.players, newPlayerName.trim()] }));
                setNewPlayerName('');
              }} className="btn-primary px-5 rounded-xl font-bold"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {editTeam.players.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {p}
                  <button onClick={() => setEditTeam({...editTeam, players: editTeam.players.filter((_, idx) => idx !== i)})} className="text-gray-500 hover:text-white"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <button 
            disabled={!editTeam.name.trim()}
            onClick={() => { onSaveTeam(editTeam); setIsEditing(false); }}
            className="w-full py-4 btn-primary font-bold rounded-xl shadow-lg disabled:opacity-30 mt-4 transition-all"
          >
            Guardar Equipo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Nueva Partida</h2>
        <p className="text-gray-500 text-sm mt-1">Selecciona los equipos rivales</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`p-5 glass-card transition-all ${team1 ? 'border-blue-500 bg-blue-500/5' : ''}`}>
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Nosotros</p>
          <div className="font-bold truncate text-sm">{team1 ? team1.name : '—'}</div>
        </div>
        <div className={`p-5 glass-card transition-all ${team2 ? 'border-red-500 bg-red-500/5' : ''}`}>
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Ellos</p>
          <div className="font-bold truncate text-sm">{team2 ? team2.name : '—'}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Equipos Disponibles</h3>
          <button onClick={() => handleStartEditing()} className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1">
            <Plus size={14} /> Nuevo
          </button>
        </div>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
          {existingTeams.map(team => (
            <div key={team.id} className="glass-card p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{team.name}</div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">{team.players.join(' · ') || 'Sin jugadores'}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleStartEditing(team)} className="p-2 text-gray-500 hover:text-white"><Edit2 size={14} /></button>
                  <button onClick={() => onDeleteTeam?.(team.id)} className="p-2 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    if(team1?.id === team.id) setTeam1(null);
                    else { if(team2?.id === team.id) setTeam2(null); setTeam1(team); }
                  }}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${team1?.id === team.id ? 'btn-primary' : 'btn-outline text-gray-400'}`}
                >
                  Nosotros
                </button>
                <button 
                  onClick={() => {
                    if(team2?.id === team.id) setTeam2(null);
                    else { if(team1?.id === team.id) setTeam1(null); setTeam2(team); }
                  }}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${team2?.id === team.id ? 'btn-primary' : 'btn-outline text-gray-400'}`}
                >
                  Ellos
                </button>
              </div>
            </div>
          ))}
          {existingTeams.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-gray-500 text-xs font-medium">Crea un equipo para empezar</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button onClick={() => setMaxPoints(15)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${maxPoints === 15 ? 'bg-white/10 text-white' : 'text-gray-500'}`}>A 15</button>
          <button onClick={() => setMaxPoints(30)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${maxPoints === 30 ? 'bg-white/10 text-white' : 'text-gray-500'}`}>A 30</button>
        </div>
        <button 
          disabled={!team1 || !team2}
          onClick={() => onStart(team1!, team2!, maxPoints)}
          className="w-full py-4 btn-primary font-bold rounded-xl shadow-lg transition-all disabled:opacity-20"
        >
          Empezar Partida
        </button>
        <button onClick={onBack} className="w-full text-gray-500 text-xs font-medium py-1 hover:text-white transition-colors">Volver</button>
      </div>
    </div>
  );
};

export default TeamSetup;
