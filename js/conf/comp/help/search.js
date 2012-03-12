/**
 * @id pl_help_search
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xinglong1
 * @example
 */
$Import('module.suggest');
STK.register('comp.help.search', function($) {
	return function(node, opts) {

		var that = {};
		var sizzle = $.sizzle;

		var addEvent=STK.core.evt.addEvent;
		var fireEvent=STK.core.evt.fireEvent;
		var custEvent=STK.core.evt.custEvent;
		var getSize=STK.core.dom.getSize;
		var getXY=STK.core.dom.position;
		var setXY=STK.core.dom.setXY;
		var trim=STK.core.str.trim;
		var leftB=STK.core.str.leftB;
		
		var _this = {
			"url":"http://help.weibo.com/search?k=",
			"input":sizzle('input[node-type="help_searchI"]')[0],
			"key":sizzle('a[node-type="help_searchK"]')[0]
		};
		//+++ 参数的验证方法定义区 ++++++++++++++++++
		var argsCheck = function(){
			if(!node) {
				throw new Error('node没有定义');
			}
		};
		
		//+++ 自定义事件绑定方法定义区 ++++++++++++++++++
		var searchObj={
			open:function(){
				var suggest=_this.suggest;
				if(!_this.need){
					suggest && custEvent.fire(suggest, 'open',_this.input);
					_this.need=1;
				};
			},
			close:function(){
				var suggest=_this.suggest;
				suggest && custEvent.fire(suggest, 'close');
				_this.need=null;
			},
			makeSuggest:function(input,wrap){
				if(!wrap){return};
				
                var size = getSize(input);
                var XY = getXY(input);
                XY.t += size.height;
                
                wrap.className = "layer_menu_list";
                wrap.style.cssText = 'width:' + size.width + 'px; ' + 'position: absolute; z-index: 99;background-color:white;overflow:hidden;';
                setXY(wrap, XY);
				
                wrap.innerHTML = '<ul>' +
                '<li class="" action-type="item" action-data="我是发布框里的音乐浮层的联想菜单"><a href="javascript:void(0)">我是发布框里的音乐浮层的联想菜单</a></li>' +
                '<li action-type="item" action-data="里面的内容不定宽，但外层写了width"><a href="javascript:void(0)">里面的内容不定宽，但外层写了width</a></li>' +
                '<li action-type="item" action-data="是为了跟音乐层的输入框一边儿齐"><a href="javascript:void(0)">是为了跟音乐层的输入框一边儿齐</a></li>' +
                '<li action-type="item" action-data="我等到花儿也谢了"><a href="javascript:void(0)">我等到花儿也谢了</a></li>' +
                '</ul>';
//				var suggest=_this.suggest;
//				suggest && searchObj.open();
			},
			selectSuggest:function(index,key){
				var input=_this.input;
				
				var list = $.sizzle("li", _this.wrap);
				input && (input.value=list[index].firstChild.innerHTML);
				fireEvent(key,'click');
			},
			bindSuggest:function(input,key){
                
                var KEY_ASSETS = {
                    '13':13, //'ENTER': 13,
                    '27':27, //'ESC': 27,
                    '38':38,//'UP': 38,
                    '40':40, //'DOWN': 40,
                    '9':9 //'TAB': 9
                };
                var $ = STK;
				var uiNode=_this.wrap;

				if(!uiNode){
					uiNode=_this.wrap=STK.C('div');
					document.body.appendChild(uiNode);

					uiNode.style.display="none";
				};

                var suggest = $.module.suggest({
                    'textNode': input,
                    'uiNode': uiNode,
                    'actionType': 'item',
                    'actionData': 'index'
                });
				_this.suggest=suggest;
                var oldIndex = 0;
                var setIndex = function(index){
				    var list = $.sizzle("li", uiNode);

                    list[oldIndex].className = "";
                    list[index].className="cur";
                    oldIndex = index;
                };
				
                custEvent.add(suggest, 'onIndexChange', function(event, index){
					 //console.log(index);
                    setIndex(index);
                });
                custEvent.add(suggest, 'onSelect', function(event, index){
                    //console.log(index);
					searchObj.selectSuggest(index,key);
                    searchObj.close();
                });
                custEvent.add(suggest, 'onClose', function(event, index){
                    uiNode.style.display = "none";
                });
                custEvent.add(suggest, 'onOpen', function(event, index){
                    uiNode.style.display = "";
                });

				
				var checkInput=function(){
					var vl=input.getAttribute('vl')||input.getAttribute('value');
					vl=trim(vl);
					var sta=true;
					var oldvl=trim(input.value);
					if(oldvl==vl){
						input.value="";
						sta= false;
					}else if(!oldvl){
						sta= false;
					};
					var suggest=_this.suggest
					if(sta){
						searchObj.open();
						
					}else{
						searchObj.close();
					};
					return sta;
				};
				
				addEvent(input,'keyup',function(event){
					var kcode=event.keyCode;

						if(!KEY_ASSETS[kcode]){
							console.log("开始联想");
							if(checkInput()){
								searchObj.think(input);
							}
							
						};
				});
				
				addEvent(input,'focus',function(event){
					checkInput();
				});
				addEvent(input,'blur',function(event){
					var vl=input.getAttribute('value');
					if(trim(input.value)==""){
						input.value=vl;
						vl=null;
					};
					setTimeout(function(){
						searchObj.close();
					},150);
				});
				addEvent(key,'click',function(){
					var vl=trim(input.value);
					if((vl==trim(input.getAttribute('value')))||(vl=="")){
						input.focus();
						return;
					}
					console.log('直接搜索');
					searchObj.search(input.value);
				});
			},
			think:function(input){
				//联想代码
                var input = _this.input;
				var wrap;
				if(!input){return};

				wrap=_this.wrap;
				wrap && searchObj.makeSuggest(input,_this.wrap);
			},
			search:function(value){
				value=leftB(value,80);
                var url=_this.url;
                if (url) {
                    setTimeout(function(){
                        window.location.href = url+encodeURIComponent(value);
                    }, 0);
                };
			}
		};

		var temp={
			checkInput:function(){
			var input=_this.input;
            var vl = input.getAttribute('vl') || input.getAttribute('value');
            vl = trim(vl);
            var oldvl = trim(input.value);
			if ((oldvl == vl)||!oldvl) {
				return false;
            };
			return true;
		},
		bind:function(input,key){
				addEvent(input,'focus',function(event){
					if(!temp.checkInput()){
						input.value="";
					};
				});
				addEvent(input,'blur',function(event){
					if(!temp.checkInput()){
						var vl = input.getAttribute('vl') || input.getAttribute('value');
						input.value=vl;
					};
				});
				addEvent(input,'keyup',function(event){
					var kcode=event.keyCode;

						if(kcode!=13){
							return;
						};
						if(!temp.checkInput()){
							return;
						};
						searchObj.search(trim(input.value));
				});
				addEvent(key,'click',function(){
					
					if(!temp.checkInput()){
						input.focus();
						return;
					}
					searchObj.search(trim(input.value));
				});
		}
		}
		//+++ DOM事件绑定方法定义区 ++++++++++++++++++
		var bindDOM = function(){
			var input=_this.input;
			var key=_this.key;
			temp.bind(input,key);//临时用，二期添加联想 去掉此行，打开下面一行即可
			//searchObj.bindSuggest(input,key);

		};

		//+++ 组件销毁方法的定义区 ++++++++++++++++++
		var destroy = function(){
			_this = null;
		};

		//+++ 组件的初始化方法定义区 ++++++++++++++++++
		var init = function(){
			argsCheck();
			bindDOM();
		};
		
		//+++ 执行初始化 ++++++++++++++++++
		init();

		//+++ 组件公开属性或方法的赋值区 ++++++++++++++++++
		that.destroy = destroy;
		
		//-------------------------------------------

		return that;
	};

});