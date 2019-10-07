# Code Modules
To enable effective collaboration the code will be broken down into modules which can be developed independently. Establishing the modules and their public interfaces will allow for easy integration of the modules into the application.

Here is the breakdown of the modules:

|Module|Responsibility|
|--|--|
|User|User creation,  user authentication and authorization, session management|
|Fixtures and Results|List fixtures, list results|
|Game Logic|Calculate points, winners|
|Play|Place prediction, retrieve result|
|Data|Any MongoDB access|
|Routing|Distribution of requests to logic/views etc|

Modules will have a public api which is essentially the methods provided by the module for use by other modules. Defining them below as they are determined will help developers integrate with them.

## User Module
### Notes
User module will provide an auth token after successful log in. This token must be stored in a session cookie in the browser and checked with each request. The checkUser() method allows easy checking of the session/auth token and should be used to ensure that an incoming request is from a currently logged in user.
### API
- createUser(string email, string password, string name, int age)
- login(string email, string password) - returns string auth token
- isAdmin(string authToken) - returns boolean (only needed if we provide an admin area)
- checkUser(String authToken) - returns string email or null if user invalid or not logged in
- getUser(String authToken) - return user object or null if user invalid or not logged in
- logout(string authToken)