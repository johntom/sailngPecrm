var _ = require('lodash');
var moment = require('moment');

module.exports = {
    getAll: function (req, res) {
//        var userId = req.param('user');
//        console.log('in start ',userId)
     console.log('user ',req.user);//user.id)
        if (req.user.role === 4) {
            console.log('all  ');//user.id)
            Message.getAll()
                .spread(function (models) {
                    //   console.log('socket ',req.socket.id);//req.socket)
                    Message.watch(req);
                    Message.subscribe(req.socket, models);//,'mess');

                    models.forEach(function (mess) {
                        mess.cdate = moment(mess.cardate).format("MM/DD/YYYY");
                        mess.cday = moment(mess.cardate).format("dddd");
                        mess.comboday = mess.cdate + ' ' + mess.cday;
                        // .sort({date:-1}) mess.comboday = moment(mess.cardate).format("MM/DD/YYYY")+' '+moment(mess.cardate).format("dddd");

                        mess.ctime = moment(mess.cardate).format("h:mm");
                    });
                    console.log('User with socket id ' + req.socket.id + ' is now subscribed to all of the model instances in \'messages\'.');
                    res.json(models);
                })
                .fail(function (err) {
                    // An error occured
                });
        } else {
            //  Po.find({ "VendorID": vendorid, "VendorInvNum": vendorinvno, "POID": { $ne: id}   })
    //var usr = "'"+req.user.id+"'";
    //            Message.find({"user":usr})
    //            var usr = "'"+req.user.id+"'";
//            Po.find({ "VendorID": vendorid, "VendorInvNum": vendorinvno, "POID": { $ne: id}   })
//
//                .exec(function (err, foundit) {
//                    var retVal;
//                    if (err) return next(err);
//                    if (foundit.length > 0) {
//                        retVal = true;
//                    } else {
//                        retVal = false;
//                    }
//                    console.log('PoController::find1Dup... ', foundit.length, retVal);
//                    res.json({ data: retVal });
//                });
            console.log('not admin..  ');//user.id)  +'534a94c661ba56e422e1f4a3'
            Message.find( {user:req.user.id} )
                .exec(function (err,models) {
                    console.log('not admin  ',models,req.user.id);//user.id)
                    //   console.log('socket ',req.socket.id);//req.socket)
//                    Message.watch(req);
//                    Message.subscribe(req.socket, models);//,'mess');
                    //console.log('models  ',models);
                    models.forEach(function (mess) {
                        mess.cdate = moment(mess.cardate).format("MM/DD/YYYY");
                        mess.cday = moment(mess.cardate).format("dddd");
                        mess.comboday = mess.cdate + ' ' + mess.cday;
                        // .sort({date:-1}) mess.comboday = moment(mess.cardate).format("MM/DD/YYYY")+' '+moment(mess.cardate).format("dddd");

                        mess.ctime = moment(mess.cardate).format("h:mm");
                    });
                    console.log('User with socket id ' + req.socket.id + ' is now subscribed to all of the model instances in \'messages\'.');

                    Message.watch(req);
                    Message.subscribe(req.socket, models);//,'mess');

                    res.json(models);
                })
//                .fail(function (err) {
//                    // An error occured
//                });
        }
    },

    getOne: function (req, res) {
        Message.getOne(req.param('id'))
            .spread(function (model) {
                Message.subscribe(req.socket, model);
                res.json(model);
            })
            .fail(function (err) {
                res.send(404);
            });
    },

    create: function (req, res) {
        var userId = req.param('user');
        var cardate = req.param('cardate');
        var cd1 = moment(cardate).format("MM/DD/YYYY");
        var cd2 = moment(cardate).format("dddd");
        var model = {
            title: req.param('title'),
            cardate: cardate,//req.param('cardate'),
            cartime: req.param('cartime'),
            cdate: cd1,
            comboday: cd1 + ' ' + cd2,
            status: req.param('status'),
            user: userId
            // , cars:req.param('cars')

        };
        console.log('in create', model)
        Message.create(model)
            .exec(function (err, message) {
                if (err) {
                    return console.log(err);
                }
                else {
                    Message.publishCreate(message);
                    res.json(message);
                }
            });
    },
    update: function (req, res, next) {
        console.log('in update', req.params.all())
        var id = req.param("id");
        var status = req.param("status");
        console.log('in update', status, id)
        if (status && req.isSocket) {
            Message.update(id, {status: status}).exec(function update(err, updated) {
                Message.publishUpdate(updated[0].id,{ status:updated[0].status });

            })
        }
        },
//                .exec(function (err, message) {
//                    if (err) {
//                        return console.log(err);
//                    }
//                    else {
//                        console.log('in publishUpdate', message)
//                        // This does not work
//                        // Message.publishUpdate(message.id, message) // Subscription
//                        // Calls.publishUpdate(call.id,{updatedId:call.id});
//                        // This does
//                        //    Message.publish(message, {updatedId: message.id});
//                        //                    Message.publish(message.id, {
//                        //                        id: message.id
//                        //                    });

        destroy: function (req, res) {
            var id = req.param('id');
            if (!id) {
                return res.badRequest('No id provided.');
            }

            // Otherwise, find and destroy the model in question
            Message.findOne(id).exec(function (err, model) {


                if (err) {
                    return res.serverError(err);
                }
                if (!model) {
                    return res.notFound();
                }

                Messageaudit.create(model)
                    .exec(function (err, message) {
                        if (err) {
                            return console.log(err);
                        }
                        else {

                        }
                    });
                Message.destroy(id, function (err) {
                    if (err) {
                        return res.serverError(err);
                    }

                    Message.publishDestroy(model.id);
                    return res.json(model);
                });
            });
        }

    };