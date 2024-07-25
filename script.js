let tasks = JSON.parse
    (localStorage.getItem('tasks')) || [];

document.addEventListener("DOMContentLoaded", function () {
        renderTasks();
    });

// function to render task
function renderTasks(){
    const columns = ['todo','in-process', 'done'];

    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        column.querySelector('.task-container').innerHTML = '';

        tasks.forEach(task => {
            if(task.status === columnId){
                const taskElement = createTaskElement(task.content, task.id);
                column.querySelector('.task-container').appendChild(taskElement);
            }
        });

    });
}

function createTaskElement(content, id) {
    const taskId = id
    const task = document.createElement("div");
    task.id = taskId;
    task.className = "task";
    task.draggable = true;
    task.innerHTML =
        `${content}
    <span class="delete-btn" 
        onclick="deleteTask('${taskId}')">
        ❌
    </span>`;
    task.addEventListener("dragstart", drag);
    return task;
}

//function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    updateLocalStorage();
    renderTasks();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.
        setData("text/plain", event.target.id);
}

function drop(event, columnId) {
    event.preventDefault();
    console.log(columnId);
    const data = event.
        dataTransfer.getData("text/plain");
    const draggedElement =
        document.getElementById(data);
    console.log(draggedElement);
    if (draggedElement) {
        const taskStatus = columnId;
        updateTaskStatus(data, taskStatus);
        event.target.querySelector('.task-container').
            appendChild(draggedElement);
    }
}

function capitalizeInput(input){
    input.value = input.value.toUpperCase();
}

//add task
function addTask(columnId) {
    const taskInput = document.getElementById("taskInput");
    const taskContent = taskInput.value.trim();
    if(taskContent !== ""){
        const newTask = {
            id: "task-" + Date.now(),
            content: taskContent,
            status: columnId
        };
        tasks.push(newTask);
        updateLocalStorage();
        renderTasks();
        taskInput.value = "";
    }
}

// function update task 
function updateTaskStatus(taskId, newStatus) {
    console.log(newStatus)
    tasks = tasks.map(task => {
        console.log(task)
        console.log(taskId)
        if (task.id === taskId) {
            console.log("inside if")
            return { ...task, status: newStatus };
        }
        return task;
    });
    updateLocalStorage();
}

function updateLocalStorage() {
    console.log("task update")
    localStorage.setItem ('tasks', JSON.stringify(tasks));
}