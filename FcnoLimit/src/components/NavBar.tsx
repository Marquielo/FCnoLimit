import React, { useState, useEffect } from "react";
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

  const usuario = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")!) : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { path: "/inicio", icon: homeSharp, text: "Inicio" },
    { path: "/equipos", icon: peopleSharp, text: "Equipos" },
    { path: "/jugadores", icon: footballOutline, text: "Jugadores" },
    { path: "/partidos", icon: footballSharp, text: "Partidos" },
    { path: "/campeonatos", icon: trophySharp, text: "Campeonatos" },
    { path: "/comparativas", icon: gitCompareSharp, text: "Comparativas" },
    { path: "/noticias", icon: newspaperSharp, text: "Noticias" },
    { path: "/auth", icon: logInSharp, text: "Login" },
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
    history.push("/auth");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
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
          <ul className="navbar-nav ms-auto">
            {mainNavItems
              .filter(item => item.path !== "/auth")
              .map((item) => (
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
          {/* Avatar y nombre como botón con menú */}
          {usuario && (
            <>
              <IonButton
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "1rem" }}
                onClick={handleUserButtonClick}
                fill="clear"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre_completo || "U")}&background=ff9800&color=fff&rounded=true&size=32`}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%" }}
                />
                <span style={{ color: "#fff", fontWeight: 500 }}>{usuario.nombre_completo}</span>
              </IonButton>
              <IonPopover
                isOpen={showUserMenu}
                event={popoverEvent}
                onDidDismiss={() => setShowUserMenu(false)}
              >
                <IonList>
                  {usuario && (
                    <>
                      <IonItem
                        button={usuario.rol === "administrador"}
                        disabled={usuario.rol !== "administrador"}
                        onClick={() => {
                          if (usuario.rol === "administrador") {
                            setShowUserMenu(false);
                            history.push("/admin");
                          }
                        }}
                      >
                        {usuario.rol === "administrador" ? "Administrador" : 
                         usuario.rol === "jugador" ? "Jugador" : 
                         usuario.rol === "persona_natural" ? "Perfil" : 
                         usuario.rol === "entrenador" ? "Entrenador" : "Usuario"}
                      </IonItem>
                      <IonItem button onClick={handleLogout}>
                        <IonIcon icon={logOutOutline} slot="start" />
                        Cerrar sesión
                      </IonItem>
                    </>
                  )}
                </IonList>
              </IonPopover>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
