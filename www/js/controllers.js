angular.module('starter.controllers', ['starter.services'])

.controller('HomeCtrl', function($scope, Home, $localstorage) {
	$scope.$on('$ionicView.enter', function() {
		if ($localstorage.get('token'))
		{
			//console.log('success!');
		}
		else
		{
			//console.log('Please log in');
		}
	})
	$scope.isLogged = function()
	{
		//console.log('isLogged', ($localstorage.get('token') != undefined && $localstorage.get('token') != ""));
		return ($localstorage.get('token') != undefined && $localstorage.get('token') != "");
	}
	$scope.doLogin = function()
	{
		console.log('tryin login...', $scope.username);
		Home.login($scope.username, $scope.password);
	}
})

.controller('TravelsCtrl', function($scope, Travels, $localstorage) {

  $scope.travels = Travels.all();
  $scope.remove = function(travel) {
    Travels.deleteTravel(travel);
  };

})

.controller('TravelDetailCtrl', function($scope, Travels, $localstorage) {

  $scope.travels = Travels.all();
  $scope.remove = function(travel) {
    Travels.deleteTravel(travel);
  };

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
