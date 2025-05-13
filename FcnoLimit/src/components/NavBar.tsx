import React, { useState, useEffect, useRef } from "react";
import { IonIcon, IonButton, IonPopover, IonList, IonItem } from "@ionic/react";
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
  chevronForwardOutline
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
  const navbarRef = useRef<HTMLDivElement>(null);

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

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: "/inicio", icon: homeSharp, text: "Inicio" },
    { path: "/equipos", icon: peopleSharp, text: "Equipos" },
    { path: "/partidos", icon: footballSharp, text: "Partidos" },
    { path: "/campeonatos", icon: trophySharp, text: "Campeonatos" },
    { path: "/comparativas", icon: gitCompareSharp, text: "Comparativas" },
    { path: "/noticias", icon: newspaperSharp, text: "Noticias" },
  ];

  const handleNavClick = (path: string) => {
    history.push(path);
    setIsOpen(false);
  };

  const handleUserButtonClick = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
    setShowUserMenu(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setShowUserMenu(false);
    setIsOpen(false);
    history.push("/auth");
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${scrolled ? "scrolled" : ""}`} ref={navbarRef}>
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/" onClick={(e) => {e.preventDefault(); handleNavClick("/inicio")}}>
              <IonIcon icon={footballOutline} />
              <div className="brand-text">
                FCnoLimit
                <span className="brand-slogan d-none d-lg-inline">
                  El fútbol amateur al siguiente nivel
                </span>
              </div>
            </a>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${isOpen ? " show" : ""}`}>
            {/* Botón para cerrar menú en móvil */}
            <button className="navbar-close-btn d-lg-none" onClick={() => setIsOpen(false)}>
              <IonIcon icon={closeCircleOutline} />
            </button>
            
            {/* Perfil de usuario en móvil */}
            {usuario && (
              <div className="user-profile-mobile d-lg-none">
                <div className="user-avatar-mobile">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&size=80`}
                    alt="Avatar"
                    width="80"
                    height="80"
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
            
            <ul className="navbar-nav">
              {mainNavItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <button
                    className={`nav-link btn btn-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavClick(item.path)}
                    type="button"
                  >
                    <IonIcon icon={item.icon} />
                    <span>{item.text}</span>
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
            
            {/* Avatar y nombre como botón con menú (solo en desktop) */}
            {usuario && (
              <div className="d-none d-lg-block">
                <IonButton
                  className="user-button"
                  onClick={handleUserButtonClick}
                  fill="clear"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&rounded=true&size=32`}
                    alt="avatar"
                    className="user-avatar"
                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                  />
                  <span style={{ color: "#fff", fontWeight: 500, marginLeft: "0.5rem" }}>{usuario.nombre_completo}</span>
                  <IonIcon icon={chevronForwardOutline} style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }} />
                </IonButton>
                <IonPopover
                  isOpen={showUserMenu}
                  event={popoverEvent}
                  onDidDismiss={() => setShowUserMenu(false)}
                  className="user-popover"
                >
                  <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee" }}>
                    <h5 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{usuario.nombre_completo}</h5>
                    <p style={{ margin: "5px 0 0", fontSize: "14px", color: "#666" }}>
                      {usuario.rol === "administrador" ? "Administrador" : 
                       usuario.rol === "jugador" ? "Jugador" : 
                       usuario.rol === "persona_natural" ? "Perfil" : 
                       usuario.rol === "entrenador" ? "Entrenador" : "Usuario"}
                    </p>
                  </div>
                  <IonList>
                    <IonItem button onClick={() => {
                      setShowUserMenu(false);
                      history.push("/perfil");
                    }}>
                      <IonIcon icon={personCircleOutline} slot="start" />
                      Mi perfil
                    </IonItem>
                    {usuario.rol === "administrador" && (
                      <IonItem button onClick={() => {
                        setShowUserMenu(false);
                        history.push("/admin");
                      }}>
                        <IonIcon icon={settingsOutline} slot="start" />
                        Panel de administración
                      </IonItem>
                    )}
                    <IonItem button onClick={handleLogout}>
                      <IonIcon icon={logOutOutline} slot="start" />
                      Cerrar sesión
                    </IonItem>
                  </IonList>
                </IonPopover>
              </div>
            )}
            
            {/* Acciones de usuario en móvil */}
            {usuario && (
              <div className="user-actions-mobile d-lg-none">
                <button 
                  className="user-action-btn"
                  onClick={() => {
                    setIsOpen(false);
                    history.push("/perfil");
                  }}
                >
                  <IonIcon icon={personCircleOutline} />
                  <span>Mi perfil</span>
                </button>
                
                {usuario.rol === "administrador" && (
                  <button 
                    className="user-action-btn"
                    onClick={() => {
                      setIsOpen(false);
                      history.push("/admin");
                    }}
                  >
                    <IonIcon icon={settingsOutline} />
                    <span>Panel de administración</span>
                  </button>
                )}
                
                <button 
                  className="user-action-btn logout-btn"
                  onClick={handleLogout}
                >
                  <IonIcon icon={logOutOutline} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Overlay para fondo oscuro en móvil */}
      <div 
        className={`navbar-overlay${isOpen ? " show" : ""}`} 
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
};

export default NavBar;
