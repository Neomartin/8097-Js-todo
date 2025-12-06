const TODOS = [
  {
    id: 10, // 10 === "10" -> false
    title: "Comprar pan",
    date: "2023-10-20",
    completed: false,
  },
  {
    id: 20,
    title: "Estudiar JavaScript",
    date: "2025-10-21",
    completed: true,
  },
  {
    id: 30,
    title: "Hacer ejercicio",
    date: "2024-10-22",
    completed: false,
  },
  {
    id: 40,
    title: "Leer un libro",
    date: "2025-10-23",
    completed: true,
  },
  {
    id: 50,
    title: "Llamar a mamá",
    date: "2023-10-24",
    completed: false,
  },
];

const searchInputHTML = document.querySelector("#searchInput");


const listaTodoHTML = document.getElementById("lista-todo");
const buttonSubmit = document.getElementById("btnSubmit");
const todoFormHTML = document.getElementById("todoForm"); // obtener referencia al formulario

renderizarTodos(); // llamar a la función para renderizar la lista de tareas

function obtenerBotonesEditar() {
  const todosLosBotonesEditar = listaTodoHTML.querySelectorAll(".btn-primary");

  todosLosBotonesEditar.forEach((boton) => {
    // agregar un event listener a cada botón
    boton.addEventListener("click", function (event) {
      const buttonHTML = event.currentTarget;
      // Puedo recibir el evento del click
      const id = buttonHTML.getAttribute("data-id"); // obtener el id de la tarea desde el atributo data-
      // Editar la tarea con el id obtenido
      console.log(+id);

      editarTarea(+id);
    });
  });

}

console.log(searchInputHTML);


let todoEditing = null;

// @params: identificador: id de la tarea a eliminar
function eliminarTarea(identificador) {

  const confirmar = confirm("¿Estás seguro de que deseas eliminar esta tarea?");

  if(confirmar) {
    // ✅ Identificar la tarea a eliminar
    // ✅ Buscar el elemento en el array y buscar su posicion para luego borrarlo
    const indicePelicula = TODOS.findIndex((tarea) => {
      if (tarea.id === identificador) {
        return true; // si encontramos la tarea, retornamos true
      }

      return false; // si no es la tarea que buscamos, retornamos false
    });

    console.log("Indice tarea a eliminar:", indicePelicula);

    // Splice para eliminar un elemento del array
    TODOS.splice(indicePelicula, 1); // eliminar 1 elemento en la posicion indicePelicula

    renderizarTodos(); // volver a renderizar la lista de tareas
  }


  
}

// listaTodoHTML.innerHTML = "<h2>TExto desde JS</h2>";

// # Renderizar la lista de tareas en el HTML
function renderizarTodos() {
  listaTodoHTML.innerHTML = ""; // limpiar el contenido previo

  for (let todo of TODOS) {
    const isCompleted = todo.completed ? "checked" : "";

    // <div class="todo-image">
    //     <img src="${todo.image}" alt="${todo.title} avatar">
    // </div>

    listaTodoHTML.innerHTML += `<div class="todo-item ${isCompleted}">
              
              <div class="todo-check todo-nueva">
                <input  class="form-check-input" type="checkbox" ${isCompleted} onchange="cambiarEstadoTarea(${
      todo.id
    })" >
              </div>

              <div class="todo-info">
                <div class="todo-title"> ${todo.title} </div>
                <div class="todo-date"> ${formatearFecha(todo.date)} </div>
              </div>

              <div class="todo-actions">
                <button class="btn btn-sm btn-primary" data-id="${todo.id}">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${
                  todo.id
                })">
                  <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            
          </div>`;

    obtenerBotonesEditar();
  }
}



// # Manejo del evento submit del formulario para agregar nuevas tareas
todoFormHTML.addEventListener("submit", function (event) {
  event.preventDefault(); // prevenir el comportamiento por defecto del formulario
  const el = event.target.elements;

  if (todoEditing === null) {
    // AGREGAMOS UNA NUEVA TAREA
    // Obtener los datos del formulario y armar una nueva tarea
    const nuevaTarea = {
      id: Date.now(), // generar un id único basado en la fecha actual
      title: el.title.value, // el.title hace referencia al input con name="title"
      date: el.date.value, // "AAAA-MM-DD" => "DD-MM-AAAA"
      // image: el.image.value,
      completed: false,
    };

    // Vamos a agregar la nueva tarea a nuestro array TODOS
    TODOS.push(nuevaTarea);

    showSwalToast("Tarea Agregada!", "La tarea se agregó correctamente");


  } else {
    // EDITAMOS UNA TAREA EXISTENTE
    // Actualizar los datos de la tarea con los valores del formulario
    todoEditing.title = el.title.value;
    todoEditing.date = el.date.value;

    buttonSubmit.classList.toggle("btn-success");
    buttonSubmit.textContent = "Agregar";

    showSwalToast("Tarea Editada!", "La tarea se editó correctamente", "info");
  }

  todoEditing = null;

  // Limpiar el formulario
  // todoFormHTML.reset();

  console.log(TODOS);

  renderizarTodos(); // volver a renderizar la lista de tareas
});

