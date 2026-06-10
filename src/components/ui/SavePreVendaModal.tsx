import { useState, useEffect } from "react";
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
    tipo_venda: "Balcão" | "Entrega";
    faturada: boolean;
    forma_pagamento: string;
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
  // Configurações e Tipo da Venda
  const [tipoVenda, setTipoVenda] = useState<"Balcão" | "Entrega">("Balcão");

  // Cliente
  const [clienteIdInput, setClienteIdInput] = useState("");
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [clientAddress, setClientAddress] = useState<Endereco | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");

  // Submodal de Busca de Cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [modalSearchText, setModalSearchText] = useState("");

  // Faturamento e Pagamento
  const [formaPagamento, setFormaPagamento] = useState("À Vista");

  // Outros Campos
  const [selectedSeller, setSelectedSeller] = useState<number>(usuarios[0]?.id || 1);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [valorTotalFinal, setValorTotalFinal] = useState(totalAmount);
  const [notes, setNotes] = useState("");

  // Lista de métodos de pagamento de acordo com o canal
  const getFormasPagamento = () => {
    const list: string[] = [];
    if (selectedClient && selectedClient.permite_faturado && !selectedClient.bloqueado_por_atraso) {
      list.push("Faturado");
    }
    list.push("Cartão", "À Vista");
    if (tipoVenda === "Entrega") {
      list.push("Link Pix", "Link Cartão");
    }
    return list;
  };

  // Reset/Carregamento inicial
  useEffect(() => {
    if (isOpen) {
      setTipoVenda("Balcão");
      setClienteIdInput("");
      setSelectedClient(null);
      setClientAddress(null);
      setClientName(defaultClient || "Consumidor Final");
      setClientContact("");
      setNotes("");
      setSelectedSeller(usuarios[0]?.id || 1);
      setIsClientModalOpen(false);
      setModalSearchText("");
      setWhatsappLink("");

      const formas = getFormasPagamento();
      const defaultMethod = formas[0] || "À Vista";
      setFormaPagamento(defaultMethod);
      if (defaultMethod === "À Vista" || defaultMethod === "Link Pix") {
        setValorTotalFinal(Number((totalAmount * 0.95).toFixed(2)));
      } else {
        setValorTotalFinal(totalAmount);
      }
    }
  }, [isOpen, defaultClient, defaultDiscount, totalAmount]);

  // Se mudar o cliente selecionado, gerencia a validade de faturamento e auto check
  useEffect(() => {
    if (selectedClient) {
      setClientName(selectedClient.nome);
      setClientContact(selectedClient.telefone || "");
      setWhatsappLink(selectedClient.telefone || "");
      
      const address = enderecos.find((e) => e.cliente_id === selectedClient.id);
      setClientAddress(address || null);
    } else {
      setClientAddress(null);
      setClientName(defaultClient || "Consumidor Final");
      setWhatsappLink("");
    }
  }, [selectedClient, defaultClient]);

  // Sincroniza métodos de pagamento válidos de acordo com Tipo Venda e Faturamento
  useEffect(() => {
    const formas = getFormasPagamento();
    const defaultMethod = formas[0] || "À Vista";
    setFormaPagamento(defaultMethod);
    if (defaultMethod === "À Vista" || defaultMethod === "Link Pix") {
      setValorTotalFinal(Number((totalAmount * 0.95).toFixed(2)));
    } else {
      setValorTotalFinal(totalAmount);
    }
  }, [selectedClient, tipoVenda, totalAmount]);

  if (!isOpen) return null;

  // Handler para busca direta por ID do Cliente
  const handleClienteIdChange = (idStr: string) => {
    if (/^\d*$/.test(idStr)) {
      setClienteIdInput(idStr);
      if (idStr === "") {
        setSelectedClient(null);
        return;
      }
      const client = clientes.find((c) => c.id === parseInt(idStr, 10));
      if (client) {
        setSelectedClient(client);
      } else {
        setSelectedClient(null);
      }
    }
  };

  // Seleção de cliente pelo Submodal de busca
  const handleSelectClientFromModal = (client: Cliente) => {
    setSelectedClient(client);
    setClienteIdInput(client.id.toString());
    setIsClientModalOpen(false);
  };

  const handleFormaPagamentoChange = (method: string) => {
    setFormaPagamento(method);
    if (method === "À Vista" || method === "Link Pix") {
      setValorTotalFinal(Number((totalAmount * 0.95).toFixed(2)));
    } else {
      setValorTotalFinal(totalAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      client: clientName,
      clientId: selectedClient?.id || null,
      provisionalContact: clientContact,
      sellerId: selectedSeller,
      discount: Math.max(0, totalAmount - valorTotalFinal),
      notes: notes + (whatsappLink ? ` [WhatsApp para Link: ${whatsappLink}]` : ""),
      tipo_venda: tipoVenda,
      faturada: formaPagamento === "Faturado",
      forma_pagamento: formaPagamento,
    });
  };

  const finalTotal = valorTotalFinal;

  // Filtragem de clientes no submodal
  const filteredClientsInModal = clientes.filter((c) => {
    const query = modalSearchText.toLowerCase();
    return (
      c.nome.toLowerCase().includes(query) ||
      c.cpf_cnpj.includes(query) ||
      c.id.toString() === query
    );
  });

  return (
    <div 
      className="fixed inset-0 z-55 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#0e1626] border border-slate-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 p-4 bg-[#0e1626]/50">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ClipboardCopy className="h-5 w-5 text-emerald-450" />
              Emitir Pré-Venda
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Defina o tipo, cliente e condições comerciais para emitir a pré-venda.</p>
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
          
          {/* Top Row: Tipo de Retirada/Entrega (Tabbar) & Vendedor */}
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-between border-b border-slate-800/50 pb-4">
            {/* Tabbar for tipoVenda */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tipo de Atendimento</span>
              <div className="flex bg-[#070a13] p-1 rounded-lg border border-slate-800 w-fit">
                <button
                  type="button"
                  onClick={() => setTipoVenda("Balcão")}
                  className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    tipoVenda === "Balcão"
                      ? "bg-emerald-650 text-white shadow-md shadow-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#16223f]/30"
                  }`}
                >
                  Balcão
                </button>
                <button
                  type="button"
                  onClick={() => setTipoVenda("Entrega")}
                  className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    tipoVenda === "Entrega"
                      ? "bg-emerald-650 text-white shadow-md shadow-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#16223f]/30"
                  }`}
                >
                  Entrega
                </button>
              </div>
            </div>

            {/* Seller dropdown */}
            <div className="flex flex-col gap-1.5 w-full sm:w-64">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vendedor Responsável</span>
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors h-[36px] cursor-pointer text-xs"
              >
                {usuarios.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nome} ({user.cargo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Identificação de Cliente */}
          <div className="space-y-2">
            <div className="flex gap-3">
              
              {/* Digitar código diretamente */}
              <div className="space-y-1 w-[90px] shrink-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Código</label>
                <input
                  type="text"
                  placeholder="ID"
                  value={clienteIdInput}
                  onChange={(e) => handleClienteIdChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors h-[38px] text-right font-mono font-bold"
                />
              </div>

              {/* Nome do Cliente */}
              <div className="space-y-1 flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Cliente / Razão Social</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly={!!selectedClient}
                    placeholder="Nome do cliente provisório ou use a busca..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`flex-1 px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors h-[38px] ${
                      selectedClient ? "opacity-75 font-semibold" : ""
                    }`}
                  />
                  
                  {/* Buscar cliente abrindo modal de busca */}
                  <Button
                    type="button"
                    onClick={() => setIsClientModalOpen(true)}
                    className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold h-[38px] px-3.5 flex items-center justify-center gap-1 rounded-lg cursor-pointer"
                    title="Buscar Cliente"
                  >
                    <Search className="h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            {/* Informações detalhadas do cliente selecionado */}
            {selectedClient && (
              <div className="bg-[#070a13]/55 border border-slate-800 rounded-lg p-3.5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dados Cadastrais */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-emerald-450 font-bold text-[10px] uppercase tracking-wider">
                      <User className="h-3.5 w-3.5" />
                      Dados Cadastrais
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-555 block text-[9px] uppercase">CPF/CNPJ</span>
                        <span className="text-slate-300 font-mono font-semibold">{selectedClient.cpf_cnpj}</span>
                      </div>
                      <div>
                        <span className="text-slate-300 block text-[9px] uppercase">Telefone</span>
                        <span className="text-slate-300">{selectedClient.telefone || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Situação Financeira (Simplificada) */}
                  <div className="space-y-1.5 border-l border-slate-800/60 pl-0 md:pl-4 flex flex-col justify-center">
                    <span className="text-slate-300 block text-[9px] uppercase font-bold tracking-wider">Situação Financeira</span>
                    {selectedClient.bloqueado_por_atraso ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-450 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/35 uppercase w-fit">
                        <ShieldAlert className="h-3.5 w-3.5 mr-0.5" /> Bloqueado para Compra
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-450 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/35 uppercase w-fit">
                        <Check className="h-3.5 w-3.5 mr-0.5" /> Liberado para Compra
                      </span>
                    )}
                  </div>
                </div>

                {/* Endereço de Entrega */}
                {clientAddress && (
                  <div className="text-[11px] pt-2 border-t border-slate-800/50">
                    <span className="text-slate-300 block text-[9px] uppercase font-bold tracking-wider">Endereço de Entrega</span>
                    <span className="text-slate-200 font-medium block mt-0.5">
                      {clientAddress.rua}, {clientAddress.numero} - {clientAddress.bairro}
                    </span>
                    <span className="text-slate-400">
                      {clientAddress.cidade}/{clientAddress.estado} - CEP: {clientAddress.cep}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Condições Financeiras & WhatsApp side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Método de Pagamento</label>
              <select
                value={formaPagamento}
                onChange={(e) => handleFormaPagamentoChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors h-[38px] cursor-pointer"
              >
                {getFormasPagamento().map((forma) => (
                  <option key={forma} value={forma}>
                    {forma}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">WhatsApp (Link de Pagamento)</label>
              <input
                type="text"
                placeholder="Ex: 11999999999..."
                value={whatsappLink}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setWhatsappLink(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors h-[38px]"
              />
            </div>
          </div>

          {/* Observações - Full Width with default height */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Observações de Retirada / Entrega</label>
            <textarea
              placeholder="Ex: Cliente aguarda aprovação de orçamento, observações de rota de frete..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none text-xs"
            />
          </div>

          {/* Totals Summary */}
          <div className="bg-[#070a13]/60 p-4 rounded-lg border border-slate-800 flex justify-between items-center h-[76px]">
            <div className="space-y-1">
              {(formaPagamento === "À Vista" || formaPagamento === "Link Pix") ? (
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Valor da Nota (À Vista - Editável)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={valorTotalFinal}
                    onChange={(e) => setValorTotalFinal(Number(e.target.value))}
                    className="w-40 px-2.5 py-1 bg-[#070a13] border border-slate-700 rounded text-sm font-bold text-slate-200 focus:outline-none focus:border-emerald-500 h-[32px]"
                  />
                </div>
              ) : (
                <div>
                  <span className="text-slate-300 block text-[9px] uppercase font-bold tracking-wider">Valor da Nota</span>
                  <span className="text-slate-300 font-bold text-sm">R$ {totalAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-slate-300 block text-[9px] uppercase font-bold tracking-wider">Total Líquido</span>
              <span className="text-emerald-455 font-black text-3xl">
                R$ {valorTotalFinal.toFixed(2)}
              </span>
              {totalAmount - valorTotalFinal > 0 && (
                <span className="text-[10px] text-emerald-500 block font-bold mt-0.5">
                  Desconto: -R$ {(totalAmount - valorTotalFinal).toFixed(2)} ({((totalAmount - valorTotalFinal) / totalAmount * 100).toFixed(1)}%)
                </span>
              )}
            </div>
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
              disabled={tipoVenda === "Entrega" && !selectedClient}
              className="bg-gradient-to-r from-emerald-600 to-emerald-750 hover:from-emerald-550 hover:to-emerald-700 text-white text-xs font-bold py-2 rounded-lg flex items-center gap-1.5 cursor-pointer h-[36px] shadow-lg shadow-emerald-650/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <ClipboardCopy className="h-4 w-4" />
              Emitir Pré-Venda
            </Button>
          </div>
        </form>

        {/* 3 - Submodal de Busca de Cliente */}
        {isClientModalOpen && (
          <div className="absolute inset-0 z-65 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1626] border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85%] animate-in fade-in zoom-in duration-150">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-slate-800 p-4 bg-[#0e1626]/50">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Buscar Cliente Cadastrado</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Filtre a pesquisa por Nome, ID ou CPF/CNPJ.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="p-1 hover:bg-[#16223f] border border-slate-800 rounded-lg text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Search Input */}
              <div className="p-3 border-b border-slate-800 bg-[#0e1626]/20">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-550" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={modalSearchText}
                    onChange={(e) => setModalSearchText(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 h-[34px]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Modal Clients List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-850/50 max-h-[300px]">
                {filteredClientsInModal.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => handleSelectClientFromModal(client)}
                    className="p-3 hover:bg-[#16223f]/50 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-200">
                        <span className="text-[10px] font-mono text-emerald-450 font-bold mr-1">#{client.id}</span>
                        {client.nome}
                      </div>
                      <div className="text-[10px] text-slate-550 mt-0.5">
                        {client.tipo_pessoa === "Física" ? "CPF: " : "CNPJ: "} {client.cpf_cnpj}
                      </div>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      {client.bloqueado_por_atraso ? (
                        <span className="text-[8px] bg-red-950/60 text-red-400 border border-red-900/30 px-1.5 py-0.5 rounded font-extrabold uppercase">Bloqueado</span>
                      ) : (
                        <span className="text-[8px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/30 px-1.5 py-0.5 rounded font-extrabold uppercase">Liberado</span>
                      )}
                    </div>
                  </div>
                ))}
                {filteredClientsInModal.length === 0 && (
                  <div className="p-8 text-center text-slate-555 italic">Nenhum cliente correspondente encontrado.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
