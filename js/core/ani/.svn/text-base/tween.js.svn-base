/**
 * 让指定对象执行动画效果(静态方法,不需要实例化)
 * @id STK.core.ani.tween
 * @param {Element} node 需要被执行动画效果的对象ID或者DOM对象
 * @param {Object} spec 动画的结束值,带单位,可传入多个	
		// 	'animationType' : 'linear',
		// 	'duration' : 500,
		// 	'algorithmParams' : {},
		// 	'extra' : 5,
		// 	'delay' : 25,
		// 	'end' : function(){},
		// 	'tween' : function(){},
		// 	'propertys' : {}
 * @return {Object}
			that.play(target);
			that.stop();
			that.pause();
			that.resume();
			that.finish(target);
			that.setNode(el);
			that.destroy();
 * @example tween($E('test'),{'end':function(el){el.style.display='none'}}).finish({'height':0});
			tween($E('test')).
				play({'height':100}).
				play({'width':100}).
				play({
					'top':100,
					'left':100
				}).
				destroy();
 * @author FlashSoft | fangchao@staff.sina.com.cn
	modify by Robin Young | yonglin@staff.sina.com.cn
 */
$Import('core.ani.tweenArche');
$Import('core.dom.getStyle');
$Import('core.dom.cssText');
$Import('core.func.getType');
$Import('core.obj.parseParam');
$Import('core.arr.foreach');
$Import('core.json.merge');
$Import('core.util.color');
$Import('core.func.empty');

