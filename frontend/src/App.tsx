import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import MapPage from "./pages/MapPage";
import Reports from "./pages/Reports";
import Funnel from "./pages/Funnel";
import Products from "./pages/Products";
import Contract from './pages/Contract';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="layout">
          <Sidebar />

          <main>
            <Routes>
              <Route path="/map" element={<MapPage />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/funnel" element={<Funnel />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contract" element={<Contract />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  )
}
