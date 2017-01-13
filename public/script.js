function func(){
      var inputData = document.getElementById('input').value

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
