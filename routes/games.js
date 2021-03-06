'use strict'

const express = require('express');
const games = express.Router();
const db = require('../db/pg');
const request = require('request');
const dotenv = require('dotenv');
dotenv.load();
const SECRET = process.env.SECRET;
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const key = process.env.KEY;

games.get('/start', expressJWT({secret: SECRET}), db.getUserData, (req,res) => {
  res.send(res.data)
})

games.post('/start', expressJWT({secret: SECRET}), db.createGame, (req, res) => {
  res.send(res.data)
});

games.put('/start', expressJWT({secret: SECRET}), db.insertScore, (req, res) => {
  res.send(res.data)
});

games.get('/score/:section', expressJWT({secret: SECRET}), db.getBestSectionScore, (req, res) => {
  res.send(res.data)
})

games.get('/search/:id', expressJWT({secret: SECRET}), db.getArticleInfo, (req, res) => {
  res.send(res.data)
})

var section;

games.post('/search', expressJWT({secret: SECRET}), getAPI, db.insertPhotos, (req, res) => {
  res.send(res.data)
  });

function getAPI (req, result, next) {
  section = req.body.section
  request.get({url : 'http://api.nytimes.com/svc/topstories/v1/' + section + '.json?api-key=' + key}, function(error, response, body) {
    var nyt = JSON.parse(body);
    var data = [];
      for (var i = 0; i < nyt.results.length; i++) {
        if (nyt.results[i].multimedia !== '' && nyt.results[i].multimedia[4].caption !== '') {
          var obj = {
            abstract: nyt.results[i].abstract,
            section: nyt.results[i].section,
            subsection: nyt.results[i].subsection,
            headline: nyt.results[i].title,
            pub_date: nyt.results[i].published_date,
            article_url: nyt.results[i].url,
            image_url: nyt.results[i].multimedia[4].url,
            caption: nyt.results[i].multimedia[4].caption
          }
        data.push(obj)
        }
      }
    result.data = data;
    next();
  })
};

games.get('/:id', expressJWT({secret: SECRET}), db.getGameInfo, (req, res) => {
  res.send(res.data)
})

module.exports = games;
