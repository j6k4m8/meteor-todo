Meteor.publish('tasks', function() {
    return Tasks.find()
});

Meteor.publish('tags', function() {
    return Tags.find()
});

Meteor.publish('people', function() {
    return People.find()
});

Meteor.publish('associations', function() {
    return Associations.find()
});


getDueFromString = function(due) {
    if (!due) return undefined;
    if (Date.parse(due) > new Date()) return new Date(Date.parse(due));
    if (Date.parse((new Date()).getFullYear().toString() + due) > new Date()) {
        return new Date(Date.parse((new Date()).getFullYear().toString() + due))
    }
    if (due == 'today') return moment().add(2, 'h').toDate();
    if (due == 'tomorrow') return moment().add(1, 'd').toDate();
    if (due.split(' ').length < 2) {
        var date = new Date();
        date.setHours(due.split(':')[0]);
        date.setMinutes(due.split(':')[1]);
        return date;
    }
    return undefined;
    // if (moment(Date.parse(due)).add(12, 'h').toDate() > new Date()) return moment(Date.parse(due)).add(12, 'h').toDate();
};


Meteor.methods({
    addNewTask: function(rawText) {
        var text = rawText;
        var tags = rawText.match(/#\w+/g);
        var people = rawText.match(/@\w+/g);
        var rawDue = rawText.match(/`(.+)`/g);
        rawDue = !!rawDue && rawDue != [] ? rawDue[0].toString().slice(1, -1) : undefined;
        due = getDueFromString(rawDue);

        var newTask = Tasks.insert({
            text: text.replace(/`.*`/gi, ''),
            parent: undefined,
            due: due,
            complete: undefined,
            created: new Date(),
            description: due ? "Date parsed from: " + rawDue : '',
            waiting: false
        });

        _(tags).each(function(i) {
            var newTag = Tags.findOne({text: i});
            if (!newTag) {
                newTag = Tags.insert({
                    text: i
                });
            }

            Associations.insert({
                tag: newTag,
                task: newTask
            });
        })

        _(people).each(function(i) {
            var newPerson = People.findOne({text: i});
            if (!newPerson) {
                newPerson = People.insert({
                    text: i,
                    contact: {}
                });
            }

            Associations.insert({
                person: newPerson,
                task: newTask
            });
        })
    },

    deleteTask: function(taskId) {
        Tasks.remove(taskId);
        Associations.remove({
            task: taskId
        });
    },

    setDueDate: function(taskId, dueDate) {
        Tasks.update(taskId, {
            $set: {
                due: dueDate
            }
        });
    },

    completeTask: function(taskId) {
        var task = Tasks.findOne(taskId);
        Tasks.update(taskId, {
            $set: {
                complete: !!task.complete ? undefined : new Date()
            }
        });
    },

    archiveCompleted: function() {
        var completed = Tasks.find({
            complete: {$lt: new Date()}
        }).fetch();

        _(completed).each(function(task) {
            ArchivedTasks.insert(task);
            Tasks.remove(task._id);
        });
    },

    updateDescription: function(taskId, desc) {
        Tasks.update(taskId, {
            $set: {
                description: desc
            }
        });
    },

    toggleWaiting: function(taskId) {
        Tasks.update(taskId, {
            $set: {
                waiting: !Tasks.findOne(taskId).waiting
            }
        });
    },

    setPersonEmail: function(personId, personEmail) {
        People.update(personId, {
            $set: { 'contact.email': personEmail }
        });
    }
})
