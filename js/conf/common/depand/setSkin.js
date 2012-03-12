$Import('kit.extra.require');
STK.register('common.depand.setSkin', function($){
	var rm = $.kit.extra.require;
	rm.register('asyn_skinManager', ['common.skin.skinManager'], {'activeLoad': true});
	return rm;
});