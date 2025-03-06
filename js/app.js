document.addEventListener("DOMContentLoaded", function () {
  // Obtener el elemento que deseas llenar con el contenido guardado
  let muestraRutina = document.getElementById("muestra_rutina");

  // Verificar si hay contenido guardado en el local storage
  let contenidoGuardado = localStorage.getItem("contenido_rutina");

  // Si hay contenido guardado, establecerlo como el HTML de la sección
  if (contenidoGuardado) {
    muestraRutina.innerHTML = contenidoGuardado;
  }
});

//LLAMO LOS ELEMENTOS DEL DOM

const fecha = document.querySelector("#fecha");
const ingresoFecha = document.querySelector("#ingreso_fecha");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const cargaUno = document.querySelector("#carga_uno");
const dia = document.querySelector("#dia");
const grupo = document.querySelector("#grupo");
const buttonSumarDia = document.querySelector("#dia_grupo");
const agregarSubtitulo = document.querySelector("#agrega_subtitulo");
const circuito = document.querySelector("#circuito");
const muestraRutina = document.querySelector("#muestra_rutina");
const ingresoRutina = document.querySelector("#ingreso_rutina");
const ejercicios = document.querySelector("#ejercicios");
const divResultados = document.querySelector("#resultados");
const seriesRepeticiones = document.querySelector("#series_repeticiones");
const agregarEjercicio = document.querySelector("#agregar_ejercicio");
const observaciones = document.querySelector("#observaciones");
//CLASE MOLDE PARA EJERCICIOS
class Ejercicio {
  constructor(id, nombre, musculo, video, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.musculo = musculo;
    this.video = video;
    this.imagen = imagen;
  }
}

