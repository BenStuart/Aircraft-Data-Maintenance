var app = angular.module('myApp', [])

// Data to be passed around between controllers
app.service('Service', function(){
  var id = 0
  var ARego = ""
  var AType = ""
  var ADescription = ""
  var AOdometer = 0
  var AFlag = 0
  var entrySelected = true

  // functions need to be returned from a service as vars are private scope
  return {
    CheckEntrySelected: function(){
      return entrySelected
    },
    setARego: function (_ARego){
      ARego = _ARego
    },
    getARego: function (){
      return ARego
    },
    setAType: function(_AType){
      AType = _AType
    },
    getAType: function(){
      return AType
    },
    setADescription: function(_ADescription){
      ADescription = _ADescription
    },
    getADescription: function(){
      return ADescription
    },
    setAOdometer: function(_AOdometer){
      AOdometer = _AOdometer
    },
    getAOdometer: function(){
      return AOdometer
    },
    setAFlag: function(_AFlag){
      AFlag = _AFlag
    },
    getAFlag: function(){
      return AFlag
    },
    getid: function(){
      return id
    },
    setid: function(_id){
      id = _id
    },
    ChangeEntrySelected: function(){
      entrySelected = !entrySelected
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

          $scope.clicked = data.ARego
          //console.log("scope clicked: " +  $scope.clicked)
          //console.log(data.ARego)
          //Pass selected data to the service to be used by other controller
          Service.setAType(data.AType)
          Service.setARego(data.ARego)
          Service.setAFlag(data.AFlag)
          Service.setADescription(data.ADescription)
          Service.setAOdometer(data.AOdometer)
          //console.log("Data Passed From Table: " + data.name)
          //console.log("Data Passed From Table: " + data.location)

          // if clicking on the same row twice, removing the row selection
          if($scope.clicked == lastclick){
            //console.log($rootScope.updateMyVar)
            //make sure edit form is closed when switching/unselecting rows and values will change
             if($rootScope.updateMyVar == false){
               $rootScope.updateMyVar = !$rootScope.updateMyVar
            }

            //make sure add form is closed when making selections from list
            if($rootScope.addMyVar == false){
              $rootScope.addMyVar = !$rootScope.addMyVar
            }
             //console.log("change entry triggered")
             //Trigggers the "Please select an entry first"
             Service.ChangeEntrySelected()
             $scope.clicked = ""
          }

          // if not clicking for the first time and the last click was nothing i.e removing a selection
          // but now clicking on something
          else if ($scope.clicked != "" && lastclick != null && lastclick == ""){
            //console.log($rootScope.updateMyVar)
            Service.ChangeEntrySelected()
          }

          else if ($scope.clicked != "" && lastclick != ""){
              //console.log("$rootScope.updateMyVar")
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
        //console.log(JSON.stringify(response.data))
    }, function myError(response) {
        $scope.data = response.statusText;
    })
})

app.controller('updateEntryCtrl', function($scope, Service, $window, $rootScope, $http){

  $rootScope.updateMyVar = true

  //Check and make sure other form is closed when opening this form
  $scope.$watch('updateMyVar', function(){
    if($rootScope.addMyVar == false){
      if($rootScope.updateMyVar == false){
        console.log("add form is open, closing")
        $rootScope.addMyVar =! $rootScope.addMyVar
      }
    }
  })

  //Check if a valid field has been selected if so the edit button can open form
  // and continue pre-adding fields otherwise alert
  $rootScope.updateToggle = function(){
    console.log(Service.CheckEntrySelected())
    if (Service.CheckEntrySelected() === false){
          $window.alert("Please select a field to edit first")
          return
    }
    $rootScope.updateMyVar = !$rootScope.updateMyVar

    //Pre fill info into edit forms elements
    $scope.ARego = Service.getARego()
    $scope.selectedType = Service.getAType()
    $scope.AType = ["Boeing 747","Harrier","JumpJet"]
    $scope.id = Service.getid()
    $scope.ADescription = Service.getADescription()
    $scope.AOdometer = Service.getAOdometer()
    $scope.AFlag = Service.getAFlag()
  }

  //When submit button pressed send to node server
  $scope.submitEditEmployeeForm = function() {

    //********************* UP TO HERE ************************
    //object containing the aircraft values
    $scope.Aircraft = {ARego: $scope.ARego, AType: $scope.AType, id: $scope.id}

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
        if($rootScope.addMyVar == false){
          $rootScope.updateMyVar =! $rootScope.updateMyVar
        }
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
