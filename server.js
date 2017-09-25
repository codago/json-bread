const express = require ('express');
const app = express();
const path = require('path');
const fs =require('fs');
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

const DATA_PATH = path.join(__dirname, 'data.json');
console.log(DATA_PATH);

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')))

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','no-cache');
  next();
})

app.get('/',function(req, res){
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
    }
    res.render('list',{title:"test", data:JSON.parse(data)});
  })
})

app.post('/add',function(req, res){
  var string = req.body.string;
  var id = Date.now();
  var date =req.body.date;
  var float=req.body.float;
  var integer=req.body.integer;
  var boolean=req.body.boolean;

  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
      res.send(err);
    }else{
      var data=JSON.parse(data);
      data.push({id:id,
                string:req.body.string,
                integer: req.body.integer,
                float: req.body.float,
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


app.get('/add',function(req, res){
  res.render('add');
})
app.get('/edit/:id',function(req, res){
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
      res.send(err);
    }else{
      var data=JSON.parse(data);
      var id = Number(req.params.id);
      var item = data.filter(function(x){
        return x.id == id
      })

      res.render('edit', {item: item[0]});
    }
  });

})

app.post('/edit/:id',function(req,res){
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
      res.send(err);
    }else{
      data = JSON.parse(data);
      var id = Number(req.params.id)

      var d = data.map(function(x){
        if(x.id===id){
          x.string=req.body.string;
          x.date=req.body.date;
          x.integer=req.body.integer;
          x.boolean=req.body.boolean;
          x.float=req.body.float;
        }
        return x;
      })
      fs.writeFile(DATA_PATH, JSON.stringify(d, null, 3), function(err) {
        if(err) {
          console.error(err);
          res.send(err)
        } else {
          res.redirect('/')
        }
      })
    }
  })
})
app.get('/delete/:id',function(req, res){
  fs.readFile(DATA_PATH, function(err, data){
    if(err){
      console.error(err);
      res.send(err);
    }else{
      var data=JSON.parse(data);
      var id = Number(req.params.id);
      var item = data.filter(function(x){
        return x.id != id
      })
      fs.writeFile(DATA_PATH, JSON.stringify(item, null, 3), function(err) {
        res.redirect('/')

    });

  }
})
})



  app.listen(3000,function(){
    console.log("server jalan di port 3000");
  })
