<h1>NC News Backend</h1>

A news aggregation site built to practice full-stack development fundamentals.  Developed using a Node.js framework, using TTD - with testing implemented using Jest and Supertest.  The project includes a RESTful backend API with database integration and a responsive frontend interface.  This practice project is currently unfinished and I intend to add features, as well as improve upon the UI and accessability. </br>
Frontend repository: https://github.com/smilingdogjpeg/nc-news


<h2>Tech Stack</h2>
<ul>
  <li><strong>Frontend: React, CSS, HTML, Vite, Lighthouse</strong></li>
  <li><strong>Backend: Node.js, Express, PostgreSQL</strong></li>
</ul>

<h2>Prerequisites</h2>
<ul>
<li>Node.js v24.1.0 or higher</li>
</ul>
<h2>API Endpoints</h2>

|Endpoint	|Description|
|:----------- |:----------|
|GET /api/topics|	Fetch all topics|
|GET /api/articles|	Fetch all articles|
|GET /api/articles/article_id|	Fetch article by topic|
|PATCH /api/articles/article_id|	Amends votes for an article|
|POST /api/articles/article_id/comments|	Add a comment to an article|

<h2>To run locally...</h2>

<ol>
<li>Clone the repository</li>
<li>Install dependencies</li>
<li>Create environment variables
To create required environment variables:

- Create 2 files in the root directory: ".env.test" and ".env.development".
- To connect to each database locally, add the following values to .env.test and .env.development respectively:
    PGDATABASE=nc_news_test, PGDATABASE=nc_news

<strong>NOTE:</strong> This information would normally be secure.</li>
<li>Run the setup script to create the databases using "npm run setup-dbs"</li>
<li>Seed the databases </li>

</ol>
