/**
 * Created by gbenami on 11/28/2014.
 */

var task_line =  document.getElementById("new-todo");

function setTaskInHTML (div, task, i){
    var completeClass = '',
        checkClass = '';

    var template
        =	'<li data-id="{{id}}" class="{{completed}}" onblur="editItemDone({{id}})">'
        +		'<div class="view">'
        +			'<input class="toggle" onclick="checkBox({{id}})" type="checkbox" {{checked}}>'
        +			'<label  ondblclick="editLabel({{id}})" >{{value}}</label>'
        +			'<button class="destroy" onclick="deleteItem({{id}})"></button>'
        +		'</div>'
        +	'</li>';
    if (task.completed === 1){
        completeClass = 'completed';
        checkClass = 'checked';
    }
    template = template.replace(/\{\{id}}/g, task.id);
    template = template.replace(/\{\{value}}/g, task.value);
    template = template.replace('{{completed}}', completeClass);
    template = template.replace('{{checked}}', checkClass);

    div.innerHTML += (template);
}

function checkBox(id){
    var listTodo = document.querySelector('[data-id="' + id + '"]');
    if (!listTodo) {
        return;
    }
    var value = listTodo.getElementsByTagName('label')[0].firstChild.data;
    var oldStatus = listTodo.className;
    var newStatus = oldStatus === "" ? "completed" : "";
    var todoStatus = newStatus === "" ? 0 : 1;

    $.ajax({
        url: "/item",
        type: "PUT",

        data: JSON.stringify({id: id, value: value, completed: todoStatus}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result, status, xhr) {
            alert("update completed success");

            listTodo.className = newStatus;
            listTodo.querySelector('input').checked = todoStatus;
            fillList();
        },
        error: function (xhr, status, error) {
            if (xhr.status === 200){
                listTodo.className = newStatus;
                listTodo.querySelector('input').checked = todoStatus;
                fillList();
            }
        }
    });}

function editLabel(id){
    var listItem = qs('[data-id="' + id + '"]');
    var title = listItem.getElementsByTagName('label')[0].firstChild.data;
    if (!listItem) {
        return;
    }

    listItem.className = listItem.className + ' editing';

    var input = document.createElement('input');
    input.className = 'edit';
    input.setAttribute('onblur', 'editItemDone(' +id+')');

    listItem.appendChild(input);
    input.focus();
    input.value = title;
}

function editItemDone(id){
    var listItem = qs('[data-id="' + id + '"]');

    var title = listItem.querySelector('input.edit').value;
    if (!listItem) {
        return;
    }

    var input = qs('input.edit', listItem);
    listItem.removeChild(input);

    listItem.className = listItem.className.replace('editing', '');

    qsa('label', listItem).forEach(function (label) {
        label.textContent = title;
    });
    putItem(id, title, 0);
}

function fillList(){
    var all = document.getElementById('all');
    var completed = document.getElementById('completed');
    var active = document.getElementById('active');
    all.innerHTML = "";
    completed.innerHTML = "";
    active.innerHTML = "";

    $.ajax ({
        url: "/item",
        type: "GET",
        dataType: "json",

        success: function(data, textStatus, messageBody) {
            if (data.toString() === '500'){
                alert("success: Loading list failed. Try again.");
            }
            else {
                var all_items = JSON.parse(JSON.stringify(data));

                for (var i = 0; i < all_items.length; i++){
                    if (typeof all_items[i] === 'undefined') continue;
                    setTaskInHTML(all, all_items[i], i);
                    if (all_items[i].completed = 1){
                        setTaskInHTML(completed, all_items[i], i);

                    }
                    else { // The task should be in active
                        setTaskInHTML(active, all_items[i], i);
                    }
                }
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            alert("error: " + jqXHR.status + " Loading list failed. Try again.");
        }
    });
}

function addItem(){
    var task = task_line.value;
    if (task === '') return;

    $.ajax ({
        url: "/item",
        type: "POST",

        data: JSON.stringify({id: 0, value: task, completed: 0}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            if (data.toString() === '500'){
                //alert("success: Add Item failed");
            }
            else {
                //alert("success: Add Item success");
                task_line.value = "";

                fillList();
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            if (jqXHR.status === 200){
                //alert("fail: Add Item success");
                task_line.value = "";

                fillList();
            }
            else{
                //alert(jqXHR.status + " Add Item failed");
            }
        }
    });
};

function deleteItem(id){
    $.ajax({
        url: '/item',
        type: 'DELETE',
        data: JSON.stringify({id: id}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            fillList();
        },
        error: function(jqXHR,textStatus, errorThrown) {
            if (jqXHR.status === 200) {
                fillList();
            }
            else alert("jqXHR.status:" + jqXHR.status + " " + errorThrown);
        }
    });
}


function putItem(id, value, completed){
    $.ajax({
        url: "/item",
        type: "PUT",

        data: JSON.stringify({id: id, value: value, completed: completed}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            fillList();
        },
        error: function(jqXHR,textStatus, errorThrown) {
            if (jqXHR.status === 200) {
                fillList();
            }
            else alert("jqXHR.status:" + jqXHR.status + " " + errorThrown);
        }
    });
}


function login(){

    var username = document.getElementById("user_name");
    var password = document.getElementById("password");

    $.ajax ({
        url: "/login",
        type: "POST",
        data: JSON.stringify({user_name:username.value, password:password.value}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus, messageBody) {
            if (data.toString() === '500'){
                alert("Wrong login details");
            }
            else {
                fillList();
                activate_todo();
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            if (jqXHR.status === 200){
                fillList();
                activate_todo();
            }
            else{
                alert("Wrong login details");
            }
        }
    });
}

function register(){
    var full_name = document.getElementById("full_name");
    var username = document.getElementById("reg_user_name");
    var password = document.getElementById("reg_pass_word");
    var ver_password = document.getElementById("ver_reg_pass_word");

    $.ajax ({
        url: "/register",
        type: "POST",
        data: JSON.stringify({full_name: full_name.value, user_name:username.value, password:password.value, verify_password:ver_password.value}),
        dataType: "json",
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            try {
                if (data.toString() === '500') {
                    alert(textStatus);
                    alert("Wrong login details");
                }
                else {
                    fillList();
                    activate_todo();
                }
            } catch (e) {
                alert("GOLAN");
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            if (jqXHR.status === 200){
                fillList();
                activate_todo();
            }
            else{
                alert("Wrong login details");
            }
        }
    });
}

function runScript(e){
    if (e.keyCode == 13) {
        addItem();
    }
}



function activate_register(){
    document.getElementById("login").style.display = "none";
    document.getElementById("todoapp").style.display = "none";
    document.getElementById("register").style.display = "block";
}

function activate_login(){
    document.getElementById("register").style.display = "none";
    document.getElementById("todoapp").style.display = "none";
    document.getElementById("login").style.display = "block";
}

function activate_todo(){
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("todoapp").style.display = "block";
}
