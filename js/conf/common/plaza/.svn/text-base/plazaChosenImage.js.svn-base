/**
 * 微博精选，图墙模式
 * @author liusong@staff.sina.com.cn
 */

$Import('common.trans.plaza');
$Import('common.extra.lazyload');
//$Import('common.plaza.popFeed');
$Import('kit.extra.language');
$Import('common.comment.comment');
$Import('common.plaza.contribute');
$Import('common.plaza.feedback');
$Import('common.plaza.imageFeedForward');
$Import('kit.dom.fix');
$Import('comp.content.userCard');

$Import('common.plaza.choicePoplayer');
$Import('common.channel.plaze');

STK.register('common.plaza.plazaChosenImage', function($) {
	
	return function(oNode) {
		var  cache = 0
			,lazy
			,colsList
			,page     = 1
			,colsNum  = 4
			,maxW     = 205
			,cols     = []
			,list     = [];
		
		var wrap = function(info){
			var box = $.builder(['<div node-type="box" style="width:',info.w,'px;line-height:',info.h + 19,'px;" class="pic">'
				,'<a action-type="imageItem"  suda-data="key=plaza_chosen_image_open&value=plaza_chosen_image_open" action-data="mid=',info.mid,'&pid=',info.pid,'&uid=',info.uid,'&mlink=',info.mlink,'&url=',info.url,'" href="####" onclick="return false">'
				,'<span class="see_more"  suda-data="key=plaza_chosen_image_open&value=plaza_chosen_image_open"></span>'
				,'<img width="',info.w,'" height="',info.h,'" src="',info.url,'" suda-data="key=plaza_chosen_image_open&value=plaza_chosen_image_open"/>'
				,'</a>'
				,'<div class="pic_fav"><p class="trans clearfix"><a class="transA" action-type="feed_image_list" action-data="',info.actiondata,'" action-type="feed_list_forward" suda-data="key=plaza_image_forward&value=plaza_image_forward" href="javascript:;" onclick="return false;"><span class="icon_fav icon_trans"></span>转发',(info.fnum && info.fnum!='0')?'(' + info.fnum + ')':'','</a></p>',info.mtext,'</div>'
	        	,'</div>'].join(''));
			return box.list['box'][0];
		};
		var moreNode = $.sizzle('div[node-type="more"]', oNode)[0];
		var picListBoxNode = $.sizzle('div[node-type="picListBox"]', oNode)[0];
		var insert = function(info, type){
			if(info.h > 400){return}
			var flag, snap, index, n;
			for (var i = 0; i < colsNum; i++) {
				if(!cols[i]){cols[i] = 0}
				if(!cols[i]){
					flag = i;
					break;
				}
				if(!snap){
					snap = cols[i];
					flag = i;
					continue
				}
				if(snap>cols[i]){
					snap = cols[i];
					flag = i;
				}
			}
			cols[flag] = cols[flag] + (info.h + 35 + 19);
			if(type === 'top'){
				window.scrollTo(0,0);
				colsList[flag].insertBefore(
					 wrap(info)
					,colsList[flag].firstChild);
			}else{
				cache = wrap(info);
				colsList[flag].appendChild(cache);
			}
		};
		
		var formatView = function(info){
			var  w = maxW
				,h = (info.h/(info.w/w))||0;
			return $.parseParam(info, {
				 'w' : w
				,'h' : h
			})
		};
		
		var createCols = function(){
			picListBoxNode.innerHTML = '';
			colsList = [];
			for(var i=0, node; i<colsNum; i++){
				node = $.C('div');
				node.className = 'cols'
				colsList.push(node);
				picListBoxNode.appendChild(node)
			}
		};
		
		var onFail = function(){
			if(moreNode){
				setStatus('retry');
			}
		};
		
		var onSuccess = function(json){
			if(json.data==null) {
				window.location.reload();
				return;
			}
			for(var i = 0, len = json.data.length; i<len; i++){
				insert(formatView(json.data[i]));
			}
			lazy && lazy.destroy();
			if(moreNode) {
				if (!json.last) {
					lazy = $.common.extra.lazyload([moreNode], loadData, {
						threshold: $.winSize().height * 0.7
					});
				} else {
					moreNode && (moreNode.style.display = "none");
				}
			}
			
			//同步弹层页面slide选项
			$.common.channel.plaze.fire('slide_addimg',[json.data]);
			
		};
		
		var setStatus = function(status){
			if(moreNode){
				var content;
				if(!status){
					moreNode.innerHTML = ['<div class="W_loading"><span>',$.kit.extra.language('#L{正在加载，请稍候...}'),'</span></div>'].join('');
					return;
				}
				moreNode.innerHTML = ['<div class="zero_tips W_textb"><span>',$.kit.extra.language('#L{加载失败}'),'，<a action-type="feed_list_retry" requestType="1" href="javascript:void(0)">',$.kit.extra.language('#L{请重试}'),'</a></span></div>'].join('');
				$.sizzle('[action-type="feed_list_retry"]', moreNode)[0].onclick = loadData;				
			}
		};
		
		var listTrans = $.common.trans.plaza.getTrans('image', {
			 'onSuccess' : onSuccess
			,'onError'   : onFail
			,'onFail'    : onFail
		});
		
		var loadData = function(){
			setStatus();
			listTrans.request({
				 'class': $CONFIG['class']
				,'ts'   : $CONFIG['ts']
				,'page' : ++page
			});
		};
		
		var showFeed = function(oEvent){
//			$.common.plaza.popFeed(oEvent.data.mid);
		
			$.common.plaza.choicePoplayer().show(oEvent);

			return false;
		};
		
		var showForward = function(oEvent){
			var data = oEvent.data;
			$.foreach(['originNick','forwardNick','origin','reason'], function(k){
				if(data[k]){
					data[k] = decodeURIComponent(data[k]);
				}
			})
			$.common.plaza.imageFeedForward(oEvent.el, oEvent.data);
			return false;
		};
		var contribute = function(event){
			$.common.plaza.contribute(event.el, event.data);
			$.preventDefault()
		};
		var feedback = function(event){
			$.common.plaza.feedback(event.el, event.data);
			$.preventDefault()
		};
		$.comp.content.userCard(document.body, {
			 'zIndex': 10002
		});
		//----------------------Event-----------------------------
		var dEvt = $.delegatedEvent(picListBoxNode);
		var bindEvent = function(){
			dEvt.add('feed_image_list', 'click', showForward);
			dEvt.add('imageItem', 'click', showFeed);
		};
		var pubishEvent = $.delegatedEvent(document.body);
			pubishEvent.add('user_contribute', 'click', contribute);
			pubishEvent.add('user_feedback', 'click', feedback);
		
		var removeEvent = function(){
			dEvt.destroy();
		};
		//----------------------Handler---------------------------
		var it = {};
		/**
		 * 注消方法
		 * @method init
		 */
		it.destroy = function(){
			lazy && lazy.destroy();
			removeEvent()
		};
		/**
		 * 初始化方法
		 * @method init
		 */
		(it.init = function(){
			bindEvent();
			createCols();
			onSuccess($CONFIG['picData']);
			var feedbackButton = $.sizzle('a[action-type=user_feedback]')[0];
			feedbackButton && $.kit.dom.fix(feedbackButton, 'lt', [0, 230]).setFixed(true);
			
			//
			$.common.channel.plaze.register('slide_laoddata',loadData);

		})();
		return it;
	};
});
