import React, { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import GameLobby from './components/GameLobby';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error: error });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 text-red-400 min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-bold uppercase mb-4 text-red-500">Aplikasi Mengalami Crash</h1>
          <pre className="bg-slate-950 p-4 rounded border border-red-500/20 text-xs text-left max-w-2xl overflow-auto font-mono whitespace-pre-wrap">
            {this.state.error && this.state.error.toString()}
            {"\n"}
            {this.state.error && this.state.error.stack}
          </pre>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mt-6 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-bold uppercase transition-all"
          >
            Reset Game & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const phase = useGameStore((state) => state.phase);
  const loadGame = useGameStore((state) => state.loadGame);
  const resetToHome = useGameStore((state) => state.resetToHome);
  const initGame = useGameStore((state) => state.initGame);

  // Jalankan loadGame sekali saat pertama kali aplikasi dibuka
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <ErrorBoundary>
      {phase === 'SPLASH' && (
        <SplashScreen onStart={resetToHome} />
      )}
      
      {phase === 'HOME' && (
        <MainMenu 
          onPlay={() => useGameStore.setState({ phase: 'LOBBY' })} 
          onResetState={resetToHome} 
        />
      )}
      
      {phase === 'LOBBY' && (
        <GameLobby 
          onStartGame={initGame} 
          onBack={resetToHome} 
        />
      )}
      
      {(phase === 'PREPARATION' || phase === 'BIDDING' || phase === 'ACTION' || phase === 'SELL' || phase === 'ECONOMY') && (
        <GameScreen />
      )}
      
      {phase === 'GAMEOVER' && (
        <GameOverScreen 
          onPlayAgain={initGame} 
          onBackToHome={resetToHome} 
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
