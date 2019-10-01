// implement your API here
const express = require("express");
const db = require("./data/db.js");

const server = express();

server.use(express.json());

// GET users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.send(
        res
          .abort()
          .status(500)
          .json({ error: "The users information could not be retrieved." }),
      );
    });
});

// POST users
server.post("/api/users", (req, res) => {
  const userData = req.body;
  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(userData)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database",
        });
      });
  }
});

//GET user by id
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      // console.log(user);
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.json(user);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

// DELETE user by id
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user => {
      if (!user) {
        // console.log(user);
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.json(user);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

// PUT user by id
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, changes)
      .then(user => {
        if (!user) {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  }
});

server.listen(8000, () => console.log("Sever is running on port 8000."));
