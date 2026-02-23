import { useEffect, useState } from "react";
import "./Contract.css";

const API_CLIENTS = "http://127.0.0.1:8000/api/houses/";
const API_PRODUCTS = "http://127.0.0.1:8000/api/products/";

interface Client {
  id: number;
  name: string;
  phone?: string;
  status?: string;
}

interface Product {
  id: number;
  name: string;
  type: string;
  price?: number | string;
  monthly_price?: number | string;
}

interface ContractItem {
  product: Product;
  quantity: number;
}

export default function Contracts() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);

  useEffect(() => {
    fetch(API_CLIENTS)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(error => console.error("Erro ao buscar clientes:", error));
  }, []);

  useEffect(() => {
    fetch(API_PRODUCTS)
      .then(res => res.json())
      .then(data => {
        // 🔥 Converte valores para number para evitar erro no toFixed
        const normalized = data.map((p: Product) => ({
          ...p,
          price: p.price ? Number(p.price) : 0,
          monthly_price: p.monthly_price ? Number(p.monthly_price) : 0,
        }));

        setProducts(normalized);
      })
      .catch(error => console.error("Erro ao buscar produtos:", error));
  }, []);

  const filteredClients = clients.filter((client) => {
    const searchLower = search.toLowerCase();
    return (
      client.name?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower) ||
      client.status?.toLowerCase().includes(searchLower)
    );
  });

  const addProductToContract = (product: Product) => {
    setContractItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  const calculateTotal = () => {
    return contractItems.reduce((total, item) => {
      if (item.product.type === "product") {
        return total + (Number(item.product.price) || 0) * item.quantity;
      }
      return total + (Number(item.product.monthly_price) || 0);
    }, 0);
  };

  return (
    <div className="contracts-page">
      <div className="contracts-header">
        <h2>Clientes</h2>

        <div className="contracts-search-wrapper">
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="contracts-search-input"
          />

          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.phone || "-"}</td>
                <td>{client.status || "-"}</td>
                <td>
                  <button
                    className="create-btn"
                    onClick={() => {
                      setSelectedClient(client);
                      setContractItems([]);
                    }}
                  >
                    Criar Contrato
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <div className="contract-panel">
          <h3>Criando contrato para: {selectedClient.name}</h3>

          <div className="products-contract-list">
            {products.map((product) => (
              <div key={product.id} className="product-contract-card">
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.type === "product"
                      ? `R$ ${Number(product.price).toFixed(2)}`
                      : `R$ ${Number(product.monthly_price).toFixed(2)} / mês`}
                  </p>
                </div>
                <div className="product-add-button">
                  <button
                    className="add-btn"
                    onClick={() => addProductToContract(product)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {contractItems.length > 0 && (
            <div className="selected-contract-items">
              <h4>Itens adicionados</h4>

              {contractItems.map((item) => (
                <div key={item.product.id} className="selected-item">
                  {item.product.name} — Qtd: {item.quantity}
                </div>
              ))}

              <h4>Total: R$ {calculateTotal().toFixed(2)}</h4>
            </div>
          )}

          <button
            className="close-panel-btn"
            onClick={() => setSelectedClient(null)}
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}
