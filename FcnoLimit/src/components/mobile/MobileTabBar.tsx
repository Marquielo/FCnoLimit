import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import {
  footballOutline,
  peopleSharp,
  trophySharp,
  footballSharp,
  homeSharp,
  personCircleOutline,
  statsChartSharp,
  fitnessOutline,
  documentTextOutline,
  settingsOutline,
  logInSharp,
  logOutOutline,
  searchOutline
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTabNavigation } from '../../hooks/useTabNavigation';
import './MobileTabBar.css';

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

const MobileTabBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { activeTab, setActiveTab } = useTabNavigation();
  const [showUserActions, setShowUserActions] = useState(false);
  const [showEquiposDropdown, setShowEquiposDropdown] = useState(false);
  const [equiposPopulares, setEquiposPopulares] = useState<any[]>([]);
  
  // Obtener el usuario del localStorage (EXACTAMENTE igual que en NavBar)
  const usuario = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")!) : null;
  const userRole = usuario?.rol || 'no_auth';

  // Fetch equipos populares igual que en NavBar
  useEffect(() => {
    const fetchEquiposPopulares = async () => {
      try {
        // Obtener todos los equipos y seleccionar 8 al azar en el frontend
        const res = await fetch(`${apiBaseUrl}/api/equipos`);
        if (!res.ok) throw new Error();
        const equipos = await res.json();
        if (Array.isArray(equipos) && equipos.length > 0) {
          // Selecciona 8 equipos aleatorios del array
          const shuffled = equipos.sort(() => 0.5 - Math.random());
          setEquiposPopulares(shuffled.slice(0, 8));
        } else {
          setEquiposPopulares([]);
        }
      } catch {
        setEquiposPopulares([]);
      }
    };

    if (showEquiposDropdown && equiposPopulares.length === 0) {
      fetchEquiposPopulares();
    }
  }, [showEquiposDropdown, equiposPopulares.length]);

  // Definir las rutas de navegación según el rol del usuario (EXACTAMENTE igual que en NavBar)
  const getNavItems = () => {
    // Items comunes para todos los usuarios
    const commonItems = [
      { path: "/partidos", icon: footballSharp, text: "Partidos" },
      { path: "/campeonatos", icon: trophySharp, text: "Competicion" },
    ];
    
    // Items específicos según rol
    switch (userRole) {
      case 'administrador':
        return [
          ...commonItems,
          { path: "/admin/AdminDashboard", icon: settingsOutline, text: "Panel Admin" },
        ];
      
      case 'jugador':
        return [
          ...commonItems,
          { path: "/jugador/perfil", icon: personCircleOutline, text: "Mi Perfil" },
          { path: "/jugador/estadisticas", icon: statsChartSharp, text: "Mis Estadísticas" },
          { path: "/jugador/entrenamientos", icon: fitnessOutline, text: "Entrenamientos" },
        ];
      
      case 'entrenador':
        return [
          ...commonItems,
          { path: "/entrenador/equipo", icon: peopleSharp, text: "Mi Equipo" },
          { path: "/entrenador/entrenamientos", icon: fitnessOutline, text: "Entrenamientos" },
          { path: "/entrenador/tactica", icon: documentTextOutline, text: "Tácticas" },
          { path: "/entrenador/estadisticas", icon: statsChartSharp, text: "Estadísticas" },
        ];
    
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  // Función para manejar navegación
  const handleNavClick = (path: string) => {
    history.push(path);
    setShowUserActions(false); // Cerrar menú de acciones si está abierto
    setShowEquiposDropdown(false); // Cerrar dropdown de equipos
  };

  // Función para manejar click en equipos (mostrar dropdown)
  const handleEquiposClick = () => {
    setShowEquiposDropdown(!showEquiposDropdown);
    setShowUserActions(false); // Cerrar menú de usuario si está abierto
  };

  // Función para seleccionar equipo del dropdown
  const handleEquipoSelect = (equipo: any) => {
    setShowEquiposDropdown(false);
    localStorage.setItem("equipoSeleccionadoId", String(equipo.id));
    history.push(`/equipos/${equipo.id}`);
  };

  // Función para manejar logout (EXACTAMENTE igual que en NavBar)
  const handleLogout = async () => {
    try {
      await authService.logout();
      setShowUserActions(false);
      history.push("/auth");
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar logout local incluso si falla el servidor
      setShowUserActions(false);
      history.push("/auth");
    }
  };

  // Auto-detectar tab activo basado en la URL actual
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/inicio' || currentPath === '/') {
      setActiveTab('inicio');
    } else if (currentPath.startsWith('/equipos')) {
      setActiveTab('/equipos');
    } else {
      const currentItem = navItems.find(item => 
        currentPath === item.path || 
        (item.path !== '/inicio' && currentPath.startsWith(item.path))
      );
      if (currentItem) {
        setActiveTab(currentItem.path);
      }
    }
  }, [location.pathname, navItems, setActiveTab]);

  // Renderizar elementos de menú de usuario según rol (EXACTAMENTE igual que en NavBar)
  const renderUserMenuItems = () => {
    const items = [];
    
    // Añadir elemento de perfil según el rol
    if (userRole === 'jugador') {
      items.push(
        <button key="perfil" className="user-menu-item" onClick={() => {
          setShowUserActions(false);
          history.push("/jugador/perfil");
        }}>
          <IonIcon icon={personCircleOutline} />
          Mi perfil de jugador
        </button>
      );
    } else if (userRole === 'entrenador') {
      items.push(
        <button key="perfil" className="user-menu-item" onClick={() => {
          setShowUserActions(false);
          history.push("/entrenador/perfil");
        }}>
          <IonIcon icon={personCircleOutline} />
          Mi perfil de entrenador
        </button>
      );
    } else {
      items.push(
        <button key="perfil" className="user-menu-item" onClick={() => {
          setShowUserActions(false);
          history.push("/perfil");
        }}>
          <IonIcon icon={personCircleOutline} />
          Mi perfil
        </button>
      );
    }
    
    // Añadir panel de administración para administradores
    if (userRole === 'administrador') {
      items.push(
        <button key="admin" className="user-menu-item" onClick={() => {
          setShowUserActions(false);
          history.push("/admin/AdminDashboard");
        }}>
          <IonIcon icon={settingsOutline} />
          Panel de administración
        </button>
      );
    }

    // Botón de búsqueda para persona_natural (EXACTAMENTE igual que en NavBar)
    if (userRole === 'persona_natural') {
      items.push(
        <button key="buscar" className="user-menu-item" onClick={() => {
          setShowUserActions(false);
          history.push("/home/buscar");
        }}>
          <IonIcon icon={searchOutline} />
          Buscar
        </button>
      );
    }
    
    // Elementos comunes para todos los usuarios autenticados
    items.push(
      <button key="config" className="user-menu-item" onClick={() => {
        setShowUserActions(false);
        history.push("/configuracion");
      }}>
        <IonIcon icon={settingsOutline} />
        Configuración
      </button>
    );
    
    items.push(
      <button key="logout" className="user-menu-item logout" onClick={handleLogout}>
        <IonIcon icon={logOutOutline} />
        Cerrar sesión
      </button>
    );
    
    return items;
  };

  // Mostrar botón de login si no hay usuario
  if (!usuario) {
    return (
      <div className="mobile-tab-bar">
        <div className="tab-bar-container">
          {/* Botones básicos para usuarios no autenticados */}
          <button
            className={`tab-item ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => handleNavClick("/inicio")}
          >
            <IonIcon icon={homeSharp} className="tab-icon" />
            <span className="tab-text">Inicio</span>
          </button>
          
          <button
            className={`tab-item ${activeTab === '/equipos' ? 'active' : ''}`}
            onClick={handleEquiposClick}
          >
            <IonIcon icon={peopleSharp} className="tab-icon" />
            <span className="tab-text">Equipos</span>
          </button>
          
          <button
            className={`tab-item ${activeTab === '/partidos' ? 'active' : ''}`}
            onClick={() => handleNavClick("/partidos")}
          >
            <IonIcon icon={footballSharp} className="tab-icon" />
            <span className="tab-text">Partidos</span>
          </button>
          
          <button
            className={`tab-item ${activeTab === '/campeonatos' ? 'active' : ''}`}
            onClick={() => handleNavClick("/campeonatos")}
          >
            <IonIcon icon={trophySharp} className="tab-icon" />
            <span className="tab-text">Competición</span>
          </button>
          
          <button
            className="tab-item login-tab"
            onClick={() => handleNavClick("/auth")}
          >
            <IonIcon icon={logInSharp} className="tab-icon" />
            <span className="tab-text">Login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay para equipos dropdown */}
      {showEquiposDropdown && (
        <div 
          className="equipos-dropdown-overlay"
          onClick={() => setShowEquiposDropdown(false)}
        >
          <div className="equipos-dropdown-menu">
            <div className="equipos-dropdown-header">
              <h3>Equipos más buscados</h3>
            </div>
            
            <div className="equipos-dropdown-items">
              {equiposPopulares.length === 0 ? (
                <div className="equipos-loading">Cargando equipos...</div>
              ) : (
                equiposPopulares.map(equipo => (
                  <button
                    key={equipo.id}
                    className="equipo-dropdown-item"
                    onClick={() => handleEquipoSelect(equipo)}
                  >
                    <img
                      src={
                        equipo.imagen_url 
                          ? (equipo.imagen_url.startsWith('http') 
                              ? equipo.imagen_url 
                              : `${apiBaseUrl}${equipo.imagen_url.startsWith('/') ? equipo.imagen_url : '/' + equipo.imagen_url}`)
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(equipo.nombre.charAt(0))}&background=ff9800&color=fff&size=40`
                      }
                      alt={`${equipo.nombre} escudo`}
                      className="equipo-logo"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(equipo.nombre.charAt(0))}&background=ff9800&color=fff&size=40`;
                      }}
                    />
                    <span 
                      style={{ 
                        color: '#FFE600', 
                        fontWeight: '700', 
                        fontSize: '16px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      {equipo.nombre}
                    </span>
                  </button>
                ))
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* Overlay para acciones adicionales */}
      {showUserActions && (
        <div 
          className="user-actions-overlay"
          onClick={() => setShowUserActions(false)}
        >
          <div className="user-actions-menu">
            <div className="user-actions-header">
              <div className="user-info">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&size=40`}
                  alt="Avatar"
                  className="user-avatar-small"
                />
                <div>
                  <div className="user-name">{usuario.nombre_completo}</div>
                  <div className="user-role">
                    {usuario.rol === "administrador" ? "Administrador" :
                      usuario.rol === "jugador" ? "Jugador" :
                        usuario.rol === "persona_natural" ? "Perfil" :
                          usuario.rol === "entrenador" ? "Entrenador" : "Usuario"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="user-actions-items">
              {renderUserMenuItems()}
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar Principal */}
      <div className="mobile-tab-bar">
        <div className="tab-bar-container">
          {/* Botón de Inicio */}
          <button
            className={`tab-item ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => handleNavClick("/inicio")}
          >
            <IonIcon icon={homeSharp} className="tab-icon" />
            <span className="tab-text">Inicio</span>
          </button>
          
          {/* Botón de Equipos con dropdown */}
          <button
            className={`tab-item ${activeTab === '/equipos' || showEquiposDropdown ? 'active' : ''}`}
            onClick={handleEquiposClick}
          >
            <IonIcon icon={peopleSharp} className="tab-icon" />
            <span className="tab-text">Equipos</span>
          </button>
          
          {/* Mostrar hasta 2 items principales del navbar */}
          {navItems.slice(0, 2).map(item => (
            <button
              key={item.path}
              className={`tab-item ${activeTab === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <IonIcon icon={item.icon} className="tab-icon" />
              <span className="tab-text">{item.text}</span>
            </button>
          ))}
          
          {/* Botón de usuario/más opciones */}
          <button
            className={`tab-item user-tab ${showUserActions ? 'active' : ''}`}
            onClick={() => setShowUserActions(!showUserActions)}
          >
            <div className="user-tab-content">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&size=24`}
                alt="Avatar"
                className="user-avatar-tab"
              />
            </div>
            <span className="tab-text">Más</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileTabBar;
