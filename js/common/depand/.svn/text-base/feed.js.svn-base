$Import('kit.extra.require');
STK.register('common.depand.feed', function($){
	var rm = $.kit.extra.require;
	rm.register('asyn_forward', ['common.dialog.forward'], {'activeLoad': true});
	rm.register('asyn_comment', ['common.comment.comment'], {'activeLoad': true});
	rm.register('asyn_addtag', ['common.dialog.addTag'], {'activeLoad': true});
	
	rm.register('external_group4weibo_groupsfeed', [$CONFIG['jsPath'] + 'apps/group4weibo/js/feed.js?version=' + $CONFIG['version']], {'activeLoad': true});
	rm.register('external_chosen_groupsfeed', [$CONFIG['jsPath'] + 'apps/chosen/js/apps/chosen/home/homeChosen.js?version=' + $CONFIG['version']], {'activeLoad': true});
	
	rm.register('asyn_commentDialogue_tip', ['common.dialog.commentDialogueTip'], {'activeLoad': true});
	return rm;
});