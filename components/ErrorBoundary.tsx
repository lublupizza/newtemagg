
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center mb-6 border-4 border-red-500">
             <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white italic mb-4">SYSTEM CRITICAL</h1>
          <p className="text-gray-400 font-mono text-sm max-w-md mb-8">
            Произошла непредвиденная ошибка в матрице. Наш кибер-шеф уже уведомлен.
            <br/><br/>
            <span className="text-xs opacity-50">{this.state.error?.toString()}</span>
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <RefreshCcw className="w-5 h-5" /> ПЕРЕЗАГРУЗИТЬ СИСТЕМУ
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
