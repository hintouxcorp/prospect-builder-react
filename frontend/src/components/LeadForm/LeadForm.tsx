import "./LeadForm.css";
import type { House, Status, LeadType, BusinessType } from "../types";

type Props = {
  data: House;
  onChange: (data: House) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
};

export default function LeadForm({
  data,
  onChange,
  onSave,
  onCancel,
  onDelete
}: Props) {
  return (
    <div className="lead-form">

      <h3>{data.id ? "Editar Lead" : "Novo Lead"}</h3>

      {/* NOME */}

      <label>Nome</label>
      <input
        value={data.name}
        onChange={e => onChange({ ...data, name: e.target.value })}
      />

      {/* TIPO */}

      <label>Tipo</label>
      <select
        value={data.type}
        onChange={e => {
          const newType = e.target.value as LeadType;

          onChange({
            ...data,
            type: newType,
            business_type: newType === "base" ? "none" : data.business_type,
            custom_business: newType === "base" ? "" : data.custom_business
          });
        }}
      >
        <option value="base">Base</option>
        <option value="client">Cliente</option>
      </select>

      {/* ================= CLIENTE ================= */}

      {data.type === "client" && (
        <>

          {/* TIPO DE NEGÓCIO */}

          <label>Tipo de negócio</label>

          <select
            value={data.business_type}
            onChange={e =>
              onChange({
                ...data,
                business_type: e.target.value as BusinessType
              })
            }
          >
            <option value="barbearia">Barbearia</option>
            <option value="salao">Salão</option>
            <option value="manicure">Manicure</option>
            <option value="pedicure">Pedicure</option>
            <option value="estetica">Estética</option>
            <option value="outro">Outro</option>
          </select>

          {data.business_type === "outro" && (
            <>
              <label>Especifique</label>
              <input
                style={{ marginBottom: 20 }}
                placeholder="Digite o tipo"
                value={data.custom_business || ""}
                onChange={e =>
                  onChange({ ...data, custom_business: e.target.value })
                }
              />
            </>
          )}

          {/* CONTATO */}

          <input
            placeholder="Email"
            value={data.email || ""}
            onChange={e => onChange({ ...data, email: e.target.value })}
          />

          <input
            placeholder="Telefone"
            value={data.phone || ""}
            onChange={e => onChange({ ...data, phone: e.target.value })}
          />

          <input
            placeholder="WhatsApp"
            value={data.whatsapp || ""}
            onChange={e => onChange({ ...data, whatsapp: e.target.value })}
          />

          {/* STATUS */}

          <select
            value={data.status}
            onChange={e =>
              onChange({ ...data, status: e.target.value as Status })
            }
          >
            <option value="none">Nenhum</option>
            <option value="lead">Lead</option>
            <option value="interested">Interessado</option>
            <option value="not_interested">Não interessado</option>
            <option value="client">Cliente</option>
          </select>
        </>
      )}

      {/* ================= BASE ================= */}

      {data.type === "base" && (
        <>
          <label>Raio (metros)</label>

          <input
            type="range"
            min="100"
            max="3000"
            step="100"
            value={data.radius || 500}
            onChange={e =>
              onChange({ ...data, radius: Number(e.target.value) })
            }
          />

          <small>{data.radius}m</small>
        </>
      )}

      {/* AÇÕES */}

      <div className="actions">
        <button className="save" onClick={onSave}>Salvar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>

      {data.id && (
        <button className="delete" onClick={onDelete}>Excluir</button>
      )}

    </div>
  );
}