class BaseDeDatos {
  constructor() {
    this.ejerciciosBD = [];

    this.cargarRegistros();
  }
  async cargarRegistros() {
    const resultado = await fetch(`./json/ejercicios.json`);
    this.ejerciciosBD = await resultado.json();
  }
  //FUNCION QUE BUSCA POR GRUPO MUSCULAR
  registrosPorMusculos(musculo) {
    return this.ejerciciosBD.filter((m) => m.musculo == musculo);
  }
  registrosPorNombre(palabra) {
    return this.ejerciciosBD.filter((ejercicio) =>
      ejercicio.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

const bd = new BaseDeDatos();
//HACER QUE SE VAYAN AGREGANDO DEBAJO TODOS LOS DATOS QUE VOY COMPLETANDO
const imagenPerfil = document.querySelector("#input-imagen");
const labelImagen = document.querySelector("#labelImagen");

imagenPerfil.addEventListener("change", (event) => {
  let nameFile = event.target.files[0].name;
  labelImagen.textContent = `Archivo: ${nameFile}`;
});
cargaUno.addEventListener("click", () => {
  if (nombre.value === "" && apellido.value === "") {
    alert("No ha ingresado datos");
  } else {
    const fechaISO = fecha.value;
    const fechaLocal = new Date(fechaISO);
    fechaLocal.setDate(fechaLocal.getDate() + 1);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    let fechaFormateada = fechaLocal.toLocaleDateString("es-AR", options);
    // const imagenURL = sessionStorage.getItem("imagenURL");

    fechaFormateada = fechaFormateada.replace(/^\w/, (c) => c.toUpperCase());

    if (imagenPerfil.files.length > 0) {
      let archivo = imagenPerfil.files[0];
      let reader = new FileReader();

      reader.onload = function (event) {
        imagen = event.target.result;
        ingresoFecha.innerHTML += `<div class="datos_actuales"><div class="fecha_nombre"><p>Fecha: ${fechaFormateada} </p>
      <p class="nombre_apellido"><span class="apellido_span">${apellido.value.toUpperCase()}</span>${" "}<span class="nombre_span">${nombre.value.toUpperCase()}</span> </p>
      </div><img src="${imagen}" class="imagen_perfil" /></div>`;

        nombre.value = "";
        apellido.value = "";
        imagenPerfil.value = "";
        fecha.value = "";
      };
      reader.readAsDataURL(archivo);
    }
  }
});
const diasIngresados = new Set();

buttonSumarDia.addEventListener("click", () => {
  const diaActual = dia.value;
  if (diaActual > 0) {
    if (diasIngresados.has(diaActual.toString())) {
      alert("Este N° de día ya ha sido ingresado");
      return;
    }

    let editID = `editDia-${Date.now()}`;
    ingresoRutina.innerHTML += `
    
      <div class="h2_dia" data-dia="${diaActual}">
        <h2 class="diaSeleccionado"> DIA ${diaActual} - </h2>
        <h2 class="grupoMuscularSeleccionado"> ${grupo.value.toUpperCase()}</h2>
        <img class="editDia" data-set="${editID}" src="https://www.svgrepo.com/show/474672/edit-report.svg" alt=""><a href="#" class="btnQuitarDia" data-id="${diaActual}">
       
        <img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a>

      </div>
      
    `;

    diasIngresados.add(diaActual.toString());

    console.log(diasIngresados);
    // Agregamos el día al conjunto de días ingresados
  } else {
    alert("Número de día inválido");
  }
  dia.value = "";
  grupo.value = "";
});

// Delegación para manejar edición de día

// ✅ Usar delegación de eventos para manejar la eliminación
document.addEventListener("click", (event) => {
  if (event.target.closest(".btnQuitarDia")) {
    event.preventDefault();

    const boton = event.target.closest(".btnQuitarDia");
    const idDia = boton.dataset.id;
    const diaAEliminar = boton.closest(".h2_dia");

    if (diaAEliminar) {
      diaAEliminar.remove(); // Eliminar correctamente el div del DOM
      diasIngresados.delete(idDia); // También quitarlo del Set
    }
  }

  if (event.target.classList.contains("editDia")) {
    event.preventDefault();
    const boton = event.target;
    const editarID = boton.dataset.id;
    const h2Select = boton.previousElementSibling;

    if (h2Select) {
      h2Select.innerHTML = `
        <input class="cambioGrupo" type="text" name="" placeholder="Cambie grupo muscular"/>
        <img class="okNewDia" data-id="${editarID}" src="https://www.svgrepo.com/show/434169/ok-hand.svg" alt="">
      `;
      boton.remove();
    }
  }
  if (event.target.classList.contains("okNewDia")) {
    event.preventDefault();
    const boton = event.target;
    const obsID = boton.dataset.id.replace("btn-", "");
    const divEdit = boton.closest(".h2_dia");
    const diaActual = divEdit.querySelector(".diaSeleccionado");
    const text = divEdit.querySelector(".cambioGrupo").value;

    divEdit.innerHTML = ` <h2 class="diaSeleccionado">${
      diaActual.textContent
    }</h2>
        <h2 class="grupoMuscularSeleccionado"> ${text.toUpperCase()}</h2>
        <img class="editDia" data-set="${obsID}" src="https://www.svgrepo.com/show/474672/edit-report.svg" alt=""><a href="#" class="btnQuitarDia" data-id="${diaActual}">
       
        <img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a>`;
  }
});

agregarSubtitulo.addEventListener("click", () => {
  if (circuito.value === "") {
    alert("No ha ingresado datos");
  } else {
    ingresoRutina.innerHTML += `<div class="h3_circuito"><h3 class="textCircuito">${circuito.value.toUpperCase()}<img class="editCircuito" src="https://www.svgrepo.com/show/474672/edit-report.svg"/></h3><a href="#" class="btnQuitarDia" data-id="${
      circuito.value
    }"><img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a></div>`;
  }

  circuito.value = "";
});

ejercicios.addEventListener("input", function () {
  const textoBuscado = ejercicios.value.trim().toUpperCase();

  // Limpia el contenido anterior de resultados
  divResultados.innerHTML = "";

  if (textoBuscado === "") {
    return; // Si no hay texto, no se muestra la lista desplegable
  }

  // Filtro ejercicios que coincidan con el texto buscado
  const coincidencias = bd.ejerciciosBD.filter((ejercicio) =>
    ejercicio.nombre.toUpperCase().includes(textoBuscado)
  );

  // Creo y muestro la lista de coincidencias
  if (coincidencias.length > 0) {
    const listaCoincidencias = document.createElement("ul");
    listaCoincidencias.classList.add("ulEjercicios");

    coincidencias.forEach((ejercicio) => {
      const itemLista = document.createElement("li");
      itemLista.classList.add("liEjercicios");

      itemLista.textContent = ejercicio.nombre;

      itemLista.addEventListener("click", () => {
        ejercicios.value = ejercicio.nombre;
        divResultados.innerHTML = "";
      });

      listaCoincidencias.appendChild(itemLista);
    });

    divResultados.appendChild(listaCoincidencias);
    const listaCoincidenciasTeclado = document.querySelector(".ulEjercicios");
    let indiceSeleccionado = -1;

    ejercicios.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        // Mover la selección hacia arriba en la lista
        indiceSeleccionado = Math.max(indiceSeleccionado - 1, 0);

        actualizarSeleccion();
      } else if (event.key === "ArrowDown") {
        // Mover la selección hacia abajo en la lista
        indiceSeleccionado = Math.min(
          indiceSeleccionado + 1,
          listaCoincidenciasTeclado.children.length - 1
        );
        actualizarSeleccion();
      } else if (event.key === "Enter") {
        const seleccionado = document.querySelector(".liEjercicioSeleccionado");
        if (seleccionado) {
          ejercicios.value = seleccionado.textContent;
          divResultados.innerHTML = "";
        }
      } else if (event.key === "Tab") {
        const seleccionado = document.querySelector(".liEjercicioSeleccionado");
        if (seleccionado) {
          ejercicios.value = seleccionado.textContent;
          divResultados.innerHTML = "";
        }
      }
    });
    // Función para actualizar la selección en la lista
    function actualizarSeleccion() {
      // Remover la clase 'seleccionado' de todos los elementos de la lista
      Array.from(listaCoincidenciasTeclado.children).forEach((item, index) => {
        if (index === indiceSeleccionado) {
          item.classList.add("seleccionado");
          item.classList.replace("liEjercicios", "liEjercicioSeleccionado");
          ejercicios.value = item.textContent;
        } else {
          item.classList.replace("liEjercicioSeleccionado", "liEjercicios");
          item.classList.remove("seleccionado");
        }
      });
    }
  }
});

