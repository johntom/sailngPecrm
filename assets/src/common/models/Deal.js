//'use strict';

angular.module('models.deal', ['lodash', 'services', 'ngSails'])

    .service('DealModel', function($q, lodash, utils, $sails) {
// use blueprints
        this.find = function() {
            var deferred = $q.defer();
            //var url = utils.prepareUrl('deal');
            var url = '/deals';
            console.log('url ;',url)
            $sails.get(url, function(models) {
                return deferred.resolve(models);
            });

            return deferred.promise;
        };


        this.getAll = function() {
            var deferred = $q.defer();
            var url = utils.prepareUrl('deal');

            $sails.get(url, function(models) {
                return deferred.resolve(models);
            });

            return deferred.promise;
        };

        this.create = function(newModel) {
            console.log('mode ',newModel)
            var deferred = $q.defer();
            var url = utils.prepareUrl('deal');


            $sails.post(url, newModel, function(model) {
                return deferred.resolve(model);
            });

            return deferred.promise;
        };

        this.delete = function(model) {
            var deferred = $q.defer();
            var url = utils.prepareUrl('deal/' + model.id);

            $sails.delete(url, function(model) {
                return deferred.resolve(model);
            });

            return deferred.promise;
        };
    });
