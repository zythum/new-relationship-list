/**
 * 感兴趣的群推荐
 * @author Chen Jian | chenjian2@staff.sina.com.cn
 */
$Import('common.trans.relation');
$Import('kit.dom.parseDOM');

STK.register('comp.content.interestgroup', function($){
	var MINCOUNT	= 3;
	
	var	dataArr = [],
		displayIndex = 0,
		locked	= false;
		
	/**
	 * 获取用户池内的剩余数量
	 */
	var getCount = function(){
		return dataArr.length || 0;
	};
	
 
	/**
	 * @param {Number} count 要获取的个数
	 */
	var getItemHTMLInArr = function(count){
		var _arr = [];
		if (!isNaN(count)) {
			for(var i=0;i<count;i++){
				displayIndex++;
				displayIndex = displayIndex % dataArr.length;
				var item = dataArr[displayIndex];
				if (item) {
					_arr.push(item);
				}
			}
		}
		return _arr;
	};
	
	/**
	 * 更新dataArr
	 * @param {Array} pList 需要添加到dataArr内的数据源
	 */
	var updateDataArr = function(pList){
		pList.length && (dataArr = dataArr.concat(pList));
	};
	
	return function(node){
		//-------------变量定义区-START--------------
		var that	= {},
			rAjax	= $.common.trans.relation,
			dEvent	= $.core.evt.delegatedEvent(node),
			nodes;
			
		//-------------变量定义区--END---------------
		
		/**
		 * @param {Region} 需要更新的Node
		 * @param {Number} count
		 */
		var drawInterest = function(region, count){
			var interArr	= getItemHTMLInArr(count);
			if(interArr.length){
				interHTML = interArr.join('');
				region.innerHTML = interHTML;
			}else{
				hideChangeBtn();
			}
		};
		var hideChangeBtn = function(){
			var topic_refresh = $.sizzle('a[action-type="topic_refresh"]',node)[0];
			if (topic_refresh) {
				topic_refresh.style.display = "none";
			}
		};
		//------AJAX信息获取定义区-START--------------
		var ioFuns = {
			getInterestGroup: (function(){
				var onComplete = function(rs, param){
					locked	= false;
					var code 	= rs.code,
						data	= rs.data;
					if(code === '100000'){
						updateDataArr(data.list || []);
					}
				};
				var onFail = function(rs, param){
					locked	= false;
					hideChangeBtn();
				};
				var myInterest = rAjax.getTrans('mayinterestedweiqun', {
					'onComplete': onComplete,
					'onFail'	: onFail
				});
				
				return function() {
					if(locked){ return; }
					locked = true;
					var exclude_gids = nodes['interestgroup_panel'].getAttribute("exclude_gids");
					myInterest.request({
						exclude_gids:exclude_gids || ""
					});
				}
			})()
		};
		//------AJAX信息获取定义区---END--------------
		
		//-------DOM事件回调函数定义区-START----------
		
		var bindDOMFuns = {
			initDataArr: function(){
				!getCount() && ioFuns.getInterestGroup();
				$.removeEvent(node, 'mouseover', bindDOMFuns.initDataArr);
			},
			
			changeBtnClick: function(spec){
				spec.evt && $.preventDefault(spec.evt);
				!getCount() && ioFuns.getInterestGroup();
				drawInterest(nodes['interestgroup_panel'], MINCOUNT);
//				return false;
			}
		};
		//-------DOM事件回调函数定义区--END-----------
		
		//---------DOM事件绑定定义区-START------------
		var bindDOM = function(){
			$.addEvent(node, 'mouseover', bindDOMFuns.initDataArr);
			dEvent.add('topic_refresh', 'click', bindDOMFuns.changeBtnClick);
		};
		//---------DOM事件绑定定义区--END-------------
		
		var bindListener = function(){};
		
		//----------组建初始化定义区-START------------
		var init = function(){
			argsCheck();
			parseDOM();
			bindDOM();
			bindListener();
		};
		//----------组建初始化定义区--END-------------
		
		//------------参数验证定义区-START------------
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.interestgroup]:node is not a Node!";
			}
		};
		//------------参数验证定义区--END-------------
		
		//-----------DOM获取函数定义区-START----------
		var parseDOM = function(){
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
		};
		//-----------DOM获取函数定义区--END-----------

		//---------组件公开方法的定义区-START----------
		var destroy = function(){
			$.removeEvent(node, 'mouseover', bindDOMFuns.initDataArr);
			dEvent.remove('topic_refresh', 'click');
			bindDOMFuns = null;
			dEvent = null;
			nodes = null;
		};
		//---------组件公开方法的定义区--END-----------
		
		//---------------执行初始化-START--------------
		init();
		//---------------执行初始化--END---------------
		
		//--------组件公开属性或方法赋值区-START--------
		that.destroy = destroy;
		//--------组件公开属性或方法赋值区--END---------
		return that;
	}
});