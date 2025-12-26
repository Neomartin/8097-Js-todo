// Definición de variables y constantes
let TODOS = []; // array para almacenar las tareas

const SERVER_URL = "https://694332dc69b12460f313f671.mockapi.io";

let todoEditing = null;
let isDeletingMultiple = false; // Variable para rastrear el estado de eliminación múltiple
// Referencias al DOM
const searchInputHTML = document.querySelector("#searchInput");
const listaTodoHTML = document.getElementById("lista-todo");
const buttonSubmit = document.getElementById("btnSubmit");
const todoFormHTML = document.getElementById("todoForm"); // obtener referencia al formulario
const deleteMultipleBtn = document.getElementById("deleteMultipleBtn");


obtenerTareas() // Llamamos a la función para obtener las tareas desde el servidor


// # Obtener tareas desde el servidor (MockAPI)

async function obtenerTareas() {
  console.log("Obteniendo tareas desde el servidor...");  
  try {
    
    const response = await axios.get(`${SERVER_URL}/todos`);
  
    TODOS = response.data;

    renderizarTodos(); // renderizar las tareas obtenidas

  } catch (error) {
    console.log(error)
    showSwalToast("Error", "No se pudieron cargar las tareas desde el servidor", "error");

    //        title         text                                              icon
    // Swal.fire("Error", "No se pudieron cargar las tareas desde el servidor", "error");
  }

}


function obtenerBotonesEditar() {
  const todosLosBotonesEditar = listaTodoHTML.querySelectorAll(".btn-primary");

  todosLosBotonesEditar.forEach((boton) => {
    // agregar un event listener a cada botón
    boton.addEventListener("click", function (event) {
      const buttonHTML = event.currentTarget;
      // Puedo recibir el evento del click
      const id = buttonHTML.getAttribute("data-id"); // obtener el id de la tarea desde el atributo data-
      // Editar la tarea con el id obtenido
      console.log(id);
      

      editarTarea(id);
    });
  });

}

// @params: identificador: id de la tarea a eliminar
function eliminarTarea(identificador) {

  try {
    
    Swal.fire({
      title: '¿Estás seguro de eliminar la tarea?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f00',
      confirmButtonText: 'Sí, eliminar',
      theme: 'dark',
      cancelButtonText: 'Cancelar',
      
    }).then(async(result) => {
      // Si isConfirmed es true, el usuario confirmó la eliminación
      if(result.isConfirmed) {

        try {
          // Eliminamos la tarea del servidor
          const response = await axios.delete(`${SERVER_URL}/todos/${identificador}`)

          showSwalToast("Tarea eliminada!", "La tarea se eliminó correctamente", "success");
          
          obtenerTareas(); // Volver a obtener las tareas desde el servidor


        } catch (error) {
          console.log(error)
          showSwalToast("Error", "No se pudo eliminar la tarea del servidor", "error");
        }

      }
    })





  } catch (error) {
    console.log(error)
    showSwalToast("Error", "No se pudo eliminar la tarea del servidor", "error");
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

    // const divTodo = document.createElement("div");

    // divTodo.classList.add("todo-item");
    // if(todo.completed) {
    //   divTodo.classList.add("todo-completed");
    // }

    // buttonEditar = document.createElement("button");
    // buttonEditar.classList.add("btn", "btn-sm", "btn-primary");
    // buttonEditar.setAttribute("data-id", todo.id);
    // buttonEditar.title = "Editar tarea";

    // // Añadir estilos al botón

    // buttonEditar.style.color = "white";
    // buttonEditar.style.borderRadius = "5px";
    // buttonEditar.backgroundColor = "royalblue";

    // buttonEditar.textContent = "✏️";
    
    // console.log(divTodo);
    // console.log(buttonEditar);

    // divTodo.appendChild(buttonEditar);

    // listaTodoHTML.appendChild(divTodo);


    listaTodoHTML.innerHTML += `<div class="todo-item ${isCompleted}">
              
              <div class="todo-check todo-nueva">
                <input  class="form-check-input" 
                        type="checkbox" 
                        ${isCompleted} 
                        onchange="cambiarEstadoTarea(${todo.id})" >
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

            ${
              isDeletingMultiple ? `<div class="todo-clear">
                <input type="checkbox" class="form-check-input checkbox-delete" value="${
                  todo.id
                }" onchance="toggleDeleteMulti(${todo.id})" />
              </div>` : ''
            }

            
            
          </div>`;

    obtenerBotonesEditar();
  }
}


