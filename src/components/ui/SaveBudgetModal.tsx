import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Save, ClipboardCopy } from "lucide-react";
import { Orcamento } from "@/types/sales.entities";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface SaveBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClienteNome: string;
  defaultClienteId?: number | null;
  defaultTelefone?: number | null;
  defaultVeiculoModelo: string;
  defaultDescontoTotal: number;
  defaultDataValidade?: string | null;
  totalAmount: number;
  existingId?: string | null;
  onSave: (data: {
    cliente_nome: string;
    cliente_id: number | null;
    telefone: number | null;
    veiculo_modelo: string;
    desconto_total: number;
    data_validade: string | null;
    status: Orcamento["status"];
    observacoes: string;
    overwrite: boolean;
    enviar_whatsapp?: boolean;
  }) => void;
}

const getThreeDaysFromNow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

export function SaveBudgetModal({
  isOpen,
  onClose,
  defaultClienteNome,
  defaultClienteId,
  defaultTelefone,
  defaultVeiculoModelo,
  defaultDescontoTotal,
  defaultDataValidade,
  totalAmount,
  existingId,
  onSave,
}: SaveBudgetModalProps) {
  const [clienteNome, setClienteNome] = useState("");
  const [clienteIdStr, setClienteIdStr] = useState("");
  const [telefoneStr, setTelefoneStr] = useState("");
  const [veiculoModelo, setVeiculoModelo] = useState("");
  const [descontoTotal, setDescontoTotal] = useState(0);
  const [status, setStatus] = useState<Orcamento["status"]>("Enviado");
  const [observacoes, setObservacoes] = useState("");
  const [overwrite, setOverwrite] = useState(true);
  const [enviarWhatsapp, setEnviarWhatsapp] = useState(false);

  const dataValidadeFixa = getThreeDaysFromNow();

  useEscapeKey(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setClienteNome(defaultClienteNome || "Consumidor Final");
      setClienteIdStr(defaultClienteId ? String(defaultClienteId) : "");
      setTelefoneStr(defaultTelefone ? String(defaultTelefone) : "");
      setVeiculoModelo(defaultVeiculoModelo || "");
      setDescontoTotal(defaultDescontoTotal || 0);
      setStatus("Enviado");
      setObservacoes("");
      setOverwrite(true);
      setEnviarWhatsapp(false);
    }
  }, [isOpen, defaultClienteNome, defaultClienteId, defaultTelefone, defaultVeiculoModelo, defaultDescontoTotal, defaultDataValidade]);

  if (!isOpen) return null;

  const handleNumericChange = (val: string, setter: (v: string) => void) => {
    // Restringe para aceitar apenas números via regex
    if (/^\d*$/.test(val)) {
      setter(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      cliente_nome: clienteNome,
      cliente_id: clienteIdStr ? parseInt(clienteIdStr, 10) : null,
      telefone: telefoneStr ? parseInt(telefoneStr, 10) : null,
      veiculo_modelo: veiculoModelo,
      desconto_total: descontoTotal,
      data_validade: dataValidadeFixa,
      status,
      observacoes,
      overwrite: existingId ? overwrite : false,
      enviar_whatsapp: enviarWhatsapp,
    });
  };

  const finalTotal = Math.max(0, totalAmount - descontoTotal);

  return (
    <div 
      className="fixed inset-0 z-55 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#0e1626] border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-205"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 p-4 bg-[#0e1626]/50">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ClipboardCopy className="h-5 w-5 text-indigo-400" />
              Salvar Orçamento
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Defina as informações finais para salvar este orçamento.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#16223f] border border-slate-850 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente</label>
              <input
                type="text"
                required
                placeholder="Nome do cliente..."
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">ID Cliente</label>
              <input
                type="text"
                placeholder="Ex: 42..."
                value={clienteIdStr}
                onChange={(e) => handleNumericChange(e.target.value, setClienteIdStr)}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Veículo</label>
              <input
                type="text"
                placeholder="Ex: Fiat Uno 1.0 2012..."
                value={veiculoModelo}
                onChange={(e) => setVeiculoModelo(e.target.value)}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Telefone</label>
              <input
                type="text"
                placeholder="Ex: 11999999999..."
                value={telefoneStr}
                onChange={(e) => handleNumericChange(e.target.value, setTelefoneStr)}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Desconto (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={descontoTotal}
                onChange={(e) => setDescontoTotal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Orcamento["status"])}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px] cursor-pointer"
              >
                <option value="Rascunho">Rascunho</option>
                <option value="Enviado">Enviado</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Recusado">Recusado</option>
                <option value="Convertido">Convertido</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Validade</label>
              <input
                type="date"
                value={dataValidadeFixa}
                disabled
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-400 focus:outline-none opacity-60 pointer-events-none cursor-not-allowed h-[38px]"
              />
            </div>
          </div>

          {existingId && (
            <div className="flex items-center gap-2.5 bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-900/30">
              <input
                id="overwrite-checkbox"
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="h-4 w-4 bg-[#070a13] border-slate-700 rounded text-indigo-550 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="overwrite-checkbox" className="text-xs text-slate-350 font-bold cursor-pointer select-none">
                Atualizar/Sobrescrever orçamento original <span className="text-indigo-400 font-bold font-mono">({existingId})</span>
              </label>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Observações</label>
            <textarea
              placeholder="Alguma observação importante sobre esta venda..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Totals Summary */}
          <div className="bg-[#070a13]/60 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Final</span>
              <span className="text-indigo-400 font-black text-base">R$ {finalTotal.toFixed(2)}</span>
            </div>
            {descontoTotal > 0 && (
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Subtotal: R$ {totalAmount.toFixed(2)}</span>
                <span className="text-emerald-400 font-bold">Desconto: -R$ {descontoTotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-800/60 justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-300 text-xs py-2 rounded-lg cursor-pointer h-[36px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={() => setEnviarWhatsapp(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg flex items-center gap-1.5 cursor-pointer h-[36px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4 shrink-0" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Enviar
            </Button>
            <Button
              type="submit"
              onClick={() => setEnviarWhatsapp(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg flex items-center gap-1.5 cursor-pointer h-[36px]"
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
