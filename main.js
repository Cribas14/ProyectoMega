// -----------------------------
// COLORES Y CONFIGURACIÓN INICIAL
// -----------------------------

// Colores para el efecto de parpadeo
let red = "rgb(255, 0, 0)";
let black = "rgb(11, 18, 32)";

// Fondo de inicio en negro
document.body.style.backgroundColor = black;

// Contador que limita la cantidad de parpadeos
let counter = 0;

// URLs de APIs
const API_PRESIDENTIAL = "https://elecciones-dev.mega.cl/api/v202511/resultados?redis=false&eleccion=4&zona=19001&zonaTipo=10";
// const API_DIPUTADOS = "pendiente";
// const API_CONCEJALES = "pendiente";
// const API_SENADORES = "pendiente";


// -----------------------------
// FUNCIONES
// -----------------------------

// Efecto visual de parpadeo rojo/negro
function flashRed() {
  let boxes = document.querySelectorAll(".caja");

  window.interval = setInterval(() => {
    let background = document.body.style.backgroundColor;

    if (background === black) {
      document.body.style.backgroundColor = red;
      boxes.forEach(box => box.style.backgroundColor = red);
    } else {
      document.body.style.backgroundColor = black;
      boxes.forEach(box => box.style.backgroundColor = black);
    }

    // Detener el parpadeo después de unas cuantas repeticiones
    if (counter > 4) {
      clearInterval(window.interval);
      counter = 0;
    } else {
      if (document.body.style.backgroundColor === red) {
        counter++;
      }
    }
  }, 600); // cada 0,6 segundos
}


// Actualizar y mostrar datos de Presidencial
async function updatePresidential() {
  try {
    // Pido los datos a la API
    let response = await fetch(API_PRESIDENTIAL);
    let data = await response.json();

    // Datos generales de la elección
    let voting = data.data.eleccion.votacion;

    // Lista de candidatos
    let candidates = data.data.zonas["1-19001"].candidatos;

    // Construyo el HTML con toda la información
    let html = `
      <p><strong>Votos totales:</strong> ${voting.votos}</p>
      <p><strong>Válidos:</strong> ${voting.validos}</p>
      <p><strong>Blancos:</strong> ${voting.blancos}</p>
      <p><strong>Nulos:</strong> ${voting.nulos}</p>
      <p><strong>Participación:</strong> ${voting.participacion}%</p>
      <p><strong>Mesas escrutadas:</strong> ${voting.escrutado}%</p>
      <p><strong>Última actualización:</strong> ${voting.actualizacion}</p>
      <p><strong>Candidatos:</strong></p>
      <ul>
    `;

    // Agrego cada candidato con sus datos
    candidates.forEach(c => {
      html += `
        <li>
          ${c.alias} (${c.partido.descripcion}) – 
          Votos: ${c.votacion.votos}, 
          ${c.votacion.porcentaje}%
        </li>
      `;
    });

    html += "</ul>";

    // Pego el resultado en la caja de Presidencial
    document.getElementById("presidencial-content").innerHTML = html;

    // Activo el parpadeo general
    flashRed();

  } catch (error) {
    console.error("Error cargando Presidencial:", error);
    document.getElementById("presidencial-content").textContent = "Error cargando datos";
  }
}


// Funciones temporales para las otras elecciones
function updateDiputados() {
  document.getElementById("diputados-content").textContent = "No disponible";
}

function updateConcejales() {
  document.getElementById("concejales-content").textContent = "No disponible";
}

function updateSenadores() {
  document.getElementById("senadores-content").textContent = "No disponible";
}


// -----------------------------
// EJECUCIÓN PRINCIPAL
// -----------------------------

// Esta función actualiza todas las cajas
function updateAll() {
  updatePresidential();
  updateDiputados();
  updateConcejales();
  updateSenadores();
}

// Cuando la página carga, actualizo todo
window.onload = updateAll;

// Cada 60 segundos, vuelvo a pedir datos
setInterval(updateAll, 60000);
