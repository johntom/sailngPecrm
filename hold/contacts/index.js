angular.module( 'sailng.todos', [
])

.config(function config( $stateProvider ) {
	$stateProvider.state( 'todos', {
		url: '/todos',
		views: {
			"main": {
				controller: 'TodoCtrl',
				templateUrl: 'todos/index.tpl.html'
			}
		},
		data:{ pageTitle: 'Todo' }
	});
})
//    .controller( 'MessagesCtrl', function MessagesController( $scope, $sails, lodash, config, titleService, MessageModel,$filter, ngTableParams ) {
//        titleService.setTitle('Messages');
//        $scope.newMessage = {};
//        $scope.messages = [];
//        $scope.currentUser = config.currentUser;
//
//        $sails.on('message', function (envelope) {
.controller( 'TodoCtrl', function TodoController( $scope, $sails, lodash, config,titleService, TodoModel,$filter, ngTableParams  ) {

    //    titleService.setTitle('Messages');
    $scope.newTodo = {};
	$scope.todos = [];
	$scope.currentUser = config.currentUser;
    console.log('$scope.currentUser ',$scope.currentUser)
	$sails.on('message', function (envelope) {
        //alert(envelope.verb)
        console.log('TodoCtrl envelope.verb'  ,  envelope.verb)
		switch(envelope.verb) {
			case 'created':
				$scope.todos.unshift(envelope.data);
				break;
			case 'destroyed':
				lodash.remove($scope.todos, {id: envelope.id});
				break;
		}
	});

	$scope.destroyTodo = function(todo) {
		TodoModel.delete(todo).then(function(model) {
			// todo has been deleted, and removed from $scope.todos
		});
	};

	$scope.createTodo = function(newTodo) {
        console.log('new ',newTodo)
        newTodo.user = config.currentUser.id;

        TodoModel.create(newTodo).then(function(model) {
			$scope.newTodo = {};
		});
	};

//	TodoModel.getAll($scope).then(function(models) {
//        console.log('models '  ,  models)
//		$scope.todos = models.data;
//	});

        TodoModel.getAll($scope).then(function(models) {
            console.log('models '  ,  models)
            $scope.todos = models.data;
            var data =$scope.todos;
            console.log('data ',data)


            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25,          // count per page
                sorting: {
                    //  comboday: 'asc'     // initial sorting
                    title: 'asc',
                    isComplete:'asc'
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


//        MessageModel.getAll($scope).then(function(models) {
//            $scope.messages = models;
//            var data =$scope.messages;
//            $scope.tableParams = new ngTableParams({
//                page: 1,            // show first page
//                count: 25,          // count per page
//                sorting: {
//                    //  comboday: 'asc'     // initial sorting
//                    cardate: 'asc'
//                }
//            }, {
//                groupBy: 'comboday',//'cdate',//moment('cardate').format('MM/DD/YYYY'), //    'cardate',//'title',//'comboday', //cardate
//                total: data.length,
//                getData: function($defer, params) {
//                    var orderedData = params.sorting() ?
//                        $filter('orderBy')(data, $scope.tableParams.orderBy()) :
//                        data;
//
//                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
//                }
//            });
//        });



});

