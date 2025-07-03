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
import { authService } from '../services/authService';
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
          { path: "/admin/AdminDashboard", icon: settingsOutline, text: "Panel Admin" }, // <-- Cambiado aquí
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
  const handleLogout = async () => {
    try {
      await authService.logout();
      setShowUserMenu(false);
      handleMenuClose();
      history.push("/auth");
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar logout local incluso si falla el servidor
      setShowUserMenu(false);
      handleMenuClose();
      history.push("/auth");
    }
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
          history.push("/admin/AdminDashboard"); // <-- Cambiado aquí
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

  // Renderizado de los items de navegación según el perfil
  const renderNavItems = () => (
    <>
      {navItems
        .filter(item => item.path !== "/equipos") // Elimina el botón duplicado "Equipos"
        .map(item => (
          <li className="nav-item" key={item.path}>
            <button
              className={`nav-link btn btn-link ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
              type="button"
            >
              <IonIcon icon={item.icon} />
              <span className="nav-text-visible">{item.text}</span>
            </button>
          </li>
        ))}
    </>
  );

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
                {/* Equipos dropdown */}
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
                    <div className="equipos-dropdown-menu">
                      <div className="dropdown-title" style={{ fontWeight: 700, marginBottom: 10, fontSize: 16, color: "#fff" }}>
                        Equipos más buscados
                      </div>
                      {equiposPopulares.length === 0 ? (
                        <div className="dropdown-loading">Cargando...</div>
                      ) : (
                        equiposPopulares.map(eq => (
                          <button
                            key={eq.id}
                            className="dropdown-equipo-btn"
                            onClick={async () => {
                              setShowEquiposDropdown(false);
                              // Guarda el id del equipo seleccionado en localStorage (opcional)
                              localStorage.setItem("equipoSeleccionadoId", String(eq.id));
                              // Redirige a la página EquiposPage.tsx con el id del equipo
                              history.push(`/equipos/${eq.id}`);
                              handleMenuClose();
                            }}
                          >
                            <img
                              src={`${apiBaseUrl}/equipos/${eq.id}/escudo`}
                              alt={`${eq.nombre} escudo`}
                              className="dropdown-equipo-logo"
                            />
                            <span className="dropdown-equipo-nombre">
                              {eq.nombre}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </li>
                {/* Renderiza los items de navegación según el perfil */}
                {renderNavItems()}
                {/* ...otros items según login... */}
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
              <div className="d-none d-lg-flex align-items-center gap-2 user-section-container">
                {/* Botón de search a la izquierda del perfil */}
                {usuario.rol === 'persona_natural' && (
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
