application.controller('MainController', ['$scope', '$http', 'facebookService',function($scope, $http, facebookService){
	$scope.abc = "abc";
	$scope.title = "I am awesome";
	console.log('abc');
	$http.get('/api')
	.success(function(data){
		console.log('success');
		$scope.data = data;
		
		$scope.data.forEach( function (element){
			// console.log(element);
		});
	});
	$scope.getMyLastName = function(callback) {
	   facebookService.getMyLastName() 
	     .then(function(response) {
	       $scope.last_name = response.last_name;
	       $scope.first_name = response.first_name;
	       $scope.id = response.id;
	       var url = 'http://graph.facebook.com/' + $scope.id + '/picture?type=large';
	       $scope.photo = url;
	     }
	   );
	   callback();
	};
	$scope.getMyFirstName = function() {
	   facebookService.getMyFirstName() 
	     .then(function(response) {
	       $scope.last_name = response.firstname;
	     }
	   );
	};
	$scope.getPhoto = function() {
	   $http.get('http://graph.facebook.com/1490175794333581/picture?type=large')
	   .success(function(photo){
		console.log('success');
		console.log(photo);
		$scope.photo = 'http://graph.facebook.com/1490175794333581/picture?type=large';
		});
	};

	$scope.storeData = function(){
		alert("ff");
		console.log("abc");
		$scope.getMyLastName(function(){
			console.log($scope.last_name)
			var data  = {lName: $scope.last_name, fName: $scope.first_name, id: $scope.id};
			$http.post('/store',data)
			.success(function(data) {
	            // console.log(data);
	        });	
		});
		$scope.connected = facebookService.isConnected();
		console.log($scope.connected);
	};

	$scope.submit = function(){
		console.log()
	}
	
	$scope.fbLogout = function(){
		FB.getLoginStatus(function(response) {
        if (response && response.status === 'connected') {
            FB.logout(function(response) {
                document.location.reload();
            });
        }
    });
	}

}]);