import { useState } from "react";

export function useUserSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "usuarios") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/buscar?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResults(Array.isArray(data) ? data : [data]);
      } else {
        setSearchResults([{ error: data.error }]);
      }
    } catch {
      setSearchResults([{ error: "Error de conexión con el servidor" }]);
    }
  };

  const resetSearch = () => {
    setSearch("");
    setSearchField("nombre");
    setSearchDate("");
    setSearchResults([]);
  };

  return {
    search, setSearch,
    searchField, setSearchField,
    searchDate, setSearchDate,
    searchResults, setSearchResults,
    handleSearch,
    resetSearch
  };
}