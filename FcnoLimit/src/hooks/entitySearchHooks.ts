import { useState } from "react";

// Usuarios
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

// Equipos
export function useEquipoSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "equipos") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/equipos/buscar?${params.toString()}`, {
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

// Campeonatos
export function useCampeonatoSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "campeonatos") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/campeonatos/buscar?${params.toString()}`, {
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

// Jugadores
export function useJugadorSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("usuario_id");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "jugadores") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/jugadores/buscar?${params.toString()}`, {
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
    setSearchField("usuario_id");
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

// Partidos
export function usePartidoSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("equipo_local_id");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "partidos") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/partidos/buscar?${params.toString()}`, {
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
    setSearchField("equipo_local_id");
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

// Estadísticas Partido
export function useEstadisticasPartidoSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("partido_id");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "estadisticasPartido") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/estadisticasPartido/buscar?${params.toString()}`, {
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
    setSearchField("partido_id");
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

// Estadísticas Jugador
export function useEstadisticasJugadorSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("jugador_id");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "estadisticasJugador") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/estadisticasJugador/buscar?${params.toString()}`, {
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
    setSearchField("jugador_id");
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

// Ligas
export function useLigaSearch(selected: string) {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (selected !== "ligas") return;
    const params = new URLSearchParams();
    if (search) params.append(searchField, search);
    if (searchDate) params.append("fecha", searchDate);

    try {
      const res = await fetch(`http://localhost:3001/api/ligas/buscar?${params.toString()}`, {
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