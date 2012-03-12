$Import('kit.extra.require');
STK.register('common.depand.tasks', function($){
	var rm = $.kit.extra.require;
	rm.register('panel', ['comp.tasks.panel'], {'activeLoad': false});
	rm.register('comment', ['comp.tasks.comment'], {'activeLoad': false});
	rm.register('invite', ['comp.tasks.invite'], {'activeLoad': false});
	rm.register('follow', ['comp.tasks.follow'], {'activeLoad': false});
	rm.register('publisher', ['comp.tasks.publisher'], {'activeLoad': false});
	return rm;
});