//Arreglo para ir subiendo los ejercicios que asigno a la rutina
const ejerciciosRutina = [];

agregarEjercicio.addEventListener("click", function () {
  if (
    ejercicios.value.trim() === "" ||
    seriesRepeticiones.value.trim() === ""
  ) {
    alert(
      ejercicios.value.trim() === ""
        ? "No ha ingresado ejercicio"
        : "No ha ingresado series y repeticiones"
    );
    return;
  }
  //Buscao por indice la coincidicencia que existe en el array de los ejercicios
  const ejercicio = ejercicios.value.toUpperCase();
  const indice = bd.ejerciciosBD.findIndex((el) => el.nombre === ejercicio);
  if (indice === -1) {
    alert("El ejercicio no está en la base de datos.");
    return;
  }

  // Generar IDs únicos
  // let idSection = `section-${Date.now()}`
  let idEjercicios = `ejercicio-${Date.now()}`;
  // let idSection2 = `section2-${Date.now()}`
  let idEdit = `edit-${Date.now()}`;

  ingresoRutina.innerHTML += `
    <section class="sectionContainer ejercicio" data-set="section-${idEjercicios}">
    <div id="${idEjercicios}"class="ejercicio" draggable="true" data-set="divEjercicio-${idEjercicios}">
      <p class="musculoEjercicio">${bd.ejerciciosBD[indice].musculo}</p>
      <p class="tituloEjercicio">${bd.ejerciciosBD[indice].nombre}</p>
      <p class="dato" >${seriesRepeticiones.value}</p>
      <p class="observaciones"> ${observaciones.value} <img class="editObs" data-id="${idEdit}" src="https://www.svgrepo.com/show/474672/edit-report.svg" alt=""></p>
      <a class="enlacesEjercicio" href="${bd.ejerciciosBD[indice].video}" target="_blank"><img class="imagenV" src="https://www.svgrepo.com/show/520494/video-course.svg" alt="icono video"/></a>
      <a href="#" class="btnQuitar enlacesEjercicio" data-id="delete-${idEjercicios}"><img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a>
    </div>
    </section>
    <section class="sectionContainer ejercicio"></section>`;

  ejercicios.value = "";
  seriesRepeticiones.value = "";
  observaciones.value = "";
});

