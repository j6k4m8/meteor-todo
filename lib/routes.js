Router.route('/', function () {
    this.render('main');
});

Router.route('/api/tasks/get', { where: 'server' })
    .post(function() {
        var self = this;
        Meteor.call('getTasks', self.request.body, function(err, val) {
            self.response.end( val + '\n');
        });
    });

Router.route('/api/tasks/new', { where: 'server' })
    .post(function () {
        var self = this;
        Meteor.call('webhookAddNewTask', self.request.body, function(err, val) {
            self.response.end(val + "\n");
        });
    });
