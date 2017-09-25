const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

const DATA_PATH = path.join(__dirname, 'data.json');
//console.log(DATA_PATH);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))

app.use(function (req, res, next) {
  res.setHeader('Acces-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
})



app.get('/', function (req, res) {
  fs.readFile(DATA_PATH, function (err, data) {
    if (err) {
      console.error(err);
    }
    res.render('list',{data:JSON.parse(data)})
  })
})

app.get('/add', function (req, res) {
  res.render('add')
})

app.post('/add', function (req, res) {
  var id = Date.now()
  var datanya = req.body;
  datanya['id'] = id
  fs.readFile(DATA_PATH, function (err, data) {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      var data = JSON.parse(data)
      data.push(datanya)
      fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function (err) {
        if(err){
          console.log(err);
          res.send(err);
        }else{
          res.redirect('/')
        }
      })
    }
  })
})

app.get('/edit/:id', function (req, res) {
  console.log(req.params.id);

  fs.readFile(DATA_PATH, function (err, data) {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      data = JSON.parse(data)
      let datanya = {}
      for (var i = 0; i < data.length; i++) {
        if (req.params.id==data[i].id) {
          datanya = data[i]
          break;
        }
      }
      res.render('edit',{data:datanya})
    }
  })
})

app.post('/edit/:id', function (req, res) {
  let id = Number(req.params.id)
  fs.readFile(DATA_PATH, function (err, data) {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      data = JSON.parse(data)
      let index = data.map(function(x){
        return x.id
      }).indexOf(id);
      data[index].string = req.body.string
      data[index].integer = req.body.integer
      data[index].float = req.body.float
      data[index].date = req.body.date
      data[index].boolean = req.body.boolean
      fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function (err) {
        if(err){
          console.log(err);
          res.send(err);
        }else{
          res.redirect('/')
        }
      })
    }
  })
})

app.get('/delete/:id', function (req, res) {
  fs.readFile(DATA_PATH, function (err, data) {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      data = JSON.parse(data)
      let id=Number(req.params.id)
      data=data.filter(function(x){
        return x.id != id
      })
      fs.writeFile(DATA_PATH, JSON.stringify(data, null, 3), function (err) {
        if(err){
          console.log(err);
          res.send(err);
        }else{
          res.redirect('/')
        }
      })

    }
  })
})


app.listen(3000, function () {
  console.log('server jalan di port 3000')
})