const idBoton = `boton-${Date.now()}`;

// Función para agregar el botón en secciones vacías
function agregarBotonASeccionesVacias() {
  document.querySelectorAll(".sectionContainer").forEach((seccion) => {
    if (seccion.children.length === 0) {
      let boton = document.createElement("button");
      boton.textContent = "Eliminar";
      boton.className = "boton-eliminar";
      boton.dataset.id = idBoton;
      seccion.appendChild(boton);
      seccion.classList.remove("ejercicio");
      seccion.classList.add("tiene-boton");

      document.addEventListener("click", (event) => {
        const boton = event.target.closest(".boton-eliminar");
        if (boton) {
          const section = boton.closest(".sectionContainer");
          if (section) {
            section.remove();
          }
        }
      });
    }
  });
}

// Observador para detectar cambios en el DOM
const observer = new MutationObserver(() => {
  agregarBotonASeccionesVacias();
});

// Observa el `body` por cambios en los nodos
observer.observe(document.body, { childList: true, subtree: true });

// Ejecuta la función por si ya hay secciones vacías al cargar la página
agregarBotonASeccionesVacias();

//Delegación de eventos

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("editCircuito")) {
    event.preventDefault();
    const boton = event.target;

    const divSelect = boton.closest(".h3_circuito");
    const text = document.querySelector(".textCircuito");
    console.log(text.textContent);
    if (divSelect) {
      divSelect.innerHTML = `<div class="h3_circuito">
            <textarea class="textAreaObs">${text.textContent}</textarea>
          <img class="modificar" src="https://www.svgrepo.com/show/434169/ok-hand.svg" alt="">
          </div>`;
    }
  }
  if (event.target.classList.contains("modificar")) {
    event.preventDefault();
    const boton = event.target;
    console.log(boton);
    const divEdit = boton.closest(".h3_circuito");
    console.log(divEdit);
    const textArea = divEdit.querySelector(".textAreaObs").value;
    console.log(textArea);
    divEdit.innerHTML = `<h3 class="textCircuito">${textArea.toUpperCase()}<img class="editCircuito" src="https://www.svgrepo.com/show/474672/edit-report.svg"/></h3><a href="#" class="btnQuitarDia" data-id="${textArea}"><img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a>`;
  }
});

//Delegación de eventos para editar observaciones
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("editObs")) {
    event.preventDefault();
    const boton = event.target;
    const obsID = boton.dataset.id;
    const pSelect = boton.closest(".observaciones");
    const text = document.querySelector(".observaciones");
    if (pSelect) {
      pSelect.innerHTML = `
        <div class="divEdit">
          <textarea class="textAreaObs">${text.textContent}</textarea>
          <img class="modificar" data-id="$${obsID}" src="https://www.svgrepo.com/show/434169/ok-hand.svg" alt="">
        </div>`;
    }
  }
  if (event.target.classList.contains("modificar")) {
    event.preventDefault();
    const boton = event.target;
    const obsID = boton.dataset.id.replace("btn-", "");
    const divEdit = boton.closest(".divEdit");
    const textArea = divEdit.querySelector(".textAreaObs");
    const observaciones = divEdit.closest(".observaciones");
    observaciones.innerText = `${textArea.value}`;
    observaciones.innerHTML += `<img class="editObs" data-id="$${obsID}" src="https://www.svgrepo.com/show/474672/edit-report.svg" alt="">`;
  }
});

