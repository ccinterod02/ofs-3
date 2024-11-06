const bcrypt = require('bcrypt');
const User = require('../models/user');
const { beforeEach, after, describe, test, it } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const { default: mongoose } = require('mongoose');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
        username: 'nimda',
        passwordHash: await bcrypt.hash('nimda', 10)
    });

    await user.save();
});

after(async () => {
    await mongoose.connection.close();
});

test('POST /api/login with correct credentials returns a JWT token', async () => {
    const loginData = {
        username: 'nimda', // Cambia a un usuario válido
        password: 'nimda' // Cambia a la contraseña correcta
    };

    const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    // Comprobar que el cuerpo contiene el JWT
    const token = response.body.token;
    assert.ok(token, 'Token was not returned in response');
    assert.strictEqual(typeof token, 'string', 'Token should be a string');
});

test('POST /api/login with incorrect password returns 401 Unauthorized', async () => {
    const loginData = {
        username: 'nimda',
        password: 'nimda'
    };

    const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /application\/json/);

    // Comprobar que no se devuelve un token
    assert.strictEqual(response.body.token, undefined, 'Token should not be returned for incorrect password');
    assert.strictEqual(response.body.error, 'invalid username or password');
});

test('POST /api/login with non-existent username returns 401 Unauthorized', async () => {
    const loginData = {
        username: 'nonexistentuser',
        password: 'testpassword'
    };

    const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(401)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.token, undefined, 'Token should not be returned for non-existent user');
    assert.strictEqual(response.body.error, 'invalid username or password');
});

test('POST /api/login with missing username returns 400 Bad Request', async () => {
    const loginData = {
        password: 'testpassword'
    };

    const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.token, undefined, 'Token should not be returned when username is missing');
    assert.strictEqual(response.body.error, 'username is required');
});

test('POST /api/login with missing password returns 400 Bad Request', async () => {
    const loginData = {
        username: 'testuser'
    };

    const response = await api
        .post('/api/login')
        .send(loginData)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.token, undefined, 'Token should not be returned when password is missing');
    assert.strictEqual(response.body.error, 'password is required');
});
