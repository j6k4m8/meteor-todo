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

Mousetrap.bind('v', function() {
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
        e.preventDefault();

        var $active = $(document.activeElement),
            val = $active.val();

        val = val.trim().split(' ').slice(0, -1).join(' ');

        $active.val(val + ' ' + Session.get('suggestions')[0].text);
    }
});



