const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (req, res) => {
    res.json(await Blog.find({}));
});

blogRouter.post('/', async (req, res) => {
    const body = req.body;
    if (!body) return res.json(400).send({ error: 'content missing' });
    if (!body.title || !body.url) return res.json(400).send({ error: 'title and url are required' });

    const user = await User.findById(body.userId);

    const { title, author, url, likes } = body;
    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const result = await Blog.deleteMany({
        _id: id
    });
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(204);
});

blogRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    if (!req.body.title || !req.body.url) return res.status(400).json({ error: 'title and body are required' });

    const result = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!result) return res.status(404).json({ error: 'blog not found' });

    res.status(200).json(result);
});


module.exports = blogRouter;