// # Manejo del evento submit del formulario para agregar nuevas tareas
todoFormHTML.addEventListener("submit", async function (event) {
  event.preventDefault(); // prevenir el comportamiento por defecto del formulario
  const el = event.target.elements;

  if (todoEditing === null) {

    try {
      // -AGREGAMOS UNA NUEVA TAREA
      // Obtener los datos del formulario y armar una nueva tarea
      const nuevaTarea = {
        id: Date.now(), // generar un id único basado en la fecha actual
        title: el.title.value, // el.title hace referencia al input con name="title"
        date: el.date.value, // "AAAA-MM-DD" => "DD-MM-AAAA"
        // image: el.image.value,
        completed: false,
      };

      // Vamos a agregar la nueva tarea a nuestro array TODOS
      // . TODOS.push(nuevaTarea);
      // Vamos a crear o guardar la tarea en el servidor (MockAPI)
      await axios.post(`${SERVER_URL}/todos`, nuevaTarea);


      showSwalToast("Tarea Agregada!", "La tarea se agregó correctamente");
      obtenerTareas(); // volver a obtener las tareas desde el servidor


    } catch (error) {

      console.log(error)
      showSwalToast("Error", "No se pudo agregar la tarea al servidor", "error");

    }

  } else {

    try {
      // Actualizar nuestra tarea en el servidor (MockAPI)

      const tareaActualizada = {
        title: el.title.value, // title 3 =>  Titulo ac
        date: el.date.value,
      };

      await axios.put(
        `${SERVER_URL}/todos/${todoEditing.id}`,
        tareaActualizada
      );

      obtenerTareas(); // volver a obtener las tareas desde el servidor

      buttonSubmit.classList.toggle("btn-success");
      buttonSubmit.textContent = "Agregar";

      showSwalToast(
        "Tarea Editada!",
        "La tarea se editó correctamente",
        "info"
      );
    } catch (error) {
      console.log(error)
      showSwalToast("Error", "No se pudo editar la tarea en el servidor", "error");
    }

    
  }

  todoEditing = null;

  // Limpiar el formulario
  todoFormHTML.reset();


  // renderizarTodos(); // volver a renderizar la lista de tareas
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

async function cambiarEstadoTarea(idRecibido) {

  const id = idRecibido.toString();
  
  try {
    
    // Buscar la tarea en el array por su id -> find
    const tarea = TODOS.find((todo) => todo.id === id);

    console.log("Tarea encontrada para cambiar estado:", tarea);

    // tarea.completed = !tarea.completed; // alternar el estado

    await axios.put(`${SERVER_URL}/todos/${idRecibido}`, { completed: !tarea.completed });

    showSwalToast("Tarea Actualizada!", "El estado de la tarea se actualizó correctamente", "success");

    // Pintar la lista actualizada
    obtenerTareas();


  } catch (error) {
    console.log(error)
    showSwalToast("Error", "No se pudo cambiar el estado de la tarea en el servidor", "error");
  }


}

function editarTarea(id) {

  console.log("Editar tarea con id:", id);
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

/* 
  TAREAS A REALIZAR PARA EL BORRADO POR LOTES DE TAREAS
  1. Escuchar el evento en el botón "Seleccionar"
  2. Al hacer click en el botón, vamos a mostrar la columna de checkboxes
  3. Vamos a cambiar el botón "Seleccionar" por "Eliminar seleccionados"
  4. Al hacer click en "Eliminar seleccionados", vamos a eliminar las tareas que estén seleccionadas
  4.a Vamos a recorrer el array de tareas y por cada checkbox que esté seleccionado, vamos a eliminar la tarea correspondiente
  5. Volvemos a renderizar la lista de tareas 
  6. Volver al estado inicial (ocultar checkboxes, cambiar botón a "Seleccionar")
*/
// Escuchar el evento click en el botón de eliminación múltiple
deleteMultipleBtn.addEventListener("click", function() {
  // Tenemos que diferenciar la lógica entre los dos estados del botón
  
  // Si NO estamos en modo de eliminación múltiple (estado inicial)
  if(!isDeletingMultiple) {
    // Cambiamos el estado a true para activar el modo de eliminación múltiple
    isDeletingMultiple = !isDeletingMultiple; // alternar el estado
    
    // Cambiamos el texto del botón dependiendo del estado
    // Si isDeletingMultiple es true, mostramos "ELIMINAR SELECCIONADOS"
    // Si es false, mostramos "SELECCIONAR"
    deleteMultipleBtn.innerText = isDeletingMultiple
      ? "ELIMINAR SELECCIONADOS"
      : "SELECCIONAR";
    
    // Alternamos la clase btn-danger para cambiar el color del botón a rojo
    deleteMultipleBtn.classList.toggle("btn-danger");
    
    // Volver a renderizar la lista para que aparezcan los checkboxes
    renderizarTodos();
  } else {
    // Si YA estamos en modo de eliminación múltiple, ejecutamos la eliminación
    deleteMultipleTodos();
  }
  
})

function deleteMultipleTodos() {
  // Obtener todos los checkboxes que tienen la clase "checkbox-delete" y están marcados (:checked)
  const checksDelete = listaTodoHTML.querySelectorAll(".checkbox-delete:checked");

  // Crear un array vacío donde guardaremos los IDs de las tareas a eliminar
  const idsToDelete = [];

  // Recorrer cada checkbox seleccionado
  checksDelete.forEach((checkbok) => {
    // Obtener el valor del checkbox (que es el ID de la tarea)
    // El símbolo + convierte el string a número
    const id = +checkbok.value;
    
    // Agregar el ID al array de IDs a eliminar
    idsToDelete.push(id);

  })

  // Recorrer cada ID que vamos a eliminar
  idsToDelete.forEach(id => {
    // Buscar el índice (posición) de la tarea en el array TODOS
    const indice = TODOS.findIndex(tarea => {
      // Si el ID de la tarea coincide con el ID que buscamos
      if(tarea.id === id) {
        return true // Encontramos la tarea
      }
    })
    
    // Eliminar la tarea del array usando splice
    // splice(indice, 1) significa: en la posición "indice", elimina 1 elemento
    TODOS.splice(indice, 1)
  })

  // Quitar la clase btn-danger del botón (volver al color original)
  deleteMultipleBtn.classList.toggle('btn-danger')
  
  // Cambiar el texto del botón de vuelta a "SELECCIONAR"
  deleteMultipleBtn.innerText = "SELECCIONAR"
  
  // Cambiar el estado a false para salir del modo de eliminación múltiple
  isDeletingMultiple = false;
  
  // Volver a renderizar la lista para ocultar los checkboxes y mostrar las tareas actualizadas
  renderizarTodos();

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
