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


.factory('Logging', ['$window', function($window, $localstorage) {
    return {
      isLogged: function($state, token) {
        if (token)
		{
			console.log('success!');
			return true;
		}
		else
		{
			console.log('Please log in');
			$state.go("tab.dash");
			return false;
		}
      }
    }
}])

.factory('MyDateUtil', ['$window', function($window) {
	return {
		getYYYYMMDD: function(dateValue, separator) {
			if (undefined == separator)
			{
				separator = '-';
			}			
			data_partenza_anno = dateValue.getFullYear();
			data_partenza_mese = ((dCurr = dateValue.getMonth()*1+1) < 10 ? '0'+dCurr : dCurr);
			data_partenza_giorno = ((dCurr = dateValue.getDate()*1) < 10 ? '0'+dCurr : dCurr);
			
			return data_partenza_anno+""+separator+data_partenza_mese+""+separator+data_partenza_giorno;
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
			return $http
				.post(ApiEndpoint.loginUrl, postData)
				.then(
					function(response)
					{
						//console.log('service success response:', response);
						$http.defaults.headers.common['Authorization'] = 'Token ' + response.data.token
						return response;
					},
					function(error)
					{
						//console.log('service error response:', error.data);
						return error;
					}
				);
		},
		getUserId: function(token)
		{
			return $http({
				method: 'GET',
				url: ApiEndpoint.rest+'/users/'+token+'/'
			}).then(function successCallback(response) {
				return response.data;
			}, function errorCallback(response) {
				return false;
			});
		},
		logout: function(data)
		{
			$localstorage.set('token', '');
		}
	}
})

.factory('Travels', function($http, $localstorage, ApiEndpoint, MyDateUtil) {
	return {
		all: function()
		{
			return $http({
				method: 'GET',
				url: ApiEndpoint.rest+'/passaggi/'
			}).then(function successCallback(response) {
				return response.data;
			}, function errorCallback(response) {
				return false;
			});
		},
		create: function(postData)
		{
			$http.defaults.headers.common['Authorization'] = 'Token ' + $localstorage.get('token');
			return $http
				.post(ApiEndpoint.rest+'/passaggi/', postData)
				.then(
					function(response)
					{
						return response;
					},
					function(error)
					{
						return error;
					}
				);
		},
		read: function(id)
		{
			return $http({
				method: 'GET',
				url: ApiEndpoint.rest+'/passaggio/'+id+'/'
			}).then(function successCallback(response) {
				return response.data;
			}, function errorCallback(response) {
				return false;
			});
		},
		update: function(id, data)
		{
			
		},
		del: function(id)
		{
			
		},		
		joinTravel: function(travel, user)
		{
			postData = 
			{
				passaggio: travel,
				user: user*1,
				data_partecipazione: MyDateUtil.getYYYYMMDD(new Date(), '-')
			};
			return $http
			.post(ApiEndpoint.rest+'/partecipazioni/', postData)
			.then(
				function(response)
				{
					return response;
				},
				function(error)
				{
					return error;
				}
			);
		},
		joinedTravels: function(user_id)
		{
			return $http({
				method: 'GET',
				url: ApiEndpoint.rest+'/passaggio/'+id+'/'
			}).then(function successCallback(response) {
				return response.data;
			}, function errorCallback(response) {
				console.log(response);
				return false;
			});
		},
		myTravels: function(user_id)
		{
			console.log(ApiEndpoint.rest+'/miei-passaggi/'+user_id+'/');
			return $http({
				method: 'GET',
				url: ApiEndpoint.rest+'/miei-passaggi/'+user_id+'/'
			}).then(function successCallback(response) {
				console.log(response);
				return response.data;
			}, function errorCallback(response) {
				console.log(response);
				return false;
			});
		},
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
