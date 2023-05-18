
(function(){
let tasks = [];
let taskList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');
const completedCounter = document.getElementById('tasks-checked');
const notfBox = document.getElementById('notification-box');

function renderList() {
    let ccount = 0;
    taskList.innerHTML = '';
    console.log('render');
    for (var task of tasks) {
        if (task.completed)
            ccount++;
        addElementToDOM(task);
    }
    completedCounter.innerText = ccount;
    tasksCounter.innerText = tasks.length;
}

function addElementToDOM(task) {
    console.log('DOMel-add');
    const el = document.createElement('li');
    el.innerHTML = `
    
        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="bin.png" class="delete" data-id="${task.id}" />
    
    `
    taskList.append(el);
    console.log('dom-el-add success');
    return;
}

function markTaskAsComplete(taskId) {
    for (var task of tasks) {
        if (task.id == taskId) {
            task.completed = !task.completed;
            if (task.completed)
                showNotification('Task completed!')
            else
                showNotification(':(')
        }
    }
    console.log('check toggle success');
    renderList();
}

function deleteTask(taskId) {
    const newTasks = tasks.filter(function (task) {
        return task.id != taskId;
    });
    tasks = newTasks;
    console.log('delete success');
    renderList();
    showNotification('task deleted!');
}

function addTask(task) {
    if (task) {
        console.log('add success');
        tasks.push(task);
        showNotification('task added!');
        renderList();
    }
}

function showNotification(text) {
    notfBox.innerText = text;
    setTimeout(() => {
        notfBox.innerText = '';
    }, 1000);
}

function handleInputKeyPress(e) {
    if (e.key == 'Enter') {
        const text = e.target.value;
        console.log(text);
        if (text) {
            const task = {
                title: text,
                id: Date.now().toString(),
                completed: false,
            }
            addTask(task);
            e.target.value = '';
        }
        else
            showNotification('task empty');
    }
}

function clickEventHandler(e) {
    const target = e.target;
    if (target.className == 'custom-checkbox') {
        const targetId = target.id; //using id directly
        //const targetId = target.getAttribute('id'); //using id via getAttribute()
        markTaskAsComplete(targetId);
    }
    else if (target.className == 'delete') {
        const targetId = target.dataset.id; //using dataset attribute where <... data-id = el-id.../>
        deleteTask(targetId);
    }
    else if (target.id == 'submit-btn') {
        var inpbox = document.getElementById('add');
        const text = inpbox.value;
        if (text) {
            const task = {
                title: text,
                id: Date.now().toString(),
                completed: false,
            }
            addTask(task);
            inpbox.value = '';
        }
        else
            showNotification('task empty');
    }
}

//fetching data from server via API
    async function fetchData() {
         fetch('https://jsonplaceholder.typicode.com/todos')
        .then(function(fetchedData){
            return fetchedData.json();
        })
        .then(function(data){
            tasks = data.slice(0,10);
            renderList();
        })
        .catch(function(error){
            console.log(error.message);
        }) 
        //Using Async Await:
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
            tasks = data.slice(0, 10);
            renderList();
        }
        catch (error) {
            console.log(error.message);
        }
    }


function init() {
    console.log('initializing app');
    addTaskInput.addEventListener('keyup', handleInputKeyPress);
    document.addEventListener('click', clickEventHandler);
     document.addEventListener('keyup',function(e){
            if(e.key == 'f'){
                fetchData();
            }
            else if(e.key == 'c'){
                tasks=[];
                renderList();
            }
        });
}
init();
})();
