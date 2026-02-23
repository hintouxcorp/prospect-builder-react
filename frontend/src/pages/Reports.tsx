import { useEffect, useState } from "react";
import "./Reports.css";

type Status =
  | "none"
  | "lead"
  | "interested"
  | "not_interested"
  | "client";

type House = {
  id: number;
  name: string;
  status: Status;
  visits: number;
  business_type: string;
  custom_business?: string;
  created_at: string;
};

const API = "http://127.0.0.1:8000/api/houses/";

export default function Reports() {
  const [data, setData] = useState<House[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function load() {
    const res = await fetch(API, { credentials: "include" });
    setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR");
  }

  function businessLabel(h: House) {
    if (h.business_type === "outro") return h.custom_business || "Outro";
    return h.business_type;
  }

  const businesses = Array.from(new Set(data.map(h => businessLabel(h))));

  const filtered = data.filter(h => {
    const statusOk = statusFilter === "all" || h.status === statusFilter;
    const businessOk =
      businessFilter === "all" || businessLabel(h) === businessFilter;

    const created = new Date(h.created_at);

    const startOk = startDate ? created >= new Date(startDate) : true;
    const endOk = endDate ? created <= new Date(endDate + "T23:59:59") : true;

    return statusOk && businessOk && startOk && endOk;
  });

  const total = filtered.length;
  const leads = filtered.filter(h => h.status === "lead").length;
  const clients = filtered.filter(h => h.status === "client").length;
  const interested = filtered.filter(h => h.status === "interested").length;

  /* EXPORT CSV */

  function exportCSV() {
    if (!filtered.length) {
      alert("Sem dados para exportar");
      return;
    }

    const header = ["Nome", "Status", "Tipo Negócio", "Data", "Visitas"];

    const rows = filtered.map(h => [
      h.name,
      h.status,
      businessLabel(h),
      formatDate(h.created_at),
      String(h.visits)
    ]);

    let csv = header.join(";") + "\n";

    rows.forEach(r => {
      csv += r.join(";") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "relatorio.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="reports">

      <div className="metrics">
        <Metric title="Total" value={total} />
        <Metric title="Leads" value={leads} />
        <Metric title="Interessados" value={interested} />
        <Metric title="Clientes" value={clients} />
      </div>

      <div className="filters">

        <select
          className="filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Todos status</option>
          <option value="lead">Lead</option>
          <option value="interested">Interessado</option>
          <option value="not_interested">Não interessado</option>
          <option value="client">Cliente</option>
        </select>

        <select
          className="filter"
          value={businessFilter}
          onChange={e => setBusinessFilter(e.target.value)}
        >
          <option value="all">Todos negócios</option>
          {businesses.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="date"
          className="filter"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="filter"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />

      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Tipo de negócio</th>
              <th>Visitas</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(h => (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{h.status}</td>
                <td>{businessLabel(h)}</td>
                <td>{h.visits}</td>
                <td>{formatDate(h.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="export-container">
        <button className="export" onClick={exportCSV}>
          Exportar CSV
        </button>
      </div>

    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="metric">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
