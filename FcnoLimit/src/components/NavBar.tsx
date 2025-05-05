import React, { useState, useEffect } from "react";
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
} from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            {mainNavItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <button
                  className={`nav-link btn btn-link ${
                    isActive(item.path) ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(item.path)}
                  type="button"
                >
                  <IonIcon icon={item.icon} />
                  <span>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
