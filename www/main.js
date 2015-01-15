/**
 * Created by gbenami on 11/28/2014.
 */

var task_line =  document.getElementById("new-todo");

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
                alert("status: " + textStatus);
                alert("messageBody: " + messageBody);
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
        data: JSON.stringify({task: task}),
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
