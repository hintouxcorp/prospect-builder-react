import { useEffect, useState } from "react";
import "./SaleForm.css";

type Product = {
  id: number;
  name: string;
  type: "product" | "service";
  price?: number;
  monthly_price?: number;
};

type Props = {
  houseId: number;
  onSaved: () => void;
};

export default function SaleForm({ houseId, onSaved }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch("http://127.0.0.1:8000/api/products/", {
      credentials: "include"
    });

    setProducts(await res.json());
  }

  async function save() {
    if (!selected) return alert("Selecione um produto");

    const payload: any = {
      house: houseId,
      name: selected.name,
      sale_type: selected.type
    };

    if (selected.type === "product") {
      payload.price = selected.price;
    } else {
      payload.monthly_price = selected.monthly_price;
      payload.start_date = startDate;
      payload.status = "active";
    }

    const res = await fetch("http://127.0.0.1:8000/api/sales/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    setSelected(null);
    setStartDate("");

    onSaved();
  }

  return (
    <div className="sale-form">

      <h4>Novo Produto / Serviço</h4>

      <select
        value={selected?.id || ""}
        onChange={e => {
          const prod = products.find(p => p.id === Number(e.target.value));
          setSelected(prod || null);
        }}
      >
        <option value="">Selecione</option>

        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {selected?.type === "product" && (
        <p>Valor: R$ {selected.price}</p>
      )}

      {selected?.type === "service" && (
        <>
          <p>Mensalidade: R$ {selected.monthly_price}</p>

          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </>
      )}

      <button onClick={save}>Salvar</button>

    </div>
  );
}
