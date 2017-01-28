window.fbAsyncInit = function() {
	    FB.init({
	      appId      : '156540548165234',
	      xfbml      : true,
	      cookie: true, 
      	  xfbml: true,
	      version    : 'v2.8'
	    });
	    FB.Event.subscribe('auth.login', function (response) {
		  	var scope = angular.element(document.getElementById('MainWrap')).scope();
		  	console.log(scope);
		  	scope.storeData();
		  
		});	  
	  };

	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/en_US/sdk.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));

