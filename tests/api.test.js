const { test, describe, beforeEach, after, expect, it } = require('node:test');
const Blog = require('../models/blog');
const assert = require('node:assert');
const listHelper = require('../utils/list_helpers');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const { default: mongoose } = require('mongoose');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
});

after(async () => {
    await mongoose.connection.close();
});

describe('api tests', () => {
    it('get all the blogs', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    it('there are several blogs', async () => {
        const result = await api.get('/api/blogs').expect(200);
        assert.strictEqual(result.body.length, helper.initialBlogs.length);
    });

    it('there are a id field', async () => {
        const result = await api.get('/api/blogs').expect(200);
        assert.strictEqual('id' in result.body[0], true);
    });

    it('can use post', async () => {
        let result = await api.post('/api/blogs').send({
            title: 'Patria',
            author: 'Fernando Aramburu',
            url: 'https://patria.com/',
        }).expect(201);

        const id = result.body.id;
        result = await api.get('/api/blogs').expect(200);
        assert.strictEqual(result.body.length, helper.initialBlogs.length + 1);
        assert.strictEqual(result.body.some(obj => obj.id === id), true);
    });

    it('verify that like prop is in the response when in the request has the value 0', async () => {
        let result = await api.post('/api/blogs').send({
            title: 'Patria',
            author: 'Fernando Aramburu',
            url: 'https://patria.com/',
        }).expect(201);

        const id = result.body.id;
        result = await api.get('/api/blogs').expect(200);
        assert.strictEqual(result.body.find(obj => obj.id === id).likes, 0);
    });
});