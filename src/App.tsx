import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center space-y-6">
        {/* Header / Brand */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            IS-ERP Autopeças
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Painel de Controle Desktop (Tauri + React + Tailwind v4)
          </p>
        </div>

        {/* Logos Row */}
        <div className="flex items-center justify-center gap-6 py-2">
          <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src="/vite.svg" className="h-10 w-10" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank" className="hover:scale-110 transition-transform">
            <img src="/tauri.svg" className="h-10 w-10" alt="Tauri logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={reactLogo} className="h-10 w-10 animate-[spin_20s_linear_infinite]" alt="React logo" />
          </a>
        </div>

        {/* Welcome Section */}
        <div className="w-full space-y-4">
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
          >
            <input
              id="greet-input"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:border-transparent text-sm transition-all"
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Digite um nome para saudar o backend..."
              value={name}
            />
            <Button type="submit" variant="default" className="w-full font-semibold shadow-md cursor-pointer bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200">
              Saudar Backend (Rust)
            </Button>
          </form>

          {greetMsg && (
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-sm border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-medium">
              {greetMsg}
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
          Pronto para o desenvolvimento profissional de telas de ERP
        </div>
      </div>
    </main>
  );
}

export default App;
