import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Plus, User as UserIcon, Activity, Calendar, Trash2, Save, Download, ArrowLeft, MoreVertical, X, TrendingUp, LogOut, Edit2, Cloud, CloudOff, Settings } from 'lucide-react';
import { BodyFigurine } from './components/BodyFigurine';
import { ProgressCharts } from './components/ProgressCharts';
import { StorageService } from './services/storageService';
import { User, WorkoutLog, Exercise, BodyPart, WorkoutSet } from './types';
import { BODY_PARTS } from './constants';

// --- Types for Form Input (Allows strings for decimals) ---
interface InputSet {
  weight: string | number;
  reps: string | number;
}

// --- Shared Layout Component ---
const Layout: React.FC<{ children: React.ReactNode; currentUser: User | null }> = ({ children, currentUser }) => {
  const location = useLocation();
  // We use a state to force re-render when cloud status changes
  const [isCloud, setIsCloud] = useState(StorageService.isCloudConnected());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsCloud(StorageService.isCloudConnected());
    };
    window.addEventListener('blacksmith_storage_change', handleStorageChange);
    return () => window.removeEventListener('blacksmith_storage_change', handleStorageChange);
  }, []);
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: <Activity size={20} /> },
    { path: '/history', label: 'History', icon: <Calendar size={20} /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 text-text font-sans selection:bg-primary selection:text-black">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 group select-none">
            <span className="text-white">BLACK</span><span className="text-primary">SMITH</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${location.pathname === link.path ? 'bg-primary text-black' : 'text-muted hover:text-white hover:bg-zinc-800'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Cloud Indicator */}
          <div className={`hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${isCloud ? 'border-primary/30 text-primary bg-primary/5' : 'border-zinc-800 text-zinc-500'}`}>
            {isCloud ? <><Cloud size={12} /> Cloud Sync</> : <><CloudOff size={12} /> Offline</>}
          </div>

          {currentUser && (
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className={`w-9 h-9 rounded-full ${currentUser.avatarColor} flex items-center justify-center text-xs font-bold text-black border-2 border-background`}>
                {currentUser.name[0]}
              </div>
              <span className="text-sm font-bold text-white hidden sm:block">{currentUser.name}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-zinc-800 md:hidden flex justify-around p-4 z-50 pb-safe">
        {navLinks.map(link => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-muted'}`}
          >
            {React.cloneElement(link.icon as React.ReactElement<any>, { size: 24, strokeWidth: location.pathname === link.path ? 3 : 2 })}
          </Link>
        ))}
      </nav>
    </div>
  );
};

// --- Sets Input Component (Shared) ---
const SetsInput: React.FC<{ sets: InputSet[]; onChange: (sets: InputSet[]) => void }> = ({ sets, onChange }) => {
  return (
    <div className="space-y-2 mb-4">
       <div className="grid grid-cols-12 gap-2 text-[10px] text-muted font-bold uppercase text-center mb-1">
         <div className="col-span-2">Set</div>
         <div className="col-span-4">Weight</div>
         <div className="col-span-2"></div>
         <div className="col-span-4">Reps</div>
       </div>
       
       {sets.map((set, idx) => (
         <div key={idx} className="grid grid-cols-12 gap-2 items-center">
           <div className="col-span-2 flex justify-center">
              <span className="w-6 h-6 rounded-full bg-surface border border-zinc-800 flex items-center justify-center text-[10px] text-muted font-mono">
                {idx + 1}
              </span>
           </div>
           <div className="col-span-4">
             <input 
               type="number"
               inputMode="decimal"
               step="any"
               placeholder="0"
               className="w-full bg-surface border border-zinc-800 rounded-lg py-2 text-center text-white font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-700 text-sm"
               value={set.weight}
               onChange={(e) => {
                 const newSets = [...sets];
                 newSets[idx].weight = e.target.value;
                 onChange(newSets);
               }}
             />
           </div>
           <div className="col-span-2 text-center text-zinc-600 text-xs font-black">×</div>
           <div className="col-span-4">
             <input 
               type="number"
               inputMode="decimal"
               placeholder="0"
               className="w-full bg-surface border border-zinc-800 rounded-lg py-2 text-center text-white font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-zinc-700 text-sm"
               value={set.reps}
               onChange={(e) => {
                 const newSets = [...sets];
                 newSets[idx].reps = e.target.value;
                 onChange(newSets);
               }}
             />
           </div>
         </div>
       ))}
    </div>
  );
};

