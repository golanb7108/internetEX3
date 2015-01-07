Internet technologies EX4
=========================

-------------------------------------------------------------------------------
(1) What was hard in this ex?
-------------------------------------------------------------------------------
A couple of issues:
a. Understanding the asynchronous mechanism in which javascript works -
   It took time to understand the way the code executes - it is not linear,
   and it is difficult to control the program flows.
b. Working as a server -
   As programmers we are "educated" to think as the client side. Know,
   performing as server demanded a change of mind set.
c. Using Javascript -
   Although this is the third ex, we are still javascript newbies.
   On the way of creating the http server, we had to learn the
   language ability.
d. The http protocol -
   Learning the http protocol was one of our biggest challenges.
e. Understanding the EX -
   It took time to understand our position in this ex, what exactly is our task.
f. Learning the Express API -
   The express API is new to us, and it took time leaning exactly what each function
   and part is responsible of.
g. Learning what is the middleware -
   The middleware concept is new to us, as a layer connecting the server and response / request.
h. Working with a big amount of modules -
   We handled a large amount of modules in this ex that demanded a large amount of
   encapsulation.

-------------------------------------------------------------------------------
(2) What was fun in this ex?(We wont reduce points in case this part is empty)
-------------------------------------------------------------------------------
Actually this ex was less fun.
Still, if we need to point out one bean of light in this situation, it was learning
to work with the express API.


------------------------------------------------------------------
(3)If you were a hacker and you could add a dynamic function
   that answers the URL /hello/hacker, write 2 different ‘bad’
   dynamic functions that will cause DOS.
   How would you make sure that those functions will get executed?
------------------------------------------------------------------
1. Mess with the response message / file.
2. Won't use the next function and won't send the data.
================
   How would you make sure that those functions will get executed?
================
Put '/' in the as the resource argument.
