const { fetchArticles, fetchArticleByID, updateArticleVoteCount, updateCommentVoteCount } = require(`../models/articles.models`)

const getArticles = (req, res) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })

    })
}

const getArticleByID = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
        .catch(next)
}

const updateVotesByArticleID = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    return updateArticleVoteCount(article_id, inc_votes).then((updatedArticle) => {
        res.status(200).send({ updatedArticle })
    })
        .catch(next)
}

const updateVotesByCommentID = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    return updateCommentVoteCount(comment_id, inc_votes).then((updatedComment) => {
        res.status(200).send({ updatedComment })
    })
        .catch(next)
}

module.exports = { getArticles, getArticleByID, updateVotesByArticleID, updateVotesByCommentID }