// INGENIA - Motor de casas astrologicas
// Version 0.5.1 - Ascendente y Medio Cielo

const IngeniaCasas = (() => {

  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  function normalizar(grados) {
    return ((grados % 360) + 360) % 360;
  }

  function calcularAngulos(fechaUTC, latitud, longitud) {

    const fecha = new Date(fechaUTC);

    if (!Number.isFinite(fecha.getTime())) {
      throw new Error("Fecha UTC invalida.");
    }

    if (!Number.isFinite(latitud) ||
        !Number.isFinite(longitud) ||
        Math.abs(latitud) >= 90 ||
        Math.abs(longitud) > 180) {
      throw new Error("Coordenadas invalidas.");
    }

    const JD = fecha.getTime() / 86400000 + 2440587.5;

    const T = (JD - 2451545.0) / 36525;

    const oblicuidad =
      23.439291111 -
      0.013004167 * T -
      0.000000164 * T * T +
      0.000000504 * T * T * T;

    const GMST = normalizar(
      280.46061837 +
      360.98564736629 * (JD - 2451545.0) +
      0.000387933 * T * T -
      T * T * T / 38710000
    );

    const tiempoSideral = normalizar(GMST + longitud);

    const theta = tiempoSideral * RAD;
    const epsilon = oblicuidad * RAD;
    const phi = latitud * RAD;

    const medioCielo = normalizar(
      Math.atan2(
        Math.sin(theta),
        Math.cos(theta) * Math.cos(epsilon)
      ) * DEG
    );

    const ascendente = normalizar(
      Math.atan2(
        -Math.cos(theta),
        Math.sin(theta) * Math.cos(epsilon) +
        Math.tan(phi) * Math.sin(epsilon)
      ) * DEG + 180
    );

    return {
      ascendente,
      medioCielo,
      descendente: normalizar(ascendente + 180),
      fondoCielo: normalizar(medioCielo + 180),
      tiempoSideral,
      oblicuidad,
      diaJuliano: JD
    };

  }

  return {
    calcularAngulos
  };

})();
