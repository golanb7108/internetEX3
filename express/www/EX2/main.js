/**
 * Created by Amit Abel on 06/12/2014.
 */

// Instance of Calc object
var total_calc;

// The Calc object
var Calc = function() {
    this.value = 0;
};

Calc.prototype.plus = function(x){
    this.value += x;
    return this.value;
};

Calc.prototype.mult = function(x){
    this.value *= x;
    return this.value;
};

Calc.prototype.clear = function(){
    this.value = 0;
    return this.value;
};

// Initial function
function init(){
    login();
    profile();
    calculator();
    total_calc = new Calc();
    document.getElementById("login").style.display = "block";
}

// Login window
function login() {
    //login div
    var div_login = document.createElement('div');
    div_login.id = "login";
    document.body.appendChild(div_login);

    //user
    var user_label = document.createElement('label');
    user_label.textContent = "Username: ";
    div_login.appendChild(user_label);
    var user_input = document.createElement('input');
    user_input.type = "text";
    user_input.id = "username";
    div_login.appendChild(user_input);
    div_login.appendChild(document.createElement('br'));
    div_login.appendChild(document.createElement('br'));

    //div password
    var psw_label = document.createElement('label');
    psw_label.textContent = "Password: ";
    div_login.appendChild(psw_label);
    var psw_input = document.createElement('input');
    psw_input.type = "password";
    psw_input.id = "password";
    div_login.appendChild(psw_input);
    div_login.appendChild(document.createElement('br'));
    div_login.appendChild(document.createElement('br'));

    //submit button
    var submit_button = document.createElement('button');
    submit_button.id = "submit_button";
    submit_button.textContent = "login";
    div_login.appendChild(submit_button);
    document.getElementById("submit_button").addEventListener('click',check_login);

    document.getElementById("login").style.display = "none";
}

// Profile window
function profile(){
    //profile div
    var div_prof = document.createElement('div');
    div_prof.id = "profile";
    document.body.appendChild(div_prof);

    //name
    var prof_name = document.createElement('label');
    prof_name.textContent = "Name: Amit Abel";
    prof_name.id = "prof_name";
    div_prof.appendChild(prof_name);
    div_prof.appendChild(document.createElement('br'));
    div_prof.appendChild(document.createElement('br'));

    //introduction
    var prof_intro = document.createElement('label');
    prof_intro.textContent = "Amit is a student for computer science. " +
    "Amit takes this year the course of Internet Technologies (67555)";
    prof_intro.id = "prof_intro";
    div_prof.appendChild(prof_intro);
    div_prof.appendChild(document.createElement('br'));
    div_prof.appendChild(document.createElement('br'));

    //hobbies
    var prof_hob = document.createElement('label');
    prof_hob.textContent = "Hobbies: listening to music, watching movies and sailing";
    prof_hob.id = "prof_hob";
    div_prof.appendChild(prof_hob);
    div_prof.appendChild(document.createElement('br'));
    div_prof.appendChild(document.createElement('br'));

    //funny quote
    var prof_quote = document.createElement('label');
    prof_quote.textContent = "Quote: \"I go through life like a Karate Kid\" (Britney Spears)";
    prof_quote.id = "prof_quote";
    div_prof.appendChild(prof_quote);
    div_prof.appendChild(document.createElement('br'));
    div_prof.appendChild(document.createElement('br'));

    // Pictures
    var prof_pict = document.createElement('img');
    prof_pict.src = "first_pic.jpg";
    prof_pict.id = "prof_pict";
    div_prof.appendChild(prof_pict);

    document.getElementById("prof_pict").addEventListener('mouseover', function(){
        document.getElementById("prof_pict").src = "second_pic.jpg";
    });
    document.getElementById("prof_pict").addEventListener('mouseout', function(){
        document.getElementById("prof_pict").src = "first_pic.jpg";
    });
    div_prof.appendChild(document.createElement('br'));
    div_prof.appendChild(document.createElement('br'));

    //calculator button, move to calculator screen
    var calc_button = document.createElement('button');
    calc_button.id = "calc_button";
    calc_button.textContent = "calculator";
    div_prof.appendChild(calc_button);
    document.getElementById("calc_button").addEventListener('click',move_to_calc);

    //logout button, back to submit screen
    var logout_button = document.createElement('button');
    logout_button.id = "logout_button_prof";
    logout_button.textContent = "logout";
    div_prof.appendChild(logout_button);
    document.getElementById("logout_button_prof").addEventListener('click',back_to_submit);

    document.getElementById("profile").style.display = "none";
}

