Internet technologies EX3
=========================
-------------------------------------------------------------------------------
(1) What was hard in this ex?
-------------------------------------------------------------------------------
A couple of issues?
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

-------------------------------------------------------------------------------
(2) What was fun in this ex?(We wont reduce points in case this part is empty)
-------------------------------------------------------------------------------
.
.
.
.
.
.
.
.
.
.
Kidding, we actually kind of enjoyed developing this light-weight http server.
First, it was really cool to learn how to create and control
such a useful ability. It is of course really practical and now we have
a basic knowledge of how to build our own website!!
Second, .. well, no, that's all :/


-------------------------------------------------------------------------------
(3) What did you do in order to make your server efficient?
-------------------------------------------------------------------------------
a. Maintain the "keep-alive" definitions in order to create the minimal
number of sockets needed.
b. Use the short timeout in order to kill the socket when it is no more
needed.
c. The parser takes charge of all of the dealing with the request string,
and this modelling enables each of the modules do only what it need to do.
