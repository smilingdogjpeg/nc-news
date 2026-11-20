const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

// Reseed before EVERY test so each one starts from identical data and tests
// can't affect each other (e.g. a DELETE test changing a later count).
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("unknown paths", () => {
  test("404: responds with Path Not Found for a route that doesn't exist", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path Not Found");
      });
  });
});

describe.skip("GET /api", () => {
  test("200: responds with documentation for every endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with all articles, each with a comment_count and without a body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("200: comment_count is calculated correctly", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        const article1 = articles.find((a) => a.article_id === 1);
        expect(article1.comment_count).toBe(11);
      });
  });

  describe.skip("sorting", () => {
    test("200: defaults to created_at, descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("200: sorts by any valid column with sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });

    test("200: can sort by the calculated comment_count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count", { descending: true });
        });
    });

    test("200: accepts order=asc (case-insensitive)", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });

    test("200: combines sort_by and order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=ASC")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { ascending: true });
        });
    });

    test("400: rejects a sort_by column that isn't in the greenlist", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid sort_by query");
        });
    });

    test("400: rejects sort_by values that only exist on Object.prototype", () => {
      return request(app).get("/api/articles?sort_by=constructor").expect(400);
    });

    test("400: rejects an order that isn't asc or desc", () => {
      return request(app)
        .get("/api/articles?order=sideways")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid order query");
        });
    });
  });

  describe.skip("topic filter", () => {
    test("200: returns only articles with the given topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("200: returns an empty array for a topic that exists but has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toEqual([]);
        });
    });

    test("404: responds with an error for a topic that doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Topic Not Found");
        });
    });
  });
});

describe.skip("GET /api/articles/:article_id", () => {
  test("200: responds with the requested article, including body and comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url: expect.any(String),
          comment_count: 11,
        });
      });
  });

  test("200: comment_count is 0 for an article with no comments", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(0);
      });
  });

  test("404: valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Not Found");
      });
  });

  test("400: invalid article_id", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe.skip("PATCH /api/articles/:article_id", () => {
  test("200: increments votes and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          votes: 101,
        });
      });
  });

  test("200: decrements votes with a negative inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(0);
      });
  });

  test("200: an empty body leaves the article unchanged", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(100);
      });
  });

  test("400: inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("400: invalid article_id", () => {
    return request(app).patch("/api/articles/two").send({ inc_votes: 1 }).expect(400);
  });

  test("404: valid but non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Not Found");
      });
  });
});

describe.skip("GET /api/articles/:article_id/comments", () => {
  test("200: responds with the article's comments, most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });

  test("200: empty array for an article that exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("404: valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Not Found");
      });
  });

  test("400: invalid article_id", () => {
    return request(app).get("/api/articles/two/comments").expect(400);
  });
});

describe.skip("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the newly created comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "I am adding a comment" })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          article_id: 1,
          author: "butter_bridge",
          body: "I am adding a comment",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("201: ignores unexpected properties on the request body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "hello", votes: 9000 })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(0);
      });
  });

  test("400: missing body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400);
  });

  test("400: missing username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "who am I?" })
      .expect(400);
  });

  test("400: invalid article_id", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .send({ username: "butter_bridge", body: "hello" })
      .expect(400);
  });

  test("404: valid but non-existent article_id", () => {
    return request(app)
      .post("/api/articles/10000/comments")
      .send({ username: "butter_bridge", body: "hello" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article Not Found");
      });
  });

  test("404: username that doesn't exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "felicity_cloake", body: "hello" })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("User Not Found");
      });
  });
});

describe.skip("PATCH /api/comments/:comment_id", () => {
  test("200: updates votes and responds with the updated comment", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({ comment_id: 1, votes: 17 });
      });
  });

  test("400: invalid comment_id", () => {
    return request(app).patch("/api/comments/one").send({ inc_votes: 1 }).expect(400);
  });

  test("404: valid but non-existent comment_id", () => {
    return request(app)
      .patch("/api/comments/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment Not Found");
      });
  });
});

describe.skip("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment and responds with no body", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
        return db.query(`SELECT * FROM comments WHERE comment_id = 1;`);
      })
      .then(({ rows }) => {
        expect(rows).toHaveLength(0); // check the DB itself, not just the status code
      });
  });

  test("404: valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment Not Found");
      });
  });

  test("400: invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
