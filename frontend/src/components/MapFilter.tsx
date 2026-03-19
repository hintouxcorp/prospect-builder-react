import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import './MapFilter.css';

type BusinessType = {
  value: string;
  label: string;
};

type Props = {
  onFilter: (type: string | null) => void;
};

export default function MapFilter({ onFilter }: Props) {
  const [types, setTypes] = useState<BusinessType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch('http://localhost:8000/api/business-types/');
        const data = await res.json();
        setTypes(data);
      } catch (err) {
        console.error('Erro ao buscar tipos:', err);
      }
    }

    fetchTypes();
  }, []);

  function handleFilter(e: React.MouseEvent, type: string) {
    e.stopPropagation();

    if (selected === type) {
      setSelected(null);
      onFilter(null);
      return;
    }

    setSelected(type);
    onFilter(type);
  }

  function clearFilter(e: React.MouseEvent) {
    e.stopPropagation();
    setSelected(null);
    onFilter(null);
  }

  function toggleOpen(e: React.MouseEvent) {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }

  return (
    <div
      ref={containerRef}
      className={`container-filter-map ${!isOpen ? 'collapsed' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="filter-header">
        <p>Filtros</p>
        <button onClick={toggleOpen}>
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {/* 🔥 CONTEÚDO SEM REMOVER DO DOM */}
      <div className="filter-content">
        <button onClick={clearFilter}>
          ❌ Limpar filtro
        </button>

        <div className="filter-list">
          {types.map((item) => (
            <div
              key={item.value}
              className={`container-description-filter ${
                selected === item.value ? 'active' : ''
              }`}
            >
              <button onClick={(e) => handleFilter(e, item.value)}>
                {selected === item.value ? '✅' : '⬜'}
              </button>

              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}