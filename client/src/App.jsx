// App.jsx - Composant principal avec routage
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from './context/WebSocketContext';
import { GameProvider } from './context/GameContext';
import { Home } from './pages/Home';
import { CreateRoom } from './pages/CreateRoom';
import { JoinRoom } from './pages/JoinRoom';
import { GameRoom } from './pages/GameRoom';
import { NarratorDashboard } from './pages/NarratorDashboard';

function App() {
  return (
    <Router>
      <WebSocketProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/game/:roomCode" element={<GameRoom />} />
            <Route path="/narrator/:roomCode" element={<NarratorDashboard />} />
          </Routes>
        </GameProvider>
      </WebSocketProvider>
    </Router>
  );
}

export default App;
