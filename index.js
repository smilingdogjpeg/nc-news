const db = require("./db/connection")

db.query(`SELECT * FROM comments;`)
.then((commentData) => console.log(commentData))

