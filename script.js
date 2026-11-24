// Simple todo list — data is saved in the browser's localStorage.
const STORAGE_KEY = "todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const footer = document.getElementById("footer");
const count = document.getElementById("count");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter");

let todos = load();
let filter = "all";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  save();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  save();
  render();
}

function render() {
  const visible = todos.filter((t) =>
    filter === "active" ? !t.done : filter === "completed" ? t.done : true
  );

  list.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = todos.length === 0 ? "Nothing to do yet 🎉" : "No todos here";
    list.appendChild(empty);
  }

  visible.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "×";
    del.title = "Delete";
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, del);
    list.appendChild(li);
  });

  // Footer
  const remaining = todos.filter((t) => !t.done).length;
  footer.hidden = todos.length === 0;
  count.textContent = `${remaining} left`;
}

// Events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

clearBtn.addEventListener("click", clearCompleted);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  });
});

render();
