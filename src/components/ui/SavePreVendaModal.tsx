import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ClipboardCopy, Search, User, CreditCard, ShieldAlert, Check } from "lucide-react";
import { Cliente } from "@/types/customers.entities";
import { Endereco } from "@/types/infrastructure.entities";
import { clientes, enderecos, usuarios } from "../../../mocks/products.mock";

interface SavePreVendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClient: string;
  defaultDiscount: number;
  totalAmount: number;
  onSave: (data: {
    client: string;
    clientId?: number | null;
    provisionalContact?: string;
    sellerId: number;
    discount: number;
    notes: string;
  }) => void;
}

export function SavePreVendaModal({
  isOpen,
  onClose,
  defaultClient,
  defaultDiscount,
  totalAmount,
  onSave,
}: SavePreVendaModalProps) {
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [clientAddress, setClientAddress] = useState<Endereco | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<number>(usuarios[0]?.id || 1);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setClientSearch(defaultClient || "");
      setSelectedClient(null);
      setClientAddress(null);
      setClientName(defaultClient || "Consumidor Final");
      setClientContact("");
      setDiscount(defaultDiscount || 0);
      setNotes("");
      setSelectedSeller(usuarios[0]?.id || 1);
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }, [isOpen, defaultClient, defaultDiscount]);

  // Handle outside clicks to close suggestion box
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!isOpen) return null;

  // Filter clients based on search input
  const filteredClients = clientes.filter((c) => {
    const query = clientSearch.toLowerCase();
    return c.nome.toLowerCase().includes(query) || c.cpf_cnpj.includes(query);
  });

  const handleSelectClient = (client: Cliente) => {
    setSelectedClient(client);
    setClientName(client.nome);
    setClientSearch(client.nome);
    setClientContact(client.telefone || "");
    
    // Find address
    const address = enderecos.find((e) => e.cliente_id === client.id);
    setClientAddress(address || null);

    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredClients.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredClients.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredClients.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredClients.length) {
        handleSelectClient(filteredClients[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      client: clientName,
      clientId: selectedClient?.id || null,
      provisionalContact: clientContact,
      sellerId: selectedSeller,
      discount,
      notes,
    });
  };

  const finalTotal = Math.max(0, totalAmount - discount);

  return (
    <div 
      className="fixed inset-0 z-55 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#0e1626] border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 p-4 bg-[#0e1626]/50">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ClipboardCopy className="h-5 w-5 text-indigo-400" />
              Emitir Pré-Venda
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Vincule um cliente cadastrado ou informe dados de balcão.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#16223f] border border-slate-850 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Autocomplete Client Search */}
          <div className="space-y-1 relative" ref={suggestionsRef}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Buscar Cliente (Nome ou CPF/CNPJ)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={clientSearch}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setClientName(e.target.value);
                  if (selectedClient) {
                    setSelectedClient(null);
                    setClientAddress(null);
                  }
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Digite para buscar ou deixe provisório..."
                className="w-full pl-9 pr-4 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
              />
            </div>

            {/* Suggestions list */}
            {showSuggestions && clientSearch.trim() !== "" && (
              <div className="absolute z-60 w-full mt-1 bg-[#0b111e] border border-slate-800 rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-850/50">
                {filteredClients.map((client, idx) => (
                  <div
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className={`p-2.5 cursor-pointer flex justify-between items-center transition-colors ${
                      idx === activeIndex
                        ? "bg-indigo-600/30 text-white"
                        : "hover:bg-[#16223f]/50 text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{client.nome}</div>
                      <div className="text-[10px] text-slate-500">
                        {client.tipo_pessoa === "Física" ? "CPF: " : "CNPJ: "}
                        {client.cpf_cnpj}
                      </div>
                    </div>
                    {client.bloqueado_por_atraso && (
                      <span className="text-[9px] bg-red-950 text-red-400 border border-red-900/40 px-2 py-0.5 rounded font-bold">
                        Bloqueado
                      </span>
                    )}
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="p-3 text-center text-slate-500">Nenhum cliente cadastrado encontrado</div>
                )}
              </div>
            )}
          </div>

          {/* Client Financial / Credit Status & Address Detail */}
          {selectedClient && (
            <div className="bg-[#070a13]/55 border border-slate-800 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px] border-b border-slate-800 pb-1">
                  <User className="h-3.5 w-3.5" />
                  Dados do Cliente
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Nome / Razão Social</span>
                  <span className="text-slate-200 font-semibold">{selectedClient.nome}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">{selectedClient.tipo_pessoa === "Física" ? "CPF" : "CNPJ"}</span>
                    <span className="text-slate-200 font-mono">{selectedClient.cpf_cnpj}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Telefone</span>
                    <span className="text-slate-200">{selectedClient.telefone || "-"}</span>
                  </div>
                </div>
                {clientAddress && (
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Endereço de Entrega</span>
                    <span className="text-slate-300 text-[10px] block">
                      {clientAddress.rua}, {clientAddress.numero} - {clientAddress.bairro}
                    </span>
                    <span className="text-slate-400 text-[9px]">
                      {clientAddress.cidade}/{clientAddress.estado} - CEP: {clientAddress.cep}
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Status */}
              <div className="space-y-2 border-l border-slate-800/60 pl-0 md:pl-4">
                <div className="flex items-center justify-between text-indigo-400 font-bold text-[11px] border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    Análise de Crédito
                  </span>
                  {selectedClient.bloqueado_por_atraso ? (
                    <span className="flex items-center gap-1 text-[9px] font-extrabold text-rose-400 bg-rose-950/45 px-1.5 py-0.5 rounded border border-rose-900/40 uppercase">
                      <ShieldAlert className="h-3 w-3" /> Bloqueado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-950/45 px-1.5 py-0.5 rounded border border-emerald-900/40 uppercase">
                      <Check className="h-3 w-3" /> Liberado
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Permite Faturado</span>
                    <span className={`font-bold ${selectedClient.permite_faturado ? "text-emerald-400" : "text-slate-400"}`}>
                      {selectedClient.permite_faturado ? "Sim" : "Não"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Limite de Crédito</span>
                    <span className="text-slate-200 font-bold font-mono">R$ {selectedClient.limite_credito.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Saldo Utilizado</span>
                    <span className="text-rose-400 font-bold font-mono">R$ {selectedClient.saldo_utilizado.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Saldo Disponível</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      R$ {Math.max(0, selectedClient.limite_credito - selectedClient.saldo_utilizado).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback Client Details (Provisional) */}
          {!selectedClient && (
            <div className="bg-slate-900/20 border border-slate-800/70 rounded-lg p-3 space-y-3">
              <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800/40">
                Dados do Consumidor Balcão / Provisório
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Nome Provisório</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[34px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Contato (Telefone/Email)</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 99999-9999..."
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[34px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vendedor, Desconto & Observações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Vendedor Responsável</label>
                <select
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px] cursor-pointer"
                >
                  {usuarios.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome} ({user.cargo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Desconto Especial (R$)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-[38px]"
                />
              </div>
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Observações Operacionais / Logística</label>
              <textarea
                placeholder="Ex: Cliente vai confirmar com o mecânico antes de fechar, ou observações sobre retirada..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full flex-grow px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-[#070a13]/60 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Líquido da Pré-Venda</span>
              <span className="text-indigo-400 font-black text-base">R$ {finalTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Subtotal: R$ {totalAmount.toFixed(2)}</span>
                <span className="text-emerald-400 font-bold">Desconto Concedido: -R$ {discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Blocked Alert */}
          {selectedClient?.bloqueado_por_atraso && (
            <div className="flex gap-2 p-2.5 rounded-lg border border-red-950 bg-red-950/20 text-red-400 items-start">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Atenção:</strong> Este cliente possui parcelas vencidas em atraso e está bloqueado para emissão a prazo (Faturado). As formas de pagamento permitidas no checkout serão apenas à vista.
              </div>
            </div>
          )}

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
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-550 hover:to-teal-550 text-white text-xs font-bold py-2 rounded-lg flex items-center gap-1.5 cursor-pointer h-[36px] shadow-lg shadow-emerald-650/10"
            >
              <ClipboardCopy className="h-4 w-4" />
              Emitir Pré-Venda
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