STK.register('core.ani.tween', function($){
	
	var tweenArche	= $.core.ani.tweenArche;
	var foreach		= $.core.arr.foreach;
	var getStyle	= $.core.dom.getStyle;
	var getType		= $.core.func.getType;
	var parseParam	= $.core.obj.parseParam;
	var merge		= $.core.json.merge;
	var color		= $.core.util.color;
	
	var getSuffix = function(sValue){
		var charCase = /(-?\d\.?\d*)([a-z%]*)/i.exec(sValue);
		var ret = [0, 'px'];
		if(charCase){
			if(charCase[1]){
				ret[0] = charCase[1] - 0;
			}
			if(charCase[2]){
				ret[1] = charCase[2];
			}
		}
		return ret;
	};
	//'marginTop'==>'margin-top'
	var styleToCssText = function(s){
	    for(var i = 0, len = s.length; i < len; i += 1){
	        var l = s.charCodeAt(i);
	        if(l > 64 && l < 90){
	            var sf = s.substr(0,i);
	            var sm = s.substr(i,1);
	            var se = s.slice(i+1);
	            return sf + '-' + sm.toLowerCase() + se;
	        }
	    }
		return s;
	};
	
	var formatProperty = function(node, value, key){
		//for node property
		var property = getStyle(node,key);
		
		if(getType(property) === 'undefined' || property === 'auto'){
			if(key === 'height'){
				property = node.offsetHeight;
			}
			if(key === 'width'){
				property = node.offsetWidth;
			}
		}
		//end node property
		
		var ret = {
			'start'	: property,
			'end'	: value,
			'unit'	: '',
			'key'	: key,
			'defaultColor' : false
		};
		
		//about number
		if(getType(value) === 'number'){
			var style = [0, 'px'];
			if(getType(property) === 'number'){
				style[0] = property;
			}else{
				style = getSuffix(property);
			}
			ret['start'] = style[0];
			ret['unit'] = style[1];
		}
		
		//about color
		if(getType(value) === 'string'){
			var tarColObj, curColObj;
			tarColObj = color(value);
			if(tarColObj){
				curColObj = color(property);
				if(!curColObj){
					curColObj = color('#fff');
				}
				ret['start'] = curColObj;
				ret['end'] = tarColObj;
				ret['defaultColor'] = true;
			}
		}
		node = null;
		return ret;
	};
	
	var propertyFns = {
		'opacity' : function(rate, start, end, unit){
			var value = (rate*(end - start) + start);
			return {
				'filter' : 'alpha(opacity=' + value*100 + ')',
				'opacity' : Math.max(Math.min(1,value),0),
				'zoom' : '1'
			};
		},
		'defaultColor' : function(rate, start, end, unit, key){
			var r =  Math.max(0,Math.min(255, Math.ceil((rate*(end.getR() - start.getR()) + start.getR()))));
			var g =  Math.max(0,Math.min(255, Math.ceil((rate*(end.getG() - start.getG()) + start.getG()))));
			var b =  Math.max(0,Math.min(255, Math.ceil((rate*(end.getB() - start.getB()) + start.getB()))));
			var ret = {};
			ret[styleToCssText(key)] = '#' + 
				(r < 16 ? '0' : '') + r.toString(16) + 
				(g < 16 ? '0' : '') + g.toString(16) + 
				(b < 16 ? '0' : '') + b.toString(16);
			return ret;
		},
		'default' : function(rate, start, end, unit, key){
			var value = (rate*(end - start) + start);
			var ret = {};
			ret[styleToCssText(key)] = value + unit;
			return ret;
		}
	};
	
	
	// 	'animationType' : 'linear',
	// 	'distance' : 1,
	// 	'duration' : 500,
	// 	'algorithmParams' : {},
	// 	'extra' : 5,
	// 	'delay' : 25,
	// 	'end' : function(){},
	// 	'tween' : function(){},
	// 	'propertys' : {}
	
	return function(node, spec){
		var that, conf, propertys, ontween, propertyValues, staticStyle, onend, sup, queue, arche;
		
		spec = spec || {};
		
		conf = parseParam({
			'animationType' : 'linear',
			'duration' : 500,
			'algorithmParams' : {},
			'extra' : 5,
			'delay' : 25
		}, spec);
		
		conf['distance'] = 1;
		
		conf['callback'] = (function(){
			var end = spec['end'] || $.core.func.empty;
			return function(){
				ontween(1);
				onend();
				end(node);
			};
		})();
		
		propertys = merge(propertyFns, spec['propertys'] || {});
		
		staticStyle = null;
		
		propertyValues = {};
		
		queue = [];
		
		ontween = function(rate){
			var list = [];
			var opts = foreach(propertyValues, function(value, key){
				var fn;
				if(propertys[key]){
					fn = propertys[key];

				}else if(value['defaultColor']){
					fn = propertys['defaultColor'];

				}else{
					fn = propertys['default'];

				}
				var res = fn(
					rate, 
					value['start'], 
					value['end'], 
					value['unit'],
					value['key']
				);
				for(var k in res){
					staticStyle.push(k, res[k]);
				}
				
				
			});
			node.style.cssText = staticStyle.getCss();
		};
		
		
		onend = function(){
			var item;
			while(item = queue.shift()){
				try{
					item.fn();
					if(item['type'] === 'play'){
						break;
					}
					if(item['type'] === 'destroy'){
						break;
					}
				}catch(exp){
					
				}
			}
		};
		
		arche = tweenArche(ontween, conf);
		
		var setNode = function(){
			if(arche.getStatus() !== 'play'){
				node = el;
			}else{
				queue.push({'fn' : setNode, 'type':'setNode'});
			}
		};
		
		var play = function(target){
			if(arche.getStatus() !== 'play'){
				propertyValues = foreach(target, function(value, key){
					return formatProperty(node, value, key);
				});
				staticStyle = $.core.dom.cssText(node.style.cssText + (spec['staticStyle'] || ''));
				arche.play();
			}else{
				queue.push({'fn':function(){play(target);},'type':'play'});
			}
		};
		
		var destroy = function(){
			if(arche.getStatus() !== 'play'){
				arche.destroy();
				node = null;
				that = null;
				conf = null;
				propertys = null;
				ontween = null;
				propertyValues = null;
				staticStyle = null;
				onend = null;
				sup = null;
				queue = null;
			}else{
				queue.push({'fn':destroy,'type':'destroy'});
			}
		};
		
		that = {};
		
		that.play = function(target){
			play(target);
			return that;
		};
		that.stop = function(){
			arche.stop();
			return that;
		};
		that.pause = function(){
			arche.pause();
			return that;
		};
		that.resume = function(){
			arche.resume();
			return that;
		};
		that.finish = function(target){
			play(target);
			destroy();
			return that;
		};
		that.setNode = function(el){
			setNode();
			return that;
		};
		that.destroy = function(){
			destroy();
			return that;
		};
		return that;
	};
});
