import { useEffect, useState } from "react";
import type { Product, ProductType } from "../components/types";
import "./Products.css";

const API = "http://127.0.0.1:8000/api/products/";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    name: "",
    type: "product",
    price: 0
  });

  async function load() {
    const res = await fetch(API, { credentials: "include" });
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    });

    setForm({
      name: "",
      type: "product",
      price: 0
    });

    load();
  }

  // 🔥 DELETE
  async function remove(id: number) {
    if (!confirm("Deseja realmente excluir este item?")) return;

    await fetch(`${API}${id}/`, {
      method: "DELETE",
      credentials: "include"
    });

    load();
  }

  return (
    <div className="products">
      <div className="form-product">
        <h2>Novo Produto / Serviço</h2>

        <input
          placeholder="Nome do Produto / Serviço"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.type}
          onChange={e =>
            setForm({
              ...form,
              type: e.target.value as ProductType,
              price: 0,
              monthly_price: 0
            })
          }
        >
          <option value="product">Produto</option>
          <option value="service">Serviço</option>
        </select>

        {form.type === "product" && (
          <input
            type="number"
            placeholder="Preço único"
            value={form.price}
            onChange={e =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        )}

        {form.type === "service" && (
          <input
            type="number"
            placeholder="Preço Mensal"
            value={form.monthly_price}
            onChange={e =>
              setForm({ ...form, monthly_price: Number(e.target.value) })
            }
          />
        )}

        <button onClick={save}>Salvar</button>
      </div>

      <div className="product-container">
        <h3>Produtos cadastrados</h3>

        <ul>
          {products.map(p => (
            <li key={p.id}>
              <div className="product-card">
                <p className="product-name">{p.name}</p>

                <p className="product-price">
                  {p.type === "product"
                    ? `R$ ${p.price}`
                    : `R$ ${p.monthly_price}/mês`}
                </p>

                <button
                  className="delete-btn"
                  onClick={() => remove(p.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
