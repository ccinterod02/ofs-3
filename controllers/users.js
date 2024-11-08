const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
});

usersRouter.get('/', async (req, res) => {
    res.json(await User.find({}));
});

module.exports = usersRouter;

