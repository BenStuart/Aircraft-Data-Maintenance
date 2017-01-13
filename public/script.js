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
