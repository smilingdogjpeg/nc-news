const db = require("../connection")
const format = require("pg-format")
const { convertTimestampToDate, createLookupRef } = require("./utils.js")

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`)
    })
    .then(() => {
      return createTopics()
    })
    .then(() => {
      return createUsers()
    })
    .then(() => {
      return createArticles()
    })
    .then(() => {
      return createComments()
    })
    .then(() => {
      const topicsInsertQuery = format(
        ` INSERT INTO topics(slug, description, img_url) VALUES %L RETURNING *`,
        topicData.map(({ slug, description, img_url }) => [
          slug,
          description,
          img_url
        ])
      );
      return db.query(topicsInsertQuery)
    })
    .then(() => {
      const usersInsertQuery = format(
        ` INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`,
        userData.map(({ username, name, avatar_url }) => [
          username,
          name,
          avatar_url
        ])
      );
      return db.query(usersInsertQuery)
    })
    .then(() => {
      const articlesInsertQuery = format(
        ` INSERT INTO articles(title, topic, author, 
          body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        articleData.map(({ title, topic, author,
          body, created_at, votes, article_img_url }) => [
            title,
            topic,
            author,
            body,
            new Date(created_at),
            votes,
            article_img_url
          ])
      );
      return db.query(articlesInsertQuery)
    })
    .then(({ rows: articles }) => {
      const ref = createLookupRef(articles, "title", "article_id");
      const commentsInsertQuery = format(
        ` INSERT INTO comments(
          article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
        commentData.map(({ body, votes, author, created_at, article_title }) => [
          ref[article_title.toLowerCase().trim()],
          body,
          votes,
          author,
          new Date(created_at)
        ])
      )
      return db.query(commentsInsertQuery)
    })
    .catch((err) => {
      console.error("Error during seeding:", err);
    });
}

function createTopics() {
  const query = `CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000) NOT NULL
          )`
  return db.query(query);
}

function createUsers() {
  const query = `CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR,
          avatar_url VARCHAR(1000)
           )`
  return db.query(query);
}

function createArticles() {
  const query = `CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR (1000)
      )`
  return db.query(query);
}

function createComments() {
  const query = ` CREATE TABLE comments (
        comment_id SERIAl PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
  return db.query(query);
}



module.exports = seed;
