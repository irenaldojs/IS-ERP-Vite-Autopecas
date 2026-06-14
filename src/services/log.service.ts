import { invoke } from '@tauri-apps/api/core';

export interface LogEntry {
  id?: number;
  timestamp: string;
  nivel: string;
  contexto: string;
  query?: string;
  erro: string;
}

export const LogService = {
  async listarLogs(): Promise<LogEntry[]> {
    return await invoke<LogEntry[]>('listar_logs');
  },

  async limparLogs(): Promise<void> {
    return await invoke<void>('limpar_logs');
  }
};
