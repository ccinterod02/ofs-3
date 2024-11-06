
const dummy = (blogs) => {

    return 1;

};

const totalLikes = (blogs) => {
    let totalLikes = 0;
    blogs.forEach(blog => {
        totalLikes += blog.likes;
    });
    return totalLikes;
};

const favoriteBlog = (blogs) => {
    let favoriteBlog = blogs[0];
    blogs.forEach(blog => {
        if (blog.likes > favoriteBlog.likes) favoriteBlog = blog;
    });
    return favoriteBlog;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
};