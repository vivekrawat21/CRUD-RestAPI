const express = require('express');
const users =require('./MOCK_DATA.json')
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

//MIDDLEWARE
app.use(bodyParser.json());

//SSR is a technique used to render the initial state of the application on the server, and then send it to the client.

//--------SSR(Server Side Rendering) ROUTES--------


//This is a SSR (Server Side Rendering) for all users . It will render all the users in the browser in a list format. 

app.get("/users", (req, res) => {
    const html = `
    <h1>Users</h1>
    <ul>
        ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>
    `
    res.send(html);
});


//This is a SSR (Server Side Rendering) for a single user
app.get("/users/:id", (req, res) => {
    const user = users.find(user => user.id === +req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.send(`
    <h1>${user.first_name} ${user.last_name}</h1>
    <p>Email: ${user.email
    }<p>
    `);
});





//--------REST API ROUTES-------- 

//GET /api/users -> returns all users
app.get("/api/users", (req, res) => {
    return res.json(users);
});


//GET:  /api/users/:id -> returns a single user with the specified id :  
app.get("/api/users/:id", (req, res) => {
    const user = users.find(user => user.id === +req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
});


//POST:  /api/users -> creates a new user
app.post("/api/users", (req, res) => {
    const request = req.body;
    if (!request.first_name || !request.last_name || !request.email) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    const newUser = {
        id: users.length + 1,
        first_name: request.first_name,
        last_name: request.last_name,
        email: request.email
    };
    users.push(newUser);
    return res.json(newUser);
});


//PUT:  /api/users/:id -> update a user fully or  with the specified id 
app.put("/api/users/:id", (req, res) => {
    const user = users.find(user => user.id === +req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const request = req.body;
    if (!request.first_name || !request.last_name || !request.email) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    user.first_name = request.first_name;
    user.last_name = request.last_name;
    user.email = request.email;
    return res.json(user);
});


//PATCH:  /api/users/:id -> update a user partially or for specific update with the specified id    
app.patch("/api/users/:id", (req, res) => {
    const user = users.find(user => user.id === +req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const request = req.body;
    if (!request.first_name && !request.last_name && !request.email) {
        return res.status(400).json({ message: "Please enter a valid field you want to update" });
    }
    user.first_name = request.first_name || user.first_name;
    user.last_name = request.last_name || user.last_name;
    user.email = request.email || user.email;
    return res.json(user);
});


//DELETE:  /api/users/:id -> delete a user with the specified id
app.delete("/api/users/:id", (req, res) => {
    const user = users.find(user => user.id === +req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    users.splice(users.indexOf(user), 1);
    return res.json(user);
});




// SERVER IS LISTENING TO PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


