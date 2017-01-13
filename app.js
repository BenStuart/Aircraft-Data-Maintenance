var express = require('express')
var bodyParser = require('body-parser');
var app = express()
var mysql = require("mysql");

var listArray = []

// setting bodyParser for text
app.use(bodyParser.urlencoded({ extended: true }));

// setting for passing JSON
app.use(bodyParser.json());

// static page to be served when contacted
app.use('/',express.static(__dirname + '/public'))


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "practise"
});

con.connect(function(err){
  if(err){
    console.log("Error connecting to DB")
    return
  }
  console.log('Connection established')
})

app.post('/list', function (req, res){
  // Establish connection to db
  con.query('SELECT * FROM employees',function(err,rows){
    if(err) throw err;
    for (var i = 0; i < rows.length; i++) {
      listArray.push(rows[i])
    };
    /*
    ar names = listArray.map(function(item) {
    return item;
    });
    console.log(names)
    */
    res.send(listArray)
  })

  con.end(function(err){
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
  })
})

// POST method route
app.post('/pass', function (req, res) {
  console.log("server received POST from homepage")
  console.log(req.body)
  res.send('POST request to the homepage')
})

//listening on
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
