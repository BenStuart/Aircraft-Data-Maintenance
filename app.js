var express = require('express')
var bodyParser = require('body-parser');
var app = express()

// setting bodyParser for text
app.use(bodyParser.urlencoded({ extended: true }));

// static page to be served when contacted
app.use('/',express.static(__dirname + '/public'))

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
