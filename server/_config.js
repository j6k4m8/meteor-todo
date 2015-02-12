getNextNTasks = function(n) {
    return Tasks.find({}, {sort: {'due': 1}}).fetch().slice(0, n);
};

getTasksInNextNHours = function(n) {
    return Tasks.find({
        due: {$lt: new Date((new Date())*1 + (n*1000*60*60))}
    }).fetch();
};

if (Meteor.settings.PUSHBULLET_API_KEY) {
    SyncedCron.add({
        name: 'Send notifications to Pushbullet',
        schedule: function(parser) {
            return parser.text('every 6 hours'); 
        }, 
        job: function() {
            var tasks = getTasksInNextNHours(6);
            pushbullet({
                "type":  "note",
                "title": "todo",
                "body":  _(tasks).pluck('text').join('\n')
            });
        }
    });
}
SyncedCron.start();
