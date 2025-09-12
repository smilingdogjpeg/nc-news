const db = require(`../db/connection`)

const fetchArticles = (sort_by, order) => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, 
                    articles.votes, articles.article_img_url , COUNT(comments.comment_id)::int AS comment_count
                    FROM articles
                    LEFT JOIN comments ON comments.article_id = articles.article_id
                    GROUP BY articles.article_id
                    ORDER BY $1 $2
                    (CASE WHEN $1 IS NULL THEN created_at
                    CASE WHEN $2 IS NULL THEN DESC`, [sort_by, order]
                    )
        .then(({ rows: articles }) => {
            return articles
        })
}

const fetchArticleByID = (article_id) => {
    return db.query(`SELECT * FROM articles 
                    WHERE article_id = $1`,
        [article_id]).then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "path not found" })
            }
            const article = rows[0]
            return article
        })
}

const updateArticleVoteCount = (article_id, inc_vote) => {
    return db.query(`UPDATE articles SET votes = votes + $2
                    WHERE article_id = $1
                    RETURNING *`, [article_id, inc_vote])
        .then(({ rows }) => {
            const article = rows[0]
            return article
        })
}

const updateCommentVoteCount = (comment_id, inc_vote) => {
    return db.query(`UPDATE comments SET votes = votes + $2 
                    WHERE comment_id = $1 
                    RETURNING *`, [comment_id, inc_vote])
        .then(({ rows }) => {
            const comment = rows[0]
            return comment
        })
}


module.exports = { fetchArticles, fetchArticleByID, updateArticleVoteCount, updateCommentVoteCount }