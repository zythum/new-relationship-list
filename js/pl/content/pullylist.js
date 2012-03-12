/**
 *  tips推广位，根据dom中的start和end time分析哪几个tip显示。
 * creater: xionggq guoqing5@staff.sina.com.cn
 * Date: 11-7-21
 * Time: 下午2:23
 */
$Import('comp.content.pullylist');

STK.pageletM.register("pl.content.pullylist", function($) {
          var node = $.E("pl_content_pullylist");
	    var that = $.comp.content.pullylist(node);
        return   that;
    });
