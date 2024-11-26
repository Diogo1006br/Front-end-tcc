import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, FormInput, Network, BarChart, Paperclip } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="z-40 bg-zinc-800 w-full">
        <div className="flex h-20 items-center justify-between py-6 px-6">
          <nav className="flex-1 flex justify-center space-x-6 text-white">
            <Link href="#features">Funcionalidades</Link>
            <Link href="#cases">Cases</Link>
            <Link href="#plans">Planos</Link>
            <Link href="#support">Suporte</Link>
            <Link href="#contact">Contato</Link>
          </nav>
          <div className="flex">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative text-center pt-8 pb-12 bg-white flex flex-col items-center justify-center">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-8 max-w-4xl">
            Transforme a coleta e a gestão de dados em um processo eficiente e inteligente.
          </h1>
          <div className="relative w-full h-[450px] flex justify-center items-center overflow-hidden">
            <div
              className="absolute bg-white p-6 rounded-lg shadow-lg max-w-sm text-center border border-gray-300"
              style={{
                top: "30%",
                transform: "translateY(-50%)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)", 
                borderRadius: "20px", 
              }}
            >
              <p className="text-lg mb-4 text-gray-700 font-medium">
                O GDIF ajuda sua empresa a coletar informações, gerenciar operações e tomar decisões estratégicas com facilidade.
              </p>
              <Link href="/login">
                <Button variant="default" size="lg" className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full">
                  Comece agora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="text-center  bg-white w-full flex flex-col items-center justify-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-4 max-w-4xl">
            A solução completa para fiscalizar, monitorar e gerenciar operações de forma simples e personalizada.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2">Captura de Dados Simplificada</h3>
              <p>Formulários personalizáveis para atender a qualquer necessidade.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2">Gestão de Operações em Tempo Real</h3>
              <p>Monitore projetos, fornecedores e ativos de forma eficaz.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold text-xl mb-2">Relatórios Inteligentes</h3>
              <p>Gere insights que ajudam na tomada de decisão rápida e informada.</p>
            </div>
          </div>
        </section>

        <section className="text-center py-8 bg-white w-full flex flex-col items-center justify-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-4 max-w-4xl">
            O que faz do GDIF a melhor escolha?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-5xl space-y-4 md:space-y-0">
            <div className="text-left space-y-2">
              <p><FormInput className="inline mr-2" /> Criação de formulários personalizados</p>
              <p><Check className="inline mr-2" /> Módulo de ações para gerenciamento de tarefas</p>
              <p><BarChart className="inline mr-2" /> Dashboards e relatórios detalhados</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
