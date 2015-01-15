/**
 * Created by gbenami on 11/28/2014.
 */

function start(btn){
    document.body.appendChild(btn);
}

/****************************  VARS - START  ****************************/
var first_time_table = 1;
var first_cal_table = 1;
var input_box;
var after_clear = 1;
var value_screen;
var mouse_over_pic = 0;
var calculator;
/****************************  VARS - END  ****************************/


/*******************************************  LOGIN PAGE ELEMENTS - START  *******************************************/
//Header
var login_header = document.createElement("HEADER");
login_header.id = "login_header";
var header_text = document.createTextNode("Login Form");
login_header.appendChild(header_text);

//User name
var input_username = document.createElement("INPUT");
input_username.setAttribute("type", "text");
input_username.setAttribute("id", "input_username");
input_username.setAttribute("placeholder", "User name...");
input_username.setAttribute("className", "css-input_username");

//Password
var input_password = document.createElement("INPUT");
input_password.setAttribute("type", "password");
input_password.setAttribute("id", "input_password");
input_password.setAttribute("placeholder", "Password...");
input_password.setAttribute("className", "css-input_password");

// Login button
var login_btn = document.createElement("INPUT");
login_btn.setAttribute("type", "button");
login_btn.setAttribute("value", "Login");
login_btn.id = "login_btn";

//Remember checkbox
var remember_checkbox = document.createElement("INPUT");
remember_checkbox.setAttribute("id", "remember_checkbox");
remember_checkbox.type = "checkbox";
remember_checkbox.name = "checkbox";

// Wrong login div
var wrong_login = document.createElement('div');
wrong_login.id = 'wrong_login';
var wrong_login_message = document.createTextNode("Wrong login or password");
wrong_login.appendChild(wrong_login_message);

// Successful logout div
var success_logout = document.createElement('div');
success_logout.id = 'success_logout';
var success_logout_message = document.createTextNode("You logged out successfully");
success_logout.appendChild(success_logout_message);

// Append children to the main login div
var my_login_layer = document.createElement('div');
my_login_layer.id = 'login_layer';
my_login_layer.appendChild(login_header);
my_login_layer.appendChild(input_username);
my_login_layer.appendChild(input_password);
my_login_layer.appendChild(login_btn);
my_login_layer.appendChild(wrong_login);
my_login_layer.appendChild(success_logout);
addEventListener('load', start(my_login_layer));
document.getElementById("input_username").focus();
document.getElementById("wrong_login").style.display = "none";
document.getElementById("success_logout").style.display = "none";
/*******************************************  LOGIN PAGE ELEMENTS - END  *******************************************/




/******************************************  PROFILE PAGE ELEMENTS - START  ******************************************/
// Profile Header
var profile_header = document.createElement("HEADER");
profile_header.id = "profile_header";
var profile_header_text = document.createTextNode("My Profile");
profile_header.appendChild(profile_header_text);

// Profile Image
var img = document.createElement("img");
img.setAttribute("id", "img");
img.setAttribute("src", "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT9b-QUUAXWLge-YLDgv0r9e3hFS2E214BAse3p7hdZ0CZ--bNrkg");

//Profile table
var profile_table = document.createElement("TABLE");
profile_table.setAttribute("id", "profile_table");
profile_table.border = "1";
profile_table.cellPadding = "2";

// Logoff button
var logoff_btn = document.createElement("INPUT");
logoff_btn.setAttribute("type", "button");
logoff_btn.setAttribute("value", "Logoff");
logoff_btn.id = "logoff_btn";

// Calculator button
var calculator_btn = document.createElement("INPUT");
calculator_btn.setAttribute("type", "button");
calculator_btn.setAttribute("value", "Calculator");
calculator_btn.id = "calculator_btn";

// Append all of the elements to the main profile div.
var my_profile_layer = document.createElement('div');
my_profile_layer.id = 'profile_layer';
my_profile_layer.appendChild(profile_header);
my_profile_layer.appendChild(img);
my_profile_layer.appendChild(profile_table);
my_profile_layer.appendChild(calculator_btn);
my_profile_layer.appendChild(logoff_btn);
addEventListener('load', start(my_profile_layer));
document.getElementById("profile_layer").style.display = "none";
/*******************************************  PROFILE PAGE ELEMENTS - END  *******************************************/








