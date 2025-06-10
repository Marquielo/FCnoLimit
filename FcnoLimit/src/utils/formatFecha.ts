export function formatFecha(fecha: string) {
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (e) {
    return 'Fecha inválida';
  }
}
