/**
 * 勋章展示位
 * 
 * @id STK.comp.content.medal
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import('kit.dom.parseDOM');
$Import('comp.content.medalCard');

STK.register('comp.content.medal', function($){

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
			medalCard;
		
		
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
			options.autohidden && medals.length > options.column && createToggleBtn();
		}
		
		var init = function(){
			medals = $.sizzle('li', node);
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
