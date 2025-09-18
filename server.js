const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

const users = [];

// Get all users (only usernames, hide passwords)
app.get('/users', (req, res) => {
    const safeUsers = users.map(user => ({ name: user.name }));
    res.json(safeUsers);
});

// Register a new user
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);

        res.status(201).json({
            message: "User created successfully",
            username: user.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const user = users.find(u => u.name === req.body.name);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.json({ message: "Login successful", username: user.name });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
