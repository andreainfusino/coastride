angular.module('starter.controllers', ['starter.services'])
.constant('DateTimeFormats', {
	hourFormat: "HH:mm",
	dateFormat: "dd/MM/y"
})

.controller('HomeCtrl', function($scope, Home, $localstorage, $state, Logging) {
	$scope.$on('$ionicView.enter', function() {
		Logging.isLogged($state, $localstorage.get('token'));
	})
	$scope.isLogged = function()
	{
		//console.log('isLogged', ($localstorage.get('token') != undefined && $localstorage.get('token') != ""));
		return ($localstorage.get('token') != undefined && $localstorage.get('token') != "");
	}
	$scope.doLogin = function()
	{
		//console.log('tryin login...', $scope.username);
		Home.login($scope.username, $scope.password)
		.then(function(response){
			if (response.data.non_field_errors != undefined)
			{
				alert('Login error! Check username and password!');
			}
			else
			{
				console.log(response);
				$localstorage.set('token', response.data.token);
				Home.getUserId(response.data.token)
				.then(
					  function(success)
					  {
						  console.log(success.user);
						  $localstorage.set('user_id', success.user);
					  }, 
					  function(error)
					  {
						  console.log('An error occurred');
					  }
					  );
			}
		});
	}
})

.controller('TravelsCtrl', function($scope, Travels, $localstorage, DateTimeFormats, MyDateUtil, $state, Logging) {
	$scope.$on('$ionicView.enter', function() {
		Logging.isLogged($state, $localstorage.get('token'));
	})
	
	$scope.hourFormat = DateTimeFormats.hourFormat;
	$scope.dateFormat = DateTimeFormats.dateFormat;
	
	$scope.travels = Travels.all();
	$scope.remove = function(travel) {
		Travels.deleteTravel(travel);
	};
	
	$scope.predicate = 'data_partenza';
	$scope.reverse = false;
	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};
	
	$scope.doRefresh = function() {
		$scope.predicate = 'data_partenza';
		$scope.reverse = true;
	
		Travels.all()
		.then(function(response){
			$scope.travels = response;
		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	
	$scope.allTravels = function()
	{
		Travels.all()
		.then(function(response){
			$scope.travels = response;
		});
	}
	
	$scope.myTravels = function()
	{
		Travels.myTravels($localstorage.get('user_id'))
		.then(function(response){
			$scope.travels = response;
		});
	}
	
	$scope.saveTravel = function()
	{		
		$scope.newTravel.data.is_richiesta = false;
		$scope.newTravel.data.is_fumatore = false;
		$scope.newTravel.data.costo = 0;
		$scope.newTravel.data.valuta = 'euro';
		$scope.newTravel.data.tempo_totale = 0;
		$scope.newTravel.data.km_totale = 0;
		$scope.newTravel.data.data_partenza = MyDateUtil.getYYYYMMDD($scope.newTravel.data.data_partenza_tmp, '-');
		$scope.newTravel.data.data_arrivo = MyDateUtil.getYYYYMMDD($scope.newTravel.data.data_arrivo_tmp, '-');	
		$scope.newTravel.data.utente = $localstorage.get('user_id')*1;
		
		console.log($scope.newTravel.data);
		Travels.create($scope.newTravel.data)
		.then
		(
			function(success)
			{
				console.log(success);
				alert('Creation successful!');
				$scope.newTravel.data = {};
				$state.go("tab.travels");
			},
			function(error)
			{
				console.log(error);
			}
		);
	}
	
})

.controller('TravelCtrl', function($scope, $stateParams, Travels, $localstorage, DateTimeFormats, Logging, $state) {
	$scope.$on('$ionicView.enter', function() {
		Logging.isLogged($state, $localstorage.get('token'));
	})

	$scope.hourFormat = DateTimeFormats.hourFormat;
	$scope.dateFormat = DateTimeFormats.dateFormat;
	
	Travels.read($stateParams.travelId)
	.then(function(success){
		$scope.travel = success;
		$scope.isMyTravel = function()
		{
			console.log($scope.travel.utente, $localstorage.get('user_id'));
			return $scope.travel.utente*1 == $localstorage.get('user_id')*1;
		}
	});
	
	
	$scope.joinTravel = function()
	{
		console.log($scope.travel.id);
		Travels.joinTravel($scope.travel.id, $localstorage.get('user_id'))
		.then(function(success){
			console.log(success);
		});
	}
})

.controller('ChatsCtrl', function($scope, Chats, $localstorage) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $localstorage) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.directive('listTravels', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/directive-list-travels.html'
	};
})
;
