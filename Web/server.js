const express = require('express');
const app = express();
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser');
const DATA_PATH = path.join(__dirname, 'data.json');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-control', 'no-cache');
  next();
});
app.get('/', function(req, res) {
  fs.readFile(DATA_PATH, function(err, data) {
    if(err) {
      console.error(err);
    }
    res.render('list', {title: "test", body: data, header: "header", data: JSON.parse(data)});
  });
});

app.get('/add', function(req,res) {
  res.render('add');
});
app.post('/add', function(req,res) {
  var string = req.body.string;
  var id = Date.now()
  var integer = req.body.integer;
  var float = req.body.float;
  var date = req.body.date;
  var boolean = req.body.boolean;
  fs.readFile(DATA_PATH, function(err,data) {
    if(err) {
      console.error(err)
      res.send(err);
    } else {
      var data = JSON.parse(data);
      data.push({id: id, string: req.body.string, integer: req.body.integer, float: req.body.float, date: req.body.date, boolean: req.body.boolean })
    }
    fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function(err) {
      if(err) {
        console.error(err);
        res.send(err)
      } else {
        res.redirect('/')
      }
    })
  })
});

app.get('/edit/:id', function(req, res){
  fs.readFile(DATA_PATH, function (err, data){
    if(err){
      console.error(err)
      res.send(err);
    }else{
      data = JSON.parse(data);
      var id = Number(req.params.id);
      var index = data.map(function(x){
        return x.id;
      }).indexOf(id);
      console.log(data[index]);
      res.render('edit',{item: data[index]});
    }
  })
})

app.post('/edit/:id', function(req, res){
  fs.readFile(DATA_PATH, function (err, data){
    if(err){
      console.error(err)
      res.send(err);
    }else{
      data = JSON.parse(data);
      var id = Number(req.params.id);
      var index = data.map(function(x){
        return x.id;
      }).indexOf(id);
      data[index].string= req.body.string;
      data[index].integer= req.body.integer;
      data[index].float= req.body.float;
      data[index].date= req.body.date;
      data[index].boolean= req.body.boolean;
      fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function(err){
        if(err){
          console.error(err)
          res.send(err);
        }else{
          res.redirect('/')
        }
      });
    }
  });
})

app.get('/delete/:id', function(req, res){
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);;
      res.send(err);
    }else{
      data = JSON.parse(data);
      var id = Number(req.params.id);
      data = data.filter(function(x){return x.id != id})
      fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function(err){
        if(err){
          console.error(err)
          res.send(err);
        }else{
          res.redirect('/')
        }
      });
    }
  })
})

app.listen(3000, function() {
  console.log("server is online")
});
