Router.route('/', function () {
    this.render('main');
});

Router.route('/webhooks/tasks', { where: 'server' })
    .get(function () {
        var self = this;
        Meteor.call('getTasks', self.request.body, function(err, val) {
            self.response.end(val + "\n");
        });
    })
    .post(function () {
        var self = this;
        Meteor.call('webhookAddNewTask', self.request.body, function(err, val) {
            self.response.end(val + "\n");
        });
    })
    .put(function () {
        // PUT /webhooks/stripe
     });