// --- Log Workout Component ---
const LogWorkout: React.FC<{ 
  user: User | null; 
  exercises: Exercise[]; 
  onSave: (log: WorkoutLog) => void;
  onAddExercise: (ex: Exercise) => void;
  onDeleteExercise: (id: string) => void;
  selectedPart: BodyPart | null;
  onPartSelect: (part: BodyPart | null) => void;
}> = ({ user, exercises, onSave, onAddExercise, onDeleteExercise, selectedPart, onPartSelect }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [sets, setSets] = useState<InputSet[]>([{ weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }]);
  const [notes, setNotes] = useState('');
  
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  // Auto-select first exercise when body part changes
  useEffect(() => {
    if (selectedPart) {
      const partExercises = exercises.filter(e => e.bodyPart === selectedPart);
      if (partExercises.length > 0) {
        setSelectedExerciseId(partExercises[0].id);
      } else {
        setSelectedExerciseId('');
      }
    }
  }, [selectedPart, exercises]);

  const handleSave = () => {
    if (!user || !selectedExerciseId || !selectedPart) return;
    
    // Convert inputs to numbers and filter empty
    const validSets: WorkoutSet[] = sets
      .map(s => ({ 
        weight: parseFloat(s.weight.toString()) || 0, 
        reps: parseFloat(s.reps.toString()) || 0 
      }))
      .filter(s => s.reps > 0 || s.weight > 0);

    if (validSets.length === 0) {
      alert("Please log at least one set.");
      return;
    }

    const exercise = exercises.find(e => e.id === selectedExerciseId);
    if (!exercise) return;

    // Use robust ID generation to prevent collisions
    const newLog: WorkoutLog = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: selectedPart,
      sets: validSets,
      notes
    };

    onSave(newLog);
    // Reset inputs but keep context
    setSets([{ weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }]);
    setNotes('');
  };

  const handleCreateCustom = () => {
    if (!customName || !selectedPart) return;
    const newEx: Exercise = {
      id: `custom_${Date.now()}`,
      name: customName,
      bodyPart: selectedPart,
      isCustom: true
    };
    onAddExercise(newEx);
    setIsAddingCustom(false);
    setCustomName('');
    setSelectedExerciseId(newEx.id);
  };

  const filteredExercises = useMemo(() => {
    return selectedPart ? exercises.filter(e => e.bodyPart === selectedPart) : [];
  }, [exercises, selectedPart]);

  return (
    <div className="h-full flex flex-col gap-6">
       <div className="flex items-center justify-between mb-2">
         <h2 className="text-xl font-black text-white italic tracking-tighter">LOG WORKOUT</h2>
         <button onClick={() => { onPartSelect(null); setSelectedExerciseId(''); }} className="text-xs font-bold text-muted hover:text-white uppercase tracking-wider">Reset</button>
       </div>

       {/* 1. Muscle Group Selector */}
       <div className="w-full">
         <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">1. Muscle Group</label>
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear">
           {BODY_PARTS.map(part => (
             <button
               key={part}
               onClick={() => onPartSelect(part)}
               className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${selectedPart === part ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'bg-surface text-muted border-zinc-800 hover:text-white hover:border-zinc-700'}`}
             >
               {part}
             </button>
           ))}
         </div>
       </div>

       {/* 2. Exercise Dropdown */}
       <div className={`transition-opacity duration-300 w-full ${selectedPart ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
         <div className="flex justify-between items-baseline mb-2">
           <label className="text-xs font-bold text-muted uppercase tracking-wider block">2. Exercise</label>
           {selectedPart && (
             <button onClick={() => setIsAddingCustom(!isAddingCustom)} className="text-[10px] font-bold text-primary hover:underline">
               {isAddingCustom ? 'Cancel Custom' : '+ Add Custom'}
             </button>
           )}
         </div>

         {isAddingCustom ? (
            <div className="flex gap-2">
              <input 
                autoFocus
                type="text" 
                placeholder="Exercise Name" 
                className="flex-1 bg-surface border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
              <button onClick={handleCreateCustom} className="bg-primary text-black font-bold px-4 rounded-xl text-sm">Add</button>
            </div>
         ) : (
           <div className="relative">
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full bg-surface border border-zinc-800 hover:border-zinc-700 text-white rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none appearance-none transition-colors"
              >
                {filteredExercises.map(ex => (
                  <option key={ex.id} value={ex.id} className="text-black bg-zinc-200">{ex.name}</option>
                ))}
                {filteredExercises.length === 0 && <option disabled>No exercises found</option>}
              </select>
           </div>
         )}
       </div>

       {/* 3. Sets & Reps Input */}
       <div className={`flex-1 flex flex-col transition-opacity duration-300 ${selectedExerciseId ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">3. Performance</label>
          
          <SetsInput sets={sets} onChange={setSets} />

          <div className="mt-auto pt-4">
            <button 
              onClick={handleSave}
              disabled={!selectedExerciseId}
              className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={22} strokeWidth={3} /> LOG SET
            </button>
          </div>
       </div>
    </div>
  );
};

// --- Edit Modal Component ---
const EditLogModal: React.FC<{
  log: WorkoutLog | null;
  onClose: () => void;
  onUpdate: (updatedLog: WorkoutLog) => void;
  onDelete: (id: string) => void;
}> = ({ log, onClose, onUpdate, onDelete }) => {
  const [sets, setSets] = useState<InputSet[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (log) {
      // Ensure we always have at least 3 input rows for editing
      const initialSets: InputSet[] = log.sets.map(s => ({ weight: s.weight, reps: s.reps }));
      while (initialSets.length < 3) {
        initialSets.push({ weight: '', reps: '' });
      }
      setSets(initialSets);
      setNotes(log.notes || '');
    }
  }, [log]);

  if (!log) return null;

  const handleSave = () => {
    // Convert inputs to numbers
    const validSets: WorkoutSet[] = sets
      .map(s => ({ 
        weight: parseFloat(s.weight.toString()) || 0, 
        reps: parseFloat(s.reps.toString()) || 0 
      }))
      .filter(s => s.reps > 0 || s.weight > 0);

    if (validSets.length === 0) {
      alert("Cannot save an empty log.");
      return;
    }
    const updatedLog: WorkoutLog = {
      ...log,
      sets: validSets,
      notes
    };
    onUpdate(updatedLog);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      onDelete(log.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-background w-full max-w-md rounded-3xl border border-zinc-800 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={24} />
        </button>

        <h3 className="text-xl font-black text-white italic mb-1 uppercase">Edit Entry</h3>
        <p className="text-primary font-bold text-sm mb-6">{log.exerciseName} <span className="text-zinc-500">•</span> {new Date(log.date).toLocaleDateString()}</p>

        <SetsInput sets={sets} onChange={setSets} />

        <div className="mt-4">
          <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Notes</label>
          <textarea 
            className="w-full bg-surface border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-primary outline-none resize-none"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleDelete}
            className="flex-none bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 font-bold p-3 rounded-xl transition-all"
            title="Delete Log"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary-dark text-black font-black text-lg py-3 rounded-xl transition-all active:scale-95"
          >
            UPDATE LOG
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Dashboard Screen ---
const Dashboard: React.FC<{ 
  logs: WorkoutLog[]; 
  user: User | null;
  exercises: Exercise[];
  onSave: (log: WorkoutLog) => void;
  onAddExercise: (ex: Exercise) => void;
  onDeleteExercise: (id: string) => void;
}> = ({ logs, user, exercises, onSave, onAddExercise, onDeleteExercise }) => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const userLogs = useMemo(() => logs.filter(l => l.userId === user?.id), [logs, user]);
  const filteredLogs = useMemo(() => selectedPart ? userLogs.filter(l => l.bodyPart === selectedPart) : userLogs, [userLogs, selectedPart]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-surface to-background border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={120} />
          </div>
          <h2 className="text-3xl font-black text-white italic mb-1 tracking-tighter">
            HELLO <span className="text-primary uppercase">{user?.name}</span>
          </h2>
          <p className="text-muted font-medium mb-6 text-sm">Let's crush some goals today.</p>
          
          <div className="flex gap-4 flex-wrap">
            <div className="bg-black/40 backdrop-blur px-4 py-3 rounded-2xl border border-zinc-800 min-w-[100px]">
              <span className="block text-2xl font-black text-white">{userLogs.length}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Workouts</span>
            </div>
             <div className="bg-black/40 backdrop-blur px-4 py-3 rounded-2xl border border-zinc-800 min-w-[100px]">
              <span className="block text-2xl font-black text-primary">
                 {userLogs.filter(l => (Date.now() - l.timestamp) < 604800000).length}
              </span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">This Week</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1 bg-surface border border-zinc-800 rounded-3xl p-6 flex flex-col justify-center items-center relative overflow-hidden min-h-[180px]">
          <div className="absolute inset-0 bg-primary/5"></div>
          <TrendingUp className="text-primary mb-2" size={32} />
          <span className="text-xs font-bold text-muted uppercase tracking-wider text-center">Volume Lifted</span>
          <span className="text-3xl font-black text-white mt-1">
            {(userLogs.reduce((acc, log) => acc + log.sets.reduce((s, set) => s + (set.weight * set.reps), 0), 0) / 1000).toFixed(1)}k
          </span>
          <span className="text-xs text-zinc-600 font-bold">KILOGRAMS</span>
        </div>
      </div>

      {/* Main Content Grid - Balanced 1:1 on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: Visuals */}
        <div className="space-y-6 flex flex-col h-full min-w-0">
          <div className="bg-surface rounded-3xl p-6 border border-zinc-800 shadow-xl overflow-hidden relative">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-white italic flex items-center gap-2 tracking-tighter">
                  <UserIcon size={18} className="text-primary" /> MUSCLE HEATMAP
                </h3>
             </div>
             <BodyFigurine logs={userLogs} selectedBodyPart={selectedPart} onPartClick={setSelectedPart} />
          </div>

          <div className="bg-surface rounded-3xl p-6 border border-zinc-800 shadow-xl overflow-hidden flex-1 min-h-[300px]">
             <h3 className="text-lg font-black text-white italic mb-4 flex items-center gap-2 tracking-tighter">
               <TrendingUp size={18} className="text-primary" /> PROGRESS
             </h3>
             <ProgressCharts logs={filteredLogs} filterType="Volume" />
          </div>
        </div>

        {/* RIGHT: Logger (Sticky) */}
        <div className="h-full min-w-0">
          <div className="bg-surface rounded-3xl p-6 border border-zinc-800 shadow-2xl sticky top-24 overflow-hidden h-fit lg:min-h-[calc(100vh-8rem)]">
            <LogWorkout 
              user={user} 
              exercises={exercises} 
              onSave={onSave} 
              onAddExercise={onAddExercise}
              onDeleteExercise={onDeleteExercise}
              selectedPart={selectedPart}
              onPartSelect={setSelectedPart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- History Screen ---
const History: React.FC<{ 
  logs: WorkoutLog[]; 
  user: User | null; 
  onDeleteLog: (id: string) => void; 
  onEditLog: (log: WorkoutLog) => void;
  onExport: () => void;
}> = ({ logs, user, onDeleteLog, onEditLog, onExport }) => {
  const userLogs = logs
    .filter(l => l.userId === user?.id)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface p-6 rounded-3xl border border-zinc-800">
        <h2 className="text-2xl font-black text-white italic tracking-tighter">HISTORY</h2>
        <button onClick={onExport} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors">
          <Download size={16} /> CSV
        </button>
      </div>

      <div className="grid gap-3">
        {userLogs.length === 0 && (
          <div className="text-center p-12 text-muted">No workout history found. Go lift something!</div>
        )}
        {userLogs.map(log => (
          <div key={log.id} className="bg-surface p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between sm:items-center group hover:border-zinc-700 transition-all gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">{log.bodyPart}</span>
              <h4 className="font-bold text-white text-lg">{log.exerciseName}</h4>
              <div className="flex gap-2 text-xs text-muted font-medium">
                <span>{new Date(log.date).toLocaleDateString()}</span>
                <span>•</span>
                <span className="text-zinc-400">{log.sets.reduce((a,b) => a+b.reps, 0)} total reps</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
               <div className="text-left sm:text-right">
                 {log.sets.map((s, i) => (
                   <div key={i} className="text-xs font-mono text-zinc-500">
                     <span className="text-white font-bold">{s.weight}</span>kg × {s.reps}
                   </div>
                 ))}
               </div>
               <div className="flex gap-1 relative z-10">
                 <button onClick={() => onEditLog(log)} className="p-2 text-zinc-600 hover:text-white transition-colors bg-zinc-900/50 rounded-lg">
                   <Edit2 size={16} />
                 </button>
                 <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLog(log.id);
                  }} 
                  className="p-2 text-zinc-600 hover:text-red-500 transition-colors bg-zinc-900/50 rounded-lg"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Cloud Config Modal ---
const CloudConfigModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  const handleConnect = () => {
    if (!url || !key) return alert('Please enter both URL and Key');
    StorageService.connectCloud(url, key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
       <div className="bg-surface w-full max-w-lg rounded-3xl border border-zinc-800 p-6 shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={24}/></button>
          
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
              <Cloud size={32} />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase">Connect to Cloud</h3>
            <p className="text-muted text-sm mt-2">Enter your Supabase credentials to sync data across devices.</p>
          </div>

          <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-muted uppercase block mb-1">Project URL</label>
               <input 
                 className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                 placeholder="https://xyz.supabase.co"
                 value={url}
                 onChange={e => setUrl(e.target.value)}
               />
             </div>
             <div>
               <label className="text-xs font-bold text-muted uppercase block mb-1">Anon Public Key</label>
               <input 
                 className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
                 placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                 value={key}
                 onChange={e => setKey(e.target.value)}
               />
             </div>
          </div>

          <div className="mt-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
            <h4 className="text-xs font-bold text-white mb-2">DB Setup Required:</h4>
            <code className="text-[10px] text-zinc-400 font-mono block whitespace-pre-wrap">
              create table app_data ( key text primary key, value jsonb );
            </code>
          </div>

          <button onClick={handleConnect} className="w-full mt-6 bg-primary text-black font-black py-4 rounded-xl hover:bg-primary-dark transition-all">
            CONNECT & SYNC
          </button>
       </div>
    </div>
  );
};

// --- Profile Screen ---
const Profile: React.FC<{ 
  currentUser: User | null; 
  allUsers: User[]; 
  onSwitch: (id: string) => void;
  onAddUser: (name: string) => void;
  onDeleteUser: (id: string) => void; 
}> = ({ currentUser, allUsers, onSwitch, onAddUser, onDeleteUser }) => {
  const [newUserName, setNewUserName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const isCloud = StorageService.isCloudConnected();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-surface p-8 rounded-3xl border border-zinc-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className={`w-24 h-24 mx-auto rounded-full ${currentUser?.avatarColor} flex items-center justify-center text-4xl font-bold text-black border-4 border-background mb-4 shadow-xl`}>
          {currentUser?.name[0]}
        </div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{currentUser?.name}</h2>
        <p className="text-muted font-bold text-xs uppercase tracking-widest mt-2">Current Athlete</p>
      </div>

      {/* Cloud Sync Section */}
      <div className="bg-surface p-6 rounded-2xl border border-zinc-800 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCloud ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-500'}`}>
             {isCloud ? <Cloud size={20} /> : <CloudOff size={20} />}
           </div>
           <div>
             <h4 className="font-bold text-white text-sm">Cloud Sync</h4>
             <p className="text-xs text-muted">{isCloud ? 'Data is syncing online' : 'Data is stored locally'}</p>
           </div>
         </div>
         <button 
           onClick={() => isCloud ? StorageService.disconnectCloud() : setShowCloudModal(true)}
           className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-white hover:border-primary transition-colors"
         >
           {isCloud ? 'Disconnect' : 'Connect Cloud'}
         </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white px-2">Switch Profile</h3>
        {allUsers.map(u => (
           <div key={u.id} onClick={() => onSwitch(u.id)} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${currentUser?.id === u.id ? 'border-primary bg-primary/10' : 'border-zinc-800 bg-surface hover:border-zinc-600'}`}>
             <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-full ${u.avatarColor} flex items-center justify-center font-bold text-black`}>{u.name[0]}</div>
               <span className={`font-bold ${currentUser?.id === u.id ? 'text-white' : 'text-zinc-400'}`}>{u.name}</span>
             </div>
             {currentUser?.id !== u.id && <button onClick={(e) => {e.stopPropagation(); onDeleteUser(u.id)}}><Trash2 size={16} className="text-zinc-600 hover:text-red-500"/></button>}
           </div>
        ))}
        
        {isAdding ? (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 flex gap-2">
            <input 
              autoFocus
              className="flex-1 bg-transparent outline-none text-white font-bold"
              placeholder="New Name"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
            />
            <button onClick={() => { onAddUser(newUserName); setNewUserName(''); setIsAdding(false); }} className="text-primary font-bold text-sm">SAVE</button>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="w-full p-4 rounded-2xl border border-dashed border-zinc-700 text-muted font-bold hover:text-white hover:border-primary hover:bg-zinc-900 transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> ADD ATHLETE
          </button>
        )}
      </div>

      {showCloudModal && <CloudConfigModal onClose={() => setShowCloudModal(false)} />}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null);

  // Load Data Callback
  const loadData = useCallback(async () => {
    try {
      const [loadedUsers, loadedExercises, loadedLogs] = await Promise.all([
        StorageService.getUsers(),
        StorageService.getExercises(),
        StorageService.getLogs()
      ]);
      
      setUsers(loadedUsers);
      setExercises(loadedExercises);
      setLogs(loadedLogs);
      
      if (loadedUsers.length > 0 && !currentUserId) {
        setCurrentUserId(loadedUsers[0].id);
      }
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Initial Load & Event Listener
  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('blacksmith_storage_change', handleStorageChange);
    return () => window.removeEventListener('blacksmith_storage_change', handleStorageChange);
  }, [loadData]);

  const currentUser = users.find(u => u.id === currentUserId) || null;

  const handleSaveLog = async (log: WorkoutLog) => {
    const updatedLogs = [...logs, log];
    setLogs(updatedLogs); // Optimistic Update
    await StorageService.saveLogs(updatedLogs);
  };

  const handleUpdateLog = async (updatedLog: WorkoutLog) => {
    const updatedLogs = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
    setLogs(updatedLogs);
    await StorageService.saveLogs(updatedLogs);
    setEditingLog(null);
  };

  const handleDeleteLog = async (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    
    // Functional update + Async save
    setLogs(prevLogs => {
      const updatedLogs = prevLogs.filter(l => l.id !== id);
      StorageService.saveLogs(updatedLogs); 
      return updatedLogs;
    });
    
    if (editingLog?.id === id) {
      setEditingLog(null);
    }
  };

  const handleAddExercise = async (ex: Exercise) => {
    const updated = [...exercises, ex];
    setExercises(updated);
    await StorageService.saveExercises(updated);
  };

  const handleDeleteExercise = async (id: string) => {
    const hasLogs = logs.some(l => l.exerciseId === id);
    if (hasLogs) {
      if (!window.confirm("This exercise has history. Deleting it will keep history but remove it from the list. Continue?")) {
        return;
      }
    }
    const updated = exercises.filter(e => e.id !== id);
    setExercises(updated);
    await StorageService.saveExercises(updated);
  };

  const handleAddUser = async (name: string) => {
    if (!name.trim()) return;
    const colors = ['bg-lime-400', 'bg-emerald-400', 'bg-cyan-400', 'bg-fuchsia-400'];
    const newUser: User = { id: `u_${Date.now()}`, name, avatarColor: colors[Math.floor(Math.random() * colors.length)] };
    const updated = [...users, newUser];
    setUsers(updated);
    await StorageService.saveUsers(updated);
    setCurrentUserId(newUser.id);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Delete user and all their data? This cannot be undone.")) return;
    
    // Delete User
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    await StorageService.saveUsers(updatedUsers);

    // Delete User's Logs
    const updatedLogs = logs.filter(l => l.userId !== id);
    setLogs(updatedLogs);
    await StorageService.saveLogs(updatedLogs);

    if (currentUserId === id && updatedUsers.length > 0) setCurrentUserId(updatedUsers[0].id);
  };

  const handleExport = () => {
    const userSpecificLogs = logs.filter(l => l.userId === currentUserId);
    StorageService.exportDataToCSV(userSpecificLogs, users);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-black italic text-2xl tracking-tighter">BLACKSMITH</div>;

  return (
    <HashRouter>
      <Layout currentUser={currentUser}>
        <Routes>
          <Route path="/" element={<Dashboard logs={logs} user={currentUser} exercises={exercises} onSave={handleSaveLog} onAddExercise={handleAddExercise} onDeleteExercise={handleDeleteExercise}/>} />
          <Route path="/history" element={<History logs={logs} user={currentUser} onDeleteLog={handleDeleteLog} onEditLog={setEditingLog} onExport={handleExport} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} allUsers={users} onSwitch={setCurrentUserId} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      
      {/* Edit Modal Layer */}
      {editingLog && (
        <EditLogModal 
          log={editingLog} 
          onClose={() => setEditingLog(null)} 
          onUpdate={handleUpdateLog} 
          onDelete={handleDeleteLog}
        />
      )}
    </HashRouter>
  );
}