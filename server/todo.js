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
    return chrono.parseDate(due);
};


Meteor.methods({
    addNewTask: function(rawText) {
        var text = rawText;
        rawText = " " + rawText;
        var tags = rawText.match(/\s#\w+/g);
        var people = rawText.match(/\s@\w+/g);
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
                    text: i,
                    color: stringToCSSRGB(text)
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
                    contact: {},
                    color: stringToCSSRGB(text)
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

    updateTitle: function(taskId, title) {
        Tasks.update(taskId, {
            $set: {
                text: title
            }
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
    },
    setPersonPhone: function(personId, personEmail) {
        People.update(personId, {
            $set: { 'contact.phone': personEmail }
        });
    },
    setPersonFacebook: function(personId, personFacebook) {
        People.update(personId, {
            $set: { 'contact.facebook': personFacebook }
        });
    }
})
