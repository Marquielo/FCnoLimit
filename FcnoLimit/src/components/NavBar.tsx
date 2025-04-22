import React from 'react';
import { IonIcon } from '@ionic/react';
import { football, people, trophy, list, podium, home, person, statsChart, gitCompare, logIn } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const history = useHistory();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/">
          MyApp
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/inicio')}
                type="button"
              >
                <IonIcon icon={home} className="me-2" />
                Inicio
              </button>
            </li>
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/auth')}
                type="button"
              >
                <IonIcon icon={logIn} className="me-2" />
                Auth
              </button>
            </li>
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/clasificaciones')}
                type="button"
              >
                <IonIcon icon={statsChart} className="me-2" />
                Clasificaciones
              </button>
            </li>
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/equipos')}
                type="button"
              >
                <IonIcon icon={people} className="me-2" />
                Equipos
              </button>
            </li>
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/jugadores')}
                type="button"
              >
                <IonIcon icon={person} className="me-2" />
                Jugadores
              </button>
            </li>
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/partidos')}
                type="button"
              >
                <IonIcon icon={football} className="me-2" />
                Partidos
              </button>
            </li>
            <li className="nav-item mx-1">
              <button className="nav-link btn btn-link p-0 d-flex align-items-center"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={() => history.push('/comparativas')}
                type="button"
              >
                <IonIcon icon={gitCompare} className="me-2" />
                Comparativas
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

