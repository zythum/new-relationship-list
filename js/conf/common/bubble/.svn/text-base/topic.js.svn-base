$Import('ui.bubble');

STK.register('common.bubble.topic', function($){
	var TEMP = '' + 
	'<div class="layer_send_topic" style="width:250px;" node-type="outer">' +
		'<div class="laTopic_btn"><a href="#" class="W_btn_b" action-type="blank_topic" action-data="text=#在这里输入你想要说的话题#"><span><em class="ico_topic"></em>#L{插入话题}</span></a></div>' +
		'<div class="laTopic_hrline"></div>' +
		'<div class="laTopic_titS W_textb">#L{热门话题：}</div>' +
		'<div class="tags_list" node-type="inner"></div>' +
	'</div>';
	
	var dom, conf, bub, outer, inner;
	var L = $.kit.extra.language;
	var that={};
	var build = function(){//只做一次
		dom = $.module.layer(L(TEMP));
		
		outer = dom.getOuter();
		inner = dom.getInner();
		
		bind();
		var t = $.common.trans.editor.getTrans('getTopic',{
			'onComplete' : function(ret, params){
				insertTopics(ret.data);
			}
		}).request({});
	};
	var init = function(){//每次打开浮层都执行
		bub = $.ui.bubble();
		if(!dom){
			//$.log('bub build');
			build();
		}
		custEvt.add();
		bub.setContent(outer);
		$.custEvent.add(bub, 'hide', (function(bub){
			return function(){
				//$.log('bub remove ',that.__custEventKey__);
				//$.log($.custEvent.list(that,'blank_topic'));
				$.custEvent.remove(bub, 'hide', arguments.callee);
				custEvt.destroy();
				//$.log($.custEvent.list(that,'blank_topic'));
				//$.log('bub remove end ',$.custEvent.fire(that,'blank_topic'))
				//$.custEvent.fire(that, 'hide', {});
			};
		})(bub));	
	};

	var insertTopics = function(html){
		inner.innerHTML = html; 
	};

	var custEvt = {
		add : function(){
			$.custEvent.add(that,'hide',function(){
				//$.log('bub hide');
				bub.hide();
			});
		},
		destroy : function(){
			$.custEvent.remove(that,'blank_topic');
			$.custEvent.remove(that,'hide');
			$.custEvent.remove(that,'insert');
		}
	};


	var bind = function(){

		//$.log('bubble.bind');
		$.custEvent.define(that, 'blank_topic');
		$.custEvent.define(that, 'insert');
		$.custEvent.define(that, 'hide');
		var delegate = STK.core.evt.delegatedEvent(outer);
		delegate.add('add_topic','click',function(spec){
			STK.core.evt.stopEvent();
			$.custEvent.fire(that, 'insert', {'value': spec.data.text});
		});
		delegate.add('blank_topic','click',function(spec){
			STK.core.evt.stopEvent();
			//$.log('bub,fire blanktopic');
			$.custEvent.fire(that, 'blank_topic', {'value': spec.data.text});
		});

		//bind = function(){};
	};
	that.getBub = function(){
		return bub;
	};

	return function(el,opts){
		if(!$.isNode(el)){
			throw 'common.bubble.topic need el as first parameter!';
		}
		init();
		bub.setLayout(el,{'offsetX':-29, 'offsetY':5});
		bub.show();
		return that;

	};
});
