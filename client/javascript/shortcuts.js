Mousetrap.bind('j', function() { selectNextItem(); });
Mousetrap.bind('k', function() { selectPreviousItem(); });

Mousetrap.bind('v', function() { expandCurrentItem(); });
Mousetrap.bind('V', function() { contractCurrentItem(); });


Mousetrap.bind('#', function() { deleteCurrentItem(); });
Mousetrap.bind('ctrl+enter', function() { completeCurrentItem(); });

Mousetrap.bind(['n', 'c'], function(e) { focusAddNewInput(e); });
Mousetrap.bind('?', function(e) { focusQueryInput(e); });


Mousetrap.bind('*', function(e) { toggleCompleteVisible(); });


Mousetrap.bind('|', function(e) { archiveCompleted(); });



