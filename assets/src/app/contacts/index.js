angular.module( 'sailng.contacts', [
])
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'contacts', {
            url: '/contacts',
            views: {
                "main": {
                    controller: 'ContactCtrl',
                    templateUrl: 'contacts/index.tpl.html'
                }
            },
            data:{ pageTitle: 'Contact' }
        });
    })
    .controller( 'ContactCtrl', function ContactController( $scope, $sails, lodash, config, titleService, ContactModel,$filter, ngTableParams ) {

        $scope.newContact = {};
        $scope.contacts = [];
        $scope.currentUser = config.currentUser;
        console.log('$scope.currentUser ',$scope.currentUser)
        $sails.on('contact', function (envelope) {
            //alert(envelope.verb)
            console.log('ContactCtrl envelope.verb'  ,  envelope.verb)
            switch(envelope.verb) {
                case 'created':
                    $scope.contacts.unshift(envelope.data);
                    break;
                case 'destroyed':
                    lodash.remove($scope.contacts, {id: envelope.id});
                    break;
            }
        });

        $scope.destroyContact = function(contact) {
            ContactModel.delete(contact).then(function(model) {
                // todo has been deleted, and removed from $scope.todos
            });
        };

        $scope.createContact = function(newContact) {
            console.log('new ',newContact)
            newContact.user = config.currentUser.id;
            ContactModel.create(newContact).then(function(model) {
                $scope.newContact = {};
            });
        };

        //ContactModel.getAll($scope).then(function(models) {
        ContactModel.find($scope).then(function(models) {
            console.log('models '  , models.length,  models)

            $scope.contacts = models;//.data;
            var data =$scope.contacts;

            console.log('data ',data.length)
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25,          // count per page
                sorting: {
                    //  comboday: 'asc'     // initial sorting
                    Company: 'asc',
                    Contact:'asc'
                }
            }, {
                // groupBy: 'comboday',
                total: data.length,
                getData: function($defer, params) {
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });


    });

