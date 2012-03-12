/**
 * 评论对话蛋疼弹层提醒
 */
$Import("common.trans.versionTip");
$Import("common.guide.util.tipLayer");
$Import("module.layer");

STK.register('common.dialog.commentDialogueTip', function($){
		
	var tipLayer = $.common.guide.util.tipLayer(),
		cache = {
			'binded' : null
			,'node'  : null
			,'target': null
			,'tip'   : null
		},
		tip,
		lsn,
		isClosed = 0,
		frame = $.E('pl_content_versionTip');
		
	var dEvt = $.core.evt.delegatedEvent(frame);
	
	var action = {
		'autoinit': function(){
			if(isClosed) return; //无层就撤
			
			if(cache.binded){
				cache.binded === cache.node && action.show();
			} else {
				tip = $.sizzle('[messageTip="20"]', frame)[0];
				if(tip){
					var target = action.getTarget(cache.node);
					if(target){
						cache.binded = cache.node;
						action.createTip();
						action.show();
					}
				} else {
					isClosed = 1;
				}
			}
		}
		,'getTarget': function(node){
			return $.sizzle('[action-type="commentDialogue"]', node)[0];
		}
		,'createTip': function(){
			cache.tip = $.kit.dom.parseDOM($.builder(tip).list);
			cache.tip.outer = tip;
			dEvt.add('iKnow', 'click', action.close);
			$.addEvent();
		}
		,'close': function(spec){
			action.signKnown(spec.data);
			action.hide();
			return $.core.evt.preventDefault(spec.evt);
		}
		,'show': function(){
			cache.target = action.getTarget(cache.binded);
			$.setStyle(cache.tip.outer, 'visibility', 'visible');
			lsn = window.setInterval(action.flushLocation, 200);
		}
		,'flushLocation': function(){
			var opt = {
				'target'  : cache.target
				,'layer'  : cache.tip.outer
				,'pos'    : "top"
				,'arrow'  : cache.tip.arrow
			};
			var pos = tipLayer.getLayerPosition(opt.target, opt.layer, opt.pos, opt.arrow);
			tipLayer.setPosition(opt, pos);
		}
		,'hide': function(){
			if(cache.binded === cache.node && cache.tip){
				$.setStyle(cache.tip.outer, 'visibility', 'hidden');
				lsn && window.clearInterval(lsn);
			}
		}
		,'signKnown' : function(data){
			$.common.trans.versionTip.getTrans('closeBubble', {
				onSuccess : function(){
					isClosed = 1;
				}
			}).request(data);
		}
	};
	
	return function(node){
		cache.node = node;
		
		return {
			hide : action.hide,
			show : action.autoinit
		};
	}
});
