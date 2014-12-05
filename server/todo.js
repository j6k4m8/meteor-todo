Meteor.publish('tasks', function() {
    return Tasks.find()
});

Meteor.publish('tags', function() {
    return Tags.find()
});

Meteor.publish('people', function() {
    return People.find()
});


Meteor.methods({
    addNewTask: function(rawText) {
        var text = rawText;
        var tags = rawText.match(/#\w+/g);
        var people = rawText.match(/@\w+/g);

        var newTask = Tasks.insert({
            text: text,
            parent: undefined,
            due: undefined,
            complete: undefined,
            created: new Date(),
            description: ''
        });

        console.log(tags);
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
                    text: i
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
    }
})
