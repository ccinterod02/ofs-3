const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (req, res, next) => {
    Blog.find({})
        .then(blogs => res.json(blogs))
        .catch(error => next(error));
});

blogRouter.post('/', (req, res, next) => {
    const body = req.body;
    if (!body) return res.json(400).send({ error: 'content missing' });
    const { title, author, url, likes } = body;
    new Blog({
        title,
        author,
        url,
        likes,
    })
        .save()
        .then(result => {
            res.status(202).json(result);
        })
        .catch(error => next(error));
});


module.exports = blogRouter;

