const db = require("../connection")

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
