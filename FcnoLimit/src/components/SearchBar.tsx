import React, { useRef } from "react";
import { IonButton } from "@ionic/react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  dateValue?: string;
  onDateChange?: (value: string) => void;
}

/**
 * SearchBar permite buscar por texto y por fecha.
 * 
 * Para la fecha, usa el formato YYYY-MM-DD, compatible con la mayoría de bases de datos SQL.
 * 
 * Ejemplo de uso:
 * <SearchBar
 *   placeholder="Buscar usuario..."
 *   value={search}
 *   onChange={setSearch}
 *   onSearch={handleSearch}
 *   dateValue={searchDate}
 *   onDateChange={setSearchDate}
 * />
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onSearch,
  dateValue,
  onDateChange
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Muestra el calendario al hacer clic en el botón
  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker
        ? dateInputRef.current.showPicker()
        : dateInputRef.current.focus();
    }
  };

  return (
    <div
      className="search-bar-root"
      style={{
        marginBottom: 0,
        display: "flex",
        gap: 0,
        alignItems: "center",
        width: "100%",
        background: "none"
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: "12px 16px",
          borderRadius: "6px 0 0 6px",
          border: "none",
          background: "#232323",
          color: "#fff",
          fontSize: "1.1rem",
          fontWeight: 500,
          outline: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}
      />
      {/* Botón para desplegar el calendario */}
      {onDateChange && (
        <>
          <input
            ref={dateInputRef}
            type="date"
            value={dateValue || ""}
            onChange={e => onDateChange(e.target.value)}
            style={{ display: "none" }}
          />
          <IonButton color="medium" onClick={handleCalendarClick} style={{ minWidth: 44 }}>
            📅
          </IonButton>
        </>
      )}
      <button
        type="button"
        onClick={onSearch}
        style={{
          background: "var(--fcnolimit-primary, #ffae26)",
          color: "#fff",
          fontWeight: 700,
          border: "none",
          borderRadius: "0 6px 6px 0",
          padding: "12px 28px",
          fontSize: "1.05rem",
          cursor: "pointer",
          transition: "background 0.2s",
          boxShadow: "0 2px 8px rgba(255,174,38,0.09)",
          marginLeft: "-1px"
        }}
      >
        BUSCAR
      </button>
    </div>
  );
};

export default SearchBar;