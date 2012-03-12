$Import('module.layer');
$Import('kit.dom.layoutPos');

STK.register('module.bubble', function($){

	return function(temp, spec){
		if(!temp){
			throw 'module.bubble need template as first parameter';
		}
		var that;
		var conf, layer, box, cont, close, stopBoxClose;

		conf = $.parseParam({
			'width' : null,
			'height' : null,
			'parent' : document.body
		},spec);

		layer = $.module.layer(temp);
		box = layer.getDom('outer');
		cont = layer.getDom('inner');
		if(layer.getDomListByKey('close')){
			close = layer.getDom('close');
		}
		box.style.display = 'none';
		stopBoxClose = false;
		var boxClose = function(e){
			if(stopBoxClose){
				return true;
			}
			var ev = $.fixEvent(e);
			if(!$.contains(box, ev.target)){
				layer.hide();
			}
		};
		if(close){
			$.addEvent(close,'click',layer.hide);
		}

		$.custEvent.add(layer, 'show', function(){
			setTimeout(function(){
				$.addEvent(document.body, 'click', boxClose);
			},0);
		});
		$.custEvent.add(layer, 'hide', function(){
			stopBoxClose = false;
			$.removeEvent(document.body, 'click', boxClose);
		});

		that = layer;

		that.setPosition = function(pos){
			box.style.top = pos['t'] + 'px';
			box.style.left = pos['l'] + 'px';
			return that;
		};

		that.setLayout = function(el, opts){
			if(!$.isNode(el)){
				throw 'module.bubble.setDown need element as first parameter';
			}
			$.kit.dom.layoutPos(box, el, opts);

			return that;
		};

		that.setContent = function(info){
			if(typeof info === 'string'){
				cont.innerHTML = info;
			}else if($.isNode(info)){
				cont.appendChild(info);
			}
			return that;
		};

		that.setArrow = function(args){
			var arrow;
			if(layer.getDomListByKey('arrow')){
				arrow = layer.getDom('arrow');
				if(args['className']) {
					arrow.className = args['className'] || '';
				}
				if(args['style']) {
					arrow.style.cssText = args['style'] || '';
				}
			}
		};

		that.clearContent = function(){
			while(cont.children.length){
				$.removeNode(cont.children[0]);
			}
		};

		that.stopBoxClose = function(){
			stopBoxClose = true;
		};

		that.startBoxClose = function(){
			stopBoxClose = false;
		};

		that.destroy = function(){
			$.removeEvent(document.body, 'click', boxClose);
			layer = null;
			box = null;
			cont = null;
			close = null;
		};

		return that;

	};
});
