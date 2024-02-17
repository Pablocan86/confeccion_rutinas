//LLAMO LOS ELEMENTOS DEL DOM

const fecha = document.querySelector("#fecha");
const ingresoFecha = document.querySelector("#ingreso_fecha");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const cargaUno = document.querySelector("#carga_uno");
const dia = document.querySelector("#dia");
const grupo = document.querySelector("#grupo");
const buttonSumarDia = document.querySelector("#dia_grupo");
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

// imagenPerfil.addEventListener("change", function (event) {
//   // Obtener el archivo de la imagen cargada
//   const archivo = event.target.files[0];

//   if (archivo) {
//     // Crear un objeto URL para la imagen cargada
//     const objetoURL = URL.createObjectURL(archivo);

//     // Guardar la URL del objeto para usarla más tarde
//     sessionStorage.setItem("imagenURL", objetoURL);
//   }
// });

cargaUno.addEventListener("click", () => {
  const date = new Date(fecha.value);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let fechaFormateada = date.toLocaleDateString("es-AR", options);
  // const imagenURL = sessionStorage.getItem("imagenURL");

  fechaFormateada = fechaFormateada.replace(/^\w/, (c) => c.toUpperCase());

  ingresoFecha.innerHTML += `<div class="datos_actuales"><div class="fecha_nombre"><p>Fecha: ${fechaFormateada} </p>
  <p class="nombre_apellido"><span class="apellido_span">${apellido.value.toUpperCase()}</span>${" "}<span class="nombre_span">${nombre.value.toUpperCase()}</span> </p>
  </div><img class="imagen_perfil" src="${imagenPerfil.value}"/></div>`;

  nombre.value = "";
  apellido.value = "";
  imagenPerfil.value = "";
});

buttonSumarDia.addEventListener("click", () => {
  if (dia.value > 0) {
    ingresoRutina.innerHTML += `<div class="h2_dia"><h2> DIA ${
      dia.value
    }</h2><h2> ${grupo.value.toUpperCase()}</h2><a href="#" class="btnQuitarDia" data-id="${
      dia.value
    }"><img class="imagenX" src="./assets/images/close.svg" alt="icono de una x"/></a></div>`;
    const botonesQuitar = document.querySelectorAll(".btnQuitarDia");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idDia = Number(boton.dataset.id);
        const diaAEliminar = document.querySelector(`[data-id="${idDia}"]`);
        if (diaAEliminar) {
          ingresoRutina.removeChild(diaAEliminar.parentElement);
        }
      });
    }
  } else {
    alert("No ingreso día");
  }

  dia.value = "";
  grupo.value = "";
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
        // Cuando se hace clic en un elemento de la lista, se completa el valor en el input
        ejercicios.value = ejercicio.nombre;
        // Limpio la lista de resultados
        divResultados.innerHTML = "";
      });
      listaCoincidencias.appendChild(itemLista);
    });

    divResultados.appendChild(listaCoincidencias);
  }
});

//Arreglo para ir subiendo los ejercicios que asigno a la rutina
const ejerciciosRutina = [];

agregarEjercicio.addEventListener("click", function () {
  //Buscao por indice la coincidicencia que existe en el array de los ejercicios
  const ejercicio = ejercicios.value.toUpperCase();
  const indice = bd.ejerciciosBD.findIndex((el) => el.nombre === ejercicio);

  ingresoRutina.innerHTML += `<div class="ejercicio">
    <p class="musculoEjercicio">${bd.ejerciciosBD[indice].musculo}</p>
      <p class="tituloEjercicio">${bd.ejerciciosBD[indice].nombre}</p>
      <p class="dato" >SERIES Y REPETICIONES: ${seriesRepeticiones.value}</p>
      
      <p>Observación: ${observaciones.value}</p>
      <a class="enlacesEjercicio" href="${bd.ejerciciosBD[indice].video}" target="_blank"><img class="imagenV" src="https://www.svgrepo.com/show/520494/video-course.svg" alt="icono video"/></a>
      <a href="#" class="btnQuitar enlacesEjercicio" data-id="${bd.ejerciciosBD[indice].id}"><img class="imagenX" src="/assets/images/close.svg" alt="icono de una x"/></a>
    </div>`;

  //Necesito un botón eliminar para sacar de a un ejercicio si fuera necesario
  const botonesQuitar = document.querySelectorAll(".btnQuitar");
  //Recorro los botones existentes para crear el evento

  for (const boton of botonesQuitar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();

      const idEjercicio = Number(boton.dataset.id);
      const ejercicioAEliminar = document.querySelector(
        `[data-id="${idEjercicio}"]`
      );
      if (ejercicioAEliminar) {
        ingresoRutina.removeChild(ejercicioAEliminar.parentElement);
        // Eliminar el ejercicio de ejerciciosRutina
        const indiceAEliminar = ejerciciosRutina.findIndex(
          (el) => el.id === idEjercicio
        );
        if (indiceAEliminar !== -1) {
          ejerciciosRutina.splice(indiceAEliminar, 1);
        }
      }
    });
  }
  ejercicios.value = "";
  seriesRepeticiones.value = "";
  observaciones.value = "";
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

    // Filtrar las imágenes que no sean close.svg y eliminarlas
    for (let i = 0; i < imagenes.length; i++) {
      if (imagenes[i].src.includes("close.svg")) {
        imagenes[i].parentNode.removeChild(imagenes[i]);
      }
    }

    // Crear un nuevo documento HTML con el contenido filtrado
    const nuevoDocumento =
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
      justify-content: space-between;
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
.ejercicio {
  background-image: linear-gradient(to right, #a4161a, #161a1d);
  width: 99%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
}

.imagenV {
  width: 50px;
  height: 50px;
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
    const blob = new Blob([nuevoDocumento], { type: "text/html" });

    // Crear un enlace para la descarga
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `rutina_${apellidoSpan.textContent.toLowerCase()}_${nombreSpan.textContent.toLowerCase()}.html`;

    // Simular clic en el enlace para iniciar la descarga
    link.click();
  });

//Hago que el button eliminar borre todo el contenido de la rutina

const borrarRutnia = document.querySelector("#borrarRutina");

borrarRutnia.addEventListener("click", () => {
  ingresoFecha.innerHTML = "";
  ingresoRutina.innerHTML = "";
});
