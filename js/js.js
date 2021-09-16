//Темная тема
let darkMode;
if(localStorage.getItem('darkMode')){
    darkMode = (localStorage.getItem('darkMode') === 'true');
    if(darkMode){
        document.querySelector('.color-mode').setAttribute('checked', 'true');
        document.querySelector('html').classList.toggle('light-theme');
        document.querySelector('html').classList.toggle('dark-theme');
    }
}
else
darkMode = false;

//Секция заметок открыта ли
let note_is_open = true;

//Массивы объектов, содержащих заметки и задачи
let noteList = [], taskList = [];

//Номера откртых элементов
let Open_Note_Number = null, Open_Task_Number = null;

//Заполнить массив заметок данными из LocalStorage, если такие имеются
if(localStorage.getItem('note')){
    noteList = JSON.parse(localStorage.getItem('note'));
}

//Заполнить массив задач данными из LocalStorage, если такие имеются
if(localStorage.getItem('task')){
    taskList = JSON.parse(localStorage.getItem('task'));
}

//Показать все существующие заметки
for(let i in noteList)show_note(i);

//Показать все существующие задачи
for(let i in taskList)show_task(i);

//Прелоудер
window.addEventListener('load',function(){ 
    document.body.classList.remove('load');
    document.body.removeChild(this.document.querySelector('.preloader'));
});
  

//Открытие меню настроек
document.querySelector('.settings-btn').addEventListener('click', () => {
    document.querySelector('#settings-menu').classList.toggle('module-open');
});


//Закрытие меню настроек
document.querySelector('#settings-close').addEventListener('click', () => {
    document.querySelector('#settings-menu').classList.toggle('module-open');
});

//Открыть в полном окне заметку или задачу
document.querySelector('.main-section').addEventListener('click', function (event){
    if(note_is_open){
        if(event.target.closest('.note-container')){
            for(let i in noteList){
                if(event.target.closest('.note-container').id == noteList[i].id){
                    document.querySelector('#fullScreen-time').innerHTML = noteList[i].time;
                    document.querySelector('#fullScreen-title').value = noteList[i].title;
                    document.querySelector('#fullScreen-content').value = noteList[i].content;
                    Open_Note_Number = i;
                    break;
                }
            }
            document.querySelector('#fullScreen-note').classList.toggle('module-open');
        }   
    }else if(event.target.closest('.task-container')){
            for(let i in taskList){
                if(event.target.closest('.task-container').id == taskList[i].id){
                    Open_Task_Number = i;
                    break;
                }
            }
        }
});

//Поиск заметок или задач
document.querySelector('.search').addEventListener('input', function (){
    let value = this.value.toLowerCase().trim();
    let items = note_is_open ? noteList : taskList;
    if(value != ''){
        if(note_is_open){
            items.forEach(function (elem){
                if(elem.title.toLowerCase().search(value) == -1 && elem.content.toLowerCase().search(value) == -1){
                    document.querySelector(`#${elem.id}`).classList.add('hide');
                }else{
                    document.querySelector(`#${elem.id}`).classList.remove('hide');
                }
            });
        }else{
            items.forEach(function (elem){
                if(elem.content.toLowerCase().search(value) == -1){
                    document.querySelector(`#${elem.id}`).classList.add('hide');
                }else{
                    document.querySelector(`#${elem.id}`).classList.remove('hide');
                }
            });
        }
        }else{
        items.forEach(function (elem){
            document.querySelector(`#${elem.id}`).classList.remove('hide');
        });
    }
});

document.querySelector('.color-mode').addEventListener('change', () => {
    document.querySelector('html').classList.toggle('light-theme');
    document.querySelector('html').classList.toggle('dark-theme');
    darkMode = darkMode ? false : true;
    localStorage.setItem('darkMode',JSON.stringify(darkMode));
});

const month = ["Января","Февраля","Марта","Апреля",'Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря']
function addZero(n){
    return n < 10 ? '0' + n : n;
}

document.querySelector('.radio-container').addEventListener('change', () => {
    note_is_open = note_is_open ? false : true;
    document.querySelector('.main-section').classList.toggle('notes-is-acivated');
    document.querySelector('.search').placeholder = note_is_open ? 'Поиск заметок' : 'Поиск задач';
});

document.querySelector('.create-task-module').addEventListener('click', (event) => {
    if(!event.target.closest('.create-task-container')){
        close_create_task();
    }
    if(event.target.closest('.create-task__btn')){
        create_new_block();
    }
});

function close_fullScreen_module(){
    document.querySelector('#fullScreen-time').innerHTML = '';
    document.querySelector('#fullScreen-title').value = '';
    document.querySelector('#fullScreen-content').value = '';
    document.querySelector('#fullScreen-note').classList.toggle('module-open');
    if(noteList[Open_Note_Number])cancel_change();
    else hide_buttons();
    Open_Note_Number = null;
}

document.querySelector('#fullScreen-close-button').addEventListener('click', close_fullScreen_module);

document.querySelector('.create-new-block').addEventListener('click', () => {
    if(note_is_open){
        document.querySelector('#create-note').classList.toggle('module-open');
        let t = new Date();
        document.querySelector('#create-time').innerHTML = t.getDate() + " " + month[t.getMonth()] + " " + addZero(t.getHours()) + ":" + addZero(t.getMinutes());
    }else{
        document.querySelector('#create-task').classList.toggle('module-open');
    }
    document.querySelector('body').style.overflowY = 'hidden';
});

