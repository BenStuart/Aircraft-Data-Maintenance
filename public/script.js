var app = angular.module('myApp', [])

// Data to be passed around between controllers
app.service('Service', function($timeout){
  var id = 0
  var ARego = ""
  var AType = ""
  var ADescription = ""
  var AOdometer = 0.00
  var AFlag = 0.00
  var entrySelected = null

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

app.controller('deletCtrl', function($scope, $window, Service, $rootScope, $http, $timeout) {
  $rootScope.delete = function(){
    if (Service.CheckEntrySelected() == false || Service.CheckEntrySelected() == null){
      $window.alert("Please select an entry first")
    }else{
      if(Service.getAOdometer() < 500.00){
        $window.alert("Aircraft cannot be deleted, Odometer reading too low")
      }else{
        if (confirm('Are you sure you want to delete: ' + Service.getARego())) {
          $http({
            method : "POST",
            url : "/delete",
            data: {"rego" : Service.getARego()}
          }).then(function mySucces(response) {
            $rootScope.status = "Entry Deleted"
            $rootScope.listed()
            Service.ChangeEntrySelected()
            $rootScope.successOrFailureAlert = true;
            //console.log($scope.successOrFailureAlert)
            $timeout(function () {$rootScope.successOrFailureAlert = false}, 1000)
          }, function myError(response) {
          })
        }
      }
    }
  }

})

app.controller('listCtrl', function($scope, $http, Service, $rootScope) {
    $rootScope.listed = function() {
      $http({
          method : "POST",
          url : "/list"
      }).then(function mySucces(response) {
          $scope.clicked = null;
          $scope.data = response.data;
          $scope.go = function(data){
            var lastclick = $scope.clicked
            $scope.clicked = data.ARego

            //console.log(data.ARego)
            //Pass selected data to the service to be used by other controller
            Service.setAType(data.AType)
            Service.setARego(data.ARego)
            Service.setAFlag(data.AFlag)
            Service.setADescription(data.ADescription)
            console.log(data.AOdometer)
            console.log(data.AFlag)
            Service.setAOdometer(data.AOdometer)
            Service.setid(data.id)
            console.log("Data id: " + data.id)
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
            else if ($scope.clicked != "" && lastclick != "" ){
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
            if(lastclick == null && $scope.cliked != ""){
              Service.ChangeEntrySelected()
            }
          }
          //console.log(JSON.stringify(response.data))
      }, function myError(response) {
          $scope.data = response.statusText;
      })
    }
    $rootScope.listed()
})

app.controller('updateEntryCtrl', function($scope, Service, $window, $rootScope, $http, $timeout){
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
    if(Service.CheckEntrySelected() == null){
      $window.alert("Please select a field to edit first")
        return
    }
    console.log("EntrySelected" + Service.CheckEntrySelected())
    if (Service.CheckEntrySelected() == false){
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
    console.log($scope.AOdometer)
    console.log($scope.AFlag)
    $scope.id = Service.getid()
  }

  $scope.updateCancel = function(){
    $rootScope.updateToggle()
    $scope.ARego = ""
    $scope.selectedType = ""
    $scope.AType = ["Boeing 747","Harrier","JumpJet"]
    $scope.id = ""
    $scope.ADescription = ""
    $scope.AOdometer = 0.00
    $scope.AFlag = 0.00
    $scope.id = ""
  }

  //When submit button pressed send to node server
  $scope.submitEditEmployeeForm = function() {
    console.log("AOdometer" + $scope.AOdometer)
    console.log("AOdometer" + $scope.AFlag)
    //object containing the aircraft values
    if($scope.AOdometer > $scope.AFlag){
      $window.alert("Odometer value must be lower than flag value, please try again")
    }else{
      $scope.Aircraft = {
        ARego: $scope.ARego, AType: $scope.selectedType,
        id: $scope.id, ADescription: $scope.ADescription,
        AOdometer: $scope.AOdometer, AFlag: $scope.AFlag
      }
      console.log($scope.AOdometer)
      console.log($scope.AFlag)
      $http({
        method : "POST",
        url : "/update",
        data: $scope.Aircraft
      }).then(function mySucces(response) {
        console.log("triggered")
        $rootScope.listed()
        $rootScope.updateToggle()
        Service.ChangeEntrySelected()
        $rootScope.status = "Entry Updated"
        //once toggled i.e form taken away success or failure message displayed for x time
        $rootScope.successOrFailureAlert = true;
        //console.log($scope.successOrFailureAlert)
        $timeout(function () {$rootScope.successOrFailureAlert = false}, 1000)
      }, function myError(response) {
        console.log(response)
      })
    }
  }
})

app.controller('addFormCtrl', function($scope, $http, $timeout, Service, $rootScope, $window){
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
    $scope.AType = ["Boeing 747","Harrier","JumpJet"]
    //empty forms content
    $scope.ARego = ""
    $scope.ADescription = ""
    $scope.AOdometer = 0.00
    $scope.AFlag = 0.00
  }

  $scope.addCancel = function(){
    $rootScope.addToggle()
  }

  $scope.submitAddEmployeeForm = function(){
    if($scope.AOdometer > $scope.AFlag){
      $window.alert("Odometer value must be lower than flag value, please try again")
    }else{

      $scope.Aircraft = {
        ARego: $scope.ARego, AType: $scope.selectedType,
        id: $scope.id, ADescription: $scope.ADescription,
        AOdometer: $scope.AOdometer, AFlag: $scope.AFlag
      }

      $http({
        method : "POST",
        url : "/add",
        data: $scope.Aircraft,
      }).then(function mySucces(response) {
        console.log(response.data)
        if(response.data == "Cannot Add New Entry Duplicate Rego, Please try again!")
        {
          console.log("triggered")
          $rootScope.status = response.data
        }
        else{
          $rootScope.status = "Succesfully Added"
          $rootScope.addToggle()
          //Service.ChangeEntrySelected()
          $rootScope.listed()
        }
        //once toggled i.e form taken away success or failure message displayed for x time
        $rootScope.successOrFailureAlert = true;
        //console.log($scope.successOrFailureAlert)
        $timeout(function () {$rootScope.successOrFailureAlert = false}, 1000)
      }, function myError(response) {
        console.log(response)
      });
    }
  }

})
