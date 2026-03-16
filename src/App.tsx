import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Drivers from './pages/Drivers';
import Menu from './pages/Menu';
import Payments from './pages/Payments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/discounts" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