function close_create_task(){
    document.querySelector('.create-task__input').value = "";
    document.querySelector('.create-task-module').classList.toggle('module-open');
}

function close_create_note(){
    document.querySelector('body').style.overflowY = 'auto';
    document.querySelector('#create-note').classList.toggle('module-open');
}

document.querySelector('#create-note-close').addEventListener('click', close_create_note);

document.querySelector('#create-form').addEventListener('input', (event) =>{
   if(event.target){
       if(document.querySelector('#create-title').value == '' ||
          document.querySelector('#create-content').value == '')
           document.querySelector('#create-button').disabled = true;
       else document.querySelector('#create-button').disabled = false;
   }
});

function hide_buttons(){
    document.querySelector('#fullScreen-change-button').style.display = "inline-block";
    document.querySelector('#fullScreen-save-button').style.display = "none";
    document.querySelector('#fullScreen-cancel-button').style.display = "none";
    document.querySelector('#fullScreen-title').disabled = true;
    document.querySelector('#fullScreen-content').disabled = true;
}

document.querySelector('#fullScreen-change-button').addEventListener('click', function (event){ 
    document.querySelector('#fullScreen-title').disabled = false;
    document.querySelector('#fullScreen-content').disabled = false;
    this.style.display = "none";
    document.querySelector('#fullScreen-save-button').style.display = "inline-block";
    document.querySelector('#fullScreen-cancel-button').style.display = "inline-block";
});

function opentask (id){
    for(let i in taskList){
        if(taskList[i].id == id){
            return i;
        }
    }
}

document.querySelector('.tasks').addEventListener('click', (event) =>{
    if(event.target.closest('.task-container button')){
        document.querySelector('.tasks').removeChild(document.querySelector(`#${event.target.closest('.task-container').id}`));
        taskList.splice(opentask(event.target.closest('.task-container').id),1);
        localStorage.setItem('task',JSON.stringify(taskList));
    }
});

document.querySelector('#fullScreen-save-button').addEventListener('click', () => {
    noteList[Open_Note_Number].content = document.querySelector('#fullScreen-content').value;
    noteList[Open_Note_Number].title = document.querySelector('#fullScreen-title').value;
    localStorage.setItem('note',JSON.stringify(noteList));
    hide_buttons();
    document.querySelector(`#${noteList[Open_Note_Number].id} .note-title`).innerHTML = noteList[Open_Note_Number].title;
    document.querySelector(`#${noteList[Open_Note_Number].id} .note-content`).innerHTML = noteList[Open_Note_Number].content;
});

function cancel_change(){
    document.querySelector('#fullScreen-content').value =noteList[Open_Note_Number].content;
    document.querySelector('#fullScreen-title').value = noteList[Open_Note_Number].title;
    hide_buttons();
}

document.querySelector('#fullScreen-cancel-button').addEventListener('click', () => {
    cancel_change();
});

document.querySelector('#fullScreen-remove-button').addEventListener('click', (event) =>{ 
   document.querySelector('.notes').removeChild(document.querySelector(`#${noteList[Open_Note_Number].id}`));
    noteList.splice(Open_Note_Number,1);
    localStorage.setItem('note',JSON.stringify(noteList));
    close_fullScreen_module();
});


//Обработчик на кнопке создания нового элемента
document.querySelector('#create-button').addEventListener('click', create_new_block)


//Создает новый элемент(заметку или задачу зависит от открытой вкладки)
function create_new_block(){
    if(note_is_open){
        let note ={
            id: "i"+Date.now(),
            time : new Date().getDate() + " " + month[new Date().getMonth()] + " " + addZero(new Date().getHours()) + ":" + addZero(new Date().getMinutes()),
            title : document.querySelector('.form #create-title').value,
            content : document.querySelector('.form #create-content').value
        }
        noteList.push(note);
        localStorage.setItem('note',JSON.stringify(noteList));
        show_note(noteList.length-1);
        close_create_note();
        document.querySelector('.form #create-title').value = '';
        document.querySelector('.form #create-content').value = '';  
        document.querySelector('#create-button').disabled = true;   
    }else{
        let task ={
            id: "i"+Date.now(),
            content : document.querySelector('.create-task__input').value,
            checked : ''
        }
        taskList.push(task);
        localStorage.setItem('task',JSON.stringify(taskList));
        show_task(taskList.length-1);
        close_create_task();
    }
}

//Показать заметку
function show_note(i){
        document.querySelector('.notes').innerHTML +=
        `<div class="note-container" id="${noteList[i].id}">
            <div class="note-title">${noteList[i].title}</div>
            <p class="note-content">${noteList[i].content}</p>
            <div class="note-data_creation">${noteList[i].time}</div>
        </div>`;
}

//Показать задачу
function show_task(i){
        document.querySelector('.tasks').innerHTML +=
        `<div class="task-container" id="${taskList[i].id}">
            <button><i class="fa fa-times task-icon" aria-hidden="true"></i></button>
            <p class="task-content">${taskList[i].content}</p>
        </div>`;
}