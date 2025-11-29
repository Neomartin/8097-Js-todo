const TODOS = [
  {
    id: 10,
    title: "Comprar pan",
    date: "20-10-2023",
    completed: false,
  },
  {
    id: 20,
    title: "Estudiar JavaScript",
    date: "21-10-2025",
    completed: true,
  },
  {
    id: 30,
    title: "Hacer ejercicio",
    date: "22-10-2024",
    completed: false,
  },
  {
    id: 40,
    title: "Leer un libro",
    date: "23-10-2025",
    completed: true,
  },
  {
    id: 50,
    title: "Llamar a mamá",
    date: "24-10-2023",
    completed: false,
  },
];

const listaTodoHTML = document.getElementById("lista-todo");

const todoFormHTML = document.getElementById("todoForm"); // obtener referencia al formulario


function cambiarEstadoTarea() {
  // lógica para cambiar el estado de la tarea
  // Nosotros vamos a buscar la tarea donde se hizo click
  // y cambiar su estado de completed a no completed y viceversa
}



// @params: identificador: id de la tarea a eliminar
function eliminarTarea(identificador) {

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


// listaTodoHTML.innerHTML = "<h2>TExto desde JS</h2>";

// # Renderizar la lista de tareas en el HTML\


function renderizarTodos() {

  listaTodoHTML.innerHTML = ""; // limpiar el contenido previo

  for (let todo of TODOS) {
    const isCompleted = todo.completed ? "checked" : "";

    listaTodoHTML.innerHTML += `<div class="todo-item ${isCompleted}">

              <div class="todo-check todo-nueva">
                <input  class="form-check-input" type="checkbox" ${isCompleted}>
              </div>

              <div class="todo-info">
                <div class="todo-title"> ${todo.title} </div>
                <div class="todo-date"> ${todo.date} </div>
              </div>

              <div class="todo-actions">
                <button class="btn btn-sm btn-primary">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${todo.id})">
                  <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            
          </div>`;
  }

}

renderizarTodos(); // llamar a la función para renderizar la lista de tareas


// # Manejo del evento submit del formulario
todoFormHTML.addEventListener("submit", function(event) {

  event.preventDefault(); // prevenir el comportamiento por defecto del formulario
  const el = event.target.elements;
  // Obtener los datos del formulario y armar una nueva tarea
  const nuevaTarea = {
    title: el.title.value, // el.title hace referencia al input con name="title"
    date: el.date.value,
    completed: false
  }

  console.log(nuevaTarea);

  // Vamos a agregar la nueva tarea a nuestro array TODOS
  TODOS.push(nuevaTarea);
  console.log(TODOS)

  renderizarTodos(); // volver a renderizar la lista de tareas

})




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
