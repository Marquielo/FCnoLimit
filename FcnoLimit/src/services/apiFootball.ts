import axios from 'axios';

const API_KEY = '170816abe4msh33c437bec184314p109a25jsndb09b8aae75e'; // Tu X-RapidAPI-Key real
const API_HOST = 'api-football-v1.p.rapidapi.com';
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

// IDs de ligas chilenas y europeas principales
const LIGAS_PERMITIDAS = {
  // Ligas Chilenas
  265: 'Primera División - Chile',
  266: 'Primera B - Chile',
  267: 'Copa Chile',
  
  // Ligas Europeas Principales
  39: 'Premier League - Inglaterra',
  140: 'La Liga - España', 
  61: 'Ligue 1 - Francia',
  78: 'Bundesliga - Alemania',
  135: 'Serie A - Italia',
  88: 'Eredivisie - Holanda',
  94: 'Primeira Liga - Portugal',
  144: 'Jupiler Pro League - Bélgica',
  
  // Competiciones Europeas
  2: 'UEFA Champions League',
  3: 'UEFA Europa League',
  848: 'UEFA Conference League',
  
  // Otras importantes
  203: 'Süper Lig - Turquía',
  218: 'Liga MX - México'
};

interface FixtureEvent {
  fixtureId: number;
  league: string;
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
  events: any;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
  date: string;
  venue: {
    name: string;
    city: string;
  };
}

// Trae partidos del día actual filtrados por ligas específicas
export const getLiveEvents = async (): Promise<FixtureEvent[]> => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: { date: dateStr },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });

    const data = response.data as { response: any[] };
    
    // Filtrar solo las ligas permitidas
    const partidosFiltrados = data.response.filter((fixture: any) => {
      const ligaId = fixture.league.id;
      return LIGAS_PERMITIDAS.hasOwnProperty(ligaId);
    });
      // Ver toda la información que trae la API
    console.log('Respuesta completa de la API:', data);
    console.log('Cantidad total de partidos:', data.response?.length || 0);
    console.log('Partidos de ligas chilenas/europeas:', partidosFiltrados.length);
    if (partidosFiltrados.length > 0) {
      console.log('Ejemplo de un partido filtrado:', partidosFiltrados[0]);
      // Verificar si hay eventos y si incluyen fotos de jugadores
      if (partidosFiltrados[0].events && partidosFiltrados[0].events.length > 0) {
        console.log('Eventos del primer partido:', partidosFiltrados[0].events);
        console.log('Primer evento completo:', partidosFiltrados[0].events[0]);
      }
    }
      return partidosFiltrados.map((fixture: any) => ({
      fixtureId: fixture.fixture.id,
      league: `${fixture.league.name} (${fixture.league.country})`,
      teams: {
        home: {
          id: fixture.teams.home.id,
          name: fixture.teams.home.name,
          logo: fixture.teams.home.logo
        },
        away: {
          id: fixture.teams.away.id,
          name: fixture.teams.away.name,
          logo: fixture.teams.away.logo
        }
      },
      goals: {
        home: fixture.goals.home,
        away: fixture.goals.away
      },
      score: {
        halftime: {
          home: fixture.score.halftime.home,
          away: fixture.score.halftime.away
        },
        fulltime: {
          home: fixture.score.fulltime.home,
          away: fixture.score.fulltime.away
        },
        extratime: {
          home: fixture.score.extratime.home,
          away: fixture.score.extratime.away
        },
        penalty: {
          home: fixture.score.penalty.home,
          away: fixture.score.penalty.away
        }
      },
      events: fixture.events || [],
      status: {
        long: fixture.fixture.status.long,
        short: fixture.fixture.status.short,
        elapsed: fixture.fixture.status.elapsed
      },
      date: fixture.fixture.date,
      venue: {
        name: fixture.fixture.venue?.name || 'Estadio no especificado',
        city: fixture.fixture.venue?.city || 'Ciudad no especificada'
      }
    }));
  } catch (error) {
    console.error('Error obteniendo partidos del día:', error);
    return [];
  }
};
