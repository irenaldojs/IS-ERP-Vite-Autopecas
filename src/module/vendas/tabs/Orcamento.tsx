import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Plus } from "lucide-react";

type Product = { code: string; name: string; brand: string; price: number; stock?: number };
type Item = { id: string; code: string; name: string; brand: string; qty: number; price: number };

type Props = {
  clientName: string;
  setClientName: (v: string) => void;
  vehicleName: string;
  setVehicleName: (v: string) => void;
  productSearchQuery: string;
  setProductSearchQuery: (v: string) => void;
  showProductSuggestions: boolean;
  setShowProductSuggestions: (v: boolean) => void;
  filteredCatalog: Product[];
  activeSaleItems: Item[];
  setActiveSaleItems: (fn: ((prev: Item[]) => Item[]) | Item[]) => void;
  subtotalSale: number;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  totalSale: number;
  handleSaveBudget: () => void;
  handleSavePreSale: () => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
};

export default function Orcamento(props: Props) {
  const {
    clientName,
    setClientName,
    vehicleName,
    setVehicleName,
    productSearchQuery,
    setProductSearchQuery,
    showProductSuggestions,
    setShowProductSuggestions,
    filteredCatalog,
    activeSaleItems,
    setActiveSaleItems,
    subtotalSale,
    discountValue,
    setDiscountValue,
    totalSale,
    handleSaveBudget,
    handleSavePreSale,
    showToast,
  } = props;

  return (
    <div className="flex-1 w-full h-full flex flex-col lg:flex-row gap-4 min-h-0 bg-[#070a13]">
      {/* Main List Entry Area */}
      <div className="flex-grow border border-slate-850 rounded-xl bg-[#0e1626]/10 flex flex-col min-h-0">
        {/* Header: Client & Vehicle Inputs */}
        <div className="p-4 border-b border-slate-850/60 bg-[#0e1626]/30 grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 rounded-t-xl">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome do Cliente</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente (ou Consumidor Final)"
              className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modelo do Veículo</label>
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder="Ex: Honda Civic 2018 2.0"
              className="w-full px-3 py-1.5 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Product Autocomplete Search Bar */}
        <div className="p-3 border-b border-slate-850/60 bg-[#0e1626]/20 relative shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={productSearchQuery}
              onChange={(e) => {
                setProductSearchQuery(e.target.value);
                setShowProductSuggestions(true);
              }}
              onFocus={() => setShowProductSuggestions(true)}
              placeholder="Pesquisar código, peça ou marca de veículo no catálogo..."
              className="w-full pl-9 pr-4 py-2 bg-[#070a13] border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Suggestions Overlay */}
          {showProductSuggestions && productSearchQuery.trim() !== "" && (
            <div className="absolute left-3 right-3 mt-1.5 max-h-48 overflow-y-auto bg-[#070a13] border border-slate-800 rounded-xl shadow-2xl z-50 divide-y divide-slate-850/60">
              {filteredCatalog.length > 0 ? (
                filteredCatalog.map((prod) => (
                  <button
                    key={prod.code}
                    type="button"
                    onClick={() => {
                      setActiveSaleItems((prev: Item[]) => {
                        const existing = prev.find((item) => item.code === prod.code);
                        if (existing) {
                          return prev.map((item) => (item.code === prod.code ? { ...item, qty: item.qty + 1 } : item));
                        } else {
                          return [
                            ...prev,
                            {
                              id: prod.code,
                              code: prod.code,
                              name: prod.name,
                              brand: prod.brand,
                              qty: 1,
                              price: prod.price,
                            },
                          ];
                        }
                      });
                      setProductSearchQuery("");
                      setShowProductSuggestions(false);
                      showToast(`${prod.name} adicionado!`);
                    }}
                    className="w-full px-4 py-2.5 hover:bg-[#16223f]/30 flex justify-between items-center text-left cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">{prod.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Código: {prod.code} • Marca: {prod.brand}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold text-slate-450">Estoque: {prod.stock} UN</span>
                      <span className="text-xs font-black text-indigo-400">R$ {prod.price.toFixed(2)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-xs text-slate-500">Nenhuma autopeça encontrada.</div>
              )}
            </div>
          )}
        </div>

        {/* Cart Items Table */}
        <div className="flex-grow overflow-y-auto min-h-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/60 text-slate-500 font-semibold bg-[#0e1626]/10">
                <th className="p-2.5 pl-4">Código</th>
                <th className="p-2.5">Descrição da Peça</th>
                <th className="p-2.5">Marca</th>
                <th className="p-2.5 text-center w-24">Qtd</th>
                <th className="p-2.5 text-right w-28">Unitário</th>
                <th className="p-2.5 text-right pr-4 w-28">Total</th>
                <th className="p-2.5 text-center w-12">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50 text-slate-355">
              {activeSaleItems.map((item) => (
                <tr key={item.code} className="hover:bg-[#16223f]/10">
                  <td className="p-2.5 pl-4 font-mono text-slate-450">{item.code}</td>
                  <td className="p-2.5 font-semibold text-slate-200">{item.name}</td>
                  <td className="p-2.5 text-slate-400">{item.brand}</td>
                  <td className="p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setActiveSaleItems((prev: Item[]) => prev.map((i) => (i.code === item.code ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
                        }}
                        className="h-5 w-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 hover:text-white cursor-pointer active:scale-92 transition-all"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-200 text-xs w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => {
                          setActiveSaleItems((prev: Item[]) => prev.map((i) => (i.code === item.code ? { ...i, qty: i.qty + 1 } : i)));
                        }}
                        className="h-5 w-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 hover:text-white cursor-pointer active:scale-92 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[10px] text-slate-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setActiveSaleItems((prev: Item[]) => prev.map((i) => (i.code === item.code ? { ...i, price: val } : i)));
                        }}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 text-right w-16 text-slate-200 font-semibold focus:outline-none transition-colors"
                      />
                    </div>
                  </td>
                  <td className="p-2.5 text-right pr-4 font-bold text-slate-200">R$ {(item.price * item.qty).toFixed(2)}</td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => {
                        setActiveSaleItems((prev: Item[]) => prev.filter((i) => i.code !== item.code));
                        showToast(`${item.name} removido!`, "info");
                      }}
                      className="p-1 hover:bg-[#16223f] border border-transparent hover:border-slate-800 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Remover Item"
                    >
                      <Plus className="h-3.5 w-3.5 rotate-45" />
                    </button>
                  </td>
                </tr>
              ))}
              {activeSaleItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingCart className="h-8 w-8 text-slate-700" />
                      <span className="text-xs font-semibold">Tabela limpa. Insira itens usando a busca de produtos acima.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Totals Summary sidebar */}
      <div className="w-full lg:w-72 border border-slate-850 rounded-xl bg-[#0e1626]/40 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850/80 pb-2">Resumo da Venda</h4>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-455">Subtotal:</span>
              <span className="text-slate-250 font-semibold">R$ {subtotalSale.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-slate-455">Desconto (R$):</span>
              <input
                type="number"
                min="0"
                max={subtotalSale}
                value={discountValue}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setDiscountValue(Math.min(subtotalSale, val));
                }}
                className="bg-[#070a13] border border-slate-800 rounded px-2 py-0.5 w-20 text-right text-xs text-emerald-450 font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="border-t border-slate-800/80 my-2 pt-2 flex justify-between text-sm">
              <span className="font-bold text-slate-300">Total Líquido:</span>
              <span className="font-extrabold text-indigo-400">R$ {totalSale.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <Button onClick={handleSaveBudget} className="w-full bg-[#16223f]/50 hover:bg-[#16223f] border border-slate-800 text-slate-200 text-xs font-bold py-2.5 h-auto rounded-lg cursor-pointer transition-colors uppercase tracking-wider">Salvar Orçamento</Button>
          <Button onClick={handleSavePreSale} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-550 hover:to-teal-550 text-white text-xs font-bold py-2.5 h-auto rounded-lg shadow-lg shadow-emerald-600/10 cursor-pointer transition-all uppercase tracking-wider">Vender (Pré-Venda)</Button>
        </div>
      </div>
    </div>
  );
}
