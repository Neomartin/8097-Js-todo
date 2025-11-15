const TODOS = [
  {
    title: "Comprar pan",
    date: "20-10-2023",
    completed: false,
  },
  {
    title: "Estudiar JavaScript",
    date: "21-10-2025",
    completed: true,
  },
  {
    title: "Hacer ejercicio",
    date: "22-10-2024",
    completed: false,
  },
  {
    title: "Leer un libro",
    date: "23-10-2025",
    completed: true,
  },
  {
    title: "Llamar a mamá",
    date: "24-10-2023",
    completed: false,
  },
];

const listaTodoHTML = document.getElementById("lista-todo");

console.dir(listaTodoHTML);

// listaTodoHTML.innerHTML = "<h2>TExto desde JS</h2>";


for(let todo of TODOS) {

  listaTodoHTML.innerHTML += `<div class="todo-item">

              <div class="todo-check">
                <input class="form-check-input" type="checkbox">
              </div>

              <div class="todo-info">
                <div class="todo-title"> ${todo.title} </div>
                <div class="todo-date"> ${todo.date} </div>
              </div>


              <div class="todo-actions">
                <button class="btn btn-sm btn-primary">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-danger">
                  <i class="fa-solid fa-trash"></i>
                </button>
            </div>

            
          </div>`;

}
