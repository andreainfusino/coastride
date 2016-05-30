angular.module('starter.services', [])

.constant('ApiEndpoint', {
	loginUrl: 'http://localhost:8100/api',
	rest: 'http://localhost:8100/rest'  
})

.factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
}])
  
.factory('Home', function($http, $localstorage, ApiEndpoint) {
	return {
		login: function(username, password)
		{
			postData = 
				{
					username: username, 
					password: password
				};
			console.log('ApiEndpoint', ApiEndpoint.loginUrl);
			console.log('document.cookie', document.cookie);
			console.log(postData);
			return $http
				.post(ApiEndpoint.loginUrl, postData)
				.then(function(response){
					console.log('login response:', response);
					return response;
				});
				
				
		},
		logout: function(data)
		{
		  
		}
	}
})

.factory('Travels', function($http, $localstorage) {
	return {
		all: function()
		{
			$http({
				method: 'GET',
				url: 'http://coastride.andreainfusino.com/coastride/passaggi/'
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				console.log(response);
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		},
		create: function(data)
		{
		  
		},
		read: function(id)
		{
			
		},
		update: function(id, data)
		{
			
		},
		del: function(id)
		{
			
		},
		
		joinTravel: function(id)
		{
			
		}
	}
})


.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})


;
