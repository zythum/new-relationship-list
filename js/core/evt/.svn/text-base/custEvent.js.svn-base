/**
 * 自定义对象事件 注意：使用属性  __custEventKey__ 污染自定义对象
 * 事件添加或绑定前应该先定义事件，定义事件方法为 custEvent.define(obj, type)
 * 约定：事件处理函数的第一个参数为event对象其结构为：
 * 	{
 * 		type:"click",//{String}绑定时的自定义事件类型
 * 		data:{}//{Any}绑定时的扩展属性 可以是任意类型
 *  }
 * @id STK.core.evt.custEvent
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @version 1.0
 * @example
 * var a = {};
 * var f = function(event) {
 * 	console.log(event.data);
 * 	console.log(event.type);
 * 	console.log(arguments[1]);
 * };
 * STK.core.evt.custEvent.define(a, "click");
 * STK.core.evt.custEvent.add(a, "click", f,{aaa:0});
 * STK.core.evt.custEvent.fire(a, "click", 5);
 * STK.core.evt.custEvent.fire(a, "click", 33);
 * STK.core.evt.custEvent.remove(a, "click", f);
 * STK.core.evt.custEvent.fire(a, "click", 22);
 * STK.core.evt.custEvent.remove(a, "click");
 * STK.core.evt.custEvent.remove(a);
 * STK.core.evt.custEvent.undefine(a, "click");
 * STK.core.evt.custEvent.undefine(a);
 * @import STK.core.arr.isArray
 */

$Import("core.arr.isArray");
STK.register("core.evt.custEvent", function($) {
	
	var _custAttr = "__custEventKey__",
		_custKey = 1,
		_custCache = {},
		/**
		 * 从缓存中查找相关对象 
		 * 当已经定义时 
		 * 	有type时返回缓存中的列表 没有时返回缓存中的对象
		 * 没有定义时返回false
		 * @param {Object|number} obj 对象引用或获取的key
		 * @param {String} type 自定义事件名称
		 */
		_findObj = function(obj, type) {
			var _key = (typeof obj == "number") ? obj : obj[_custAttr];
			return (_key && _custCache[_key]) && {
				obj: (typeof type == "string" ? _custCache[_key][type] : _custCache[_key]),
				key: _key
			};
		};
		
	return {
		/**
		 * 对象自定义事件的定义 未定义的事件不得绑定
		 * @method define
		 * @static
		 * @param {Object|number} obj 对象引用或获取的下标(key); 必选 
		 * @param {String|Array} type 自定义事件名称; 必选
		 * @return {number} key 下标
		 */
		define: function(obj, type) {
			if(obj && type) {
				var _key = (typeof obj == "number") ? obj : obj[_custAttr] || (obj[_custAttr] = _custKey++),
					_cache = _custCache[_key] || (_custCache[_key] = {});
				type = [].concat(type);
				for(var i = 0; i < type.length; i++) {
					_cache[type[i]] || (_cache[type[i]] = []);
				}
				return _key;
			}
		},
		
		/**
		 * 对象自定义事件的取消定义 
		 * 当对象的所有事件定义都被取消时 删除对对象的引用
		 * @method define
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 可选 不填可取消所有事件的定义
		 */
		undefine: function(obj, type) {
			if (obj) {
				var _key = (typeof obj == "number") ? obj : obj[_custAttr];
				if (_key && _custCache[_key]) {
					if (type) {
						type = [].concat(type);
						for(var i = 0; i < type.length; i++) {
							if (type[i] in _custCache[_key]) delete _custCache[_key][type[i]];
						}
					} else {
						delete _custCache[_key];
					}
				}
			}
		},
		
		/**
		 * 事件添加或绑定
		 * @method add
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Function} fn 事件处理方法; 必选
		 * @param {Any} data 扩展数据任意类型; 可选
		 * @return {number} key 下标
		 */
		add: function(obj, type, fn, data) {
			if(obj && typeof type == "string" && fn) {
				var _cache = _findObj(obj, type);
				if(!_cache || !_cache.obj) {
					throw "custEvent (" + type + ") is undefined !";
				}
				_cache.obj.push({fn: fn, data: data});
				return _cache.key;
			}
		},
		
		once: function(obj, type, fn, data) {
			if(obj && typeof type == "string" && fn) {
				var _cache = _findObj(obj, type);
				if(!_cache || !_cache.obj) {
					throw "custEvent (" + type + ") is undefined !";
				}
				_cache.obj.push({fn: fn, data: data, once:true});
				return _cache.key;
			}
		},
		/**
		 * 事件删除或解绑
		 * @method remove
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 可选; 为空时删除对象下的所有事件绑定
		 * @param {Function} fn 事件处理方法; 可选; 为空且type不为空时 删除对象下type事件相关的所有处理方法
		 * @return {number} key 下标
		 */
		remove: function(obj, type, fn) {
			if (obj) {
				var _cache = _findObj(obj, type), _obj, index;
				if (_cache && (_obj = _cache.obj)) {
					if ($.core.arr.isArray(_obj)) {
						if (fn) {
							//for (var i = 0; i < _obj.length && _obj[i].fn !== fn; i++);
							var i = 0;
							while(_obj[i]) {
								if(_obj[i].fn === fn) {
									break;
								}
								i++;
							}
							_obj.splice(i, 1);
						} else {
							_obj.splice(0, _obj.length);
						}
					} else {
						for (var i in _obj) {
							_obj[i] = [];
						}
					}
					return _cache.key;
				}
			}
		},
		
		/**
		 * 事件触发
		 * @method fire
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Any|Array} args 参数数组或单个的其他数据; 可选
		 * @return {number} key 下标
		 */
		fire: function(obj, type, args) {
			if(obj && typeof type == "string") {
				var _cache = _findObj(obj, type), _obj;
				if (_cache && (_obj = _cache.obj)) {
					if(!$.core.arr.isArray(args)) {
						args = args != undefined ? [args] : [];
					}
					for(var i = _obj.length - 1; i > -1 && _obj[i]; i--) {
						var fn = _obj[i].fn;
						var isOnce = _obj[i].once;
						if(fn && fn.apply) {
							try{
								fn.apply(obj, [{type: type, data: _obj[i].data}].concat(args));
								if(isOnce){
									_obj.splice(i,1);
								}
							} catch(e) {
								$.log("[error][custEvent]" + e.message);
							}
						}
					}
					return _cache.key;
				}
			}
		},
		/**
		 * 销毁
		 * @method destroy
		 * @static
		 */
		destroy: function() {
			_custCache = {};
			_custKey = 1;
		}
	};
});
