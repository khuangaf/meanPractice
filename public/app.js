var mainApplicationModuleName = 'mean';

var application = angular.module(mainApplicationModuleName, ['facebookUtils'])
.constant('facebookConfigSettings', {
    'appID' : '156540548165234'
  });

// angular.element(document)ready(function() {
// 	angular.bootstrap(document,
// 		[mainApplicationModuleName]); 
// });