// Calculator window
function calculator(){
    //calculator div
    var div_calc = document.createElement('div');
    div_calc.id = "calculator";
    document.body.appendChild(div_calc);

    //value screen
    var value_screen = document.createElement('label');
    value_screen.textContent = "Enter number: ";
    div_calc.appendChild(value_screen);
    var value_input = document.createElement('input');
    value_input.type = "text";
    value_input.id = "value_input";
    div_calc.appendChild(value_input);
    document.getElementById("value_input").addEventListener('keypress',validate_int);

    // clear button
    var clear_button = document.createElement('button');
    clear_button.id = "clear_button";
    clear_button.textContent = "clear";
    div_calc.appendChild(clear_button);
    document.getElementById("clear_button").addEventListener('click',clear_all_calc);

    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));

    // plus button
    var plus_button = document.createElement('button');
    plus_button.id = "plus_button";
    plus_button.textContent = "+";
    div_calc.appendChild(plus_button);
    document.getElementById("plus_button").addEventListener('click',oprerate_plus);

    // mult button
    var mult_button = document.createElement('button');
    mult_button.id = "mult_button";
    mult_button.textContent = "x";
    div_calc.appendChild(mult_button);
    document.getElementById("mult_button").addEventListener('click',oprerate_mult);
    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));

    //result screen
    var result_screen = document.createElement('label');
    result_screen.textContent = "result: ";
    result_screen.id = "result_screen";
    div_calc.appendChild(result_screen);
    var result_value = document.createElement('output');
    result_value.type = "text";
    result_value.readOnly = true;
    result_value.value = 0;
    result_value.id = "result_value";
    div_calc.appendChild(result_value);

    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));
    div_calc.appendChild(document.createElement('br'));

    //return to profile
    var re_profile_button = document.createElement('button');
    re_profile_button.id = "re_profile_button";
    re_profile_button.textContent = "profile";
    div_calc.appendChild(re_profile_button);
    document.getElementById("re_profile_button").addEventListener('click',return_to_profile);

    //logout button, back to submit screen
    var logout_button = document.createElement('button');
    logout_button.id = "logout_button_calc";
    logout_button.textContent = "logout";
    div_calc.appendChild(logout_button);
    document.getElementById("logout_button_calc").addEventListener('click',back_to_submit);

    document.getElementById("calculator").style.display = "none";
}

// Operation plus in the calculator
function oprerate_plus(){
    var input_val = document.getElementById("value_input");
    var output = document.getElementById("result_value");
    output.value = total_calc.plus(parseInt(input_val.value));
    input_val.value = "";
}

// Operation mult in the calculator
function oprerate_mult(){
    var input_val = document.getElementById("value_input");
    var output = document.getElementById("result_value");
    output.value = total_calc.mult(parseInt(input_val.value));
    input_val.value = "";
}

// Operation clear all calculator elements
function clear_all_calc(){
    total_calc.clear();
    var input_val = document.getElementById("value_input");
    input_val.value = "";
    var output_val = document.getElementById("result_value");
    output_val.value = 0;
}

// Validate that the value was inserted to calculator is non-negative integer
function validate_int(press){
    var hold_value = press || window.event;
    var key = hold_value.keyCode || hold_value.charCode;
    var integer_regex = /[0-9]/;
    if(!integer_regex.test(String.fromCharCode(key))){
        hold_value.returnValue = false;
        if(hold_value.preventDefault) {
            hold_value.preventDefault();
        }
    }
}

// Check login password and user-name.
// If they are valid, move to profile window; otherwise - send error message.
function check_login(){
    var user = document.getElementById("username");
    var password = document.getElementById("password");
    if (user.value == "admin" && password.value == "admin"){
        document.getElementById("login").style.display = "none";
        document.getElementById("profile").style.display = "block";
    }
    else {
        alert("Your username or password is incorrect.\nPlease try again.");
    }
    user.value = '';
    password.value = '';
}

// Return to login window; Send a message that the logout succeeded.
function back_to_submit(){
    clear_all_calc();
    document.getElementById("profile").style.display = "none";
    document.getElementById("calculator").style.display = "none";
    alert("You logged out successfully");
    document.getElementById("login").style.display = "block";
}

// Open calculator window
function move_to_calc(){
    document.getElementById("profile").style.display = "none";
    document.getElementById("calculator").style.display = "block";
}

// Return to profile window
function return_to_profile(){
    clear_all_calc();
    document.getElementById("calculator").style.display = "none";
    document.getElementById("profile").style.display = "block";
}

// Run application
init();


