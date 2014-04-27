angular.module( 'sailng.deals', [
])

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'deals', {
            url: '/deals',
            views: {
                "main": {
                    controller: 'DealCtrl',
                    templateUrl: 'deals/index.tpl.html'
                }
            },
            data:{ pageTitle: 'Deal' }
        });
    })
    .controller( 'DealCtrl', function DealController( $scope, $sails, lodash, config, titleService, DealModel,$filter, ngTableParams ) {

    //    titleService.setTitle('Messages');
    $scope.newDeal = {};
	$scope.deals = [];
	$scope.currentUser = config.currentUser;
    console.log('$scope.currentUser ',$scope.currentUser)
	$sails.on('deal', function (envelope) {
        //alert(envelope.verb)
        console.log('DealCtrl envelope.verb'  ,  envelope.verb)
		switch(envelope.verb) {
			case 'created':
				$scope.deals.unshift(envelope.data);
				break;
			case 'destroyed':
				lodash.remove($scope.deals, {id: envelope.id});
				break;
		}
	});

	$scope.destroyTodo = function(todo) {
		DealModel.delete(deal).then(function(model) {
			// todo has been deleted, and removed from $scope.todos
		});
	};

	$scope.createTodo = function(newDeal) {
        console.log('new ',newDeal)
        newDeal.user = config.currentUser.id;

        DealModel.create(newDeal).then(function(model) {
			$scope.newDeal = {};
		});
	};

        //DealModel.getAll($scope).then(function(models) {
            DealModel.find($scope).then(function(models) {
                console.log('models ',models.length)
            $scope.deals = models;//.data;
            var data =$scope.deals;
            console.log('data ',data)


            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25,          // count per page
                sorting: {
                    //  comboday: 'asc'     // initial sorting
                    DedalName: 'asc',
                    Used:'asc'
                }
                }, {
               // groupBy: 'comboday',
                total: data.length,
                getData: function($defer, params) {
                    //                    $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    //                }
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
        });
        });


});

