/**
 * FundController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
find:function(req,res)
{
  console.log('in find')
},

    getAll: function(req, res) {
        console.log('fund getall')
        Fund.getAll()
            .spread(function(models) {
                //console.log('socket ',req.socket.id);//req.socket)
              console.log('mo ',models)
                Fund.watch(req);
                //  Todo.watch(req.socket, models);
                //  Todo.subscribe(req.socket, models);
                //  Todo.subscribe(req.socket,models,['create','destroy','update']);
                Fund.subscribe(req.socket,models);
                console.log('User with socket id '+req.socket.id+' is now subscribed to all of the model instances in \'todos\'.',models);
//
//                //Todo.autosubscribe;
//                //res.json(models);
                res.json({data: models});
            })
            .fail(function(err) {
                // An error occured
            });
    },

    getOne: function(req, res) {
        Fund.getOne(req.param('id'))
            .spread(function(model) {
                Fund.subscribe(req.socket, model);
                res.json(model);
            })
            .fail(function(err) {
                res.send(404);
            });
    },

    create: function (req, res) {
        var userId = req.param('user');
        console.log('userID', userId);
        var model = {
            title: req.param('title'),
            user: userId
            //user: req.param('user')
        };

        // TODO: upon message creation, how to populate the user here, so the associated user gets sent back as a property of the message
        Fund.create(model)
            .exec(function(err, model) {
                if (err) {
                    return console.log(err);
                }
                else {
                    //console.log('in todo create')
                    console.log('User with socket id '+req.socket.id+' is now subscribed to all of the model create in \'todos\'.');
                    Fund.publishCreate(model);
                    res.json(model);
                }
            });
    },

    destroy: function (req, res) {
        var id = req.param('id');
        if (!id) {
            return res.badRequest('No id provided.');
        }

        // Otherwise, find and destroy the model in question
        Fund.findOne(id).exec(function(err, model) {
            if (err) {
                return res.serverError(err);
            }
            if (!model) {
                return res.notFound();
            }

            Fund.destroy(id, function(err) {
                if (err) {
                    return res.serverError(err);
                }
                console.log('User with socket id '+req.socket.id+' is now subscribed to all of the model instances in \'Todo destroy \'.',model.id);
                Fund.publishDestroy(model.id);
                return res.json(model);
            });
        });
    }

};


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to FundController)
   */
 // _config: {}

  
