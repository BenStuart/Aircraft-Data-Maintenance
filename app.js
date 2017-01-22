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

app.post('/delete', function (req, _res){
  console.log(req.body.rego)
  var con = mysql.createConnection(connectInfo)

  con.connect(function(err){
    if(err){
      console.log("Error connecting to DB")
      return
    }
    console.log('Connection established')
  })

  con.query('DELETE FROM Aircraft WHERE ARego = ?',[req.body.rego],
  function (err, result) {
    if (err){
      console.log(err)
    }
    _res.end(req.body.rego + " Deleted")
  })
  con.end(function(err){
   console.log("connection terminated")
  })
})

// Add records to DB
app.post('/add', function (req, _res) {
  var response = 0;
  var Aircraft = {
    ARego:req.body.ARego, AType:req.body.AType,
     id:req.body.id, ADescription: req.body.ADescription,
     AOdometer: req.body.AOdometer,AFlag: req.body.AFlag
   }
  //console.log(JSON.stringify(employees))
  var con = mysql.createConnection(connectInfo)
  con.connect(function(err){
    if(err){
      console.log("Error connecting to DB")
      return
    }
    console.log('Connection established')
  })


  con.query('SELECT count(*) AS duplicate_count FROM ( SELECT ARego FROM Aircraft GROUP BY ARego=? HAVING COUNT(*) = 1) AS t',[Aircraft.ARego],
  function (err, res){
    if(err){
      console.log(err)
    }
    console.log("Response from Count:" + JSON.stringify(res))
    //console.log(res.Rego)
    //console.log(res[0].Rego)

    if(res[0].duplicate_count < 1){
      con.query('INSERT INTO Aircraft SET ?', Aircraft, function(err, res){
        // send response passed on success or failure of post
        if(err){
          console.log(err)
          _res.end(JSON.stringify(err))
        }
        console.log(res)
        _res.end("successfully added")
      })
      con.end(function(err){
       console.log("connection terminated")
      })
      //console.log("response here" + response)
    }else{
      _res.end("Cannot Add New Entry Duplicate Rego, Please try again!")
    }
  })
})

app.post('/update', function (req, _res) {
  var Aircraft = {
    ARego:req.body.ARego, AType:req.body.AType,
     id:req.body.id, ADescription: req.body.ADescription,
     AOdometer: req.body.AOdometer,AFlag: req.body.AFlag
   }
   console.log(JSON.stringify(Aircraft))

  //console.log(JSON.stringify(employees))
  var con = mysql.createConnection(connectInfo)
  con.connect(function(err){
    if(err){
      console.log("Error connecting to DB")
      return
    }
    console.log('Connection established')
  })

  con.query( 'UPDATE Aircraft SET ARego = ?, AType = ?, ADescription = ?, AOdometer = ?, AFlag = ?  Where id = ?',
  [Aircraft.ARego, Aircraft.AType, Aircraft.ADescription, Aircraft.AOdometer, Aircraft.AFlag, Aircraft.id],
  function (err, res) {
    // send response passed on success or failure of post
    if(err){
      console.log(err)
      _res.end(JSON.stringify(err))
    }
      console.log(res)
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
