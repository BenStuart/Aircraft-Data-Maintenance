var app = angular.module('myApp', [])

// Data to be passed around between controllers
app.service('Service', function($timeout){
  var id = 0
  var user = ""
  var location = ""
  var entrySelected = true
  var toggle = true
  var toReturn = false

  // functions need to be returned from a service as vars are private scope
  return {
    CheckEntrySelected: function(){
      return entrySelected
    },
    getUser: function(){
      return user
    },
    getLocation: function(){
      return location
    },
    ChangeEntrySelected: function(){
      entrySelected = !entrySelected
    },
    setName: function(_user){
      user = _user
    },
    setLocation: function(_location){
      location = _location
    },
    getid: function(){
      return id
    },
    setid: function(_id){
      id = _id
    }
  }

})

app.controller('listCtrl', function($scope, $http, Service, $rootScope) {
    $http({
        method : "POST",
        url : "/list"
    }).then(function mySucces(response) {
        $scope.clicked = null;
        $scope.data = response.data;
        $scope.go = function(data){

          var lastclick = $scope.clicked
          console.log("last clicked: " + lastclick)

          $scope.clicked = data.name
          console.log("scope clicked: " +  $scope.clicked)

          console.log(data.id)

          //Pass selected data to the service to be used by other controller
          Service.setName(data.name)
          Service.setLocation(data.location)
          Service.setid(data.id)

          //console.log("Data Passed From Table: " + data.name)
          //console.log("Data Passed From Table: " + data.location)

          // if clicking on the same row twice, removing the row selection
          if($scope.clicked == lastclick){

            console.log($rootScope.updateMyVar)
            //make sure edit form is closed when switching/unselecting rows and values will change
             if($rootScope.updateMyVar == false){
               $rootScope.updateMyVar = !$rootScope.updateMyVar
            }

            //make sure add form is closed when making selections from list
            if($rootScope.addMyVar == false){
              $rootScope.addMyVar = !$rootScope.addMyVar
            }

             console.log("change entry triggered")
             //Trigggers the "Please select an entry first"
             Service.ChangeEntrySelected()
             $scope.clicked = ""
          }

          // if not clicking for the first time and the last click was nothing i.e removing a selection
          // but now clicking on something
          else if ($scope.clicked != "" && lastclick != null && lastclick == ""){
            console.log($rootScope.updateMyVar)
            Service.ChangeEntrySelected()
          }

          else if ($scope.clicked != "" && lastclick != ""){
              console.log("$rootScope.updateMyVar")
              //make sure edit form is closed when switching/unselecting rows and values will change
               if($rootScope.updateMyVar == false){
                 $rootScope.updateMyVar = !$rootScope.updateMyVar
              }

              //make sure add form is closed when making selections from list
              if($rootScope.addMyVar == false){
                $rootScope.addMyVar = !$rootScope.addMyVar
              }
          }

        }
        console.log(JSON.stringify(response.data))
    }, function myError(response) {
        $scope.data = response.statusText;
    })
})

app.controller('updateEntryCtrl', function($scope, Service, $window, $rootScope, $http){

  //Make sure other form is closed when opening this form
  $scope.$watch('updateMyVar', function(){
    if($rootScope.addMyVar == false){
      console.log("add form is open, closing")
      $rootScope.addMyVar =! $rootScope.addMyVar
    }
  })

  $rootScope.updateMyVar = true
  $rootScope.updateToggle = function(){
    console.log(Service.CheckEntrySelected())
    if (Service.CheckEntrySelected() === false){
          $window.alert("Please select a field to edit first")
          return
    }
    $rootScope.updateMyVar = !$rootScope.updateMyVar
    $scope.name = Service.getUser()
    $scope.country = Service.getLocation()
    $scope.id = Service.getid()
  }

  $scope.submitEditEmployeeForm = function() {
    $scope.employee = {name: $scope.name, country: $scope.country, id: $scope.id}

    console.log($scope.name)
    console.log($scope.country)
    console.log($scope.id)

    $http({
      method : "POST",
      url : "/update",
      data: $scope.employee,
    }).then(function mySucces(response) {
      $rootScope.updateToggle = !$rootScope.updateToggle
    }, function myError(response) {

    })
  }
})

app.controller('addFormCtrl', function($scope, $http, $timeout, Service, $rootScope){
  $rootScope.addMyVar = true

    //Make sure other form is closed when opening this form
    $scope.$watch('addMyVar', function(){
      if($rootScope.updateMyVar == false){
        console.log("edit form is open")
        $rootScope.updateMyVar =! $rootScope.updateMyVar
      }
    })

  $rootScope.addToggle = function (){
    $rootScope.addMyVar = !$rootScope.addMyVar
  }

  $scope.submitAddEmployeeForm = function(){
    //console.log("triggered")
    //console.log($scope.name)
    //console.log($scope.country)
    $scope.employee = {name: $scope.name, country: $scope.country}
    $http({
      method : "POST",
      url : "/add",
      data: $scope.employee,
    }).then(function mySucces(response) {

        $rootScope.status = "Succesfully Added";
        console.log(response.data.insertId)

        $scope.addToggle = function (){
          $rootScope.addMyVar = !$rootScope.addMyVar
        }

        //once toggled i.e form taken away success or failure message displayed for x time
        $scope.successOrFailureAlert = true;
        $timeout(function () {$scope.successOrFailureAlert = false}, 2000)

        $scope.name = ""
        $scope.location = ""

    }, function myError(response) {
        $scope.status = "Add Was unsuccessful"
    });
  }
})
