
import React from 'react';
import { AnalysisResult } from '../types.ts';

const IconWrapper = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <div className={`p-2 rounded-lg ${color} mr-3`}>
    {children}
  </div>
);

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const Lightbulb = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

const Code = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <IconWrapper color="bg-blue-500/20 text-blue-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </IconWrapper>
          Circuit Summary
        </h3>
        <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <IconWrapper color="bg-emerald-500/20 text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
          </IconWrapper>
          Identified Components
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.components.map((comp, i) => (
            <div key={i} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-emerald-400 font-mono font-bold">{comp.name}</span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">{comp.type}</span>
              </div>
              <p className="text-sm text-slate-400 mb-1">{comp.description}</p>
              {comp.value && <p className="text-xs text-slate-500 font-mono">Value: {comp.value}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <IconWrapper color="bg-amber-500/20 text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </IconWrapper>
          Theory of Operation
        </h3>
        <p className="text-slate-300 leading-relaxed italic border-l-4 border-amber-500/30 pl-4">{analysis.theoryOfOperation}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-red-500/5 p-6 rounded-xl border border-red-500/20">
          <h3 className="text-lg font-bold mb-4 flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Potential Issues
          </h3>
          <ul className="space-y-2">
            {analysis.potentialIssues.map((issue, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start">
                <span className="text-red-500 mr-2">•</span> {issue}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-cyan-500/5 p-6 rounded-xl border border-cyan-500/20">
          <h3 className="text-lg font-bold mb-4 flex items-center text-cyan-400">
            <Lightbulb className="w-5 h-5 mr-2" />
            Suggestions
          </h3>
          <ul className="space-y-2">
            {analysis.suggestions.map((sug, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start">
                <span className="text-cyan-500 mr-2">•</span> {sug}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {analysis.suggestedFirmware && (
        <section className="bg-slate-900 p-6 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <IconWrapper color="bg-indigo-500/20 text-indigo-400">
              <Code className="w-5 h-5" />
            </IconWrapper>
            Firmware Logic
          </h3>
          <pre className="bg-black/40 p-4 rounded-lg text-indigo-300 font-mono text-sm overflow-x-auto">
            {analysis.suggestedFirmware}
          </pre>
        </section>
      )}
    </div>
  );
};

export default AnalysisDashboard;