//Función para agregar eventos para eliminar renglones
function agregaEventoBotonEliminar(clase1, clase2) {
  document.addEventListener("click", (event) => {
    if (event.target.closest(clase1)) {
      event.preventDefault();
      const boton = event.target.closest(clase1);
      const divSelect = boton.closest(clase2);

      if (divSelect) {
        divSelect.remove();
      }
    }
  });
}
//Delegación para borrar ejercicio
agregaEventoBotonEliminar(".btnQuitar", ".ejercicio");

//Delegación para borrar circuito
agregaEventoBotonEliminar(".imagenX", ".h3_circuito");

// Delegación de eventos para dragstart (se activa cuando un ejercicio comienza a ser arrastrado)
document.addEventListener("dragstart", (event) => {
  if (event.target.classList.contains("ejercicio")) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
});

// Delegación de eventos para dragover y drop en las zonas contenedoras
document.addEventListener("dragover", (event) => {
  if (event.target.classList.contains("sectionContainer")) {
    event.preventDefault(); // Necesario para permitir el drop
    // event.target.style.background = "black";
  }
});

document.addEventListener("drop", (event) => {
  if (event.target.classList.contains("sectionContainer")) {
    event.preventDefault();
    const idEjercicio = event.dataTransfer.getData("text/plain");
    const elementoMovido = document.getElementById(idEjercicio);

    event.target.style.backgroundImage =
      "linear-gradient(to right, #a4161a, #161a1d)";

    if (elementoMovido) {
      elementoMovido.style.display = "flex"; // Mostrar nuevamente el elemento
      event.target.innerHTML = "";
      event.target.appendChild(elementoMovido);
    }
  }
});

//Delegación de evento para boton de borrar section vacio
agregaEventoBotonEliminar(".borrarSectionVacio", ".sectionContainer");

const guardadoProfesor = document.getElementById("generarDocProf");

aviso(
  guardadoProfesor,
  "Guarda el archivo en .html para que lo puedas volver a usar."
);
guardadoProfesor.addEventListener("click", function () {
  // Obtener la sección muestra_rutina
  const muestraRutina = document.getElementById("muestra_rutina");

  // Clonar la sección para manipularla sin afectar el DOM original
  const nuevaSeccion = muestraRutina.cloneNode(true);

  const rutinaProfesorNueva =
    "<!DOCTYPE html>" +
    "<html lang='en'>" +
    "<head>" +
    "<meta charset='UTF-8'>" +
    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
    "<link rel='shortcut icon' href='https://icons8.com/icon/65485/barbell' type='image/x-icon'>" +
    `<title> 
      ${apellido.value} 
      ${nombre.value} 
      </title>
      <style>
      * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100%;
      background-color: black;
      color: white;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    header{
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      align-items:center;
      margin-right:10px;
    }

    .logo_shadow{
      width:300px;
      height:150px;
      margin-left:20px;
    }
    main {
      color: white;
    }

   .h2_dia {
      background-color: white;
      color: black;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap:10px; 
      align-items: space-around;
      padding: 5px;
      margin: 5px;
    }

    .datos_actuales {
      display: flex;
      flex: row;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid white;
      padding: 5px;
      margin: 5px;
      text-align: center;
    }
    .fecha_nombre {
      width: 80%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .nombre_apellido {
      font-weight: 500;
    }
    
.imagen_perfil {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 5px;
  
}
.sectionContainer{
  background-image: linear-gradient(to right, #a4161a, #161a1d);
}

.ejercicio {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
}

.ejercicio p{
  width: 20%; 
  
}

.tituloEjercicio{
  font-weight: bolder;
}

.dato{
  font-style: italic;
  }
.imagenV {
  width: 50px;
  height: 50px;
}
.h3_circuito {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(167, 158, 158);
 
  margin: 5px;
  
}




.btnQuitar{
  display: none;
} 
  .editObs,
.modificar {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.textAreaObs {
  border-radius: 5px;
  outline: none;
  padding: 2px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-size: 1rem;
}


    
      </style>` +
    "</head>" +
    `<body> 
      <header>
      <img class="logo_shadow" src="https://i.ibb.co/4WsHDQX/Artboard-1-copy-8.png"/><div><h1>RUTINA DE ENTRENAMIENTO</h1></header>
      <main>
      <section id="muestra_rutina">
      ${nuevaSeccion.innerHTML}
      </section>
      </main>
      <footer></footer>
      </body> 
      </html>`;

  const apellidoSpan = document.querySelector(".apellido_span");
  const nombreSpan = document.querySelector(".nombre_span");

  const newBlob = new Blob([rutinaProfesorNueva], { type: "text/html" });

  const newLink = document.createElement("a");
  newLink.href = window.URL.createObjectURL(newBlob);
  newLink.download = `rutina_correcciones_${apellidoSpan.textContent.toLowerCase()}_${nombreSpan.textContent.toLocaleLowerCase()}.html`;

  // Simular clic en el enlace para iniciar la descarga
  newLink.click();
});

