import './App.css';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { ROUTES } from './constants';

export const App = () => {
  return (
    <div className="App container">
      <Router>
        <Routes>
          <Route path={ROUTES.empty} element={<Navigate to={ROUTES.game} replace={true} />} />
          <Route path={ROUTES.game} element={<GamePage />} />
        </Routes>
      </Router>
    </div>
  );
};
