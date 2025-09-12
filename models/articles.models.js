const db = require(`../db/connection`)

const fetchArticles = (sort_by = "created_at", order = "DESC") => {
  const validSortColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count"
  ];
  const validOrders = ["ASC", "DESC"];

  if (!validSortColumns.includes(sort_by)) sort_by = "created_at";
  if (!validOrders.includes(order.toUpperCase())) order = "DESC";

  // Map sort_by to the appropriate column reference
  const columnMap = {
    article_id: "articles.article_id",
    title: "articles.title",
    topic: "articles.topic",
    author: "articles.author",
    created_at: "articles.created_at",
    votes: "articles.votes",
    comment_count: "comment_count" // alias is fine here since we're not using parameterized query
  };

  const queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, 
           articles.votes, articles.article_img_url, COUNT(comments.comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY ${columnMap[sort_by]} ${order};
  `;
    console.log('Generated SQL:', queryStr);
    return db.query(queryStr).then(({ rows: articles }) => {
    console.log('First few articles with votes:', articles.slice(0, 3).map(a => ({ id: a.article_id, votes: a.votes })));
    return articles;
  });
};


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