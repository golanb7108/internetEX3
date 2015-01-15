/**
 * Created by gbenami on 11/28/2014.
 */

function login() {

    var username = document.getElementById("user_name");
    var password = document.getElementById("password");


    $.post("/login",
        JSON.stringify({user_name:username.value, password:password.value}),
        function(data, textStatus, jqXHR)
        {
            if (data.toString() === '500'){
                alert(textStatus);
                alert("Wrong login details");
            }
            else {
                // Fill list with his tasks
                activate_todo();
            }
        }).fail(function(jqXHR, textStatus, errorThrown)
        {
            alert(textStatus);
        });
}

function register() {
    var full_name = document.getElementById("full_name");
    var username = document.getElementById("reg_user_name");
    var password = document.getElementById("reg_pass_word");
    var ver_password = document.getElementById("ver_reg_pass_word");

    $.post("/register",
        JSON.stringify({full_name: full_name.value, user_name:username.value, password:password.value, verify_password:ver_password.value}),
        function(data, textStatus, jqXHR)
        {
            if (data.toString() === '500'){
                alert(textStatus);
                alert("Wrong login details");
            }
            else {
                // Fill list with his tasks
                activate_todo();
            }
        }).fail(function(jqXHR, textStatus, errorThrown)
        {
            alert("fail:" + textStatus);
        });
}

function runScript(e) {
    if (e.keyCode == 13) {
        addItem();
    }
}

function addItem() {
        alert("ya");
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

activate_login();