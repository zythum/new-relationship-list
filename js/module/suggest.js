/**
 * @author liusong@staff.sina.com.cn
 */


/**
 * at提示
 * @id STK.comp.publisher.plugins.at
 * @param  {Object} ocfg 必选参数, 默认
 * 	{
		'textEl' : node		TextArea对象
	}
 * @return {Object}
 * @author liusong@staff.sina.com.cn
 * @example
 *  var textarea = STK.E("publisher");
 *  var sugg = STK.C('div');
 * 	var at = STK.comp.publisher.plugins.at({'textEl':textarea});
 * 	STK.custEvent.add(at, 'at', function(type,data){
 * 		sugg.innerHTML = data.key;
 * 		sugg.style.cssText = ['z-index:1001;background-color:#ffffff;border:1px solid #000000;position:absolute;left:',data.l,'px;top:',data.t,'px;'].join('')
 * 	}
 */
STK.register('module.suggest', function($){
	//静态指针
	var n       = null,
		ce      = $.custEvent,
		define  = ce.define,
		fire    = ce.fire,
		add     = ce.add,
		adEvent = $.addEvent,
		rmEvent = $.removeEvent,
		stEvent = $.stopEvent;
	//全局变量
	var valid = [], cache = {};
	//静态常量
	var KEY_ASSETS = {
		'ENTER' : 13,
		'ESC'   : 27,
		'UP'    : 38,
		'DOWN'  : 40,
		'TAB'   : 9
	};
	//suggest实例化函数
	var suggest = function(conf){
		var index = -1, data = [], textNode = conf['textNode'], uiNode = conf['uiNode'];
		var dEvt = $.core.evt.delegatedEvent(uiNode);
		//定义事件
		//$.log('module suggest define onClose');
		var cEvt = define(textNode, [
			//接收事件，数据更新事件，该事件重置缓存数据，和当前选中的索引值
			'open',
			//接收事件，当用户关闭时进行事件移除
			'close',
			//接收强制选中的索引值
			'indexChange',
			//广播事件，当用户选中时进行选择时进行广播
			'onSelect',
			//广播事件，当用户进行上下选择时进行广播
			'onIndexChange',
			//广播事件，当用户ESC取消进行广播
			'onClose',
			//广播事件，当用户打开时进行广播
			'onOpen',
				//打开suggest后需要设置的状态位。
			'openSetFlag'
		]);
		cEvt.setFlag = setFlag;
		var setFlag = function(flag)
		{
		  	conf.flag  = flag;
		};
		var items = function(){
			return $.sizzle(['[action-type=',conf['actionType'],']'].join(''), uiNode);
		};
		//销毁事件
		var destroy = function(){
			//$.log('module.suggest destroy');
			index = -1;
			rmEvent(textNode, 'keydown', keyHandler);
			dEvt.destroy();
		}
		//键盘事件管理
		var keyHandler = function(event){

			//$.log('module suggest keyHandler');
			var e, k;
			if(!(e = event) || !(k = e.keyCode)){return}
			if(k == KEY_ASSETS['ENTER']){
				stEvent();
				//$.log('module suggest fire onSelect textNode=',textNode);
				fire(cEvt, 'onSelect', [index,textNode,conf.flag]);
				return false;
			}
			if(k == KEY_ASSETS['UP']){
				stEvent();
				var l = items().length;
				index = index<1? l-1: index-1;
				//$.log('module suggest fire onIndexChange');
				fire(cEvt, 'onIndexChange', [index]);
				return false;
			}
			if(k == KEY_ASSETS['DOWN']){
				stEvent();
				var l = items().length;
				index = index==(l-1)? 0: index+1;
				fire(cEvt, 'onIndexChange', [index]);
				return false;
			}
			if(k == KEY_ASSETS['ESC']){
				stEvent();
				destroy();
				fire(cEvt, 'onClose');
				return false;
			}
			if(k == KEY_ASSETS['TAB']){
				destroy();
				fire(cEvt, 'onClose');
				return false;
			}
		};
		//点击事件管理
		var clickHandler = function(event){
				//$.log('module suggest fire onSelect textNode2=',textNode);
			fire(cEvt, 'onSelect', [$.core.arr.indexOf(event.el, items()),textNode,conf["flag"]]);
		};
		//鼠标滑过事件管理
		var overHandler = function(event){
			index = $.core.arr.indexOf(event.el, items());
			fire(cEvt, 'onIndexChange', [$.core.arr.indexOf(event.el, items())]);
		};
		//接收打开事件
		add(cEvt, 'open', function(evt,textarea){
			textNode = textarea;
			//$.log('module suggest open',cEvt,textarea);
			destroy();
			//$.log('module suggest bind keydown textNode=',textarea);
			adEvent(textarea, 'keydown', keyHandler);
			dEvt.add(conf['actionType'], 'mouseover', overHandler);
			dEvt.add(conf['actionType'], 'click', clickHandler);
			fire(cEvt, 'onOpen',[conf.flag]);
			//$.log('fire on open');
		});
		//为打开设置flag用
		add(cEvt,"openSetFlag", function(evt,flag){
			 setFlag(flag);
		});
		//接收关闭事件
		add(cEvt, 'close', function(){
			//$.log('module close',cEvt);
			destroy();
			fire(cEvt, 'onClose',[conf.flag]);
		});
		//接收强制选中的索引值
		add(cEvt, 'indexChange', function(evt,iIndex){
			index = iIndex;
			fire(cEvt, 'onIndexChange', [index,conf.flag]);
		});
		return cEvt;
	};


	var getIns = function(conf) {
		var node = conf['textNode'];
		var id = $.core.arr.indexOf(node, valid);
		if (!cache[id]) {
			valid[id = valid.length] = node;
			cache[id] = suggest(conf);
		}
		return cache[id];
	};
	return function(conf){
		if(!conf['textNode'] || !conf['uiNode']){return}
		//$.log('aaaaaaaaaaaaa',conf['textNode']);
		//初始化参数
		conf = $.parseParam({
			'textNode' : n,
			'uiNode'   : n,
			'actionType': 'item',
			'actionData': 'index',
			'flag':''
		},conf);
		//反回实体
		
		return getIns(conf)
	}
});

