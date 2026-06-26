import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import CervejasPage from './pages/CervejasPage';
import TanquesPage from './pages/TanquesPage';
import ParametrosPage from './pages/ParametrosPage';
import RegistrosPage from './pages/RegistrosPage';
import HistoricoLotesPage from './pages/HistoricoLotesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="cervejas" element={<CervejasPage />} />
          <Route path="tanques" element={<TanquesPage />} />
          <Route path="parametros" element={<ParametrosPage />} />
          <Route path="registros" element={<RegistrosPage />} />
          <Route path="historico" element={<HistoricoLotesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
