SyncedCron.add({
    name: 'Send notifications to Pushbullet',
    schedule: function(parser) {
    // parser is a later.parse object
        return parser.text('every 2 hours');
    }, 
    job: function() {
      console.log('Test'); 
    }
});

SyncedCron.start();
