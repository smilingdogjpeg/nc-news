const endpointsJson = require("../endpoints.json");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest");
const app = require("../app.js");


beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  return db.end();
})

describe.skip("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe("GET /api/topics", () => {
  test("200: Responds with an object with a key of topics and the value of an array of topic objects", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("topics");
        expect(typeof res === "object").toBe(true)
        expect(Array.isArray(res.body.topics)).toBe(true)
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
          })
        })
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object with the key of articles and the value of an array of article objects", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("articles")
        res.body.articles.forEach((article) => {
          expect(article.length).not.toBe(0)
          expect(article).not.toHaveProperty("body")
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          })
        })
      })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with an object with the key of users and the value of an array of objects", () => {
    return request(app)
      .get(`/api/users`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("users")
        res.body.users.forEach((user) => {
          expect(user.length).not.toBe(0)
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
        })

      })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object with the key of article and the value of an article object corresponding with given ID", () => {
  return request(app)
    .get(`/api/articles/1`)
    .expect(200)
    .then((res) => {
      expect(res.body).toHaveProperty("article")
      
        expect(res.body.article.length).not.toBe(0)
        expect(res.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String)
        })
      
    })
})
})