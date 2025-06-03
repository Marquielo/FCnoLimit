import React, { useState, useEffect, useRef } from "react";
import { IonIcon } from "@ionic/react";
import {
  footballOutline,
  peopleSharp,
  trophySharp,
  statsChartSharp,
  gitCompareSharp,
  logInSharp,
  footballSharp,
  homeSharp,
  newspaperSharp,
  personCircleOutline,
  logOutOutline,
  settingsOutline,
  notificationsOutline,
  chevronDown,
  calendarOutline,
  documentTextOutline,
  fitnessOutline,
  searchOutline
} from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./NavBar.css";

const apiBaseUrl = 'https://fcnolimit-back.onrender.com';

const NavBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showEquiposDropdown, setShowEquiposDropdown] = useState(false);
  const [equiposPopulares, setEquiposPopulares] = useState<any[]>([]);
  const navbarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLDivElement>(null);
  const equiposDropdownRef = useRef<HTMLLIElement>(null); // Cambiado de HTMLDivElement a HTMLLIElement

  // Obtener el usuario del localStorage
  const usuario = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")!) : null;
  const userRole = usuario?.rol || 'no_auth';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth > 991 && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }

      if (
        showEquiposDropdown &&
        equiposDropdownRef.current &&
        !equiposDropdownRef.current.contains(event.target as Node)
      ) {
        setShowEquiposDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, showUserMenu, showEquiposDropdown]);

  // Fetch equipos populares solo cuando se abre el dropdown
  useEffect(() => {
    if (showEquiposDropdown && equiposPopulares.length === 0) {
      fetch(`${apiBaseUrl}/api/equipos?top=8`)
        .then(res => res.json())
        .then(data => setEquiposPopulares(data))
        .catch(() => setEquiposPopulares([]));
    }
  }, [showEquiposDropdown, equiposPopulares.length]);

  // Definir las rutas de navegación según el rol del usuario
  const getNavItems = () => {
    // Items comunes para todos los usuarios
    const commonItems = [
      { path: "/equipos", icon: peopleSharp, text: "Equipos" },
      { path: "/partidos", icon: footballSharp, text: "Partidos" },
      { path: "/campeonatos", icon: trophySharp, text: "Competicion" },
    ];
    
    // Items específicos según rol
    switch (userRole) {
      case 'administrador':
        return [
          ...commonItems,
          { path: "/admin", icon: settingsOutline, text: "Panel Admin" },
          { path: "/estadisticas", icon: statsChartSharp, text: "Estadísticas" },
          { path: "/comparativas", icon: gitCompareSharp, text: "Comparativas" },
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

  // Nueva función para abrir el menú
  const handleMenuOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
    document.body.style.overflow = 'hidden';
  };

  // Nueva función para cerrar el menú con animación
  const handleMenuClose = () => {
    setIsClosing(true);
    document.body.style.overflow = '';

    // Esperamos a que termine la animación de cierre antes de ocultar completamente
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleNavClick = (path: string) => {
    history.push(path);
    handleMenuClose();
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setShowUserMenu(false);
    handleMenuClose();
    history.push("/auth");
  };

  // Renderizar elementos de menú de usuario según rol
  const renderUserMenuItems = () => {
    const items = [];
    
    // Añadir elemento de perfil según el rol
    if (userRole === 'jugador') {
      items.push(
        <a key="perfil" href="#" className="user-menu-item" onClick={(e) => {
          e.preventDefault();
          setShowUserMenu(false);
          history.push("/jugador/perfil");
        }}>
          <IonIcon icon={personCircleOutline} />
          Mi perfil de jugador
        </a>
      );
    } else if (userRole === 'entrenador') {
      items.push(
        <a key="perfil" href="#" className="user-menu-item" onClick={(e) => {
          e.preventDefault();
          setShowUserMenu(false);
          history.push("/entrenador/perfil");
        }}>
          <IonIcon icon={personCircleOutline} />
          Mi perfil de entrenador
        </a>
      );
    } else {
      items.push(
        <a key="perfil" href="#" className="user-menu-item" onClick={(e) => {
          e.preventDefault();
          setShowUserMenu(false);
          history.push("/perfil");
        }}>
          <IonIcon icon={personCircleOutline} />
          Mi perfil
        </a>
      );
    }
    
    // Añadir panel de administración para administradores
    if (userRole === 'administrador') {
      items.push(
        <a key="admin" href="#" className="user-menu-item" onClick={(e) => {
          e.preventDefault();
          setShowUserMenu(false);
          history.push("/admin");
        }}>
          <IonIcon icon={settingsOutline} />
          Panel de administración
        </a>
      );
    }
    
    // Elementos comunes para todos los usuarios autenticados
    items.push(
      <a key="config" href="#" className="user-menu-item" onClick={(e) => {
        e.preventDefault();
        setShowUserMenu(false);
        history.push("/configuracion");
      }}>
        <IonIcon icon={settingsOutline} />
        Configuración
      </a>
    );
    
    items.push(
      <a key="ayuda" href="#" className="user-menu-item" onClick={(e) => {
        e.preventDefault();
        setShowUserMenu(false);
        history.push("/ayuda");
      }}>
        <IonIcon icon={notificationsOutline} />
        Ayuda
      </a>
    );
    
    items.push(
      <a key="logout" href="#" className="user-menu-item logout" onClick={(e) => {
        e.preventDefault();
        handleLogout();
      }}>
        <IonIcon icon={logOutOutline} />
        Cerrar sesión
      </a>
    );
    
    return items;
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${scrolled ? "scrolled" : ""}`} ref={navbarRef}>
        <div className="fc-container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/" onClick={(e) => { e.preventDefault(); handleNavClick("/inicio") }}>
              <IonIcon icon={footballOutline} />
              <div className="brand-text">
                FCnoLimit
                <span className="brand-slogan d-none d-lg-inline">
                  El fútbol amateur al siguiente nivel
                </span>
              </div>
            </a>
          </div>

          {/* Botón hamburguesa solo visible cuando el menú está cerrado */}
          {!isOpen && (
            <button
              className={`navbar-toggler`}
              type="button"
              onClick={handleMenuOpen}
            >
              <div className="hamburger-icon">
                <span className="line line-1"></span>
                <span className="line line-2"></span>
                <span className="line line-3"></span>
              </div>
            </button>
          )}

          {/* Overlay para el fondo */}
          <div
            className={`navbar-overlay${isOpen ? " show" : ""}${isClosing ? " closing" : ""}`}
            onClick={handleMenuClose}
          ></div>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""} ${isClosing ? "closing" : ""}`}>
            {/* Header del menú móvil */}
            <div className="mobile-menu-header d-lg-none">
              <div className="mobile-logo">
                <IonIcon icon={footballOutline} className="mobile-logo-icon" />
                <span className="mobile-logo-text">FCnoLimit</span>
              </div>
              <button
                className="navbar-close-btn"
                onClick={handleMenuClose}
                aria-label="Cerrar menú"
              ></button>
            </div>

            <div className="mobile-menu-content">
              {/* Perfil de usuario en móvil */}
              {usuario && (
                <div className="user-profile-mobile d-lg-none">
                  <div className="user-avatar-mobile">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&size=80`}
                      alt="Avatar"
                    />
                  </div>
                  <div className="user-name-mobile">{usuario.nombre_completo}</div>
                  <div className="user-role-mobile">
                    {usuario.rol === "administrador" ? "Administrador" :
                      usuario.rol === "jugador" ? "Jugador" :
                        usuario.rol === "persona_natural" ? "Perfil" :
                          usuario.rol === "entrenador" ? "Entrenador" : "Usuario"}
                  </div>
                </div>
              )}

              {/* Título de sección principal */}
              <div className="menu-section-title d-lg-none">Navegación</div>

              <ul className="navbar-nav">
                {/* Orden original de los botones */}
                <li className="nav-item equipos-dropdown" ref={equiposDropdownRef} style={{ position: "relative" }}>
                  <button
                    className={`nav-link btn btn-link${showEquiposDropdown ? " active" : ""}`}
                    type="button"
                    onClick={() => setShowEquiposDropdown((v) => !v)}
                  >
                    <IonIcon icon={peopleSharp} />
                    <span className="nav-text-visible">Equipos</span>
                  </button>
                  {showEquiposDropdown && (
                    <div
                      className="equipos-dropdown-menu"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 9999,
                        minWidth: 220,
                        background: "#fff",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        borderRadius: 12,
                        marginTop: 4,
                        padding: 8,
                      }}
                    >
                      <div className="dropdown-title" style={{ fontWeight: 600, marginBottom: 8 }}>Equipos más buscados</div>
                      {equiposPopulares.length === 0 ? (
                        <div className="dropdown-loading">Cargando...</div>
                      ) : (
                        equiposPopulares.map(eq => (
                          <button
                            key={eq.id}
                            className="dropdown-equipo-btn"
                            onClick={() => {
                              setShowEquiposDropdown(false);
                              history.push(`/equipos/${eq.id}`);
                              handleMenuClose();
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              padding: "8px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              borderRadius: 8,
                              transition: "background 0.2s",
                            }}
                          >
                            <img
                              src={eq.logo || '/assets/equipos/default.png'}
                              alt={eq.nombre}
                              style={{ width: 24, height: 24, marginRight: 8, borderRadius: '50%' }}
                            />
                            <span>{eq.nombre}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </li>
                {/* Resto de los botones en su orden original */}
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${location.pathname === "/partidos" ? "active" : ""}`}
                    onClick={() => handleNavClick("/partidos")}
                    type="button"
                  >
                    <IonIcon icon={footballSharp} />
                    <span className="nav-text-visible">Partidos</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link ${location.pathname === "/campeonatos" ? "active" : ""}`}
                    onClick={() => handleNavClick("/campeonatos")}
                    type="button"
                  >
                    <IonIcon icon={trophySharp} />
                    <span className="nav-text-visible">Competicion</span>
                  </button>
                </li>
                {/* ...otros items según rol y login... */}
                {!usuario && (
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => handleNavClick("/auth")}
                      type="button"
                    >
                      <IonIcon icon={logInSharp} />
                      <span>Login</span>
                    </button>
                  </li>
                )}
                {/* ...otros items según rol... */}
              </ul>
            </div>

            {/* Acciones de usuario en móvil */}
            {usuario && (
              <div className="user-actions-mobile d-lg-none">
                {/* Botones de acción personalizados según rol en móvil */}
                {userRole === 'jugador' && (
                  <button
                    className="user-action-btn"
                    onClick={() => {
                      handleMenuClose();
                      history.push("/jugador/perfil");
                    }}
                  >
                    <IonIcon icon={personCircleOutline} />
                    <span className="user-action-text">Mi perfil</span>
                  </button>
                )}
                
                {userRole === 'entrenador' && (
                  <button
                    className="user-action-btn"
                    onClick={() => {
                      handleMenuClose();
                      history.push("/entrenador/equipo");
                    }}
                  >
                    <IonIcon icon={peopleSharp} />
                    <span className="user-action-text">Mi equipo</span>
                  </button>
                )}

                {userRole === 'administrador' && (
                  <button
                    className="user-action-btn"
                    onClick={() => {
                      handleMenuClose();
                      history.push("/admin");
                    }}
                  >
                    <IonIcon icon={settingsOutline} />
                    <span className="user-action-text">Admin</span>
                  </button>
                )}

                <button
                  className="user-action-btn logout-btn"
                  onClick={handleLogout}
                >
                  <IonIcon icon={logOutOutline} />
                  <span className="user-action-text">Cerrar sesión</span>
                </button>
              </div>
            )}

            {/* Avatar y nombre como botón con menú (solo en desktop) */}
            {usuario && (
              <div className="d-none d-lg-flex align-items-center gap-2">
                {/* Botón de search a la izquierda del perfil */}
                {userRole === 'persona_natural' && (
                  <button
                    className="navbar-competition-style"
                    onClick={() => handleNavClick("/home/buscar")}
                    type="button"
                  >
                    <IonIcon icon={searchOutline} className="navbar-search-icon" />
                    Buscar
                  </button>
                )}
                <div className="navbar-actions">
                  {userRole === 'jugador' && (
                    <button className="navbar-stats-btn">
                      Mis estadísticas
                    </button>
                  )}
                  <div className="user-button" onClick={toggleUserMenu} ref={userButtonRef}>
                    <div className="user-avatar-container">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff`}
                        alt={usuario.nombre_completo}
                        className="user-avatar"
                      />
                      <div className="user-status-indicator"></div>
                    </div>
                    <span className="user-name">{usuario.nombre_completo}</span>
                    <IonIcon icon={chevronDown} className="user-dropdown-icon" />
                  </div>
                  {showUserMenu && (
                    <div className="custom-user-dropdown" ref={dropdownRef}>
                      {/* Contenido del menú */}
                      <div className="user-menu-header">
                        <div className="user-avatar-dropdown">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=121921&size=48`}
                            alt={usuario.nombre_completo}
                          />
                        </div>
                        <div className="user-info-dropdown">
                          <div className="user-name-dropdown">{usuario.nombre_completo}</div>
                          <div className="user-role-dropdown">
                            {usuario.rol === "administrador" ? "Administrador" :
                              usuario.rol === "jugador" ? "Jugador" :
                                usuario.rol === "persona_natural" ? "Perfil" :
                                  usuario.rol === "entrenador" ? "Entrenador" : "Usuario"}
                          </div>
                        </div>
                      </div>
                      <div className="user-menu-items">
                        {renderUserMenuItems()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
