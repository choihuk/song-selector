import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Import custom CSS for styling
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for UI components
import SongSelection from './components/SongSelection';
import WeeklyPlaylist from './components/WeeklyPlaylist'

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              성가 서비스
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    성가 유튜브 청취 서비스
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/select">
                    성가 선정 서비스
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<WeeklyPlaylist />} />
            <Route path="/select" element={<SongSelection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
