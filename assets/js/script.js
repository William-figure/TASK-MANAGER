"use strict";

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
$("#task-due-date").datepicker();
// Todo: create a function to generate a unique task id
function generateTaskId() {
  const taskId = nextId;
  nextId += 1;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return taskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  $("#todo-cards").append(
    `
      <div class="task-card card mb-3" id="task${task.taskId}">
        <div class="card-body">
          <h5 class="card-title">${task.taskName}</h5>
          <p class="card-text">Due: ${task.taskDueDate}</p>
          <p class="card-text">${task.taskDescription}</p>
          <button class="btn btn-danger delete-task" id="delete${task.taskId}">Delete</button>
        </div>
      </div>
    `
  );
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  console.log(taskList);
  for (let i = 0; i < taskList.length; i++) {
    createTaskCard(taskList[i]);
  }
  $(".task-card").draggable();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  $("button[class=close]").click(() => {
    // $(".modal").remove();
    location.reload();
  });
  $("#add-task").click(() => {
    const tName = $("#task-title").val();
    $("#task-due-date").pointerEvents = "none";
    $("#task-due-date").attr("autocomplete", "off");
    let tDate = $("#task-due-date").val();
    const tDesc = $("#task-description").val();
    tDate = checkDate(tDate);
    if (tName && tDate) {
      const task = {
        taskId: generateTaskId(),
        taskName: tName,
        taskDueDate: tDate,
        taskDescription: tDesc
      };
      // console.log(task.taskDueDate);
      taskList.push(task);
      localStorage.setItem("tasks", JSON.stringify(taskList));
      location.reload();
      // console.log(localStorage);
      // console.log(typeof createTaskCard(task));
      // createTaskCard(task);
    } else {
      alert("please check the title or date!");
    }
    // console.log(task.taskName, task.taskDueDate, task.taskDescription);
  });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  for (let i = 0; i < taskList.length; i++) {
    $(`#delete${taskList[i].taskId}`).click(() => {
      $(`#task${taskList[i].taskId}`).remove();
      taskList = taskList.filter(item => item.taskId !== taskList[i].taskId);
      console.log(taskList);
      localStorage.setItem("tasks", JSON.stringify(taskList));
      location.reload();
    });
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

//test the date input out only, since it is very crucial using date.js to format the date correctly, restrict user input as YYYY-MM-DD;
function checkDate(Dt) {
  const desiredDateFormat = "YYYY-MM-DD";
  const parsedDate = dayjs(Dt, desiredDateFormat, true);
  if (parsedDate.isValid()) {
    const formattedDate = parsedDate.format(desiredDateFormat);
    Dt = formattedDate;
    return formattedDate;
  } else {
    const errMsg = "please use YYYY-MM-DD format!";
    Dt = errMsg;
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  handleAddTask();
  handleDeleteTask();
});
