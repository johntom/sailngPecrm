//'use strict';
angular.module('models.fund', ['lodash', 'services', 'ngSails'])

    .service('FundModel', function($q, lodash, utils, $sails) {

        this.getAll = function() {
            var deferred = $q.defer();
            var url = utils.prepareUrl('fund');

            $sails.get(url, function(models) {
                return deferred.resolve(models);
            });

            return deferred.promise;
        };

        this.create = function(newModel) {
            console.log('mode ',newModel)
            var deferred = $q.defer();
            var url = utils.prepareUrl('fund');


            $sails.post(url, newModel, function(model) {
                return deferred.resolve(model);
            });

            return deferred.promise;
        };

        this.delete = function(model) {
            var deferred = $q.defer();
            var url = utils.prepareUrl('fund/' + model.id);

            $sails.delete(url, function(model) {
                return deferred.resolve(model);
            });

            return deferred.promise;
        };
    });
