const db = require('./db/connection')
const express = require("express");
const app = express();
const getTopics = require(`./controllers/topics.controllers`)
const { getArticles, getArticleByID } = require(`./controllers/articles.controllers`)
const getUsers = require(`./controllers/users.controllers`)

app.get(`/api/topics`, getTopics)

app.get(`/api/articles`, getArticles)

app.get(`/api/users`, getUsers)

app.get(`/api/articles/:article_id`, getArticleByID)

module.exports = app