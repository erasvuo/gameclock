'use strict';

angular.module('pelikelloApp')
    
.constant("baseURL","http://localhost:3000/")

.service('SetupFactory', ['$http', 'baseURL', function($http,baseURL) {

	var storedsetup = [];

    this.getSetup = function(){
    	return $http.get(baseURL+"setup");
    };


    this.saveSetup = function(setup){
    	storedsetup = setup;
    };


    this.playAlarm = function() {
        var beep = new Audio();
        beep.src = "./sounds/myaudio.mp3";
        beep.play();
    };

	this.addGoal = function(i)
	{
		var str = "";
    	var predigit = "0";
    	var result = predigit.fontcolor("black");    
    
    	if(i < 10){
        	str = result+i.toString();
    	}
    	else 
        	str = i.toString();         
    	return str;
	};

	this.remGoal = function(i)
	{
		var str = "";
	    var predigit = "0";
    	var result = predigit.fontcolor("black");      
    
    	if(i < 10)
        	str = result+i.toString();                           
    	else 
        	str = i.toString();          
    
    	return str;
	};


}]);