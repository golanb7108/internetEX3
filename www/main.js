/**
 * Created by gbenami on 11/28/2014.
 */

var task_line =  document.getElementById("new-todo");

function fillList() {
    $.ajax ({
        url: "/item",
        type: "GET",
        success: function(data, textStatus, messageBody) {
            if (data.toString() === '500'){
                alert("Loading list failed. Try again.");
            }
            else {
                var all_items = JSON.parse(data);
                for (var i = 0; i < all_items.length; i++){
                    if (typeof all_items[i] === 'undefined') continue;


                }









            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            alert("Loading list failed. Try again.");
        }
    });
}

function login() {
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
                // Fill list with his tasks
                activate_todo();
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            alert("Wrong login details");
        }
    });
}

function register() {
    var full_name = document.getElementById("full_name");
    var username = document.getElementById("reg_user_name");
    var password = document.getElementById("reg_pass_word");
    var ver_password = document.getElementById("ver_reg_pass_word");

    $.ajax ({
        url: "/register",
        type: "POST",
        data: JSON.stringify({full_name: full_name.value, user_name:username.value, password:password.value, verify_password:ver_password.value}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            if (data.toString() === '500'){
                alert(textStatus);
                alert("Wrong login details");
            }
            else {
                // Fill list with his tasks
                activate_todo();
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function runScript(e) {
    if (e.keyCode == 13) {
        addItem();
    }
}

function addItem() {
    var task = task_line.value;
    if (task === '') return;

    $.ajax ({
        url: "/register",
        type: "POST",

        data: JSON.stringify({id: 0, title: task, completed: 0}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(data, textStatus) {
            if (data.toString() === '500'){
                alert("Add Item failed");
            }
            else {
                // Fill list with his tasks
                activate_todo();
            }
        },
        error: function(jqXHR,textStatus, errorThrown) {
            alert("Add Item failed");
        }
    });
};

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

