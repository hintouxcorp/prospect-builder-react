import { useState, useRef } from "react";
import "./SearchEngine.css";

type Props = {
  onSearch?: (value: string) => void;
};

export default function SearchEngine({ onSearch }: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function toggle() {
    setOpen(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }

  return (
    <div className={`search-wrapper ${open ? "open" : ""}`}>
      <button className="search-btn" onClick={toggle}>
        🔍
      </button>

      <input
        ref={inputRef}
        className="search-input"
        placeholder="Pesquisar comércio ou endereço..."
        maxLength={100}
        onBlur={() => setOpen(false)}
        onChange={e => onSearch?.(e.target.value)}
        />

    </div>
  );
}
