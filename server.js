const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


const DATA_PATH = path.join(__dirname, 'data.json');
console.log(DATA_PATH);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('portMarkus', 3000)

console.log(__dirname+'/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next()
});

app.get('/', function(req, res){
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
    }
    // console.log((data));
    res.render('list', {title: "test", data: JSON.parse(data)});
  });
});

app.get('/add', function(req,res) {
  res.render('add');
});


app.post('/add', function(req,res) {
  var id = Date.now()
  var string = req.body.string;
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
      data.push({id: id, string: req.body.string,
                        integer: req.body.integer,
                        float:req.body.float,
                        date: req.body.date,
                        boolean: req.body.boolean})
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
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
      res.send(err);
    }
    var dataArr = JSON.parse(data)
    var string = req.params.string;
    var integer = req.params.integer;
    var float = Number(req.body.float);
    var date = req.body.date;
    var boolean = req.body.boolean;

    for (var i = 0; i < dataArr.length; i++) {
      if(dataArr[i].id === Number(req.params.id)){ //???
        dataArr = dataArr[i];
      }
    }
      // console.log(typeof(dataArr),'ok');
      res.render('edit', {title: "test", data: dataArr});
  });
});

// app.get('/edit', function(req,res) {
//   res.render('edit');
// });

app.post('/edit/:id', function(req,res) {
  var id = Date.now()
  var string = req.body.string;
  var integer = req.body.integer;
  var float = req.body.float;
  var date = req.body.date;
  var boolean = req.body.boolean;

  fs.readFile(DATA_PATH, function(err,data) {
    if(err) {
      console.error(err)
      res.send(err);
    } else {
      var dataArr = JSON.parse(data)
      console.log(  dataArr)
      for (var i = 0; i < dataArr.length; i++) {
        if(dataArr[i]['id'] === Number(req.params.id)){
          dataArr[i].string = string;
          dataArr[i].integer = integer;
          dataArr[i].float = float;
          dataArr[i].date = date;
          dataArr[i].boolean = boolean;
        }
      }
    }

    fs.writeFile(DATA_PATH, JSON.stringify(dataArr, null, 3), function(err) {
      if(err) {
        console.error(err);
        res.send(err)
      } else {
        res.redirect('/')
      }
    })
  })
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

app.listen(3000, function(){
  console.log("server jalan di port 3000")
})
