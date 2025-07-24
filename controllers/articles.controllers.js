const { fetchArticles, fetchArticleByID } = require(`../models/articles.models`)

const getArticles = (req, res) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles })

    })
}

const getArticleByID = (req, res) => {
    const { article_id } = req.params
    fetchArticleByID(article_id).then((article) => {
        res.status(200).send({ article })
    })
}

module.exports = { getArticles, getArticleByID }