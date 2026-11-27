
// INGENIA - Modulo geografico
// Version 0.4.1

const IngeniaGeo = (() => {

  const ciudades = [
    {
      nombre: "Venado Tuerto, Santa Fe, Argentina",
      latitud: -33.7456,
      longitud: -61.9688,
      zona: "America/Argentina/Cordoba"
    },
    {
      nombre: "Funes, Santa Fe, Argentina",
      latitud: -32.9157,
      longitud: -60.8099,
      zona: "America/Argentina/Cordoba"
    },
    {
      nombre: "Rosario, Santa Fe, Argentina",
      latitud: -32.9468,
      longitud: -60.6393,
      zona: "America/Argentina/Cordoba"
    },
    {
      nombre: "Madrid, España",
      latitud: 40.4168,
      longitud: -3.7038,
      zona: "Europe/Madrid"
    },
    {
      nombre: "Tokio, Japón",
      latitud: 35.6762,
      longitud: 139.6503,
      zona: "Asia/Tokyo"
    }
  ];

  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function buscarCiudad(texto) {

    const consulta = normalizar(texto);

    if (!consulta) return null;

    const resultados = ciudades.filter(ciudad => {
      const nombre = normalizar(ciudad.nombre);
      const localidad = nombre.split(",")[0];

      return nombre.includes(consulta) ||
        consulta.split(",")[0].trim() === localidad;
    });

    return resultados.length === 1
      ? { ...resultados[0] }
      : null;
  }

  return {
    buscarCiudad
  };

})();
