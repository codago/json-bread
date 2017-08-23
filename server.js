const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const jsonfile = require('jsonfile');
const bodyParser = require('body-parser') // middleware
const DATA_PATH = path.join(__dirname, 'data.json')


app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'no-cache')
    next();
})

// get data
app.get('/', function (req, res) {
    fs.readFile(DATA_PATH, function (err, data) {
        if (err) console.log(err)
        let mydata = JSON.parse(data)
        console.log(mydata)
        res.render('index', { title: "Json Bread", data: mydata })
    })
})

//rediret to add page
app.get('/add', function (req, res) {
    res.render('add', { title: "Json Bread" });
})

// post data
app.post('/add', function (req, res) {
    let mydata = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    let string = req.body.string;
    let integer = req.body.integer;
    let float = req.body.float;
    let date = req.body.date;
    let boolean = req.body.boolean;

    mydata.push({ id: Date.now(), string: string, integer: integer, float: float, date: date, boolean: boolean })
    console.log(mydata)
    jsonfile.writeFile(DATA_PATH, mydata, function (err) {
        console.error(err)
        res.redirect('/');
    })
})

app.get('/delete/:id', function (req, res) {
    let mydata = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    let id = Number(req.params.id);
    let index;

    mydata.filter(function (item, idx) {
        if (item.id === id) index = idx
    })
    mydata.splice(index, 1);

    // let sisa = mydata.filter(function (item) {
    //     return item.id != id
    // })

    jsonfile.writeFile(DATA_PATH, mydata, function (err) {
        console.error(err)
        res.redirect('/');
    })
})


app.get('/update/:id', function (req, res) {
    let mydata = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
    let index;
    let id = Number(req.params.id)

    let item = mydata.filter(function (x) {
        return x.id === id
    })
    res.render('update', { title: "Json Bread", item: item[0] });
})

app.post('/update', function (req, res) {
    let mydata = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));    

    mydata = mydata.map(function (x) {
        if (x.id === Number(req.body.id)) {
            x.string = req.body.string;
            x.integer = req.body.integer;
            x.float = req.body.float;
            x.date = req.body.date;
            x.boolean = req.body.boolean;
        }
        return x;
    })

    jsonfile.writeFile(DATA_PATH, mydata, function (err) {
        console.error(err)
        res.redirect('/');
    })

})


app.listen(3000, function () {
    console.log("server running at port 3000")
})


