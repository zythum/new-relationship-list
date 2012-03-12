$Import('kit.extra.crc32');

STK.register('common.extra.imageURL',function($){
	return function(id, opts){
		var oOpts = {
			'size' : 'small'
		};
		/* TODO 小漆，这里直接 return 后，再次点击图片上传按钮，会先出来一个空白层 */
		if(typeof id != "string"){
			return;
		}
		oOpts = $.core.obj.parseParam(oOpts,opts);
		
		var size = oOpts.size;
		
		
		//comm func
		function hexdec(hex_string){
			hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
			return parseInt(hex_string, 16);
		}
		
		//json to img types
		var types = {
			ss: {
				middle: '&690',
				bmiddle: '&690',
				small: '&690',
				thumbnail: '&690',
				square: '&690',
				orignal: '&690'
			},
			ww: {
				middle: 'bmiddle',
				large: 'large',
				bmiddle: 'bmiddle',
				small: 'small',
				thumbnail: 'thumbnail',
				square: 'square',
				orignal: 'large'
			}
		};
		//check 'w'
		var isW = id.charAt(9) == 'w';
		var ext = id.charAt(21) == 'g' ? '.gif' : '.jpg';
		//count domain
		var domainNum = isW ? ($.kit.extra.crc32(id) % 4 + 1) : (hexdec(id.substr(19, 2)) % 16 + 1);
		//build url
		var url = 'http://' + (isW ? 'ww' : 'ss') + domainNum + '.sinaimg.cn/' + (isW ? types['ww'][size] : size) + '/' + id + (isW ? ext : '') + (isW ? '' : types['ss'][size]);
		
		return url;
	};
});
