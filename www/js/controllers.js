angular.module('starter.controllers', ['starter.services'])
.constant('DateTimeFormats', {
	hourFormat: "HH:mm",
	dateFormat: "dd/MM/y"
})

.controller('HomeCtrl', function($scope, Home, $localstorage) {
	$scope.$on('$ionicView.enter', function() {
		if ($localstorage.get('token'))
		{
			console.log('success!');
		}
		else
		{
			console.log('Please log in');
		}
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

.controller('TravelsCtrl', function($scope, Travels, $localstorage, DateTimeFormats, MyDateUtil) {
	$scope.$on('$ionicView.enter', function() {
		if ($localstorage.get('token'))
		{
			console.log('success!');
			Travels.all()
			.then(function(response){
				$scope.travels = response;
			});
		}
		else
		{
			console.log('Please log in');
		}
	})
	
	$scope.hourFormat = DateTimeFormats.hourFormat;
	$scope.dateFormat = DateTimeFormats.dateFormat;
	
	$scope.travels = Travels.all();
	$scope.remove = function(travel) {
		Travels.deleteTravel(travel);
	};
	
	$scope.doRefresh = function() {
		Travels.all()
		.then(function(response){
			$scope.travels = response;
		})
		.finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
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
			},
			function(error)
			{
				console.log(error);
			}
		);
	}

})

.controller('TravelCtrl', function($scope, $stateParams, Travels, $localstorage, DateTimeFormats) {
	$scope.hourFormat = DateTimeFormats.hourFormat;
	$scope.dateFormat = DateTimeFormats.dateFormat;
	
	Travels.read($stateParams.travelId)
	.then(function(success){
		$scope.travel = success;
	});
	
	$scope.joinTravel = function()
	{
		console.log($scope.travel.id);
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
});
