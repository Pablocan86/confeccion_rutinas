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

    ingresoFecha.innerHTML += `<div class="datos_actuales"><div class="fecha_nombre"><p>Fecha: ${fechaFormateada} </p>
  <p class="nombre_apellido"><span class="apellido_span">${apellido.value.toUpperCase()}</span>${" "}<span class="nombre_span">${nombre.value.toUpperCase()}</span> </p>
  </div><img class="imagen_perfil" src="${imagenPerfil.value}"/></div>`;

    nombre.value = "";
    apellido.value = "";
    imagenPerfil.value = "";
    fecha.value = "";
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

    diasIngresados.add(diaActual.toString()); // Agregamos el día al conjunto de días ingresados
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
    ingresoRutina.innerHTML += `<div class="h3_circuito"><h3>${circuito.value.toUpperCase()}</h3><a href="#" class="btnQuitarDia" data-id="${
      circuito.value
    }"><img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a></div>`;
    const botonesQuitar = document.querySelectorAll(".btnQuitarDia");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idDia = String(boton.dataset.id);
        const diaAEliminar = document.querySelector(`[data-id="${idDia}"]`);
        if (diaAEliminar) {
          ingresoRutina.removeChild(diaAEliminar.parentElement);
        }
      });
    }
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

  // Habilitar Drag & Drop

  const zonas = document.querySelectorAll(".sectionContainer");

  for (const zona of zonas) {
    if (zona.children.length === 0) {
      zona.style.background = "black";
    }
  }

  // Evento que ocurre cuando se comienza a arrastrar un elemento
  document.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("ejercicio")) {
      event.dataTransfer.setData("text/plain", event.target.id);
    }
  });

  // Evento cuando se suelta un elemento en una zona
  zonas.forEach((zona) => {
    zona.addEventListener("dragover", (event) => {
      zona.style.background = "black";
      event.preventDefault();
    });

    zona.addEventListener("drop", (event) => {
      event.preventDefault();
      const idEjercicio = event.dataTransfer.getData("text/plain");
      const elementoMovido = document.getElementById(idEjercicio);
      zona.style.backgroundImage =
        "linear-gradient(to right, #a4161a, #161a1d)";

      if (elementoMovido && zona.children.length === 0) {
        elementoMovido.style.display = "flex"; // Mostrar nuevamente el elemento
        zona.appendChild(elementoMovido);
      }
    });
  });
});

//Delegación de eventos

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

//Delegación de eventos para quitar ejercicios

document.addEventListener("click", (event) => {
  if (event.target.closest(".btnQuitar")) {
    event.preventDefault();
    const boton = event.target.closest(".btnQuitar");
    const divSelect = boton.closest(".ejercicio");

    if (divSelect) {
      divSelect.remove();
    }
  }
});

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
    event.target.style.background = "black";
  }
});

document.addEventListener("drop", (event) => {
  if (event.target.classList.contains("sectionContainer")) {
    event.preventDefault();
    const idEjercicio = event.dataTransfer.getData("text/plain");
    const elementoMovido = document.getElementById(idEjercicio);

    event.target.style.backgroundImage =
      "linear-gradient(to right, #a4161a, #161a1d)";

    if (elementoMovido && event.target.children.length === 0) {
      elementoMovido.style.display = "flex"; // Mostrar nuevamente el elemento
      event.target.appendChild(elementoMovido);
    }
  }
});

document
  .getElementById("generarDocProf")
  .addEventListener("click", function () {
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

document
  .getElementById("generarDocumento")
  .addEventListener("click", function () {
    // Obtener la sección muestra_rutina
    const muestraRutina = document.getElementById("muestra_rutina");

    // Clonar la sección para manipularla sin afectar el DOM original
    const nuevaSeccion = muestraRutina.cloneNode(true);

    // Obtener todas las imágenes dentro de la nueva sección
    const imagenes = nuevaSeccion.querySelectorAll(".imagenX");
    const imagenesEdit = nuevaSeccion.querySelectorAll(".editObs");
    const sections = nuevaSeccion.querySelectorAll(".sectionContainer");
    const editDias = nuevaSeccion.querySelectorAll(".editDia");

    // Filtrar las imágenes que no sean close.svg y eliminarlas
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
      if (sections[i].children.length === 0) {
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

borrarRutina.addEventListener("click", () => {
  localStorage.removeItem("contenido_rutina");
  ingresoFecha.innerHTML = "";
  ingresoRutina.innerHTML = "";
  location.reload();
});

// Guardado de rutina provisorio

const guardarRutina = document.querySelector("#guardarRutina");

guardarRutina.addEventListener("click", () => {
  let contenidoHTML = muestraRutina.innerHTML;
  localStorage.setItem("contenido_rutina", contenidoHTML);
});

const rutinaGuardada = document.querySelector("#rutinaGuardada");
const label = document.querySelector(".btnCustomFile");

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