//Funcion para agregar carteles dinamicos

function aviso(elemento, texto) {
  elemento.addEventListener("mouseover", () => {
    const div = document.createElement("div");
    div.className = "infoGuardado";
    div.innerHTML = `<span>🚨</span>
    <p>${texto}</p>`;
    elemento.style.position = "relative ";
    elemento.appendChild(div);
    elemento.addEventListener("mouseleave", () => {
      const pAviso = document.querySelector(".infoGuardado");
      if (pAviso) {
        pAviso.remove();
      }
    });
  });
}

const generarDocumento = document.getElementById("generarDocumento");

aviso(generarDocumento, "Guarda documento en .html para convertilo a .pdf.");
// generarDocumento.addEventListener("mouseover", () => {
//   const p = document.createElement("p");
//   p.className = "infoGuardadoAlumno";
//   p.textContent = "Guarda documento html para luego guardar en pdf";
//   generarDocumento.appendChild(p);
//   generarDocumento.addEventListener("mouseout", () => {
//     const pAviso = document.querySelector(".infoGuardadoAlumno");
//     if (pAviso) {
//       pAviso.remove();
//     }
//   });
// });
generarDocumento.addEventListener("click", function () {
  // Obtener la sección muestra_rutina
  const muestraRutina = document.getElementById("muestra_rutina");

  // Clonar la sección para manipularla sin afectar el DOM original
  const nuevaSeccion = muestraRutina.cloneNode(true);

  // Obtener todas las imágenes dentro de la nueva sección
  const imagenes = nuevaSeccion.querySelectorAll(".imagenX");
  const imagenesEdit = nuevaSeccion.querySelectorAll(".editObs");
  const sections = nuevaSeccion.querySelectorAll(".sectionContainer");
  const editDias = nuevaSeccion.querySelectorAll(".editDia");
  const editCircuito = nuevaSeccion.querySelectorAll(".editCircuito");

  // Filtrar las imágenes que no sean close.svg y eliminarlas
  for (let i = 0; i < editCircuito.length; i++) {
    if (editCircuito[i].src.includes("edit-report.svg")) {
      editCircuito[i].parentNode.removeChild(editCircuito[i]);
    }
  }
  for (let i = 0; i < imagenes.length; i++) {
    if (imagenes[i].src.includes("close.svg")) {
      imagenes[i].parentNode.removeChild(imagenes[i]);
    }
  }

  for (let i = 0; i < imagenesEdit.length; i++) {
    if (imagenesEdit[i].src.includes("edit-report.svg")) {
      imagenesEdit[i].parentNode.removeChild(imagenesEdit[i]);
    }
  }

  for (let i = 0; i < sections.length; i++) {
    if (sections[i].querySelector(".boton-eliminar")) {
      sections[i].remove();
    }
  }

  for (let i = 0; i < editDias.length; i++) {
    if (editDias[i].src.includes("edit-report.svg")) {
      editDias[i].parentNode.removeChild(editDias[i]);
    }
  }
  // Crear un nuevo documento HTML con el contenido filtrado
  const rutinaAlumnoNueva =
    "<!DOCTYPE html>" +
    "<html lang='en'>" +
    "<head>" +
    "<meta charset='UTF-8'>" +
    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
    "<link rel='shortcut icon' href='https://icons8.com/icon/65485/barbell' type='image/x-icon'>" +
    `<title> 
      ${apellido.value} 
      ${nombre.value} 
      </title>
      <style>
      * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      width: 100%;
      background-color: black;
      color: white;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    header{
      display:flex;
      flex-direction:row;
      justify-content:space-between;
      align-items:center;
      margin-right:10px;
    }

    .logo_shadow{
      width:300px;
      height:150px;
      margin-left:20px;
    }
    main {
      color: white;
    }

   .h2_dia {
      background-color: white;
      color: black;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap:10px; 
      align-items: space-around;
      padding: 5px;
      margin: 5px;
    }

    .datos_actuales {
      display: flex;
      flex: row;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid white;
      padding: 5px;
      margin: 5px;
      text-align: center;
    }
    .fecha_nombre {
      width: 80%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .nombre_apellido {
      font-weight: 500;
    }
    
.imagen_perfil {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 5px;
  
}
.sectionContainer{
  background-image: linear-gradient(to right, #a4161a, #161a1d);
}

.ejercicio {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
}

.ejercicio p{
  width: 20%; 
  
}

.tituloEjercicio{
  font-weight: bolder;
}

.dato{
  font-style: italic;
  }
.imagenV {
  width: 50px;
  height: 50px;
}
.h3_circuito {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(167, 158, 158);
 
  margin: 5px;
  
}




.btnQuitar{
  display: none;
} 
  .editObs,
.modificar {
  width: 50px;
  height: 50px;
  cursor: pointer;
}

.textAreaObs {
  border-radius: 5px;
  outline: none;
  padding: 2px;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  font-size: 1rem;
} 


    
      </style>` +
    "</head>" +
    `<body> 
      <header>
      <img class="logo_shadow" src="https://i.ibb.co/4WsHDQX/Artboard-1-copy-8.png"/><div><h1>RUTINA DE ENTRENAMIENTO</h1></header>
      <main>
      <section id="muestra_rutina">
      ${nuevaSeccion.innerHTML}
      </section>
      </main>
      <footer></footer>
      </body> 
      </html>`;

  const apellidoSpan = document.querySelector(".apellido_span");
  const nombreSpan = document.querySelector(".nombre_span");

  // Convertir el contenido a un Blob
  const blob = new Blob([rutinaAlumnoNueva], { type: "text/html" });

  // Crear un enlace para la descarga
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `rutina_${apellidoSpan.textContent.toLowerCase()}_${nombreSpan.textContent.toLowerCase()}.html`;

  // Simular clic en el enlace para iniciar la descarga
  link.click();
});

