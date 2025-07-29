const db = require(`../db/connection`)

const fetchCommentsByArticleID = (article_id) => {
    return db.query(`SELECT * FROM comments 
                    WHERE comments.article_id = $1
                    ORDER BY created_at DESC`,
        [article_id]).then(({ rows }) => {
            return rows
        })

}

const newComment = (article_id, username, body) => {
    return db.query(`INSERT INTO comments (article_id, author, body)
                    VALUES ($1, $2, $3)
                    RETURNING *`,
        [article_id, username, body])
        .then(({ rows }) => {
            const comment = rows[0]
            return comment
        })
}

const removeComment = (comment_id) => {
    return db.query(`DELETE`,
        [comment_id])
        .then(({ rows }) => {
            
            return comment
        })
}



module.exports = { fetchCommentsByArticleID, newComment }