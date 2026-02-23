import './MapFilter.css';

type JobItems = {
  names: string[];
  symbols: string[];
};

export default function MapFilter() {

  const jobItems: JobItems = {
    names: ['Barbearia', 'Salão de Beleza', 'Clínica de Estética'],
    symbols: ['🔴', '🟢', '🔵']
  };

  return (
    <div className='container-filter-map'>
      <p>Filtros</p>

      {jobItems.names.map((item, index) => (
        <div key={index} className='container-description-filter'>
          <button>{jobItems.symbols[index]}</button>
          <span>{item}</span>
        </div>
      ))}

    </div>
  );
}