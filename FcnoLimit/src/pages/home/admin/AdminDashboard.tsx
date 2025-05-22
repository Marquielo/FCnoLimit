import React, { useState } from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import FormGenerico from "../../../components/FormGenerico";
import SearchBar from "../../../components/SearchBar";
import sections from "../../../config/sections";
import fieldsMap from "../../../config/fieldsMap";
import { useUserSearch } from "../../../hooks/useUserSearch";
import api from "../../../api/axios";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [selected, setSelected] = useState<string>("usuarios");
  const {
    search, setSearch,
    searchField, setSearchField,
    searchDate, setSearchDate,
    searchResults, setSearchResults,
    handleSearch,
    resetSearch
  } = useUserSearch(selected);

  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  // Función para obtener configuración del formulario según contexto
  function getFormConfig() {
    if (selected === "usuarios") {
      if (usuarioEditando) {
        // Para editar usuario
        return {
          fields: fieldsMap["usuarios"].map(field =>
            field.name === "contraseña" ? { ...field, required: false } : field
          ),
          initialValues: usuarioEditando,
          onSubmit: async (data: any) => {
            if (!data.contraseña) delete data.contraseña;
            try {
              await api.put(`/usuarios/${usuarioEditando.id}`, data);
              alert("Usuario actualizado correctamente");
              setUsuarioEditando(null);
            } catch (err: any) {
              alert(err.response?.data?.error || "Error al actualizar usuario");
            }
          },
          onCancel: () => setUsuarioEditando(null)
        };
      } else {
        // Para crear usuario (NO incluyas initialValues)
        return {
          fields: fieldsMap["usuarios"],
          onSubmit: async (data: any) => {
            try {
              await api.post("/usuarios/register", data);
              alert("Usuario creado correctamente");
            } catch (err: any) {
              alert(err.response?.data?.error || "Error al crear usuario");
            }
          }
        };
      }
    }
    return null;
  }

  const formConfig = getFormConfig();

  return (
    <IonPage>
      <NavBar />
      <IonContent fullscreen>
        <div className="admin-dashboard-flex">
          <aside className="admin-sidebar">
            {sections.map(sec => (
              <IonButton
                key={sec.key}
                expand="block"
                color={selected === sec.key ? "primary" : "medium"}
                onClick={() => {
                  setSelected(sec.key);
                  resetSearch();
                }}
                style={{ marginBottom: 12 }}
              >
                {sec.label}
              </IonButton>
            ))}
          </aside>
          <main className="admin-main-content">
            <h2>Gestión de {sections.find(s => s.key === selected)?.label}</h2>
            {selected === "usuarios" && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <select value={searchField} onChange={e => setSearchField(e.target.value)} style={{ padding: 8 }}>
                  <option value="nombre">Nombre</option>
                  <option value="id">ID</option>
                  <option value="correo">Correo</option>
                  <option value="rol">Rol</option>
                </select>
                <SearchBar
                  placeholder={`Buscar usuario por ${searchField}...`}
                  value={search}
                  onChange={setSearch}
                  onSearch={handleSearch}
                  dateValue={searchDate}
                  onDateChange={setSearchDate}
                />
              </div>
            )}
            {searchResults.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <strong>Resultados:</strong>
                <ul>
                  {searchResults.map((usuario, idx) => (
                    <li key={idx}>
                      {usuario.nombre_completo} ({usuario.correo})
                      <button onClick={() => setUsuarioEditando(usuario)}>Editar</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {formConfig && (
              <FormGenerico
                {...formConfig}
              />
            )}
          </main>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;