searchInputHTML.addEventListener("keyup", function (event) {
  const text = event.target.value.toLowerCase(); // ESTUDIAR -> estudiar

  const tareasFiltradas = TODOS.filter((tarea) => {
    const titulo = tarea.title.toLowerCase(); // Estudiar JavaScript -> estudiar javascript

    if (titulo.includes(text)) {
      return true;
    }
    return false;
  });

  console.log(tareasFiltradas, tareasFiltradas.length);
});

function formatearFecha(fecha) {
  const fechaFormateada = fecha.split("-").reverse().join("-");

  return fechaFormateada;
}

function cambiarEstadoTarea(idRecibido) {
  // Buscar la tarea en el array por su id
  const tarea = TODOS.find((t) => {
    if (t.id === idRecibido) {
      return true;
    }
    return false;
  });
  // y cambiar su estado de completed a no completed y viceversa
  tarea.completed = !tarea.completed; // cambiar el estado
  // Pintar la lista actualizada
  renderizarTodos();
}

function editarTarea(id) {
  // lógica para editar la tarea
  // Buscar la tarea en el array por su id -> find
  const tarea = TODOS.find((todo) => {
    // 
    if (todo.id === id) {
      return true;
    }
  });

  // Si no encontré tarea: undefined
  if(!tarea) {
    alert("Tarea no encontrada");
    return; // salir de la función
  }


  todoEditing = tarea;

  // Llenar el formulario con los datos de la tarea encontrada
  todoFormHTML.elements.title.value = tarea.title;
  todoFormHTML.elements.date.value = tarea.date;

  // Asignar un valor a la variable isEditing para saber que estamos editando

  // buttonSubmit.classList.toggle("btn-success");

  // Como a través del DOM puedo manejar las clases de un elemento
  // Añadir clase
  // buttonSubmit.classList.add("btn-danger")
  // Eliminar clase
  // buttonSubmit.classList.remove("btn-primary")
  // Alternar clase
  // buttonSubmit.classList.toggle("btn-success");
  // Observar si tiene la clase
  // buttonSubmit.classList.contains("btn-success");

  buttonSubmit.textContent = "Editar";
}

// Recibe un parámetro "orden" que puede ser "asc" (ascendente) o "desc" (descendente)
// Por defecto será "asc" si no se pasa ningún valor
function ordenarTareasPorNombre(orden = "asc") {
  // Usamos el método .sort() que modifica el array TODOS directamente
  TODOS.sort(function (tareaA, tareaB) {
    // Convertimos ambos títulos a minúsculas para que la comparación
    // no dependa de mayúsculas/minúsculas
    const tituloA = tareaA.title.toLowerCase();
    const tituloB = tareaB.title.toLowerCase();

    // Usamos localeCompare() que retorna:
    if (orden === "asc") {
      // Orden ascendente (A -> Z)
      return tituloA.localeCompare(tituloB);
    }

    if (orden === "desc") {
      // Orden descendente (Z -> A) - invertimos la comparación
      return tituloB.localeCompare(tituloA);
    }

    return 0; // por defecto, no cambiamos el orden
  });

  // Después de ordenar, volvemos a renderizar para ver los cambios en la pantalla
  renderizarTodos();
}


function showSwalToast(titulo, descripcion, iconito = "success") {
  Swal.fire({
    title: titulo,
    text: descripcion,
    icon: iconito,
    position: "top-right",
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    theme: "dark",
  });
}

// botonHTML.addEventListener("click", function() {

//   console.log("Click en el botón");
//   console.log("El evento sucedió");

// })

// botonHTML.addEventListener("mouseover", function() {

//   console.log("Mouse over en el botón");

// })

// if(todo.completed) {

//   const STRING = `<input class="form-check-input" type="checkbox" checked>`
//   // cuando el elemento se renderiza en el navegador

// } else {

//   const STRING = `<input class="form-check-input" type="checkbox" >`

// }

// Ternary operator
// condicion ? expressionTrue : expressionFalse
