angular.module('models.message', ['lodash', 'services', 'ngSails',])

.service('MessageModel', function($q, lodash, utils, $sails) {

        // use blueprints
        this.find = function() {
            var deferred = $q.defer();
            //var url = utils.prepareUrl('deal');
            var url = '/contacts';
            console.log('url ;',url)
            $sails.get(url, function(models) {
                return deferred.resolve(models);
            });

            return deferred.promise;
        };

	this.getAll = function() {
        console.log ('MessageModel ')
		var deferred = $q.defer();
		var url = utils.prepareUrl('message');
		$sails.get(url, function(models) {
			return deferred.resolve(models);
		});
		return deferred.promise;
	};

	this.create = function(newModel) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('message');
		$sails.post(url, newModel, function(model) {
			return deferred.resolve(model);
		});
		return deferred.promise;
	};

	this.delete = function(model) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('message/' + model.id);
		$sails.delete(url, function(model) {
			return deferred.resolve(model);
		});
		return deferred.promise;
	};

        this.update = function(modelu) {
            var deferred = $q.defer();
            var url = utils.prepareUrl('message');
            console.log ('modelu ',modelu);

            $sails.put(url, modelu, function(model) {
                console.log ('after ',modelu);

                return deferred.resolve(model);
            });

            return deferred.promise;
        };

});