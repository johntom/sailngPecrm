//angular.module( 'sailng.funds', [
//])
//
//    .config(function config( $stateProvider ) {
//        $stateProvider.state( 'funds', {
//            url: '/funds',
//            views: {
//                "main": {
//                    controller: 'FundCtrl',
//                    templateUrl: 'funds/index.tpl.html'
//                }
//            },
//            data:{ pageTitle: 'Fund' }
//        });
//    })
//.controller( 'FundCtrl', function FundController( $scope, $sails, lodash, config,titleService, FundModel,$filter, ngTableParams  ) {
angular.module( 'sailng.funds', [
])

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'funds', {
            url: '/funds',
            views: {
                "main": {
                    controller: 'FundCtrl',
                    templateUrl: 'funds/index.tpl.html'
                }
            },
            data:{ pageTitle: 'Fund' }
        });
    })
    .controller( 'FundCtrl', function FundController( $scope, $sails, lodash, config, titleService, FundModel,$filter, ngTableParams ) {



        console.log('FundCtrl envelope.verb', FundModel)
        //    titleService.setTitle('Messages');
        $scope.newFund = {};
        $scope.funds = [];
        $scope.currentUser = config.currentUser;
        console.log('$scope.currentUser ', $scope.currentUser)
        $sails.on('fund', function (envelope) {
            //alert(envelope.verb)
            console.log('FundCtrl envelope.verb', envelope.verb)
            switch (envelope.verb) {
                case 'created':
                    $scope.funds.unshift(envelope.data);
                    break;
                case 'destroyed':
                    lodash.remove($scope.funds, {id: envelope.id});
                    break;
            }
        });

        $scope.destroyFund = function (fund) {
            FundModel.delete(todo).then(function (model) {
                // todo has been deleted, and removed from $scope.todos
            });
        };

        $scope.createTodo = function (newFund) {
            console.log('new ', newFund)
            newFund.user = config.currentUser.id;

            FundModel.create(newFund).then(function (model) {
                $scope.newFund = {};
            });
        };


        FundModel.getAll($scope).then(function (models) {
            console.log('models ', models)
            $scope.funds = models.data;
            var data = $scope.funds;
            console.log('data ', data)


            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25,          // count per page
                sorting: {
                    //  comboday: 'asc'     // initial sorting
                    title: 'asc',
                    isComplete: 'asc'
                }
            }, {
                // groupBy: 'comboday',
                total: data.length,
                getData: function ($defer, params) {
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

