const { test, describe, beforeEach, after } = require('node:test');
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
});

after(async () => {
    await mongoose.connection.close();
});

describe('totalLikes', () => {
    test('when the list is empty, likes = 0', () => {
        const result = listHelper.totalLikes([]);
        assert.strictEqual(result, 0);
    });

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes([helper.initialBlogs[0]]);
        assert.strictEqual(result, helper.initialBlogs[0].likes);
    });

    test('get total likes', () => {
        const result = listHelper.totalLikes(helper.initialBlogs);
        assert.strictEqual(result, 36);
    });
});

describe('favoriteBlog', () => {
    test('when list has only one blog, return that blog', () => {
        const result = listHelper.favoriteBlog([helper.initialBlogs[0]]);
        assert.deepStrictEqual(result, helper.initialBlogs[0]);
    });
    test('get the favorite blog', () => {
        const result = listHelper.favoriteBlog(helper.initialBlogs);
        assert.deepStrictEqual(result, helper.initialBlogs[2]);
    });
});


describe('api blogs', () => {
    test('');
});