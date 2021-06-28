const ideas = require('./src/ideas.js');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/proveIt/:idea', function (req, res) {
  const { idea } = req.params;
  ideas
    .proveNewIdea(idea)
    .then(idea => {
      res.status(200).send('New idea added.');
    })
    .catch(err => {
      res.status(400).send('Failed to add new idea.');
    });
});

app.get('/ideas', function (req, res) {
  ideas
    .getAllIdeas()
    .then(ideas => {
      res.status(200).send(ideas);
    })
    .catch(err => {
      res.status(400).send('Failed to fetch ideas.');
    });
});

app.get('/ideaProof/:idea', function (req, res) {
  const { idea } = req.params;
  ideas
    .getIdeaProof(idea)
    .then(proof => {
      res.status(200).send(proof);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send('Failed to get proof for idea,');
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080, function (req, res) {
  console.log(`Server is listening on port ${process.env.PORT || 8080}...`);
});