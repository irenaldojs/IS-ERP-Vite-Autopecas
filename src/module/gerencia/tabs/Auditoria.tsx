import { useState, useEffect, useMemo } from "react";
import { Button } from "@fluentui/react-components";
import { 
  RefreshCw, 
  Trash2, 
  Search, 
  AlertTriangle, 
  Database, 
  Calendar, 
  Terminal,
  ChevronRight,
  Info
} from "lucide-react";
import { LogService, LogEntry } from "@/services/log.service";

export default function Auditoria() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [filterText, setFilterText] = useState("");
  const [contextFilter, setContextFilter] = useState("all");

  const carregarLogs = async () => {
    setLoading(true);
    try {
      const data = await LogService.listarLogs();
      setLogs(data);
      if (data.length > 0 && !selectedLog) {
        setSelectedLog(data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const limparLogs = async () => {
    if (!window.confirm("Deseja realmente limpar todos os logs de erro?")) return;
    try {
      await LogService.limparLogs();
      setLogs([]);
      setSelectedLog(null);
    } catch (error) {
      console.error("Erro ao limpar logs:", error);
    }
  };

  useEffect(() => {
    carregarLogs();
  }, []);

  // Obter contextos únicos para o filtro
  const uniqueContexts = useMemo(() => {
    const contexts = new Set<string>();
    logs.forEach(log => {
      if (log.contexto) contexts.add(log.contexto);
    });
    return Array.from(contexts);
  }, [logs]);

  // Filtrar logs com base no texto e no contexto
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesText = 
        log.erro.toLowerCase().includes(filterText.toLowerCase()) ||
        (log.query && log.query.toLowerCase().includes(filterText.toLowerCase())) ||
        log.contexto.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesContext = contextFilter === "all" || log.contexto === contextFilter;
      
      return matchesText && matchesContext;
    });
  }, [logs, filterText, contextFilter]);

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("pt-BR");
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex-grow flex flex-col space-y-4 h-full min-h-0 text-xs">
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0e1626]/20 border border-slate-200 dark:border-slate-850 p-4 rounded-xl shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Auditoria de Consultas ao Banco</h3>
            <p className="text-[10px] text-slate-500">Histórico de erros e exceções geradas em operações de banco de dados</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            icon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />} 
            onClick={carregarLogs} 
            disabled={loading}
            appearance="secondary"
          >
            Atualizar
          </Button>
          <Button 
            icon={<Trash2 className="h-4 w-4" />} 
            onClick={limparLogs}
            disabled={logs.length === 0}
            appearance="outline"
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
          >
            Limpar Logs
          </Button>
        </div>
      </div>

      {/* Main Grid split into List and details */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0 overflow-hidden">
        {/* Left column: Logs List */}
        <div className="lg:col-span-3 flex flex-col border border-slate-200 dark:border-slate-850 rounded-xl bg-white dark:bg-[#0e1626]/20 p-4 min-h-0 shadow-sm dark:shadow-none">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por erro, query ou contexto..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none"
              />
            </div>
            <select
              value={contextFilter}
              onChange={(e) => setContextFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 shadow-sm dark:shadow-none cursor-pointer"
            >
              <option value="all">Todos os Contextos</option>
              {uniqueContexts.map(ctx => (
                <option key={ctx} value={ctx}>{ctx}</option>
              ))}
            </select>
          </div>

          {/* Logs Table / List Container */}
          <div className="flex-1 overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                <Info className="h-8 w-8 text-slate-400" />
                <p className="font-semibold text-xs">Nenhum log de erro registrado</p>
                <p className="text-[10px] text-slate-400 text-center px-4">Consultas normais rodando perfeitamente. Erros de banco aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredLogs.map((log) => {
                  const isSelected = selectedLog?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`group p-3 border rounded-xl flex items-start justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900/20 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-550/5' 
                          : 'border-slate-150 dark:border-slate-850/60 bg-white dark:bg-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 p-1 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center flex-wrap gap-1.5 mb-1">
                            <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-850 text-slate-650 dark:text-slate-350 text-[9px] font-bold">
                              {log.contexto}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                            {log.erro}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-400 mt-1 transition-transform group-hover:translate-x-0.5 ${isSelected ? 'translate-x-0.5' : ''}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Log Details Panel */}
        <div className="lg:col-span-2 flex flex-col border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-[#0e1626]/20 p-4 min-h-0 shadow-sm dark:shadow-none">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-850/80 pb-2 mb-4">
            Detalhes do Erro
          </h4>

          {selectedLog ? (
            <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto pr-1">
              {/* Context and Timestamp Card */}
              <div className="bg-white dark:bg-[#070a13] border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contexto</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {selectedLog.contexto}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data/Hora</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formatTimestamp(selectedLog.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-2 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nível</span>
                  <span className="text-[10px] font-extrabold uppercase bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-150 dark:border-red-900/35 px-2.5 py-0.5 rounded-full">
                    {selectedLog.nivel}
                  </span>
                </div>
              </div>

              {/* Error String section */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" /> Mensagem de Erro
                </label>
                <div className="p-3.5 bg-red-50/30 dark:bg-red-950/10 border border-red-100 dark:border-red-900/25 rounded-xl text-slate-850 dark:text-red-300 font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap select-all">
                  {selectedLog.erro}
                </div>
              </div>

              {/* SQL Query section */}
              {selectedLog.query && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Terminal className="h-3 w-3 text-indigo-400" /> Query Relacionada
                  </label>
                  <div className="p-3.5 bg-slate-900 text-slate-300 border border-slate-950 rounded-xl font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap select-all overflow-x-auto">
                    {selectedLog.query}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center py-10">
              <Database className="h-10 w-10 text-slate-350 dark:text-slate-800 mb-2" />
              <p className="font-semibold text-xs">Nenhum log selecionado</p>
              <p className="text-[10px] mt-1 text-slate-500">Selecione um log na lista para inspecionar os detalhes técnicos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
