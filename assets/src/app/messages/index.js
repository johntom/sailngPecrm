angular.module( 'sailng.messages', [
])

    .config(function config( $stateProvider ) {
        $stateProvider.state( 'messages', {
            url: '/messages',
            views: {
                "main": {
                    controller: 'MessagesCtrl',
                    templateUrl: 'messages/index.tpl.html'
                }
            }
        });
    })

    .controller( 'MessagesCtrl', function MessagesController( $scope, $sails, lodash, config, titleService, MessageModel,$filter, ngTableParams ) {
        titleService.setTitle('Messages');
        $scope.newMessage = {};
        $scope.messages = [];
        $scope.currentUser = config.currentUser;
        console.log('scope.currentUser.data:: ', $scope.currentUser)

        $sails.on('message', function (envelope) {
//            console.log('in envelope  ',envelope)
//            console.log('in MessagesCtrl sailson ',envelope.verb)
            switch(envelope.verb) {
                case 'created':
                    $scope.messages.unshift(envelope.data);
                    console.log('envelope.data:: ',envelope.data.comoboday, envelope.data)
                    $scope.tableParams.data=  $scope.messages;
                    $scope.tableParams.reload();
                    //               if( $scope.tableParams.settings().groupBy === 'comboday')
                    //               { $scope.tableParams.settings().groupBy = 'title';
                    //               } else $scope.tableParams.settings().groupBy = 'comboday';// this works

                    break;
                case 'destroyed':
                    lodash.remove($scope.messages, {id: envelope.id});
                    $scope.tableParams.data=  $scope.messages;
                    $scope.tableParams.reload();
                    break;
                case 'updated': //
                    //lodash.remove($scope.messages, {id: envelope.id});
                    console.log('in MessagesCtrl updated ',envelope.status,envelope.id,envelope)

                 //   lodash.update($scope.messages, {id: envelope.id});

                    for (var i in $scope.messages) {
                        if ($scope.messages[i].id == envelope.id) {
                            $scope.messages[i].status = envelope.data.status;
                        }
                    }
                    $scope.tableParams.data=  $scope.messages;
                    $scope.tableParams.reload();
                    break;
            }
        });

        $scope.destroyMessage = function(message) {
            // check here if this message belongs to the currentUser
            if (message.user.id === config.currentUser.id) {
                MessageModel.delete(message).then(function(model) {
                    // message has been deleted, and removed from $scope.messages
                });
            }
        };
        $scope.fetchMessage = function(message) {
            // check here if this message belongs to the currentUser
            if (message.user.id === config.currentUser.id) {
                message.status=2;
                MessageModel.update(message).then(function(model) {
                    // message has been deleted, and removed from $scope.messages
                });
            }
        };
        $scope.fetchedMessage = function(message) {
            // check here if this message belongs to the currentUser
            if (message.user.id === config.currentUser.id) {
                message.status=3;
                MessageModel.update(message).then(function(model) {
                    // message has been deleted, and removed from $scope.messages
                });
            }
        };
        $scope.createMessage = function(newMessage) {
            newMessage.user = config.currentUser.id;
            newMessage.status=1;
            console.log ('createMessage:: ',newMessage.cdate ,newMessage)
            MessageModel.create(newMessage).then(function(model) {
                $scope.newMessage.title ='';

            });
        };
        // var   messPromise =  MessageModel.getAll($scope);
        // messPromise.then(function (models) {

        MessageModel.getAll($scope).then(function(models) {
            $scope.messages = models;
            var data =$scope.messages;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 25,          // count per page
                sorting: {
                  //  comboday: 'asc'     // initial sorting
                    cardate: 'asc'
                }
            }, {
                groupBy: 'comboday',//'cdate',//moment('cardate').format('MM/DD/YYYY'), //    'cardate',//'title',//'comboday', //cardate
                total: data.length,
                getData: function($defer, params) {
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, $scope.tableParams.orderBy()) :
                        data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

        $scope.today = function() {
            $scope.newMessage.cardate = new Date();
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.newMessage.cardate  = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = ( $scope.minDate ) ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        //$scope.format = $scope.formats[0];

        $scope.format = "EEE MM/dd/yyyy";

        $scope.newMessage.cartime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.newMessage.cartime  = d;
        };

        $scope.changed = function () {
            console.log('Time changed to: ' + $scope.newMessage.cartime );
        };

        $scope.clear = function() {
            $scope.newMessage.cartime  = null;
        };

        $scope.checkEvent = function(row) {
            //      $scope.selectedRow = row;
            alert('row '+row)
        };
        $scope.changeSelection = function(message) {
            console.info(message);
        }
    });