const bcrypt = require('bcrypt');
const User = require('../models/user');
const { beforeEach, after, describe, test, it } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const { default: mongoose } = require('mongoose');
const helper = require('./test_helper');

const api = supertest(app);


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('toor', 10);
        const newUser = await new User({
            username: 'root',
            passwordHash,
        });

        await newUser.save();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'carloscintero',
            name: 'Carlos Cintero',
            password: 'secret',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        console.log(result);
        const usersAtEnd = await helper.usersInDb();
        assert(result.body.error.includes('expected `username` to be unique'));

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});