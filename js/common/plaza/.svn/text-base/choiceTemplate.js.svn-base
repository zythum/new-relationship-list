/**
 * @author wangliang3
 */
$Import('kit.extra.language');
STK.register('common.plaza.choiceTemplate', function($){
	var $L = $.kit.extra.language;
	var loadingPIC = $CONFIG['imgPath'] + '/style/images/common/loading.gif';
	
	return {
		loading: $L('<div class="W_loading"><span>#L{正在加载，请稍候}...</span></div>'),
		slideFrame: $L('<div action-type="prev" node-type="prev"><a class="scrll_btn up" href=""></a></div>'+
				       '<div class="pic_list">'+
				           '<div node-type="panel" class="pic_list_con">'+
				               '<ul node-type="cont"></ul>'+
				           '</div>'+
				       '</div>'+
				       '<div action-type="next" node-type="next"><a class="scrll_btn down" href=""></a></div>'),
		slideItem: $L('<#et temp data><li node-type="item"><a node-type="view" action-type="view" action-data="mid=${data.mid}&pid=${data.pid}&uid=${data.uid}&mlink=${data.mlink}" href="?"><i></i><img node-type="img" src="'+$CONFIG['imgPath']+'/style/images/common/transparent.gif"></a></li></#et>'),
		choiceLayer: $L('<div node-type="choice_layer" class="layer_boutique_new" style="display:none;">'+
				            '<div node-type="scroll_layer" class="boutique_pic clearfix">'+
				                '<div class="cls_bar">'+
				                    '<a class="cls_btn" href="" action-type="layer_close"></a>'+
				                '</div>'+
				                '<dl class="connectPer clearfix" node-type="layer_userinfo"></dl>'+
				                '<div class="pic_body">'+
									'<div class="pic_slider" node-type="layer_slide"></div>'+
				                    '<div class="big_pic" node-type="layer_center">'+
				                        '<div class="picImg" node-type="img_cont">'+
				                            '<img node-type="img_view" src="'+$CONFIG['imgPath']+'/style/images/common/transparent.gif"/>'+
				                        '</div>'+
				                        '<div class="right_comment" node-type="layer_comment">'+
				                            '<dl class="feed_list feed_list_b">'+
				                                '<dd node-type="comment_detail"></dd>'+
				                                '<dd class="content" node-type="comment_repeat"></dd>'+
				                                '<dd class="clear"></dd>'+
				                            '</dl>'+
				                        '</div>'+
				                    '</div>'+
									'<a class="fullBtn" href="" title="#L{查看原微博}" node-type="btn_full"></a>'+
				                '</div>'+
				            '</div>'+
				        '</div>'),
		followed: $L('<a class="W_addbtn_es" href="javascript:;">#L{已关注}</a>')
		
	}
	
});