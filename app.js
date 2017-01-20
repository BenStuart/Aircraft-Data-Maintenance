var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var mysql = require("mysql")

var connectInfo = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "practise"
}

// setting bodyParser for text
app.use(bodyParser.urlencoded({ extended: true }))

// setting for passing JSON
app.use(bodyParser.json());

// static page to be served when contacted
app.use('/',express.static(__dirname + '/public'))

// Display DB records
app.post('/list', function (req, res){
  var listArray = []
  // Creat mysql Connection
  var con = mysql.createConnection(connectInfo)
  //Esablish connection with con params
  con.connect(function(err){
    if(err){
      console.log("Error connecting to DB")
      return
    }
    console.log('Connection established')
  })
  // Query DB and store results in obj
  con.query('SELECT * FROM Aircraft',function(err,rows){
    if(err) throw err;
    for (var i = 0; i < rows.length; i++){
      listArray.push(rows[i])
      console.log(rows[i])
    }
    //send obj to client side
    res.send(listArray)
  })
  //end mysql connection
  con.end(function(err){
    console.log("connection terminated")
  })
})

// Add records to DB
app.post('/add', function (req, _res) {
  var response = 0;
  var employee = {name:req.body.name, location:req.body.country}
  //console.log(JSON.stringify(employees))
  var con = mysql.createConnection(connectInfo)
  con.connect(function(err){
    if(err){
      console.log("Error connecting to DB")
      return
    }
    console.log('Connection established')
  })
  con.query('INSERT INTO employees SET ?', employee, function(err, res){
    // send response passed on success or failure of post
    if(err){
      _res.end(JSON.stringify(err))
    }
    _res.end(JSON.stringify(res))
  })
  con.end(function(err){
    console.log("connection terminated")
  })
  console.log("response here" + response)
})


app.post('/update', function (req, _res) {
  var employee = {name:req.body.name, location:req.body.country, id:req.body.id}
  //console.log(JSON.stringify(employees))
  var con = mysql.createConnection(connectInfo)
  con.connect(function(err){
    if(err){
      console.log("Error connecting to DB")
      return
    }
    console.log('Connection established')
  })

  console.log(employee.name)
  console.log(employee.location)
  console.log(employee.id)

  con.query( 'UPDATE employees SET location = ?, name = ?  Where ID = ?',
  [employee.location, employee.name, employee.id],
  function (err, res) {
    // send response passed on success or failure of post
    if(err){
      _res.end(JSON.stringify(err))
    }
    _res.end(JSON.stringify(res))
  })

  con.end(function(err){
    console.log("connection terminated")
  })
})


//listening on
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
