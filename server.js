const ideas = require('./src/ideas.js');
const express = require('express');
const path = require('path');
const { rejects } = require('assert');
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

app.get('/ideas/detail', function (req, res) {
  ideas
    .getAllIdeas()
    .then(allideas => {
      console.log(allideas[allideas.length - 1].proofId);
      let p = new Promise((resolve, reject) => {
        for (let i = 0; i < allideas.length; i++) {
          const element = allideas[i];
          let idea = element.idea;
          ideas
            .getIdeaProof(idea)
            .then(proof => {
              let proofs = proof.proofs;
              element.status = proofs[0].status;
              element.proofId = proofs[0].versionProofId.substr(0, 5);
            })
            .catch(err => {
              element.status = 'Failed to get Proof.';
              element.proof = "-";
              console.error(err);
            });
        }
        setTimeout(() => {
          resolve(allideas);
          console.log(allideas);
        }, 5000);
      });
      p.then((v) => {
        res.status(200).send(v);
        console.log(v);
      });
    })
    .catch(err => {
      res.status(400).send('Failed to fetch ideas.');
      console.log(err);
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