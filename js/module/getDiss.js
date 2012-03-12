/**
 * @author runshi@staff.sina.com.cn
 * Get diss-data
 * 
 * 对第一个参数进行识别:
 *    object  :此参数作为元数据参与进行merge;
 *    element :只进行diss-data的获取。
 * 
 * @param object resource 元数据(可选)
 * @param element node 节点(必选)
 * @param element pNode 父节点限制
 * 
 * @return object
 */
$Import('kit.dom.parentAttr');
$Import('kit.extra.merge');
STK.register('module.getDiss', function($){
	return function(){
		var resource = {},
			st = 0,
			staticData = {
				'location': $CONFIG['location']
			};
			
		if(arguments[0] && !$.core.dom.isNode(arguments[0]))
			resource = arguments[st++];
			
		resource = $.kit.extra.merge(resource, staticData);
		
		if(!arguments[st])
			return resource;

		resource = $.kit.extra.merge(resource, $.core.json.queryToJson($.kit.dom.parentAttr(arguments[st++], 'diss-data', arguments[st]) || ''));
		return resource;
	};
});
