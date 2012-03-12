/**
 * Created by .
 * User: qbaty || yuheng@staff.sina.com.cn
 * Date: 11-5-25
 */
$Import('kit.extra.language');
STK.register('common.extra.imgUploadCode',function($){
	var lang = $.kit.extra.language;
	var codeList = {
		'-1' : lang("#L{没有登录}"),
		'-2' : lang("#L{没有收到PUT的数据}"),
		'-3' : lang("#L{没有指定cb参数}"),
		'-4' : lang("#L{没有发现提交上传文件}"),
		'-5' : lang("#L{该app没有开放图片上传服务}"),
		'-6' : lang("#L{SINAPRO或uid非法}"),
		'-7' : lang("#L{参数s值不被支持}"),
		'-8' : lang("#L{数据上传失败}"),
		'-9' : lang("#L{文件mime类型不支持}"),
		'-10' : lang("#L{文件字节数超限}"),
		'-11' : lang("#L{存储错误}")
	}
	return function(key){
		return codeList[key];
	};
});