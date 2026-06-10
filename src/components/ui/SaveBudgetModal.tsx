import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Save, ClipboardCopy } from "lucide-react";

interface SaveBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClient: string;
  defaultVehicle: string;
  defaultDiscount: number;
  totalAmount: number;
  existingId?: string | null;
  onSave: (data: { client: string; vehicle: string; discount: number; status: string; notes: string; overwrite: boolean }) => void;
}

export function SaveBudgetModal({
  isOpen,
  onClose,
  defaultClient,
  defaultVehicle,
  defaultDiscount,
  totalAmount,
  existingId,
  onSave,
}: SaveBudgetModalProps) {
  const [client, setClient] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState("Em Análise");
  const [notes, setNotes] = useState("");
  const [overwrite, setOverwrite] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setClient(defaultClient || "Consumidor Final");
      setVehicle(defaultVehicle || "");
      setDiscount(defaultDiscount || 0);
      setStatus("Em Análise");
      setNotes("");
      setOverwrite(true);
    }
  }, [isOpen, defaultClient, defaultVehicle, defaultDiscount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      client,
      vehicle,
      discount,
      status,
      notes,
      overwrite: existingId ? overwrite : false,
    });
  };

  const finalTotal = Math.max(0, totalAmount - discount);

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
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente</label>
            <input
              type="text"
              required
              placeholder="Nome do cliente..."
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Veículo</label>
            <input
              type="text"
              placeholder="Ex: Fiat Uno 1.0 2012..."
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Desconto (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px] cursor-pointer"
              >
                <option value="Em Análise">Em Análise</option>
                <option value="Rascunho">Rascunho</option>
                <option value="Aprovado">Aprovado</option>
              </select>
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            {discount > 0 && (
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Subtotal: R$ {totalAmount.toFixed(2)}</span>
                <span className="text-emerald-400 font-bold">Desconto: -R$ {discount.toFixed(2)}</span>
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg flex items-center gap-1.5 cursor-pointer h-[36px]"
            >
              <Save className="h-4 w-4" />
              Confirmar e Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
