
import React, { useState } from 'react';
import { SchematicState, Message } from './types.ts';
import { schematicService } from './services/geminiService.ts';
import BlueprintViewer from './components/BlueprintViewer.tsx';
import AnalysisDashboard from './components/AnalysisDashboard.tsx';
import ChatWindow from './components/ChatWindow.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<SchematicState>({
    image: null,
    analysis: null,
    messages: [],
    isAnalyzing: false,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setState(prev => ({ 
          ...prev, 
          image: base64String, 
          analysis: null, 
          messages: [],
          isAnalyzing: true 
        }));
        
        analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (image: string) => {
    try {
      const result = await schematicService.analyzeSchematic(image);
      setState(prev => ({ 
        ...prev, 
        analysis: result, 
        isAnalyzing: false 
      }));
    } catch (error) {
      console.error("Analysis failed:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
      alert("Failed to analyze the schematic. Please check your image and try again.");
    }
  };

  const handleSendMessage = async (content: string) => {
    const newUserMsg: Message = { role: 'user', content };
    setState(prev => ({ 
      ...prev, 
      messages: [...prev.messages, newUserMsg],
      isAnalyzing: true 
    }));

    try {
      const response = await schematicService.getChatResponse(state.messages, content, state.image);
      const newAssistantMsg: Message = { role: 'assistant', content: response };
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, newAssistantMsg],
        isAnalyzing: false 
      }));
    } catch (error) {
      console.error("Chat failed:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">S</div>
            <h1 className="text-xl font-bold tracking-tight">Schematic<span className="text-blue-500">Sensei</span></h1>
          </div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden sm:block">
            AI-Driven Circuit Intelligence
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {!state.image ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Upload Circuit Schematic</h2>
            <p className="text-slate-400 mb-8 max-w-md text-center">
              Drop an image or click to upload. SchematicSensei will identify components, explain the logic, and suggest improvements.
            </p>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              Select Image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
            <p className="mt-4 text-xs text-slate-600 uppercase tracking-tighter">Supports PNG, JPG, WEBP</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <BlueprintViewer image={state.image} />
              <ChatWindow 
                messages={state.messages} 
                onSendMessage={handleSendMessage} 
                isLoading={state.isAnalyzing}
              />
              <button 
                onClick={() => setState({ image: null, analysis: null, messages: [], isAnalyzing: false })}
                className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors border border-slate-800 rounded-lg"
              >
                ← Upload New Schematic
              </button>
            </div>

            <div className="lg:col-span-7">
              {state.isAnalyzing && !state.analysis ? (
                <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Decoding schematic...</h3>
                    <p className="text-sm text-slate-500">Mapping components and analyzing signal paths.</p>
                  </div>
                </div>
              ) : state.analysis ? (
                <AnalysisDashboard analysis={state.analysis} />
              ) : null}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-800 pt-8 opacity-40 hover:opacity-100 transition-opacity">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2024 SchematicSensei - Prototyping Intelligence</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Hardware Debugging</span>
            <span>BOM Generation</span>
            <span>Firmware Logic</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
