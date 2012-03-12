/**
 * @author liusong@staff.sina.com.cn
 */

STK.register('comp.content.plazaNav', function($){
	return function(oNode, oConf){
		var  conf
			,timer
			,ani
			,wrap
			,clock
			,locked
			,maxNum
			,group
			,cols
			,itemList
			,btnList
			,oldNum
			,currNum;
		//参数初始化
		conf = $.parseParam({
			 'step' : 4
			,'itemNode'   : 'item'
			,'wrapNode'   : 'wrap'
			,'btnAction'  : 'btn'
			,'prevAction' : 'prev'
			,'nextAction' : 'next'
		}, oConf);
		/**
		 * 设置当前位置
		 * @param {Object} nNum
		 */
		var setCurr = function(nNum){
			oldNum  = currNum;
			currNum = currNum + nNum;
			currNum < 0 && (currNum = maxNum);
			currNum > maxNum && (currNum = 0);
		};
		var setCols = function(aArr){
			$.foreach(aArr, function(a, i){
				$.setStyle(a, 'opacity', 1);
				$.setStyle(a, 'display', 'block');
				cols[i].appendChild(a);
			});
		};
		var clear = function(){
			$.foreach(cols, function(li){
				while(li.children.length){
					$.removeNode(li.children[0]);
				}
			})
		}
		/**
		 * 移动至某页
		 */
		var tweenTo = function(){
			if(currNum == oldNum){return}
			locked = 1;
			var  os = oldNum*conf['step']
				,cs = currNum*conf['step']
				,oData = itemList.slice(os, os+conf['step'])
				,cData = itemList.slice(cs, cs+conf['step']);
			clear();
			setCols(cData);
			setCols(oData);
			tween(oData);
			btnList[oldNum].className = '';
			btnList[currNum].className = 'current';
		};

		/**
		 * 上一页
		 */
		var prev = function(){
			if(locked){return}
			setCurr(-1);
			reset();
			tweenTo();
		};
		/**
		 * 下一页
		 */
		var next =  function(){
			if(locked){return}
			setCurr(1);
			reset();
			tweenTo();
		};
		/**
		 * 导航点击处理函数
		 * @param {Object} oEvent
		 */
		var navTo = function(oEvent){
			if(locked){return}
			oldNum = currNum;
			currNum = oEvent.data.page*1;
			reset();
			tweenTo();
		};
		var reset = function(){
			clearInterval(timer);
			timer = setInterval(function(){
				next();
			},8000)
		}
		var buildItem = function(oData){
			return $.builder([
				 '<a node-type="navItem" href="',oData['url'],'">'
				,'<img width="205" src="',oData['pic'],'"/>'//height="auto" 
			  	,'<span style="left:0px">',oData['name'],'</span>'
				,'</a>'
			].join('')).list['navItem'][0];
		};
		var tween = function(list){
			clearTimeout(clock);
			var  hList = list.slice()
				,hQueue = [
					 [0.75, 1,    1,    1]
					,[0.5,  0.75, 1,    1]
					,[0.25, 0.5,  0.75, 1]
					,[0,    0.25, 0.5,  0.75]
					,[0,    0,    0.25, 0.5]
					,[0,    0,    0,    0.25]
					,[0,    0,    0,    0]
				];
			clock = setTimeout(function(){
				var queue = hQueue.shift();
				if(!queue){locked = 0;return}
				$.foreach(hList, function(item, i){
					var  hid = (queue[i]===0)
						,key = hid? 'display': 'opacity'
						,val = hid? 'none': queue[i];
					$.setStyle(item, key, val);
				});
				clock = setTimeout(arguments.callee, 50)
			}, 50);
		};
		
		
		//-------------------------Event----------------------------
		var dEvt = $.delegatedEvent(oNode);
		/**
		 * 事件绑定方法
		 * @method bindEvent
		 */
		var bindEvent = function(){
			dEvt.add(conf['prevAction'], 'click', prev);
			dEvt.add(conf['nextAction'], 'click', next);
			dEvt.add(conf['btnAction'],  'click', navTo);
		};
		/**
		 * 移除事件方法
		 * @method removeEvent
		 */
		var removeEvent = function(){
			dEvt.add(conf['prevAction'], 'click', prev);
			dEvt.add(conf['nextAction'], 'click', next);
			dEvt.add(conf['btnAction'],  'click', navTo);
		};
		//------------------------Handler------------------------------
		var it = {};
		/**
		 * 组件初始化方法
		 * @method init
		 */
		it.init = function(){
			var data = $CONFIG['list'];
			oldNum  = 0;
			currNum = 0;
			maxNum  = Math.ceil(data.length/4) - 1;
			btnList = $.sizzle('li[action-type=btn]', oNode);
			itemList = $.foreach(data, function(item){
				return buildItem(item);
			});
			cols = $.sizzle('li[node-type=item]', oNode);
			setCols(itemList.slice(0, conf['step']));
			bindEvent();
			reset();
		};
		/**
		 * 组件注消方法
		 * @method destroy
		 */
		it.destroy = function(){
			clearInterval(clock);
			removeEvent();
			wrap = ani = itemList = btnList = oldNum =  currNum = currNum = maxNum = null;
		}
		
		return it;
	}
});
