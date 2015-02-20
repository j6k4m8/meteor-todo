Meteor.methods({
    'webhookAddNewTask': function(params) {
        console.log(params);
        if (!params.key) return "No API key specified.";
        if (!params.text) return "No text specified.";

        if (APIKeys.findOne({key: params.key})) {
            return Meteor.call('addNewTask', params.text, function(err, val) {
                if (val) {
                    return "" + val;
                } else {
                    return "Unknown error.";
                }
            });
        } else {
            return "Insufficient API rights.";
        }
    },
    'getTasks': function(params) {
        if (!params.key) return "No API key specified.";
        if (APIKeys.findOne({key: params.key})) {
            return JSON.stringify(Tasks.find().fetch());
        } else {
            return "[]";
        }
    }
});
