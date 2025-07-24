const db = require(`../db/connection`)

const fetchArticles  = () => {
return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, 
                    articles.votes, articles.article_img_url , COUNT(comments.comment_id)::int AS comment_count
                    FROM articles
                    LEFT JOIN comments ON comments.article_id = articles.article_id
                    GROUP BY articles.article_id
                    ORDER BY created_at DESC;
                    `)
                    .then(({ rows: articles }) => {
                        return articles
                    })
}

const fetchArticleByID = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,
    [article_id]).then(({ rows }) => {
        const article = rows[0]
        return article
    })
}


module.exports = { fetchArticles, fetchArticleByID }