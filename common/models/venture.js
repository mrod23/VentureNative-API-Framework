module.exports = function(Venture) {



  Venture.afterCreate = function (next) {
    var app = require('../../server/server');
    var container = app.models.Container;

    var self = this;
    container.createContainer({
      name: 'venture' + "-" + self.id
    }, next);


  };

};
