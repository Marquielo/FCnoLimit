import React, { useState, useEffect, useRef } from "react";
import { IonIcon, IonButton } from "@ionic/react";
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
  closeCircleOutline,
  settingsOutline,
  notificationsOutline,
  chevronForwardOutline,
  chevronDown
} from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | undefined>(undefined);
  const [isClosing, setIsClosing] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  // Referencia para el dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLDivElement>(null);

  const usuario = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")!) : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth > 991 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Bloquear scroll cuando el menú móvil esté abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Añade este efecto para manejar clics fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el dropdown está abierto y el clic fue fuera del dropdown y del botón de usuario
      if (
        showUserMenu &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    // Agregar evento al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpieza al desmontar
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const mainNavItems = [
    { path: "/inicio", icon: homeSharp, text: "Inicio" },
    { path: "/equipos", icon: peopleSharp, text: "Equipos" },
    { path: "/partidos", icon: footballSharp, text: "Partidos" },
    { path: "/campeonatos", icon: trophySharp, text: "Campeonatos" },
    { path: "/comparativas", icon: gitCompareSharp, text: "Comparativas" },
    { path: "/noticias", icon: newspaperSharp, text: "Noticias" },
  ];

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

  const handleUserButtonClick = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setShowUserMenu(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setShowUserMenu(false);
    handleMenuClose();
    history.push("/auth");
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
                  <div className="tar-mobile">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&size=80`}
                      alt="Avatar"
                      width="85"
                      height="85"
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
                {mainNavItems.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <button
                      className={`nav-link btn btn-link ${
                        // No aplicar "active" a Noticias si hay un usuario logueado
                        (usuario && item.path === "/noticias") 
                          ? "" 
                          : location.pathname === item.path 
                            ? "active" 
                            : ""
                      }`}
                      onClick={() => handleNavClick(item.path)}
                      type="button"
                    >
                      <IonIcon icon={item.icon} />
                      <span className="nav-text-visible">{item.text}</span>
                    </button>
                  </li>
                ))}
                {/* Mostrar botón Login solo si NO está logueado */}
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
              </ul>
            </div>

            {/* Acciones de usuario en móvil */}
            {usuario && (
              <div className="user-actions-mobile d-lg-none">
                <button
                  className="user-action-btn"
                  onClick={() => {
                    handleMenuClose();
                    history.push("/perfil");
                  }}
                >
                  <IonIcon icon={personCircleOutline} />
                  <span className="user-action-text">Mi perfil</span>
                </button>

                {usuario.rol === "administrador" && (
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
              <div className="d-none d-lg-block">
                <div
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  ref={userButtonRef}
                >
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
                      <a href="#" className="user-menu-item" onClick={(e) => {
                        e.preventDefault();
                        setShowUserMenu(false);
                        history.push("/perfil");
                      }}>
                        <IonIcon icon={personCircleOutline} />
                        Mi perfil
                      </a>

                      {usuario.rol === "administrador" && (
                        <a href="#" className="user-menu-item" onClick={(e) => {
                          e.preventDefault();
                          setShowUserMenu(false);
                          history.push("/admin");
                        }}>
                          <IonIcon icon={settingsOutline} />
                          Panel de administración
                        </a>
                      )}

                      <a href="#" className="user-menu-item" onClick={(e) => {
                        e.preventDefault();
                        setShowUserMenu(false);
                        history.push("/estadisticas");
                      }}>
                        <IonIcon icon={statsChartSharp} />
                        Estadísticas
                      </a>

                      <a href="#" className="user-menu-item" onClick={(e) => {
                        e.preventDefault();
                        setShowUserMenu(false);
                        history.push("/configuracion");
                      }}>
                        <IonIcon icon={settingsOutline} />
                        Configuración
                      </a>

                      <a href="#" className="user-menu-item" onClick={(e) => {
                        e.preventDefault();
                        setShowUserMenu(false);
                        history.push("/ayuda");
                      }}>
                        <IonIcon icon={notificationsOutline} />
                        Ayuda
                      </a>

                      <a href="#" className="user-menu-item logout" onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}>
                        <IonIcon icon={logOutOutline} />
                        Cerrar sesión
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
