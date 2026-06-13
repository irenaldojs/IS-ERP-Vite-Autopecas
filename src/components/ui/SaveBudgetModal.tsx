import React, { useState, useEffect } from "react";
import { Button } from "@fluentui/react-components";
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
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
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
      className="fixed inset-0 z-55 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--colorNeutralStroke1)] p-4 bg-[var(--colorNeutralBackground2)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--colorNeutralForeground1)] flex items-center gap-2">
              <ClipboardCopy className="h-5 w-5 text-[var(--colorBrandStroke1)]" />
              Salvar Orçamento
            </h3>
            <p className="text-xs text-[var(--colorNeutralForeground3)] mt-0.5 font-sans">Defina as informações finais para salvar este orçamento.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--colorNeutralBackground3Hover)] border border-[var(--colorNeutralStroke1)] rounded text-[var(--colorNeutralForeground2)] hover:text-[var(--colorNeutralForeground1)] transition-all cursor-pointer focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Cliente</label>
              <input
                type="text"
                required
                placeholder="Nome do cliente..."
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[38px]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">ID Cliente</label>
              <input
                type="text"
                placeholder="Ex: 42..."
                value={clienteIdStr}
                onChange={(e) => handleNumericChange(e.target.value, setClienteIdStr)}
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[38px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Veículo</label>
              <input
                type="text"
                placeholder="Ex: Fiat Uno 1.0 2012..."
                value={veiculoModelo}
                onChange={(e) => setVeiculoModelo(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[38px]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Telefone</label>
              <input
                type="text"
                placeholder="Ex: 11999999999..."
                value={telefoneStr}
                onChange={(e) => handleNumericChange(e.target.value, setTelefoneStr)}
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[38px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Desconto (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={descontoTotal}
                onChange={(e) => setDescontoTotal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors h-[38px]"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Status</label>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-all h-[38px] flex items-center justify-between cursor-pointer text-xs"
              >
                <span>{status}</span>
                <span className="text-[var(--colorNeutralForeground3)] font-sans">▼</span>
              </button>

              {isStatusDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                  <div className="absolute top-[58px] left-0 w-full bg-[var(--colorNeutralBackground3)] border border-[var(--colorNeutralStroke1)] rounded shadow-2xl z-20 py-1 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                    {(["Rascunho", "Enviado", "Aprovado", "Recusado", "Convertido"] as Orcamento["status"][]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatus(opt);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[var(--colorSubtleBackgroundHover)] hover:text-[var(--colorNeutralForeground1)] ${
                          status === opt ? "bg-[var(--colorSubtleBackgroundSelected)] text-[var(--colorNeutralForeground1Selected)] font-bold" : "text-[var(--colorNeutralForeground2)]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Validade</label>
              <input
                type="date"
                value={dataValidadeFixa}
                disabled
                className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground3)] focus:outline-none opacity-60 pointer-events-none cursor-not-allowed h-[38px]"
              />
            </div>
          </div>

          {existingId && (
            <div className="flex items-center gap-2.5 bg-[var(--colorNeutralBackground4Hover)] p-2.5 rounded border border-[var(--colorNeutralStroke1)]">
              <input
                id="overwrite-checkbox"
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="h-4 w-4 bg-[var(--colorNeutralBackground1)] border-[var(--colorNeutralStroke1)] rounded text-[var(--colorBrandBackground)] focus:ring-[var(--colorBrandBackground)] cursor-pointer"
              />
              <label htmlFor="overwrite-checkbox" className="text-xs text-[var(--colorNeutralForeground2)] font-bold cursor-pointer select-none">
                Atualizar/Sobrescrever orçamento original <span className="text-[var(--colorBrandStroke1)] font-bold font-mono">({existingId})</span>
              </label>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--colorNeutralForeground3)]">Observações</label>
            <textarea
              placeholder="Alguma observação importante sobre esta venda..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--colorNeutralBackground1)] border border-[var(--colorNeutralStroke1)] rounded text-xs text-[var(--colorNeutralForeground1)] focus:outline-none focus:border-[var(--colorBrandStroke1)] transition-colors resize-none"
            />
          </div>

          {/* Totals Summary */}
          <div className="bg-[var(--colorNeutralBackground1)] p-3 rounded border border-[var(--colorNeutralStroke1)] flex justify-between items-center text-xs">
            <div>
              <span className="text-[var(--colorNeutralForeground3)] block text-[10px] uppercase font-bold">Total Final</span>
              <span className="text-[var(--colorBrandStroke1)] font-black text-base">R$ {finalTotal.toFixed(2)}</span>
            </div>
            {descontoTotal > 0 && (
              <div className="text-right">
                <span className="text-[var(--colorNeutralForeground3)] block text-[10px] uppercase font-bold">Subtotal: R$ {totalAmount.toFixed(2)}</span>
                <span className="text-[var(--colorPaletteGreenForeground1)] font-bold">Desconto: -R$ {descontoTotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-2 pt-2 border-t border-[var(--colorNeutralStroke1)] justify-end">
            <Button
              type="button"
              onClick={onClose}
              style={{ height: "36px" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={() => setEnviarWhatsapp(true)}
              style={{ height: "36px", color: "var(--colorPaletteGreenForeground1)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-4 w-4 shrink-0 mr-1 inline-block align-middle" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
              </svg>
              Enviar WhatsApp
            </Button>
            <Button
              type="submit"
              onClick={() => setEnviarWhatsapp(false)}
              appearance="primary"
              style={{ height: "36px" }}
            >
              <Save className="h-4 w-4 mr-1 inline-block align-middle" />
              Salvar Orçamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
