import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'; // Custom CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import SongSelection from './components/SongSelection';
import WeeklyPlaylist from './components/WeeklyPlaylist';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              성가 서비스
            </Link>
            {/* Navigation Buttons */}
            <div className="d-flex">
              <Link className="btn btn-outline-primary me-2" to="/">
                성가 유튜브 청취 서비스
              </Link>
              <Link className="btn btn-outline-secondary" to="/select">
                성가 선정 서비스
              </Link>
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
