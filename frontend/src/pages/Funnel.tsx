import { useEffect, useState } from "react";
import "./Funnel.css";

type Status =
  | "lead"
  | "interested"
  | "client"
  | "not_interested"
  | "none";

type House = {
  id: number;
  name: string;
  status: Status;
};

const API = "http://127.0.0.1:8000/api/houses/";

const STAGES: { key: Status; label: string; tip: string }[] = [
  {
    key: "lead",
    label: "Leads",
    tip: "Primeiro contato: apresentação + curiosidade."
  },
  {
    key: "interested",
    label: "Interessados",
    tip: "Enviar proposta / agendar conversa."
  },
  {
    key: "client",
    label: "Clientes",
    tip: "Pós-venda + fidelização."
  }
];

export default function Funnel() {
  const [data, setData] = useState<House[]>([]);

  useEffect(() => {
    fetch(API, { credentials: "include" })
      .then(r => r.json())
      .then(setData);
  }, []);

  function byStatus(status: Status) {
    return data.filter(h => h.status === status);
  }

  return (
    <div className="funnel-page">

      <h2>Funil de Vendas</h2>

      <div className="funnel">

        {STAGES.map(stage => {
          const items = byStatus(stage.key);

          return (
            <div key={stage.key} className="stage">

              <h3>{stage.label}</h3>
              <span className="count">{items.length}</span>

              <p className="tip">{stage.tip}</p>

              <div className="names">
                {items.map(h => (
                  <div key={h.id} className="name">
                    {h.name}
                  </div>
                ))}
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
