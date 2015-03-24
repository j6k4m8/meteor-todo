inputFocus = function() {
    return !!document.activeElement && $(document.activeElement).is('input');
}

Mousetrap.bind('j', function() {
    if (!inputFocus()) {
        selectNextItem();
    }
});
Mousetrap.bind('k', function() {
    if (!inputFocus()) {
        selectPreviousItem();
    }
});


Mousetrap.bind(['v', 'return'], function() {
    if (!inputFocus()) {
        expandCurrentItem();
    }
});
Mousetrap.bind('V', function() {
    if (!inputFocus()) {
        contractCurrentItem();
    }
});


Mousetrap.bind('#', function() {
    if (!inputFocus()) {
        deleteCurrentItem();
    }
});
Mousetrap.bind('ctrl+enter', function() {
    if (!inputFocus()) {
        completeCurrentItem();
    }
});


Mousetrap.bind(['n', 'c'], function(e) {
    if (!inputFocus()) {
        focusAddNewInput(e);
    }
});
Mousetrap.bind('/', function(e) {
    if (!inputFocus()) {
        focusQueryInput(e);
    }
});


Mousetrap.bind('*', function(e) {
    if (!inputFocus()) {
        toggleCompleteVisible();
    }
});


Mousetrap.bind('|', function(e) {
    if (!inputFocus()) {
        archiveCompleted();
    }
});
Mousetrap.bind('?', function(e) {
    if (!inputFocus()) {
        toggleQuestionMarkPopover();
    }
});

Mousetrap.bind('tab', function(e) {
    if (inputFocus()) {
        var $active = $(document.activeElement),
            val = $active.val();

        if (val.trim() == '') return true;

        e.preventDefault();

        val = val.trim().split(' ').slice(0, -1).join(' ');
        $active.val(val + ' ' + Session.get('suggestions')[0].text + ' ');
    }
});

Mousetrap.bind('esc', function(e) {
    if (inputFocus()) {
    } else {
        $('.qm-pop').fadeOut();
    }
});


Mousetrap.bind(':', function(e) {
    if (!inputFocus()) {
        showCommandBar();
    }
});


// Individual tasks:

Mousetrap.bind('e d', function() {
    if (!inputFocus()) {
        $selectedItem.find('.description-text').focus();
    }
});

Mousetrap.bind('e w', function() {
    if (!inputFocus()) {
        Meteor.call('toggleWaiting', $selectedItem.data('id'));
    }
});

Mousetrap.bind('m t', function() {
    if (!inputFocus()) {
        Meteor.call('setDueDate', $selectedItem.data('id'), moment().add(2, 'h').toDate());
        refreshBG();
    }
});
