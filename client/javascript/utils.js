$selectedItem = undefined;

_selectFirstItem = function() {
    $selectedItem = $($('.task-row')[0]);
    _refreshSelectView();
    return $selectedItem;
};

_selectLastItem = function() {
    $selectedItem = $($('.task-row').slice(-1)[0]);
    _refreshSelectView();
    return $selectedItem;
};

_refreshSelectView = function() {
    $('.selected').removeClass('selected');
    $selectedItem.addClass('selected');
};

selectNextItem = function() {
    $selectedItem = $selectedItem && !!$selectedItem.next()[0] ? $selectedItem.next() : _selectFirstItem();

    _refreshSelectView();
};

selectPreviousItem = function() {
    $selectedItem = $selectedItem && !!$selectedItem.prev()[0] ? $selectedItem.prev() : _selectLastItem();

    _refreshSelectView();
};

expandCurrentItem = function() {
    $selectedItem = $selectedItem || _selectFirstItem();
    $selectedItem.find('.collapser').collapse('show');
};

contractCurrentItem = function() {
    $selectedItem = $selectedItem || _selectFirstItem();
    $selectedItem.find('.collapser').collapse('hide');
};


deleteCurrentItem = function() {
    if ($selectedItem) {
        Meteor.call(Meteor.call('deleteTask', $selectedItem.data('id'), function() {
            selectNextItem();
        }));
    }
};

completeCurrentItem = function() {
    if ($selectedItem) {
        Meteor.call('completeTask', $selectedItem.data('id'));
    }
};

focusAddNewInput = function(e) {
    e.preventDefault();
    $('.add-new').focus().val('');
};

focusQueryInput = function(e) {
    e.preventDefault();
    $('.search').focus().val('');
};


toggleCompleteVisible = function() {
    Session.set('show_complete', !Session.get('show_complete'));
};

archiveCompleted = function() {
    console.log('calling');
    Meteor.call('archiveCompleted');
};
