/**
 * common.editor.widget.module.saveData
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 * 
 */
STK.register('common.editor.widget.module.saveData', function($){
	return function(data){
		var _more = data.more;



		itemData = {};
		var category = [];
		itemData['默认'] = data['usual'].norm;
		
		var addName = function(item){
			//$.log(item);
			for(var i=0,l=item.length;i<l;i++){
				var p = item[i]['phrase'];
				item[i]['name'] = ($.core.str.bLength(p)>4)?$.leftB(p,6)+'...':p;
			}

		};
		addName(itemData['默认']);
	
		category.push('默认');


		for(var key in data.more){
			addName(data.more[key]);

			category.push(key);
		}	
		itemData = $.kit.extra.merge(itemData,data.more);
		itemData['category'] = category;
		//$.log(itemData);
		return itemData;
	}
});
