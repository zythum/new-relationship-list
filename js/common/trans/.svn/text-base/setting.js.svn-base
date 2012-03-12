/**
 * 设置区
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 *
 * @Change log
 * 	runshi Wang @2011-07-06 加入medalCard(勋章)接口
 */

$Import('kit.io.inter');
STK.register('common.trans.setting',function($){
	var t = $.kit.io.inter();
	var g = t.register;
	g('checkNick',	{'url':'/ajax/relation/checkNick','method':'post'});
	g('baseInfo',	{'url':'/ajax/relation/baseInfo','method':'post'});
	g('changeEmail',{'url':'/ajax/relation/changeEmail','method':'post'});
	g('changePwd', {'url':'/ajax/relation/changePwd','method':'post'});
	g('receivingInfo', {'url':'/ajax/relation/receivingInfo','method':'post'});
	g('changeDomain', {'url':'/ajax/settings/changedomain','method':'post'});
	
	//TO-DO
	g('addTags', {'url':'/t4/home/_html/common/data/addTags.js','method':'post'});
	g('delTag', {'url':'/t4/home/_html/common/data/delTag.js','method':'post'});
	g('tagList', {'url':'/t4/home/_html/common/data/tagList.js','method':'get'});
	
	g('addTagsLayerSubmit', {'url':"/aj3/person/aj_addusertag_v4.php", 'method':"post"});
	
	g('medalCard', {'url':'/aj/badge/card','method':'get'});
	g('darenCard', {'url':'/aj/club/card','method':'get'});
    g('getDarenCard', {'url':'/aj/badge/card','method':'get'});

	return t;
});

