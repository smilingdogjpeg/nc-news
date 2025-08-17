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
        expect(res.body.articles.length).toBeGreaterThan(0)
        res.body.articles.forEach((article) => {
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
        expect(res.body.users.length).toBeGreaterThan(0)
        res.body.users.forEach((user) => {
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
  test("200: Responds with an object with the key of article and the value of an article object corresponding with given article ID", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("article")
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

  test("404: Responds with error when request for article_id does not exist", () => {
    return request(app)
      .get(`/api/aritcles/14`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path Not Found")
      })
  })
  test("400: responds with error when request for article_id is of wrong data type", () => {
    return request(app)
      .get('/api/articles/two')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request")
      })
  })
})
describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an object with the key of comments and value of arrays of comments corresponding with given article ID", () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("comments")
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          })
        })
      })
  })
  test("200: Responds with an empty array when passed an article ID that holds no comments", () => {
    return request(app)
      .get(`/api/articles/2/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([])
      })
  })
  test("404: Responds with error when request for article_id does not exist", () => {
    return request(app)
      .get(`/api/aritcles/14/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path Not Found")
      })
  })
  test("400: Responds with error when request for article_id is of wrong data type", () => {
    return request(app)
      .get('/api/articles/two/comments')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request")
      })
  })
})
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the comment added to article for input ID", () => {
    const testComment = {
      author: "butter_bridge",
      body: "I am adding a comment"
    }
    return request(app)
      .post(`/api/articles/5/comments`)
      .send(testComment)
      .expect(201)
      .then(({ body: { newComment } }) => {
        expect(newComment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 5,
          body: "I am adding a comment",
          votes: expect.any(Number),
          author: "butter_bridge",
          created_at: expect.any(String)
        })
      })
  })
  test("404: Responds with error when article_id does not exist", () => {
    const testComment = {
      username: "butter_bridge",
      body: "I am adding a comment"
    }
    return request(app)
      .post(`/api/aritcles/14/comments`)
      .send(testComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path Not Found")
      })
  })
  test("400: Responds with error when article_id is of wrong data type", () => {
    const testComment = {
      username: "butter_bridge",
      body: "I am adding a comment"
    }
    return request(app)
      .post('/api/articles/two/comments')
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request")
      })
  })
  test("400: Responds with error when passed comment body is of wrong data type", () => {
    const testComment = {
      username: "butter_bridge",
      body: 6365836537
    }
    return request(app)
      .post('/api/articles/two/comments')
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request")
      })
  })
  test("400: Responds with error when passed username doesn't exist", () => {
    const testComment = {
      username: "felicity_cloake",
      body: "I am adding a comment"
    }
    return request(app)
      .post('/api/articles/two/comments')
      .send(testComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request")
      })
  })
})
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with article with updated vote count for given article ID", () => {
    const testVoteUpdate = {
      inc_votes: 5
    }
    return request(app)
      .patch("/api/articles/3")
      .expect(200)
      .send(testVoteUpdate)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 5,
          article_img_url: expect.any(String)
        })
      })
  })
})

