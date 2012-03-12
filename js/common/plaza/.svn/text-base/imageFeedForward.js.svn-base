/**
 * @author liusong@staff.sina.com.cn
 */
$Import('common.dialog.forward');
STK.register('common.plaza.imageFeedForward', function($) {
	var cache = {}, mid;
	var FTEXT = $.kit.extra.language("#L{转发}"), forwardNode;
	var forwardDialog = $.common.dialog.forward({
			styleId: 1
	});
	$.custEvent.add(forwardDialog, "forward", function(evt, data) {
		if(!forwardNode || !data.isToMiniBlog || data.getAttribute('node-type')) return;
		var count = forwardNode.innerHTML.match(/\(([\d]*)\)/);
		forwardNode.innerHTML = FTEXT + '<span class="icon_fav"></span>('+ (count ? parseInt(count[1]) + 1 : 1) +')';
		forwardNode = undefined;
	});
	$.custEvent.add(forwardDialog, "hide", function() {
		forwardNode = undefined;
	});
	return function(oNode, oData) {
		mid = oData.mid;
		if (forwardNode || !mid) return;
		forwardNode = oNode;
		forwardDialog.show(mid, oData);
	};
});


