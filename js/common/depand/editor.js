$Import('kit.extra.require');
STK.register('common.depand.editor', function($){
	var rm = $.kit.extra.require;
	rm.register('asyn_music', ['common.bubble.music'], {'activeLoad': true});
	rm.register('asyn_video', ['common.bubble.video'], {'activeLoad': true});
	rm.register('asyn_vote', ['common.bubble.vote'], {'activeLoad': true});
	rm.register('asyn_sandbox', ['common.bubble.sandbox'], {'activeLoad': true});
	return rm;
});