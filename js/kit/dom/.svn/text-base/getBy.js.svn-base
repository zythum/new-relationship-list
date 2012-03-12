/**
 * @author wangliang3
 */
STK.register('kit.dom.getBy',function($){
	return function(method, tag, root){
		tag = tag || '*';
        if (!root) {
            return [];
        }
        var nodes = [], elements = root.getElementsByTagName(tag);
        for (var i = 0, len = elements.length; i < len; ++i) {
            if (method(elements[i])) {
                nodes[nodes.length] = elements[i];
            }
        }
        return nodes;
	}
});