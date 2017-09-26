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
    let datas = JSON.parse(data);
    let id,nama, string, integer, float, date, boolean, filter = false;
    if(typeof req.query.cek_id !== 'undefined'){
       id = req.query.id;
       filter = true;
    }
    if(typeof req.query.cek_nama !== 'undefined'){
       nama = req.query.nama;
       filter = true;
    }
    if(typeof req.query.cek_string !== 'undefined'){
       string = req.query.string;
       filter = true;
    }
    if(typeof req.query.cek_integer !== 'undefined'){
       integer = req.query.integer;
       filter = true;
    }
    if(typeof req.query.cek_float !== 'undefined'){
       float = req.query.float;
       filter = true;
    }
    if(typeof req.query.cek_date !== 'undefined'){
       date = req.query.date;
       filter = true;
    }
    if(typeof req.query.cek_boolean !== 'undefined'){
       boolean = req.query.boolean;
       filter = true;
    }

    if(filter){
      let d = datas.filter(function(val) {
                if(val.id == id ||val.nama== nama || val.string== string|| val.integer== integer|| val.float == float|| val.date == date || val.boolean == boolean){
                  return val;
                }
              })
        datas = d;
    }

    let get_links = req.originalUrl;
    var the_arr = get_links.split('&pag_active');
    if(get_links.includes("?pag_active"))
      the_arr = get_links.split('?pag_active');
    let get_link = the_arr[0];

    if(get_link.length > 1){
      get_link = get_link + "&";
    }else {
      get_link = get_link + "?";
    }

    let pag_length = Math.ceil(datas.length / 2);
    let pag_active = 1;
    if (typeof req.query.pag_active !== 'undefined') {
      pag_active = req.query.pag_active;
    }

    let finish = [],
    pag_ac =(Number(pag_active) * 2) - 1;
    datas.map(function(obj, key) {
      // console.log(key > pag_ac - 2 , key <= pag_ac, key, pag_ac);
      if(key > pag_ac - 2 && key <= pag_ac){
         finish.push(obj)
      }
    });

    res.render('list',{data:finish, pag_active:pag_active, pag_length:pag_length, get_link: get_link})
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
      data[index].nama=req.body.nama
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
