//'use strict';

angular.module('models.contact', ['lodash', 'services', 'ngSails'])

    .service('ContactModel', function($q, lodash, utils, $sails) {
        this.getAll = function() {
            var deferred = $q.defer();
            var url = utils.prepareUrl('contact');

            $sails.get(url, function(models) {
                return deferred.resolve(models);
            });

            return deferred.promise;
        };

        this.create = function(newModel) {
            console.log('mode ',newModel)
            var deferred = $q.defer();
            var url = utils.prepareUrl('contact');


            $sails.post(url, newModel, function(model) {
                return deferred.resolve(model);
            });

            return deferred.promise;
        };

        this.delete = function(model) {
            var deferred = $q.defer();
            var url = utils.prepareUrl('contact/' + model.id);

            $sails.delete(url, function(model) {
                return deferred.resolve(model);
            });

            return deferred.promise;
        };
    });
