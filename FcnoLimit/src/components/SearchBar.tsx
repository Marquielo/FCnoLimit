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
    <div style={{ marginBottom: 24, display: "flex", gap: 8, alignItems: "flex-end" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
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
      <IonButton color="primary" onClick={onSearch}>Buscar</IonButton>
    </div>
  );
};

export default SearchBar;