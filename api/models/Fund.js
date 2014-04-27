/**
 * Fund
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {

        /* e.g.
         nickname: 'string'
         */

    },
//  attributes: {
//
//      CommitAmt: {
//          type: 'string',
//          required: true
//      },
//      CommitDistributionAmt: {
//          type: 'string'
//      },
//
//      CommitLPAmt: {
//          type: 'string',
//          required: true
//      },
//      FundAmt: {
//          type: 'string',
//          defaultsTo: false
//      },
//      FundName: {
//          type: 'string',
//          required: true
//      },
//      ID: {
//          type: 'integer'
//      },
//      details: {
//          type: 'array'
//      }
//
//  },
//    afterCreate: function (todo, next) {
//        // set message.user = to appropriate user model
//        User.getOne(todo.user)
//            .spread(function(user) {
//                todo.user = user;
//                next(null, todo);
//            });
//    },
//
    getAll: function() {
        return Fund.find()

          //  .populate('user')
            .then(function (models) {
                return [models];
            });
    }
//    getOne: function(id) {
//        return Todo.findOne(id)
//            .populate('user')
//            .then(function (model) {
//                // you have the option to do something with the model here if needed, before returning it to the controller
//                return [model];
//            });
//    }

};