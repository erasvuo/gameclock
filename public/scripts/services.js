'use strict';

angular.module('pelikelloApp')
    
.constant("baseURL","http://localhost:3000/")

.service('SetupFactory', ['$http', 'baseURL', function($http,baseURL) {


    this.getSetup = function(){
    	return $http.get(baseURL+"setup");
    }

    this.saveSetup = function(storedsetup){
        var url = baseURL+"storedsetup";
        return $http.post(url, storedsetup);
    }


}]);