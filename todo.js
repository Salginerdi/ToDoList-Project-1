// 1-Arayüzü Tanıma ve Todo Ekleme - Todo List Projesi

// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardbody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
  // Tüm event listenerlar
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardbody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

// Tüm Todoları Temizleme
function clearAllTodos(e) {
  if (confirm("Tümünü Silmek İstediğinize Emin misiniz?")) {
    // Todoları Arayüzden Kaldırma
    // todoList.innerHTML = ""; // Bu yöntem yavaş kalıyor.
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    // Local Storage'dan da kaldırmak için
    localStorage.removeItem("todos");
  }
}

// Todoları Filtreleme
function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      // Sonuç -1 olduğunda bulamaz.
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display : block");
    }
  });
}

// Todo'ları Arayüzden Silme
function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo başarılı bir şekilde silindi!");
  }
}

// Todo'ları Storage'dan Silme
function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); // Array'den değerimizi bu şekilde silebiliriz.
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Sayfa Yüklendiğinde Todo'ları Yükleme

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function addTodo(e) {
  const newTodo = todoInput.value.trim(); // trim metodu - stringimizin başındaki ve sonundaki gereksiz boşlukları yok eder.

  // Bilgilendirme Mesajı
  if (newTodo == "") {
    showAlert("danger", "Lütfen bir todo girin..."); // danger yerine success yaparsak alert'imizi yeşil bir şekilde oluşturur.
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo başarıyla eklendi...");
  }

  e.preventDefault();
}

// Todoları Storage'a Ekleme
function getTodosFromStorage() {
  // Storage'dan bütün Todo'ları almış oluyoruz.
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);
  // setTimeout Metodu (mesajın belirli bir süre gösterilip kaybolmasını sağlıyor.)
  setTimeout(function () {
    alert.remove();
  }, 1000);
}
function addTodoToUI(newTodo) {
  // string değerini list item olarak ekleyecektir.
  /*
<li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>
*/

  // List Item Oluşturma
  const listItem = document.createElement("li");

  // Link Oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";
  listItem.className = "list-group-item d-flex justify-content-between";

  // Text Node Ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  // Todo List'e List Item'ı Ekleme
  todoList.appendChild(listItem);
  todoInput.value = "";
}
