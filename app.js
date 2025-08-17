const db = require('./db/connection')
const express = require("express");
const app = express();
const getTopics = require(`./controllers/topics.controllers`)
const { getArticles, getArticleByID, updateVotesByArticleID, updateVotesByCommentID } = require(`./controllers/articles.controllers`)
const getUsers = require(`./controllers/users.controllers`)
const { getCommentsByArticleID, addCommentToArticle, deleteComment } = require(`./controllers/comments.controllers`)
const cors = require(`cors`)

app.use(cors())
app.use("/api", express.static("public"))
app.use(express.json())

app.get(`/api/topics`, getTopics)
app.get(`/api/articles`, getArticles)
app.get(`/api/users`, getUsers)
app.get(`/api/articles/:article_id`, getArticleByID)
app.get(`/api/articles/:article_id/comments`, getCommentsByArticleID)

app.post(`/api/articles/:article_id/comments`, addCommentToArticle)

app.patch(`/api/articles/:article_id`, updateVotesByArticleID)
app.patch(`/api/comments/:comment_id`, updateVotesByCommentID)

app.delete(`/api/comments/:comment_id`, deleteComment)


app.use((req, res, next) => {
    res.status(404).send({ msg: "Path Not Found" })
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error" })
})




module.exports = app