/*****************************************  CALCULATOR PAGE ELEMENTS - START  *****************************************/
// Calculator Header
var calculator_header = document.createElement("HEADER");
calculator_header.id = "calculator_header";
var calculator_header_text = document.createTextNode("Calculator");
calculator_header.appendChild(calculator_header_text);

// Calculator value and input table
var cal_table = document.createElement("TABLE");
cal_table.setAttribute("id", "cal_table");
cal_table.border = "1";
cal_table.cellPadding = "2";

// Calculator signs table
var sign_table = document.createElement("TABLE");
sign_table.setAttribute("id", "sign_table");
sign_table.border = "1";
sign_table.cellPadding = "2";

// Logoff from calculator button
var logoff_cal_btn = document.createElement("INPUT");
logoff_cal_btn.setAttribute("type", "button");
logoff_cal_btn.setAttribute("value", "Logoff");
logoff_cal_btn.id = "logoff_cal_btn";

// Profile from cal button
var profile_btn = document.createElement("INPUT");
profile_btn.setAttribute("type", "button");
profile_btn.setAttribute("value", "Profile page");
profile_btn.id = "profile_btn";

// Append all elements to the main calculator div
var my_calculator_layer = document.createElement('div');
my_calculator_layer.id = 'calculator_layer';
my_calculator_layer.appendChild(calculator_header);
my_calculator_layer.appendChild(cal_table);
my_calculator_layer.appendChild(sign_table);
my_calculator_layer.appendChild(profile_btn);
my_calculator_layer.appendChild(logoff_cal_btn);
addEventListener('load', start(my_calculator_layer));
document.getElementById("calculator_layer").style.display = "none";
/*****************************************  CALCULATOR PAGE ELEMENTS - END  *****************************************/

/*****************************************  HELP FUNCTIONS / OBJECTS - START  *****************************************/
// Calculator object + relevant functions in the prototype.
function Calculator(a)
{
    this.first_num = a;
}
Calculator.prototype.multiply = function(a) {
    this.first_num = parseInt(this.first_num) * parseInt(a);
    return this.first_num;
};
Calculator.prototype.plus = function(a)
{
    this.first_num = parseInt(this.first_num) + parseInt(a);
    return this.first_num;
};
Calculator.prototype.clear = function()
{
    this.first_num = 0;
    return this.first_num;
};

