module.exports = {
	getAll: function(req, res) {
		User.getAll()
		.spread(function(models) {
                console.log('in getAll user', models)

                res.json(models);
		})
		.fail(function(err) {
			// An error occured
		});
	},

	getOne: function(req, res) {
        console.log('in getOne user', req.param('id'))
		User.getOne(req.param('id'))
		.spread(function(model) {
                console.log('in getOne user', model)
			res.json(model);
		})
		.fail(function(err) {
			// res.send(404);
		});
	},

	create: function (req, res) {
		var model = {
			username: req.param('username'),
			email: req.param('email'),
			first_name: req.param('first_name')
		};

		User.create(model)
		.exec(function(err, model) {
			if (err) {
				return console.log(err);
			}
			else {
				User.publishCreate(model.toJSON());
				res.json(model);
			}
		});
	}
};