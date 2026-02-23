import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { BiLineChart, 
  BiSolidReport, 
  BiSolidUpArrow, 
  BiMap, 
  BiLogoShopify, 
  BiDollarCircle,
  BiMessageSquareCheck,
  BiMessageSquareError,
  BiMoney,
  BiLogOut
} from "react-icons/bi";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Prospect Master</h2>

      <nav>
        <NavLink to="/dashboard"> <BiLineChart /> Dashboard </NavLink>
        <NavLink to="/reports"> <BiSolidReport /> Relatórios </NavLink>
        <NavLink to="/funnel"> <BiSolidUpArrow /> Funil </NavLink>
        <NavLink to="/map"> <BiMap /> Mapa</NavLink>
        <NavLink to="/products"> <BiLogoShopify /> Produtos </NavLink>
        <NavLink to="/contract"> <BiMessageSquareCheck /> Contratos </NavLink>
        <NavLink to="/balance"> <BiDollarCircle /> Financeiro </NavLink>
        <NavLink to="/followup"> <BiMessageSquareError /> Lembrete </NavLink>
        <NavLink to="/pay"> <BiMoney /> Pagamento </NavLink>
        <NavLink to="/logout"> <BiLogOut /> Logout </NavLink>
      </nav>
    </aside>
  );
}