// Check if the char is a number
function isNumber() {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
/*****************************************  HELP FUNCTIONS / OBJECTS - END  *****************************************/


/*****************************************  EVENT LISTENERS - START  *****************************************/
// Log_0ff from profile
document.getElementById("logoff_btn").addEventListener("click", function(){
    document.getElementById("profile_layer").style.display = "none";
    document.getElementById("login_layer").style.display = "block";
    document.getElementById("success_logout").style.display = "block";
    document.getElementById('input_username').value = "";
    document.getElementById('input_password').value = "";
    document.getElementById("input_username").focus();
});

// Calculator from profile
document.getElementById("calculator_btn").addEventListener("click", function(){
    document.getElementById("profile_layer").style.display = "none";
    document.getElementById("calculator_layer").style.display = "block";
    if (first_cal_table == 1) {
        // create new calculator
        calculator = new Calculator(0);
        // Create first row element
        var first_cal_row = document.createElement("TR");
        first_cal_row.setAttribute("id", "first_cal_row");
        document.getElementById("cal_table").appendChild(first_cal_row);
        // Create value text
        var val_text = document.createElement("TD");
        val_text.setAttribute("id", "val_text");
        var val_field = document.createTextNode("Value:    ");
        val_text.appendChild(val_field);
        document.getElementById("first_cal_row").appendChild(val_text);
        // Create value presentation box
        var val_screen_box = document.createElement("TD");
        val_screen_box.setAttribute("id", "val_screen_box");
        document.getElementById("first_cal_row").appendChild(val_screen_box);
        value_screen = document.createElement("INPUT");
        value_screen.setAttribute("type", "text");
        value_screen.setAttribute("id", "value_screen");
        value_screen.setAttribute("value", "0");
        value_screen.setAttribute("readOnly", "true");
        document.getElementById("val_screen_box").appendChild(value_screen);
        // Create second row element
        var second_cal_row = document.createElement("TR");
        second_cal_row.setAttribute("id", "second_cal_row");
        document.getElementById("cal_table").appendChild(second_cal_row);
        // Create input text
        var input_text = document.createElement("TD");
        input_text.setAttribute("id", "input_text");
        var in_field = document.createTextNode("Input:    ");
        input_text.appendChild(in_field);
        document.getElementById("second_cal_row").appendChild(input_text);
        // Create input presentation
        var in_screen_box = document.createElement("TD");
        in_screen_box.setAttribute("id", "in_screen_box");
        document.getElementById("second_cal_row").appendChild(in_screen_box);
        input_box = document.createElement("INPUT");
        input_box.setAttribute("type", "text");
        input_box.setAttribute("placeholder", "0");
        input_box.setAttribute("id", "input_box");
        document.getElementById("in_screen_box").appendChild(input_box);
        document.getElementById("input_box").focus();
        document.getElementById("input_box").onkeypress = isNumber;
        // Create signs row element
        var first_sign_row = document.createElement("TR");
        first_sign_row.setAttribute("id", "first_sign_row");
        document.getElementById("sign_table").appendChild(first_sign_row);
        // Create plus box element
        var plus = document.createElement("TD");
        plus.setAttribute("id", "plus");
        var plus_box = document.createElement("INPUT");
        plus_box.setAttribute("type", "button");
        plus_box.setAttribute("id", "plus_box");
        plus_box.setAttribute("value", "+");
        plus.appendChild(plus_box);
        document.getElementById("first_sign_row").appendChild(plus);
        // Create multiply box element
        var multiple = document.createElement("TD");
        multiple.setAttribute("id", "multiple");
        var multiple_box = document.createElement("INPUT");
        multiple_box.setAttribute("type", "button");
        multiple_box.setAttribute("id", "multiple_box");
        multiple_box.setAttribute("value", "*");
        multiple.appendChild(multiple_box);
        document.getElementById("first_sign_row").appendChild(multiple);
        // Create clean box element
        var clean = document.createElement("TD");
        clean.setAttribute("id", "multiple");
        var clean_box = document.createElement("INPUT");
        clean_box.setAttribute("type", "button");
        clean_box.setAttribute("id", "clean_box");
        clean_box.setAttribute("value", "Clear");
        clean.appendChild(clean_box);
        document.getElementById("first_sign_row").appendChild(clean);
        // Plus event listener
        document.getElementById("plus_box").addEventListener("click", function(){
            if (document.getElementById('input_box').value != ""){
                document.getElementById('value_screen').value = calculator.plus(document.getElementById('input_box').value);
                document.getElementById('input_box').value = "";
                document.getElementById("input_box").focus();
                after_clear = 0;
            }
        });

        // Multiply event listener
        document.getElementById("multiple_box").addEventListener("click", function(){
            if (after_clear == 1){
                calculator.first_num = 1;
            }
            else {
                calculator.first_num = document.getElementById('value_screen').value;
            }
            if (document.getElementById('input_box').value != ""){
                document.getElementById('value_screen').value = calculator.multiply(document.getElementById('input_box').value);
                document.getElementById('input_box').value = "";
                after_clear = 0;
                document.getElementById("input_box").focus();
            }
         });

        // Clear event listener
        document.getElementById("clean_box").addEventListener("click", function(){
            after_clear = 1;
            document.getElementById('value_screen').value = calculator.clear();
            document.getElementById('input_box').value = "";
            document.getElementById("input_box").focus();
        });
    }
    first_cal_table = 0;
    document.getElementById("input_box").focus();
});

// Log_0ff from calculator
document.getElementById("logoff_cal_btn").addEventListener("click", function(){
    after_clear = 1;
    document.getElementById("calculator_layer").style.display = "none";
    document.getElementById("login_layer").style.display = "block";
    document.getElementById("success_logout").style.display = "block";
    document.getElementById('input_username').value = "";
    document.getElementById('input_password').value = "";
    document.getElementById('value_screen').value = "0";
    document.getElementById('input_box').value = "";
    document.getElementById("input_username").focus();
});

// Profile from calculator
document.getElementById("profile_btn").addEventListener("click", function(){
    after_clear = 1;
    document.getElementById("calculator_layer").style.display = "none";
    document.getElementById("profile_layer").style.display = "block";
    document.getElementById('value_screen').value = "0";
    document.getElementById('input_box').value = "";
});

// Change pic after moving over a picture.
document.getElementById("img").addEventListener("mouseover", function() {
    if (mouse_over_pic == 0){
        img.setAttribute("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf3wpXr-nMiehqKAcYF6HwGgbFf3krrfdfjrmAOTjhNZnmOmM0");
        mouse_over_pic = 1;
    }
    else {
        img.setAttribute("src", "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT9b-QUUAXWLge-YLDgv0r9e3hFS2E214BAse3p7hdZ0CZ--bNrkg");
        mouse_over_pic = 0;
    }
});

// Profile the login
document.getElementById("login_btn").addEventListener("click", function(){
    if ((document.getElementById('input_username').value == "admin") &&
        (document.getElementById('input_password').value == "admin")){
        document.getElementById("login_layer").style.display = "none";
        document.getElementById("profile_layer").style.display = "block";
        document.getElementById("wrong_login").style.display = "none";
        document.getElementById("success_logout").style.display = "none";
        /* build table */
        if (first_time_table == 1){
            var first_row = document.createElement("TR");
            first_row.setAttribute("id", "first_row");
            document.getElementById("profile_table").appendChild(first_row);
            var left_name = document.createElement("TD");
            left_name.setAttribute("id", "left_name");
            var name_field = document.createTextNode("Name:");
            left_name.appendChild(name_field);
            document.getElementById("first_row").appendChild(left_name);
            var right_name = document.createElement("TD");
            right_name.setAttribute("id", "right_name");
            var name = document.createTextNode("Golan Ben Ami");
            right_name.appendChild(name);
            document.getElementById("first_row").appendChild(right_name);
            var second_row = document.createElement("TR");
            second_row.setAttribute("id", "second_row");
            document.getElementById("profile_table").appendChild(second_row);
            var left_whom = document.createElement("TD");
            left_whom.setAttribute("id", "left_whom");
            var whom_field = document.createTextNode("Who ami I:");
            left_whom.appendChild(whom_field);
            document.getElementById("second_row").appendChild(left_whom);
            var right_whom = document.createElement("TD");
            right_whom.setAttribute("id", "right_whom");
            var whom = document.createTextNode("A CS student.");
            right_whom.appendChild(whom);
            document.getElementById("second_row").appendChild(right_whom);
            var third_row = document.createElement("TR");
            third_row.setAttribute("id", "third_row");
            document.getElementById("profile_table").appendChild(third_row);
            var left_hob = document.createElement("TD");
            left_hob.setAttribute("id", "left_hob");
            var hob_field = document.createTextNode("Hobbies:");
            left_hob.appendChild(hob_field);
            document.getElementById("third_row").appendChild(left_hob);
            var right_hob = document.createElement("TD");
            right_hob.setAttribute("id", "right_hob");
            var hob = document.createTextNode("Playing Basket ball and programming.");
            right_hob.appendChild(hob);
            document.getElementById("third_row").appendChild(right_hob);
            var fourth_row = document.createElement("TR");
            fourth_row.setAttribute("id", "fourth_row");
            document.getElementById("profile_table").appendChild(fourth_row);
            var left_fun = document.createElement("TD");
            left_fun.setAttribute("id", "left_fun");
            var fun_field = document.createTextNode("Funny Quote:");
            left_fun.appendChild(fun_field);
            document.getElementById("fourth_row").appendChild(left_fun);
            var right_fun = document.createElement("TD");
            right_fun.setAttribute("id", "right_fun");
            var fun = document.createTextNode("Tizmun ze inyan shell timing.");
            right_fun.appendChild(fun);
            document.getElementById("fourth_row").appendChild(right_fun);
        }
        first_time_table = 0;
    }
    else {
        document.getElementById("wrong_login").style.display = "block";
        document.getElementById("success_logout").style.display = "none";
        document.getElementById('input_username').value = "";
        document.getElementById('input_password').value = "";
        document.getElementById("input_username").focus();
    }
});
/*****************************************  EVENT LISTENERS - END  *****************************************/