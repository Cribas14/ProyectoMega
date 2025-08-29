var rojo = "rgb(255, 0, 0)";
var negro = "rgb(11, 18, 32)";
document.body.style.backgroundColor = negro;
var counter = 0;

// APIs
const API_PRESIDENCIAL = "https://elecciones-dev.mega.cl/api/v202511/resultados?redis=false&eleccion=4&zona=19001&zonaTipo=10";
// const API_DIPUTADOS = "... (aún no disponible)"
// const API_CONCEJALES = "... (aún no disponible)"
// const API_SENADORES = "... (aún no disponible)"

// Flash rojo general
function flashRed() {
  let cajas = document.querySelectorAll(".caja");
  window.intervalo = setInterval(() => {
    let body = document.body.style.backgroundColor;
    if (body == negro) {
      document.body.style.backgroundColor = rojo;
      cajas.forEach(caja => caja.style.backgroundColor = rojo);
    } else {
      document.body.style.backgroundColor = negro;
      cajas.forEach(caja => caja.style.backgroundColor = negro);
    }
    if (counter > 4) {
      clearInterval(window.intervalo);
      counter = 0;
    } else {
      if (document.body.style.backgroundColor == rojo) {
        counter++;
      }
    }
  }, 600);
}

// Actualizar datos de Presidencial
async function actualizarPresidencial() {
  try {
    let response = await fetch(API_PRESIDENCIAL);
    let data = await response.json();

    let votacion = data.data.eleccion.votacion;
    let candidatos = data.data.zonas["1-19001"].candidatos;

    // Armamos el HTML con todos los datos
    let html = `
      <p><strong>Votos totales:</strong> ${votacion.votos}</p>
      <p><strong>Válidos:</strong> ${votacion.validos}</p>
      <p><strong>Blancos:</strong> ${votacion.blancos}</p>
      <p><strong>Nulos:</strong> ${votacion.nulos}</p>
      <p><strong>Participación:</strong> ${votacion.participacion}%</p>
      <p><strong>Mesas escrutadas:</strong> ${votacion.escrutado}%</p>
      <p><strong>Última actualización:</strong> ${votacion.actualizacion}</p>
      <p><strong>Candidatos:</strong></p>
      <ul>
    `;

    candidatos.forEach(c => {
      html += `
        <li>
          ${c.alias} (${c.partido.descripcion}) – 
          Votos: ${c.votacion.votos}, 
          ${c.votacion.porcentaje}%
        </li>
      `;
    });

    html += "</ul>";

    document.getElementById("presidencial-contenido").innerHTML = html;

    // Aviso visual general
    flashRed();

  } catch (error) {
    console.error("Error obteniendo datos Presidencial:", error);
    document.getElementById("presidencial-contenido").textContent = "Error cargando datos";
  }
}

// Simulación para las otras elecciones
function actualizarDiputados() {
  document.getElementById("diputados-contenido").textContent = "No disponible";
}

function actualizarConcejales() {
  document.getElementById("concejales-contenido").textContent = "No disponible";
}

function actualizarSenadores() {
  document.getElementById("senadores-contenido").textContent = "No disponible";
}

// Función principal para actualizar todo
function actualizarDatos() {
  actualizarPresidencial();
  actualizarDiputados();
  actualizarConcejales();
  actualizarSenadores();
}

// Ejecutar al cargar
window.onload = actualizarDatos;

// Refrescar cada 60 segundos
setInterval(actualizarDatos, 60000);
