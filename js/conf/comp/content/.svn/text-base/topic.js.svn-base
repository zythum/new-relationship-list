/**
 * @author wangliang3
 * 侧边栏： 话题关注模块
 */
$Import('common.trans.topic');
$Import('kit.extra.language');

STK.register('comp.content.topic', function($){
	var hotKey = $.core.evt.hotKey,
		L = $.kit.extra.language,
		io = $.common.trans.topic;
	return function(el){
		//gb pars
		var it = {}, layer, btn_add, ul, input, emp_tip, cash = {}, count, more;
			cash.item = [];
			cash.map = {};
			cash.hitem = null;
			cash.more = null;
			
		//action	
		var handler = {
			init: function(){
				//get pars
				ul=$.sizzle('ul',el)[0];
				cash.item = $.sizzle('li',ul);
				btn_add = $.sizzle('[action-type=show_layer]',el)[0];
				count = $.sizzle('span[node-type="count"]',el)[0];
				more = $.sizzle('[action-type=show_more]',el)[0];
				//event
				handler.bindCustEvt();
			},
			tipRefresh: function(){
				var lis = ul.getElementsByTagName('li');
				var len = lis.length;
				!emp_tip&&(emp_tip=$.sizzle('[node-type=empty_tip]',el)[0]);
				if(len>0){
					emp_tip&&(emp_tip.style.display='none');
				}else{
					emp_tip?(emp_tip.style.display=''):handler.buildTips();
				}
			},
			buildTips: function(){
				var bd = $.core.dom.builder('<p node-type="empty_tip">'+L('你还没有关注任何话题')+'</p>');
				$.insertAfter(bd.box,ul);
				return bd.box;
			},
			bindCustEvt: function(){
				//click
				handler.bindDevt(el,['show_layer','del_topic','show_more']);
				//item hover
				for(i=0,len=cash.item.length;i<len;i++){
					var tmp = cash.item.pop();
					handler.itemHover(tmp);
					//cash map
					var data = handler.getJData(tmp);
					cash.map[data.id] = data.id;
				}
			},
			add_topic: function(){
				var val = input.value;
				if(/^\s*$/g.test(val.replace(/^\s+|\s+$/g, ''))){
					return;
				}
				val=encodeURIComponent(val);
				io.request('add', {
					'onSuccess'	: function(rs, parm){
						handler.insertItem({id:rs.data.id,value:$.core.str.encodeHTML(input.value)},true);
						handler.itemCount(1);
						handler.hide_layer();
						//reset layer input
						input.value='';
						//
//						handler.tipRefresh();
					},
					'onError'	: function(rs, parm){
						$.ui.alert(rs.msg);
					}
				}, 
				/**
				 * Diss
				 */
				$.module.getDiss({name:val}, btn_add));
			},
			del_topic: function(pars){
				var o = pars.el;
				for(;o.tagName.toLowerCase()!='li';o=o.parentNode);
				var j = handler.getJData(o);
				io.request('del', {
					'onSuccess'	: function(rs, parm){
						handler.removeItem(rs.data);
						//
//						handler.tipRefresh();
					},
					'onError'	: function(rs, parm){
						$.ui.alert(rs.msg);
					}
				}, 
				/**
				 * Diss
				 */
				$.module.getDiss({id:j.id}, o));
			},
			getJData: function(o){
				return $.core.json.queryToJson(o.getAttribute('action-data'));
			},
			insertItem: function(data,isAdd){
				var _html=[];
				_html.push('<li node-type="li" action-data="id='+data.id+'"><a href="');
				_html.push('http://s.weibo.com/weibo/'+encodeURIComponent(data.value));
				_html.push('">');
				_html.push(data.value);
				var x = $CONFIG['uid'] == $CONFIG['oid']?'<i action-type="del_topic">x</i>':'';
				_html.push('</a>' + x + '</li>');
				
				var bd = $.core.dom.builder(_html.join(''));
				
				var lis = $.sizzle('li',ul);
				if(lis.length>0 && isAdd){
					$.insertBefore(bd.box,lis[0]);
				}else{
					ul.appendChild(bd.box);
				}
				var li = bd.list['li'][0];
				//bind evt
				handler.itemHover(li);
				//cash
				var data = handler.getJData(li);
				cash.map[data.id] = data.id;
			},
			removeItem: function(rs){
				ul.removeChild(cash.hitem);
				handler.itemCount(-1);
				cash.hitem = null;
			},
			itemHover: function(el){
				$.addEvent(el,'mouseover',(function(el){
					return function(){
//						cash.hitem&&$.removeClassName(cash.hitem,'hover');
						cash.hitem = el;
						$.addClassName(el,'hover W_bgcolor');
					}
				})(el));
				$.addEvent(el,'mouseout',(function(el){
					return function(){
						$.removeClassName(el,'hover W_bgcolor');
					}
				})(el));
			},
			destroy: function(){
			
			},
			buildLayer: function(){
				var _html = [];
				_html.push('<div node-type="layer" class="layer_add_topictag">');
				_html.push('	<a action-type="hide_layer" href="javascript:void(0);" class="W_close"></a>');
				_html.push('	<div class="tagsAdd_con">');
				_html.push('		<div class="tagsAdd_input">');
				_html.push('			<input node-type="input" type="text" class="W_input" name=""><a action-type="add_topic" href="javascript:void(0);" class="W_btn_b"><span>'+L('保存')+'</span></a>');
				_html.push('		</div>');
				_html.push('		<p node-type="tip" class="tagsAdd_note W_textb">'+L('请添加想关注的话题')+'</p>');
				_html.push('	</div>');
				_html.push('</div>');
				
				var bd = $.core.dom.builder(_html.join(''));
				document.body.appendChild(bd.box);
				//
				layer = bd.list['layer'][0];
				input = bd.list['input'][0];
				//bind hotKey evt
				handler.bindDevt(layer,['hide_layer','add_topic']);
				hotKey.add(input,['enter'],handler.add_topic);//TODO
			},
			hide_layer: function(){
				layer && (layer.style.display = 'none');
			},
			show_layer: function(){
				!layer&&handler.buildLayer();
				var pos = $.position(btn_add);
				var scale = 161;
				layer.style.top = pos.t+'px';
				if($.core.util.browser.IE6 && $CONFIG['isnarrow'] != '1'){
					scale = 141;
				}
				layer.style.left = (pos.l - scale)+'px';
				layer.style.display = '';
			},
			show_more: function(){				
				if(!cash.more){
					handler.get_topics();
				}else{
					handler.view_items();
				}
			},
			get_topics: function(){
				var param = {};
				param.uid = $CONFIG['uid'];
				if($CONFIG['uid'] != $CONFIG['oid']){
					param.uid = $CONFIG['oid'];
				}else{
					param.num = ul.getElementsByTagName('li').length;
				}
				io.request('more',{
					'onSuccess'	: function(rs, parm){
						cash.more = rs.data;
						handler.view_items();
					},
					'onError'	: function(rs, parm){
						$.ui.alert(rs.msg);
					}
				}, param);
			},
			view_items: function(){
				var num=10,len = cash.more;
				len = len<num?len:num;
				for(var i=0;i<len;i++){
					var tmp = cash.more.shift();
					if(!tmp){
						handler.hideMore();
						break;
					}
					!cash.map[tmp.trend_id]?handler.insertItem({id:tmp.trend_id,value:tmp.hotword}):(i<=0?(i=0):i--);
					if(!cash.more.length){
						handler.hideMore();
						break;
					}
					
				}
			},
			itemCount: function(num){
				if (count && num) {
					var itemnum = parseInt(count.innerHTML, 10) + num;
					count.innerHTML = itemnum;
					var lis = ul.getElementsByTagName('li');
					!emp_tip && (emp_tip=$.sizzle('[node-type=empty_tip]',el)[0]);
					if(itemnum < 1){
						emp_tip ? (emp_tip.style.display='') : handler.buildTips();
					}else{
						emp_tip && (emp_tip.style.display='none');
						
						if(!lis.length){
							handler.show_more();
						}
					}
					if(itemnum < 11 && itemnum == lis.length){
						handler.hideMore();
					}
					
				}
			},
			hideMore: function(){
				if(more && more.style.display != 'none'){
					more.style.display='none';
					var sp = $.core.dom.prev(more);
					if(sp && sp.className == "W_vline"){
						sp.style.display='none';
					}
				}
			},
			bindDevt: function(obj,acts){
				var devt = $.delegatedEvent(obj);
				var key,fun;
				for(var i=0,len=acts.length;i<len;i++){
					key = acts[i],
					fun = handler[key];
					if (fun) {
						devt.add(key, 'click', fun);
					}
				}
			}
		};
		//
		it.destroy = handler.destroy;
		//init
		el&&handler.init();
		return it;
	}
});