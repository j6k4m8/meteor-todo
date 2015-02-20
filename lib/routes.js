Router.route('/', function () {
    this.render('main');
});

Router.route('/webhooks/tasks', { where: 'server' })
    .get(function () {
        // GET /webhooks/stripe
    })
    .post(function () {
        console.log(this.request.body);
        var self = this;
        Meteor.call('webhookAddNewTask', self.request.body, function(err, val) {
            self.response.end(val);       
        });
    })
    .put(function () {
        // PUT /webhooks/stripe
     });
