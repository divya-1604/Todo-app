document.addEventListener('DOMContentLoaded', ()=>{
    const tasksList=document.getElementById('tasks-list');
    const todoList=document.getElementById('todo-list');
    const addBtn=document.getElementById('addBtn');
    const searchList=document.getElementById('search-list');
    const prevBtn=document.getElementById('prev-btn');
    const nextBtn=document.getElementById('next-btn');
    const pageNumber=document.getElementById('pageNumber');
    let todos = [];
    let currentPage = 1;
    const itemsPerPage = 5;
    let isEditing = false;
    let currentTaskId=null;
    loadTodos();

    todoList.addEventListener('input', ()=>{
        addBtn.disabled = todoList.value.trim() === "";
    });

    todoList.addEventListener('keypress', (e)=>{
        if((e.key)==="Enter" && todoList.value.trim()!==""){
            if(isEditing){
                updateItem(currentTaskId,todoList.value);
            }
            else{
                addItem({id: Date.now(), text: todoList.value, checked:false});
            }
            todoList.value="";
            addBtn.disabled=true;
            isEditing=false;
        }
    });
    //on the click of add Button
    addBtn.addEventListener('click',()=>{
        if(todoList.value.trim() !== ""){
            if(isEditing){
                updateItem(currentTaskId,todoList.value);
            }
            else{
                addItem({id: Date.now(),text: todoList.value, checked:false});
            }
            todoList.value="";
            addBtn.disabled=true;
            isEditing=false;
        }
    });

    searchList.addEventListener('input',()=>{
        currentPage = 1;
        renderTodos();
    });

    prevBtn.addEventListener('click',()=>{
        if(currentPage > 1){
            currentPage--;
            renderTodos();
        }
    });

    nextBtn.addEventListener('click',()=>{
        if(currentPage * itemsPerPage < todos.length){
            currentPage++;
            renderTodos();
        }
    });
    //adding lists
    function addItem(todo){
        todos.push(todo);
        saveTodos();
        renderTodos();
    }
    //updating lists
    function updateItem(id,newText){
        todos=todos.map(todo => todo.id === id ? { ...todo, text: newText} : todo);
        saveTodos();
        renderTodos();
    }
    //saving data in the local storage
    function saveTodos(){
        localStorage.setItem('todos',JSON.stringify(todos));
    }
    //loading data from local storage
    function loadTodos(){
       todos= JSON.parse(localStorage.getItem('todos')) || [];
       renderTodos();
    }
    //rendering list
    function renderTodos(){
        tasksList.innerHTML="";
        const filteredTodos=todos.filter(todo => 
            todo.text.toLowerCase().includes(searchList.value.toLowerCase()));
            console.log(filteredTodos);
        const paginatedTodo=filteredTodos.slice((currentPage-1)*itemsPerPage,currentPage*itemsPerPage);
        paginatedTodo.forEach(todo=>{
            // creating list element
            const li=document.createElement('li');
            li.dataset.id = todo.id;
            if(todo.checked){
                li.classList.add('checked');
            }
            //creating content element
            const content=document.createElement('div');
            content.className="content";
            content.innerText=todo.text;
            //iconBox: edit , delete , check
            const iconBox=document.createElement('div');
            iconBox.className="options";
            //delete icon
            const delIcon=document.createElement('i');
            delIcon.className="fa-solid fa-xmark";
            iconBox.appendChild(delIcon);

            delIcon.addEventListener('click',()=>{
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            });
            //edit icon
            const editIcon = document.createElement('i');
            editIcon.className="fa-solid fa-pen";
            iconBox.appendChild(editIcon);

            editIcon.addEventListener('click',()=>{
                if(li.classList.contains('checked')) return;

                todoList.value=content.innerText;
                todoList.focus();
                isEditing=true;
                currentTaskId=todo.id;
                addBtn.disabled=true;   
            });
            // check icon
            const checkIcon=document.createElement('i');
            checkIcon.className='fa-regular fa-circle-check';;
            iconBox.appendChild(checkIcon);

            checkIcon.addEventListener('click',()=>{
                li.classList.toggle('checked');
                if(li.classList.contains('checked')){
                    editIcon.classList.add('disabled');
                    delIcon.classList.add('disabled');
                    todo.checked=true;
                }else{
                    editIcon.classList.remove('disabled');
                    delIcon.classList.remove('disabled');
                    todo.checked=false;
                }
                saveTodos();
            });
            // appending icons, list
            li.append(content);
            li.append(iconBox);
            tasksList.appendChild(li);
        });
        pageNumber.textContent = currentPage;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage * itemsPerPage >= filteredTodos.length;
    }
});