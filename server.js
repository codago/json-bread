const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const DATA_PATH = path.join(__dirname, "data.json");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.get("/", function(req, res) {
  fs.readFile(DATA_PATH, function(err, data) {
    if (err) {
      console.error(err);
    }
    res.render("list", { data: JSON.parse(data) });
  });
});

app.get("/add", function(req, res) {
  res.render("add");
});


app.post("/add", function(req, res) {
  var id = Date.now();
  var string = req.body.string;
  var integer = req.body.integer;
  var float = req.body.float;
  var date = req.body.date;
  var bool = req.body.bool;
  console.log(req.body);
  fs.readFile(DATA_PATH, function(err, data) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      var data = JSON.parse(data);
      data.push({
        id: id,
        string: string,
        integer: integer,
        float: float,
        date: date,
        bool: bool
      });
    }
    fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function(err) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.redirect("/");
      }
    });
  });
});

app.get("/delete/:id", function(req, res) {
  fs.readFile(DATA_PATH, function(err, data) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {

      var data = JSON.parse(data);
      var id = Number(req.params.id);
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data.splice(i, 1);
          break;
        }
      }
    }
    fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function(err) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.redirect("/");
      }
    });
  });
});



app.get("/edit/:id", function(req, res) {
  fs.readFile(DATA_PATH, function(err, data) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      var data = JSON.parse(data);
      var id = Number(req.params.id);
      var item = null;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          item = data[i];
          break;
        }
      }
      res.render("edit", { data: item });
    }
  });
});

app.post("/edit/:id", function(req, res) {
  var id = req.body.id;
  var string = req.body.string;
  var integer = req.body.integer;
  var float = req.body.float;
  var date = req.body.date;
  var bool = req.body.bool;
  console.log(req.body)
  console.log();
  fs.readFile(DATA_PATH, function(err, data) {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      var data = JSON.parse(data);
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === Number(id)) {
          data[i].string = string;
          data[i].integer = integer;
          data[i].float = float;
          data[i].date = date;
          data[i].bool = bool;
          break;
        }
      }
    }
    fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function(err) {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.redirect("/");
      }
    });
  });
})

app.listen(3000, function() {
  console.log("server is online");
});
