
Meteor.startup(function() {
    Meteor.subscribe('tasks', function() {
        refreshBG();
    });
    Meteor.subscribe('tags', function() { });
    Meteor.subscribe('associations', function() { });
    Meteor.subscribe('people', function() { });
    Session.set('query', '');
    Session.set('show_complete', true);
    lastChunk = '';
});


refreshBG = function() {
    $('body, html').css({
        'background-color': scaleGoodnessColor(0, Tasks.find().count(), Tasks.find({
            due: {
                $lt: moment().add(1, 'd').toDate(),
                $ne: undefined
            },
            complete: undefined
        }).count())
    });
};

Template.add_new.events({
    'keyup input.add-new': function(ev) {
        if (ev.keyCode == 13) {
            !!ev.target.value ? Meteor.call('addNewTask', ev.target.value, function() {
                $(ev.target).val('');
            }) : 1;
        }
    },

    'keyup input.search': function(ev) {
        Session.set('query', ev.target.value.trim());
        if (ev.keyCode == 13) {
            _selectFirstItem();
            $(ev.target).blur();
        }
    },

    'keyup input': function(ev) {
        if (ev.target.value.slice(-1) == ' ') {
            $('.suggestions-container').fadeOut();
            return;
        }
        lastChunk = ev.target.value.trim().split(' ').slice(-1)[0];
        if (lastChunk[0] == '#') {
            possibleTags = Tags.find({
                text: {
                    $regex: lastChunk + '.*',
                    $options: 'i'
                }},
                {
                    sort: {
                        text: 1
                }
            }).fetch();
            Session.set('suggestions', possibleTags);
            $('.suggestions-container').fadeIn();
        } else if (lastChunk[0] == '@') {
            possiblePeople = People.find({
                text: {
                    $regex: lastChunk + '.*',
                    $options: 'i'
                }}, {
                sort: {
                    text: 1
                }
            }).fetch();
            Session.set('suggestions', possiblePeople);
            $('.suggestions-container').fadeIn();
        } else {
            Session.set('suggestions', []);
            $('.suggestions-container').fadeOut();
        }
    }
});

Template.add_new.helpers({
    suggestions: function() {
        return Session.get('suggestions');
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
        return this.complete ? moment(this.complete).format('ddd MMM DD, h:mmA') : this.due ? moment(this.due).format('ddd MMM DD, h:mmA') : '';
    },

    overdue: function() {
        if (!!this.complete) return 'done';
        if (!!this.waiting) return 'waiting';
        if (this.due < new Date()) return 'true';
        if (this.due - new Date() < 1000*3600*1.5) return 'very-soon';
        if (this.due - new Date() < 1000*3600*24) return 'soon';
        return 'nope';
    },

    task_association_people: function() {
        var asscs = Associations.find({
            task: this._id,
            person: {$ne: undefined}
        }).fetch();

        var people = People.find({
            _id: {$in: _(asscs).pluck('person') }
        });

        return people;
    },
});


Template.show_task_row.rendered = function() {
    $('.ctag').each(function() {
        this.style.backgroundColor = stringToCSSRGB(this.innerText);
    });
};

Template.show_task_row.events({
    'click .title': function(ev, target) {
        $(ev.target).parent().find('.collapser').collapse('toggle');
        $selectedItem = $(target.firstNode);
        $('.selected').removeClass('selected');
        $selectedItem.addClass('selected');
    },

    'click .delete-task': function() {
        Meteor.call('deleteTask', this._id);
        refreshBG();
    },

    'click .one-day': function() {
        Meteor.call('setDueDate', this._id, moment().add(1, 'd').toDate());
        refreshBG();
    },
    'click .two-days': function() {
        Meteor.call('setDueDate', this._id, moment().add(2, 'd').toDate());
        refreshBG();
    },
    'click .five-days': function() {
        Meteor.call('setDueDate', this._id, moment().add(5, 'd').toDate());
        refreshBG();
    },
    'click .one-hour': function() {
        Meteor.call('setDueDate', this._id, moment().add(1, 'h').toDate());
        refreshBG();
    },
    'click .two-hours': function() {
        Meteor.call('setDueDate', this._id, moment().add(2, 'h').toDate());
        refreshBG();
    },
    'click .five-hours': function() {
        Meteor.call('setDueDate', this._id, moment().add(5, 'h').toDate());
        refreshBG();
    },

    'blur .duedate': function(ev) {
        Meteor.call('setDueDate', this._id, new Date($(ev.target).val()));
        refreshBG();
    },

    'click .complete-indicator': function() {
        Meteor.call('completeTask', this._id);
        refreshBG();
    },

    'click .ctag': function(ev) {
        $('.search').val('#' + ev.target.innerText).keyup();
    },

    'blur .task-description': function(ev) {
        Meteor.call('updateDescription', this._id, $(ev.target).html(), function() {
            ev.target.innerHTML = '';
        });
    }
});

Template.person_contact_sheet.helpers({
    primary_email: function() {
        return this.contact.email;
    },
    primary_phone: function() {
        return this.contact.phone;
    }
});


Template.person_contact_sheet.events = {
    'keyup .email-input': function(ev) {
        if (ev.keyCode == 13) {
            Meteor.call('setPersonEmail', this._id, ev.target.value);
        }
    },
    'keyup .phone-input': function(ev) {
        if (ev.keyCode == 13) {
            Meteor.call('setPersonPhone', this._id, ev.target.value);
        }
    }
}
