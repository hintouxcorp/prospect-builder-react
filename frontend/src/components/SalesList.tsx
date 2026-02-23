import { useEffect, useState } from "react";

type Sale = {
  id: number;
  name: string;
  sale_type: "product" | "service";
  price?: number;
  monthly_price?: number;
  status: string;
};

type Props = {
  houseId: number;
};

export default function SalesList({ houseId }: Props) {
  const [sales, setSales] = useState<Sale[]>([]);

  async function load() {
    const res = await fetch(
      `http://127.0.0.1:8000/api/sales/?house=${houseId}`
    );

    const data = await res.json();
    setSales(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <h4>Vendas</h4>

      {sales.map(sale => (
        <div
          key={sale.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 6,
            borderRadius: 6
          }}
        >
          <strong>{sale.name}</strong>

          <div>
            Tipo: {sale.sale_type === "product" ? "Produto" : "Serviço"}
          </div>

          {sale.sale_type === "product" && (
            <div>Valor: R$ {sale.price}</div>
          )}

          {sale.sale_type === "service" && (
            <div>Mensal: R$ {sale.monthly_price}</div>
          )}

          <small>Status: {sale.status}</small>
        </div>
      ))}

    </div>
  );
}
