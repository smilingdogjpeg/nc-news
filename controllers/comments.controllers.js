const { fetchCommentsByArticleID, newComment } = require(`../models/comments.models`)

const getCommentsByArticleID = (req, res, next) => {
    const { article_id } = req.params
    fetchCommentsByArticleID(article_id).then((comments) => {
        res.status(200).send({ comments })
    })
        .catch(next)
}

const addCommentToArticle = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    return newComment(article_id, username, body)
        .then((newComment) => {
            res.status(201).send({ newComment })
        })
        .catch(next)
}

const deleteComment = (re, res, next) => {
    const { comment_id } = req.params
    return deleteComment(comment_id)
    .then
}

module.exports = { getCommentsByArticleID, addCommentToArticle }