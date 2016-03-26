'use strict';

angular.module('pelikelloApp')


.controller('AddPenaltyModalCtrl', function ($scope, $uibModal, $log, $localStorage) {

    $scope.lengths = [ {'id':"1 min", 'value': 1},
                       {'id':"2 min", 'value': 2},
                       {'id':"4 min", 'value': 4},
                       {'id':"5 min", 'value': 5},
                       {'id':"10 min", 'value': 10}
                     ];

    $scope.open = function (size) {

        $scope.penalty = {home:false, player:"", reason:"", length:""};

        var modalInstance = $uibModal.open({
            templateUrl: 'addpenaltymodal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                penalty: function () {
                    return $scope.penalty;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;

            if($scope.selected.home){               
                console.log("home");
            }
            else {
                console.log("visitor");                
            }

        }, function () {
                $log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.reasonChanged = function($index) {
        var reason_x = $scope.setup.reasons[$index];  
        console.log("reason: "+ reason_x);
    };

})


.controller('RemovePenaltyModalCtrl', function ($scope, $uibModal, $log) {

    $scope.penalty = {home:false, player:""};

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'removepenaltymodal.html',
            controller: 'ModalInstanceCtrl2',
            size: size,
            resolve: {
                penalty: function () {
                    return $scope.penalty;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

})


.controller('SetNewTimeModalCtrl', function ($scope, $uibModal, $log, $localStorage) {

    $scope.newgametime = {minutes:"", seconds:""};

    $scope.open = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'setnewtimemodal.html',
            controller: 'ModalInstanceCtrl3',
            size: size,
            resolve: {
                newgametime: function () {
                    return $scope.newgametime;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            $localStorage.setup.correctedminutes = $scope.selected.minutes;
            $localStorage.setup.correctedseconds = $scope.selected.seconds;            
            document.getElementById('minutesNext').innerHTML = $scope.selected.minutes;
            document.getElementById('secondsNext').innerHTML = $scope.selected.seconds;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

})


.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, penalty) {


    //definition of penalty
    $scope.penalty = {home:false, player:"", reason:"", length:""};
  
    $scope.lengths = [
        {'id':"1 min", 'value': 1},
        {'id':"2 min", 'value': 2},
        {'id':"4 min", 'value': 4},
        {'id':"5 min", 'value': 5},
        {'id':"10 min", 'value': 10}
    ];



    $scope.reasons = [
        { "id": 1, "value": "Hooking" },
        { "id": 2, "value": "Slashing" },
        { "id": 3, "value": "High-sticking" },
        { "id": 4, "value": "Boarding" },
        { "id": 5, "value": "Too many men on the ice" },
        { "id": 6, "value": "Unsportsmanlike conduct" }
    ];




    $scope.penalty = penalty;
    $scope.selected = {
        penalty: $scope.penalty
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.penalty);
        console.log($scope.selected.penalty);     
    };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
})


.controller('ModalInstanceCtrl2', function ($scope, $uibModalInstance, penalty) {

    //definition of penalty
    $scope.penalty = {home:false, player:""};

    $scope.penalty = penalty;
    $scope.selected = {
        penalty: $scope.penalty
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.penalty);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})


.controller('ModalInstanceCtrl3', function ($scope, $uibModalInstance, newgametime) {

    $scope.newgametime = newgametime;
    $scope.selected = {
        newgametime: $scope.newgametime           
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.newgametime);           
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})


.controller('CtrlController', ['$scope', '$localStorage', 'SetupFactory', function($scope, $localStorage, SetupFactory) {

    var myVar;
    var set_timeout = loadSetupData().timeouttime;
    var timeout_timer = set_timeout;

    var homegoals = 0;
    var visitorgoals = 0;
    var last_goal = 0;

    $scope.homeTimeouts = [];
    $scope.visitorTimeouts = [];


    $scope.isBtnDisabled=function() {
        return $scope.clockTicking;
    };

    $scope.isTimeoutOngoing = function() {
        return $scope.timeoutOngoing;
    };

    $scope.setHomeTimeout = function() {
                
        if ($scope.homeTimeouts.length >= 3) {
            console.log("no more timeouts for Home");
        }
        else{
            startTimeout();
            $scope.timeoutOngoing = true;                
            $scope.homeTimeouts.length = $scope.homeTimeouts.length + 1;
        }
    };

    $scope.setVisitorTimeout = function() {

        if ($scope.visitorTimeouts.length >= 3) {
            console.log("no more timeouts for Visitor");
        }
        else{
            startTimeout();
            $scope.timeoutOngoing = true;
            $scope.visitorTimeouts.length = $scope.visitorTimeouts.length + 1;
        }
    };

    $scope.AddHomeGoal = function() {
        homegoals = homegoals + 1;
        document.getElementById('homegoals').innerHTML = SetupFactory.addGoal(homegoals);
        last_goal = 1;
    };

    $scope.AddVisitorGoal = function() {
        visitorgoals = visitorgoals + 1;
        document.getElementById('visitorgoals').innerHTML = SetupFactory.addGoal(visitorgoals);
        last_goal = 2;
    };

    $scope.RemHomeGoal = function(){
        if (homegoals > 0) {
            homegoals = homegoals - 1;
        }
        else homegoals = 0; {
            document.getElementById('homegoals').innerHTML = SetupFactory.remGoal(homegoals);
        }
    };

    $scope.RemVisitorGoal = function (){
        if (visitorgoals > 0) {
            visitorgoals = visitorgoals - 1;
        }
        else visitorgoals = 0; {
            document.getElementById('visitorgoals').innerHTML = SetupFactory.remGoal(visitorgoals);
        }
    };

    $scope.UpdateGoalsToScreen = function() {
        document.getElementById('homegoalsonscreen').innerHTML = SetupFactory.addGoal(homegoals);    
        document.getElementById('visitorgoalsonscreen').innerHTML = SetupFactory.addGoal(visitorgoals);                
        document.getElementById('homegoals').innerHTML = "-";                    
        document.getElementById('visitorgoals').innerHTML = "-";
    };


function startTimeout(){
    myVar = setInterval(function(){ setTimeout(); }, 1000);    
};


function setTimeout() {
    if (timeout_timer === 0){
        clearInterval(myVar);
        document.getElementById('breakperiod').innerHTML = '';

        SetupFactory.playAlarm();

        $scope.timeoutOngoing = false;

        timeout_timer = set_timeout;
    }
    else if (timeout_timer < 0)
        clearInterval(myVar);
    else{
        document.getElementById('breakperiod').innerHTML = timeout_timer;
        timeout_timer = timeout_timer - 1;
        }
};


function loadSetupData(){
    return $localStorage.setup  || $scope.setup;
};

}])


.controller('SetupController', ['$scope', '$localStorage', 'SetupFactory', function($scope, $localStorage, SetupFactory) {
    
    var gMinutes = 0;
    var gSeconds = 0;

    var remainingTime;
    var countdownHandle;
    var period = 1;    
    var gameTimeOngoing = true;

    $scope.setup= [];


    SetupFactory.getSetup()
    .then(
        function(response) {
            $scope.setup = response.data;          
        }
    );


    $scope.countdownEnabled = function() {                
        return($scope.setup.countdown);
    };

    $scope.gameTimeChanged = function($index) {    
        $localStorage.setup = [];
        $localStorage.setup.gametime = $scope.setup.gametimes[$index];
        console.log("gametime: "+ $localStorage.setup.gametime);
    };

    $scope.periodCountChanged = function($index) {
        $localStorage.setup.periodcount = $scope.setup.periodcounts[$index];    
        console.log("periods: "+ $localStorage.setup.periodcount);
    };

    $scope.pauseTimeChanged = function($index) {
        $localStorage.setup.pausetime = $scope.setup.pausetimes[$index];  
        console.log("pausetime: "+ $localStorage.setup.pausetime);
    };

    $scope.timeoutTimeChanged = function($index) {
        $localStorage.setup.timeouttime = $scope.setup.timeouttimes[$index]; 
        console.log("timeouts: "+ $localStorage.setup.timeouttime);
    };


    $scope.saveSettings = function() {      
        $localStorage.setup.hometeam = $scope.setup.hometeam;
        $localStorage.setup.visitorteam = $scope.setup.visitorteam;
        $localStorage.setup.correctedminutes = $localStorage.setup.gametime;
        $localStorage.setup.correctedseconds = 0;
        console.log($localStorage.setup);
        SetupFactory.saveSetup($localStorage.setup);
        
    };

    $(document).ready(function() {
        $localStorage.setup = loadSetupData();
        setGameTimer(loadSetupData().gametime, 0);
    });

    $scope.playAlarm = function() {
        SetupFactory.playAlarm()
    };

    $scope.onStartTimer = function() {

        if (!$scope.clockTicking) {
            $scope.clockTicking = !$scope.clockTicking;

            remainingTime = loadGametimeMin()*60*1000 + loadGametimeSec()*1000;

            clearInterval(countdownHandle);
            if (remainingTime<1000) {
                remainingTime = (gMinutes*60*1000)+(gSeconds*1000);
                renderTimer();
            }
            startTimer();
            gameTimeOngoing = true;
            document.getElementById("period").innerHTML = period;                    
        }
    };

    $scope.onResetTimer = function() {
        if ($scope.clockTicking) {
            $scope.clockTicking = !$scope.clockTicking;
        }    
        setGameTimer(loadSetupData().gametime, 0);

        document.getElementById("period").innerHTML = 1;
        document.getElementById("homegoalsonscreen").innerHTML = "00";
        document.getElementById("visitorgoalsonscreen").innerHTML = "00";
        period = 1;

    };

    $scope.onStopTimer = function() {
        if ($scope.clockTicking) {
            $scope.clockTicking = !$scope.clockTicking;

            if(loadSetupData().countdown) {
                setGameTimer(document.getElementById("minutesNext").innerHTML,
                             document.getElementById("secondsNext").innerHTML);
            }
            else{
                gMinutes = document.getElementById("minutesNext").innerHTML;
                gSeconds = document.getElementById("secondsNext").innerHTML;
                setGameTimer(gMinutes,
                             gSeconds);                
            }
        }
    };


function loadSetupData(){
    return $localStorage.setup || $scope.setup;
};

function loadGametimeMin(){
    return $localStorage.setup.correctedminutes;    
};

function loadGametimeSec(){
    return $localStorage.setup.correctedseconds;    
};


function setGameTimer(gameMinutes, gameSeconds){
    stopTimer();
    gMinutes = gameMinutes;
    gSeconds = gameSeconds;

    $localStorage.setup.correctedminutes=gameMinutes;
    $localStorage.setup.correctedseconds=gameSeconds;

    resetTimer();
}

function startAlarm(){

    if(remainingTime<1000) {
        if ($scope.clockTicking) {
            $scope.clockTicking = !$scope.clockTicking;
        }

        SetupFactory.playAlarm();
        gameTimeOngoing = !gameTimeOngoing;
        // check if it is time to start a pause between periods
        if((loadSetupData().periodcount-period)>=1 && gameTimeOngoing === false) {                            
            setTimeout(startPause, 1000);
        }
        else {   //break ends and new period can start
            $localStorage.setup.correctedminutes = $localStorage.setup.gametime;
            $localStorage.setup.correctedseconds = 0;
            gMinutes = $localStorage.setup.minutes;
            gSeconds = $localStorage.setup.seconds;
        }
    }
};


function startPause() {
    clearInterval(countdownHandle);
    remainingTime = (loadSetupData().pausetime*60*1000);
    renderTimer();
    startTimer();
    period = period + 1;

};


function startTimer() {
    countdownHandle=setInterval(function() {
        decrementTimer();
    },1000);
};


function stopTimer() {
    clearInterval(countdownHandle);
    startAlarm();
};


function resetTimer(){

    remainingTime = (gMinutes*60*1000)+(gSeconds*1000);
    renderTimer();
};


function renderTimer(){

    var deltaTime;

    deltaTime=remainingTime;

    var minutesValue=Math.floor(deltaTime/(1000*60));
    deltaTime=deltaTime%(1000*60);

    var secondsValue=Math.floor(deltaTime/(1000));
    showTime(minutesValue, secondsValue);
};


function showTime(remainingMinutes, remainingSeconds) {

    var minutesString = formatTime(remainingMinutes);
    var secondsString = formatTime(remainingSeconds);



    if(!(minutesString === "0NaN")) {
        $('#minutesNext').text(minutesString);
        $('#secondsNext').text(secondsString);
    }
};


function formatTime(intergerValue){
    return intergerValue > 9 ? intergerValue.toString():'0'+intergerValue.toString();
};


function decrementTimer(){
    remainingTime-=(1*1000);

    if(remainingTime<1000){
        stopTimer();
    }
    renderTimer();
};


}]);