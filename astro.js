
// INGENIA - Motor astrologico
// Version 0.3.1
// Zodiaco tropical geocentrico

const IngeniaAstro = (() => {

  const signos = [
    "Aries", "Tauro", "Geminis",
    "Cancer", "Leo", "Virgo",
    "Libra", "Escorpio", "Sagitario",
    "Capricornio", "Acuario", "Piscis"
  ];

  const simbolos = [
    "♈", "♉", "♊", "♋", "♌", "♍",
    "♎", "♏", "♐", "♑", "♒", "♓"
  ];

  const planetas = [
    { nombre: "Sol", simbolo: "☉", body: "Sun" },
    { nombre: "Luna", simbolo: "☽", body: "Moon" },
    { nombre: "Mercurio", simbolo: "☿", body: "Mercury" },
    { nombre: "Venus", simbolo: "♀", body: "Venus" },
    { nombre: "Marte", simbolo: "♂", body: "Mars" },
    { nombre: "Jupiter", simbolo: "♃", body: "Jupiter" },
    { nombre: "Saturno", simbolo: "♄", body: "Saturn" },
    { nombre: "Urano", simbolo: "♅", body: "Uranus" },
    { nombre: "Neptuno", simbolo: "♆", body: "Neptune" },
    { nombre: "Pluton", simbolo: "♇", body: "Pluto" }
  ];

  function normalizar(grados) {
    return ((grados % 360) + 360) % 360;
  }

  function posicionZodiacal(longitud) {

    const totalMinutos =
      Math.round(normalizar(longitud) * 60) % 21600;

    const indice = Math.floor(totalMinutos / 1800);
    const resto = totalMinutos % 1800;

    return {
      signo: signos[indice],
      simbolo: simbolos[indice],
      grado: Math.floor(resto / 60),
      minuto: resto % 60,
      longitud: normalizar(longitud)
    };
  }

  function calcularPlanetas(fechaUTC) {

    if (typeof Astronomy === "undefined") {
      throw new Error(
        "La biblioteca astronomica no esta cargada."
      );
    }

    const fecha = new Date(fechaUTC);

    if (isNaN(fecha.getTime())) {
      throw new Error("Fecha invalida.");
    }

    return planetas.map(planeta => {

      const vector = Astronomy.GeoVector(
        planeta.body,
        fecha,
        true
      );

      const ecliptica = Astronomy.Ecliptic(vector);

      return {
        planeta: planeta.nombre,
        glifo: planeta.simbolo,
        ...posicionZodiacal(ecliptica.elon)
      };

    });
  }

  function calcularAspectos(posiciones) {

    const definiciones = [
      { nombre: "Conjuncion", angulo: 0, orbe: 8 },
      { nombre: "Sextil", angulo: 60, orbe: 4 },
      { nombre: "Cuadratura", angulo: 90, orbe: 6 },
      { nombre: "Trigono", angulo: 120, orbe: 6 },
      { nombre: "Quincuncio", angulo: 150, orbe: 3 },
      { nombre: "Oposicion", angulo: 180, orbe: 8 }
    ];

    const resultados = [];

    for (let i = 0; i < posiciones.length; i++) {
      for (let j = i + 1; j < posiciones.length; j++) {

        let distancia = Math.abs(
          posiciones[i].longitud -
          posiciones[j].longitud
        );

        distancia = Math.min(
          distancia, 360 - distancia
        );

        for (const aspecto of definiciones) {

          const orbe = Math.abs(
            distancia - aspecto.angulo
          );

          if (orbe <= aspecto.orbe) {

            resultados.push({
              planeta1: posiciones[i].planeta,
              planeta2: posiciones[j].planeta,
              aspecto: aspecto.nombre,
              angulo: aspecto.angulo,
              orbe: Number(orbe.toFixed(3))
            });

          }
        }
      }
    }

    return resultados.sort((a, b) => a.orbe - b.orbe);
  }

  function calcularCarta(fechaUTC) {

    const posiciones = calcularPlanetas(fechaUTC);

    return {
      fechaUTC,
      planetas: posiciones,
      aspectos: calcularAspectos(posiciones)
    };
  }

  return {
    calcularCarta,
    calcularPlanetas,
    calcularAspectos,
    posicionZodiacal
  };

})();
