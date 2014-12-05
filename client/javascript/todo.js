
Meteor.startup(function() {
    Meteor.subscribe('tasks', function() { });
    Session.set('query', '');
    Session.set('show_complete', true);
});


Template.add_new.events({
    'keyup input.add-new': function(ev) {
        if (ev.keyCode == 13) {
            !!ev.target.value ? Meteor.call('addNewTask', ev.target.value, function() {
                $(ev.target).val('').blur() ;
            }) : 1;
        }
    },

    'keyup input.search': function(ev) {
        Session.set('query', ev.target.value.trim());
        if (ev.keyCode == 13) {
            _selectFirstItem();
            $(ev.target).blur();
        }
    }
});

Template.list_tasks.helpers({
    tasks: function() {

        var sortOrder = {
            complete: 1,
            due: 1,
            created: -1
        };

        if (Session.get('query')) {
            return Tasks.find({
                text: {
                    $regex : ".*" + Session.get('query').split('').join('.*') + ".*",
                    $options: 'i'
                },
                complete: !Session.get('show_complete') ? {$not: undefined} : {$not: -1}
            }, {
                    sort: sortOrder
                });
        } else {
            return Tasks.find({
                complete: !Session.get('show_complete') ? {$not: undefined} : {$not: -1}
            }, {
                sort: sortOrder
            });
        }
    }
});



Template.show_task_row.helpers({
    text_html: function() {
        return this.text.replace(/#(\w+)/g,
            '<span class="ctag" data-tag="$1">$1</span>')
                        .replace(/@(\w+)/g,
            '<span class="ctag" data-tag="$1">$1</span>');
    },

    complete_to_class: function() {
        return this.complete != undefined ? 'check' : 'unchecked';
    },

    complete_to_bool: function() {
        return this.complete != undefined ? 'complete' : '';
    },

    complete_string: function() {
        return this.complete ? moment(this.complete).format('ddd MMM DD, h:mmA') : '';
    }
});


Template.show_task_row.rendered = function() {
    $('.ctag').each(function() {
        this.style.backgroundColor = stringToCSSRGB(this.innerText);
    })
};

Template.show_task_row.events({
    'click .title': function(ev) {
        $(ev.target).parent().find('.collapser').collapse('toggle');
    },

    'click .delete-task': function() {
        Meteor.call('deleteTask', this._id);
    },

    'click .one-day': function() {
        Meteor.call('setDueDate', this._id, moment().add(1, 'd').toDate())
    },
    'click .one-hour': function() {
        Meteor.call('setDueDate', this._id, moment().add(1, 'h').toDate())
    },

    'click .complete-indicator': function() {
        Meteor.call('completeTask', this._id)
    },

    'click .ctag': function(ev) {
        $('.search').val('#' + ev.target.innerText).keyup();
    },

    'blur .task-description': function(ev) {
        Meteor.call('updateDescription', this._id, $(ev.target).html(), function() {
            ev.target.innerHTML = '';
        });
    }
})
