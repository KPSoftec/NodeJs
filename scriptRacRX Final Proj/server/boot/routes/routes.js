'use strict';

module.exports = function(app) {
  // Install a "/ping" route that returns "pong"
  app.get('/', function(req, res) {
    res.render('index');
  });
};

