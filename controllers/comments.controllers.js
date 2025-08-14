const { fetchCommentsByArticleID, newComment, removeComment } = require(`../models/comments.models`)

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

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id)
        .then((deletedComment) => {
            if (!deletedCOmment) {
                return res.status(404).send({ msg: "Comment not found" });
            }
            res.status(204).send()
        })
        .catch(next)
}

module.exports = { getCommentsByArticleID, addCommentToArticle, deleteComment }