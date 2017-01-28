application.factory('facebookService', function($q) {
    return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: ['last_name','first_name','id']
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                	console.log(response);
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        getMyFirstName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'gender'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                	console.log(response);
                    deferred.resolve(response);
                }
            });
            console.log('first');
            return deferred.promise;
        },
        isConnected: function(){
            var res;
            FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                res = true;
                
              } else {
                res = false;
                // the user isn't logged in to Facebook.
              }
             });
            return res;
        }
        
    }
});