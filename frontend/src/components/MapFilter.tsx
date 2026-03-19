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
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔥 BLOQUEIA propagação de clique pro mapa (nível Leaflet)
  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
    }
  }, []);

  // 🔄 BUSCAR TIPOS DO BACKEND
  useEffect(() => {
    fetch('http://localhost:8000/api/business-types/')
      .then(res => res.json())
      .then(data => setTypes(data));
  }, []);

  // 🎯 APLICAR FILTRO
  function handleFilter(e: React.MouseEvent, type: string) {
    e.stopPropagation(); // 🔥 extra segurança
    setSelected(type);
    onFilter(type);
  }

  // ❌ LIMPAR FILTRO
  function clearFilter(e: React.MouseEvent) {
    e.stopPropagation(); // 🔥 extra segurança
    setSelected(null);
    onFilter(null);
  }

  return (
    <div
      ref={containerRef}
      className='container-filter-map'
      onClick={(e) => e.stopPropagation()} // 🔥 fallback
    >
      <p>Filtros</p>

      <button onClick={(e) => clearFilter(e)}>
        ❌ Limpar filtro
      </button>

      {types.map((item) => (
        <div key={item.value} className='container-description-filter'>
          <button onClick={(e) => handleFilter(e, item.value)}>
            {selected === item.value ? '✅' : '⬜'}
          </button>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}