//Hago que el button eliminar borre todo el contenido de la rutina

const borrarRutina = document.querySelector("#borrarRutina");

aviso(borrarRutina, "Borra todo lo agregado en pantalla.");

borrarRutina.addEventListener("click", () => {
  localStorage.removeItem("contenido_rutina");
  ingresoFecha.innerHTML = "";
  ingresoRutina.innerHTML = "";
  location.reload();
});

// Guardado de rutina provisorio

const guardarRutina = document.querySelector("#guardarRutina");

aviso(guardarRutina, "Guarda todo lo que vas agregando en pantalla.");
guardarRutina.addEventListener("click", () => {
  let contenidoHTML = muestraRutina.innerHTML;
  localStorage.setItem("contenido_rutina", contenidoHTML);
});

const rutinaGuardada = document.querySelector("#rutinaGuardada");
const label = document.querySelector(".btnCustomFile");
aviso(
  label,
  "Carga rutina guardada como profe, una vez agregado en pantalla fecha, datos y foto."
);
rutinaGuardada.addEventListener("change", function (event) {
  const archivo = event.target.files[0];

  if (archivo && archivo.type === "text/html") {
    label.textContent = "Cargar otra rutina";

    const reader = new FileReader();

    reader.onload = function (e) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(e.target.result, "text/html");

      const parteDeseada = doc.querySelector("#ingreso_rutina");
      if (parteDeseada) {
        ingresoRutina.innerHTML = parteDeseada.innerHTML;
      } else {
        alert("No se encontro el elemento deseado");
      }
    };

    reader.readAsText(archivo);
  } else {
    alert("Porfavor seleccionar archivo html válido");
  }
});
