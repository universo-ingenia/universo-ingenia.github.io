
// INGENIA - Motor de tiempo astronomico
// Version 0.3.4

const IngeniaTiempo = (() => {

  function convertirUTC(fecha, hora, zona) {

    const formato = new Intl.DateTimeFormat("en-GB", {
      timeZone: zona,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });

    const horaCompleta =
      hora.length === 5 ? hora + ":00" : hora;

    const objetivo = fecha + "T" + horaCompleta;

    const referencia = new Date(objetivo + "Z");

    if (
      isNaN(referencia.getTime()) ||
      referencia.toISOString().slice(0, 19) !== objetivo
    ) {
      throw new Error("Fecha u hora invalida.");
    }

    function obtenerHoraLocal(instante) {

      const partes = {};

      formato.formatToParts(instante).forEach(p => {
        partes[p.type] = p.value;
      });

      return (
        partes.year.padStart(4, "0") + "-" +
        partes.month + "-" +
        partes.day + "T" +
        partes.hour + ":" +
        partes.minute + ":" +
        partes.second
      );
    }

    const coincidencias = new Set();

    // Buscar los desfases horarios alrededor
    // de la fecha de nacimiento.

    for (let h = -48; h <= 48; h += 6) {

      const prueba = new Date(
        referencia.getTime() + h * 3600000
      );

      const local = obtenerHoraLocal(prueba);

      const desfase =
        Date.parse(local + "Z") - prueba.getTime();

      const candidato = new Date(
        referencia.getTime() - desfase
      );

      if (obtenerHoraLocal(candidato) === objetivo) {
        coincidencias.add(candidato.toISOString());
      }
    }

    if (coincidencias.size === 0) {
      throw new Error(
        "La hora indicada no existe en esta zona horaria."
      );
    }

    if (coincidencias.size > 1) {
      throw new Error(
        "Hora ambigua por cambio de horario. " +
        "Se necesita confirmar el desfase UTC."
      );
    }

    return [...coincidencias][0];
  }

  return {
    convertirUTC
  };

})();
