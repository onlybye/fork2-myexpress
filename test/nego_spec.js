var request = require("supertest")
  , expect = require('chai').expect
  , http = require('http');

var express = require('../');

describe("setting Content-Type", function() {
  var app;
  beforeEach(function() {
    app = express();

  });

  it("sets thet content-type", function(done) {
    app.use(function(req, res) {
      res.type("json");
      res.end("[1, 2, 3]");
    });

    request(app).get('/').expect("Content-Type", "application/json").expect("[1, 2, 3]").end(done);
  });

  it("sets the default content type", function(done) {
    app.use(function(req, res) {
      res.default_type("text");
      res.default_type("json");
      res.end("[1, 2, 3]");
    });

    request(app).get('/').expect("Content-Type", "text/plain").expect("[1, 2, 3]").end(done);
  });


});

describe("req.format", function() {
  var app;
  beforeEach(function() {
    app = express();
  });

  describe("Respond with different formats", function() {
    beforeEach(function() {
      app.use(function(req, res) {
        res.format({
          text: function() {
            res.end("text hello");
          },

          html: function() {
            res.end("html <b>hello</b>");
          }
        });
      });
    });


    it("responds to text request", function(done) {
      request(app).get('/')
        .set("Accept", "text/plain, text/html")
        .expect("text hello")
        .expect("Content-Type", "text/plain")
        .end(done);
    });

  });

    it("responds with 406 if there is no matching type", function(done) {
      app.use(function(req, res) {
        res.format({});
      });

      request(app).get('/').expect(406).end(done);
    });


});
