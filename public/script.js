window.onload = function() {
    $.ajax({
      url: "/list",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      success: function(data) {
       console.log("data passed back from server is:" + data)

       // Convert JSON objects into a string readable format
       console.log(JSON.stringify(data))

       // populateTable()
       console.log(getRowCount(data))
      },
      error: function(err) {
         console.log("an error occured")
         console.log(err)
      }
    })
};

// Get the count of objects returned - each object being a set of properties
function getRowsCount(_obj){
  var count = Object.keys(_obj).length
  return count
}

function getEntriesCount(_obj){
  var count = 0;
  _obj.forEach(function(element){
    count = count + 1:
  } return count )
}

function populateTable(){
    $('#myTableData').append('<tr><td>test 2</td><td>test 3</td></tr>')
}

function ajaxRawFunc(){
      var inputData = document.getElementById('input1').value
      $.ajax({
        url: "/pass",
        type: "POST",
        data: inputData,
        contentType: "application/x-www-form-urlencoded",
        //dataType: "json", only use if you need to responce data to be JSON, if its not JSON an error will fire when uncommented. defaults to text
        success: function(data) {
         console.log("data passed back from server is:" + data)
        },
        error: function(err) {
           console.log("an error occured")
           console.log(err)
        }
      })
}

function ajaxJSONFunc(){
      var inputData = document.getElementById('input2').value
      $.ajax({
        url: "/pass",
        type: "POST",
        data: JSON.stringify({"data" : inputData}), //object needs to be stringified before sending
        contentType: "application/json",
        // dataType: "json", only use if you need to responce data to be JSON, if its not JSON an error will fire when uncommented. defaults to text
        success: function(data) {
         console.log("data passed back from server is:" + data)
        },
        error: function(err) {
           console.log("an error occured")
           console.log(err)
        }
      })
}
