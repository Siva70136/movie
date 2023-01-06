const express = require("express");

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001);
    console.log("server created at http://localhost:3001");
  } catch (e) {
    console.log(`error message${e.message}`);
  }
};

initializeDb();

const dbResponseObject = (data) => {
  return {
    movieName: data.movie_name,
  };
};

const dbResponseObjectOne = (data) => {
  return {
    movieId: data.movie_id,
    directorId: data.director_id,
    movieName: data.movie_name,
    leadActor: data.lead_actor,
  };
};

const dbResponseObjectDirector = (data) => {
  return {
    directorId: data.director_id,
    directorName: data.director_name,
  };
};
app.get("/movies", async (req, res) => {
  const getQuery = `select * from movie;`;

  const data = await db.all(getQuery);
  res.send(data.map((eachMovie) => dbResponseObject(eachMovie)));
});

app.post("/movies/", async (request, response) => {
  const teamDetails = request.body;

  const { directorId, movieName, leadActor } = teamDetails;

  const getQuery = `INSERT INTO movie (director_id,movie_name,lead_actor) VALUES ('${directorId}','${movieName}','${leadActor}'); `;

  const data = await db.run(getQuery);

  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getQuery = `select * from movie where movie_id=${movieId};`;

  const data = await db.get(getQuery);
  response.send(dbResponseObjectOne(data));
});

app.put("/movies/:movieId/", async (request, response) => {
  const teamDetails = request.body;
  const { movieId } = request.params;

  const { directorId, movieName, leadActor } = teamDetails;

  const getQuery = `UPDATE movie SET director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}' WHERE movie_id=${movieId};`;

  const data = await db.run(getQuery);

  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const deleteQuery = `delete from movie where movie_id=${movieId};`;

  const data = await db.run(deleteQuery);
  res.send("Movie Removed");
});

app.get("/directors/", async (req, res) => {
  const getQuery = `select * from director;`;

  const data = await db.all(getQuery);
  res.send(data.map((eachMovie) => dbResponseObjectDirector(eachMovie)));
});

app.get("/directors/:directorId/movies/", async (req, res) => {
  const { directorId } = req.params;
  const getQuery = `select * from movie where director_id=${directorId};`;

  const data = await db.all(getQuery);
  res.send(data.map((eachMovie) => dbResponseObject(eachMovie)));
});

module.exports = app;
