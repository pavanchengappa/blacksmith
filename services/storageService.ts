import { User, Exercise, WorkoutLog } from '../types';
import { DEFAULT_USERS, INITIAL_EXERCISES } from '../constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const KEYS = {
  USERS: 'fitTrack_users',
  EXERCISES: 'fitTrack_exercises',
  LOGS: 'fitTrack_logs',
  SUPABASE_CONFIG: 'blacksmith_supabase_config'
};

interface SupabaseConfig {
  url: string;
  key: string;
}

let supabase: SupabaseClient | null = null;

// Initialize Supabase if config exists
const initSupabase = () => {
  const configStr = localStorage.getItem(KEYS.SUPABASE_CONFIG);
  if (configStr) {
    const config: SupabaseConfig = JSON.parse(configStr);
    try {
      supabase = createClient(config.url, config.key);
      console.log('BLACKSMITH: Cloud Client Initialized');
    } catch (e) {
      console.error('BLACKSMITH: Cloud Connection Failed', e);
      supabase = null;
    }
  } else {
    supabase = null;
  }
};

initSupabase();

// Helper to handle cloud vs local
const getGeneric = async <T>(key: string, localFallback: T): Promise<T> => {
  // If connected to Supabase, try fetch from 'app_data' table
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('app_data')
        .select('value')
        .eq('key', key.replace('fitTrack_', '')) // map 'fitTrack_users' -> 'users'
        .single();
        
      if (!error && data) {
        return data.value as T;
      }
    } catch (err) {
      console.warn('Cloud fetch error, falling back to local', err);
    }
  }

  // Local Storage Fallback
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : localFallback;
};

const saveGeneric = async <T>(key: string, value: T) => {
  // Always save local for cache/offline
  localStorage.setItem(key, JSON.stringify(value));

  // If connected, sync to cloud
  if (supabase) {
    try {
      const dbKey = key.replace('fitTrack_', '');
      await supabase
        .from('app_data')
        .upsert({ key: dbKey, value: value as any });
    } catch (err) {
      console.error('Cloud save error', err);
    }
  }
};

export const StorageService = {
  isCloudConnected: () => !!supabase,

  connectCloud: (url: string, key: string) => {
    localStorage.setItem(KEYS.SUPABASE_CONFIG, JSON.stringify({ url, key }));
    initSupabase();
    // Dispatch event to notify App to reload data
    window.dispatchEvent(new Event('blacksmith_storage_change'));
  },

  disconnectCloud: () => {
    localStorage.removeItem(KEYS.SUPABASE_CONFIG);
    supabase = null;
    // Dispatch event to notify App to reload data
    window.dispatchEvent(new Event('blacksmith_storage_change'));
  },

  getUsers: async (): Promise<User[]> => {
    return getGeneric<User[]>(KEYS.USERS, DEFAULT_USERS);
  },

  saveUsers: async (users: User[]) => {
    await saveGeneric(KEYS.USERS, users);
  },

  getExercises: async (): Promise<Exercise[]> => {
    return getGeneric<Exercise[]>(KEYS.EXERCISES, INITIAL_EXERCISES);
  },

  saveExercises: async (exercises: Exercise[]) => {
    await saveGeneric(KEYS.EXERCISES, exercises);
  },

  getLogs: async (): Promise<WorkoutLog[]> => {
    return getGeneric<WorkoutLog[]>(KEYS.LOGS, []);
  },

  saveLogs: async (logs: WorkoutLog[]) => {
    await saveGeneric(KEYS.LOGS, logs);
  },
  
  exportDataToCSV: (logs: WorkoutLog[], users: User[]) => {
    const headers = ['User', 'Date', 'Body Part', 'Exercise', 'Set', 'Weight (kg/lbs)', 'Reps', 'Notes'];
    
    const rows: string[] = [];
    rows.push(headers.join(','));

    logs.forEach(log => {
      const user = users.find(u => u.id === log.userId)?.name || 'Unknown';
      const date = new Date(log.date).toLocaleDateString();
      
      log.sets.forEach((set, index) => {
        const row = [
          `"${user}"`,
          `"${date}"`,
          `"${log.bodyPart}"`,
          `"${log.exerciseName}"`,
          index + 1,
          set.weight,
          set.reps,
          `"${log.notes || ''}"`
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `blacksmith_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};