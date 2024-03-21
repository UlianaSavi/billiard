import './App.css';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { ROUTES } from './constants';

export const App = () => {
  return (
    <div className="App container">
      <header className="header">
        <h3 className="title">Billiard</h3>
      </header>

      <Router>
        <Routes>
          <Route
            path={ROUTES.empty}
            element={<Navigate to={ROUTES.game} replace={true} />}
          />
          <Route path={ROUTES.game} element={<GamePage />} />
        </Routes>
      </Router>
    </div>
  );
};