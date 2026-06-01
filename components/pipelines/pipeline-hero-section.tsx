"use client";

import React from "react";
import { GitBranch, Zap } from "lucide-react";

export const PipelineHeroSection: React.FC = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-amber/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-blue/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Top section */}
        <div className="pt-20 pb-16 px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-400 mb-8">
            <span>Cronos Audit</span>
            <span>/</span>
            <span className="text-accent-amber">Pipelines</span>
          </div>

          {/* Main content */}
          <div className="max-w-4xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-accent-amber/10 rounded-lg border border-accent-amber-border">
                <Zap className="w-6 h-6 text-accent-amber" />
              </div>
              <div>
                <p className="text-accent-amber text-sm font-semibold tracking-wide uppercase">
                  Automação Contínua
                </p>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-text-100 mb-6 leading-tight">
              CI/CD Pipelines
              <span className="block text-accent-amber">Completamente Automatizados</span>
            </h1>

            <p className="text-lg text-text-300 mb-8 max-w-2xl leading-relaxed">
              Deploy automático de código com validação completa, testes de segurança e monitoramento em tempo real. Vá de feature branch para produção em menos de 10 minutos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className={`
                  px-8 py-3 rounded-lg font-semibold
                  bg-accent-amber text-bg-0
                  hover:bg-accent-amber/90
                  transition-all duration-200
                  flex items-center justify-center gap-2
                `}
              >
                <Zap className="w-4 h-4" />
                Começar Agora
              </button>
              <button
                className={`
                  px-8 py-3 rounded-lg font-semibold
                  border border-accent-amber-border text-text-100
                  hover:bg-accent-amber/5
                  transition-all duration-200
                  flex items-center justify-center gap-2
                `}
              >
                <GitBranch className="w-4 h-4" />
                Ver Documentação
              </button>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="py-16 px-4 md:px-8 border-t border-border">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-amber mb-2">~25 min</p>
              <p className="text-text-400 text-sm">Pipeline Completo</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-teal mb-2">4</p>
              <p className="text-text-400 text-sm">Workflows Automáticos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-blue mb-2">&lt; 0.1%</p>
              <p className="text-text-400 text-sm">Taxa de Erro</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-pink mb-2">∞</p>
              <p className="text-text-400 text-sm">Escalabilidade</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineHeroSection;
