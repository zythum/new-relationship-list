/**
 * 勋章展示位
 * 
 * @id STK.comp.content.medal
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import('kit.dom.parseDOM');
$Import('comp.content.medalCard');
$Import('common.trans.medal');

STK.register('comp.content.medalwithajax', function($){
	var TEMP = {
		toggleBtn : '<p><a class="W_moredown" href="#" onclick="return false;" action-type="medalToggleBtn"><span class="more"></span></a></p>'
	};

	return function(node, opts){
		var options = {
			autohidden : false,
			column : 6
		};
		options = $.parseParam(options, opts || {});
		var that = {},
			dEvt = $.core.evt.delegatedEvent(node),
			medals,
			nodes,
			isShown = false,
			medalCard,
			isGetTrans = false,
			$T = $.templet,
			nodeUl;

		var trans = $.common.trans.medal.getTrans('getMedalInfo', {
			'onSuccess' : function(rs, param) {
				if(rs['code'] == '100000'){
					var dals = rs['data']['dels'],
						dalsLen = dals.length,
						i = 0,nodeLi;
					for(; i<dalsLen; i++){
						if(medals.length > i) continue;
						(nodeLi = $.C('li')).innerHTML = dals[i];
						nodeUl[0].appendChild(nodeLi);
					}
					medals = $.sizzle('li', node);
					isGetTrans = true;
				} else {
					userCard.setContent($T(TEMP_ERROR, {"MSG": rs['msg']}));
				}
			}
		});
		var loadingImage = {
			show: function(){
				console.log('loadingImage show');
			},
			hide: function(){
				console.log('loadingImage hide');
			}			
		}

		var bindDomFuncs = {
			toggle : function(evt){
				if(isShown){
					bindDomFuncs.hide();
					evt.el.className = 'W_moredown';
				} else {
					bindDomFuncs.show();
					evt.el.className = 'W_moreup';
				}
			},
			show : function(){
				if(!isGetTrans) trans.request();
				for(var i = options.column, l = medals.length; i < l; i++){
					$.core.dom.setStyle(medals[i], 'display', '');
				}
				isShown = true;
			},
			hide : function(){
				for(var i = options.column, l = medals.length; i < l; i++){
					$.core.dom.setStyle(medals[i], 'display', 'none');
				}
				isShown = false;
			}
		};
		var createToggleBtn = function(){
			var list = $.sizzle('ul', node)[0];
			var ls = $.core.dom.builder(TEMP.toggleBtn);
			nodes = $.kit.dom.parseDOM(ls);
			$.core.dom.insertAfter(ls["box"]["firstChild"], list);
			dEvt.add('medalToggleBtn', 'click', bindDomFuncs.toggle);
			list = null, ls = null;
		}
		var bindDOMEvents = function(){
			createToggleBtn();
		}
		
		var init = function(){
			medals = $.sizzle('li', node);
			nodeUl = $.sizzle('ul',node);
			bindDOMEvents();
			medalCard = $.comp.content.medalCard(node, {'uid': $CONFIG['oid']});
		}
		
		that.destroy = function(){
			dEvt.destroy();
			medalCard.destroy();
			nodes = null, that = null, dEvt = null, medals = null, medalCard = null;
		}
		init();
		return that;
	}
});
