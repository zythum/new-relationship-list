/**
 * 任务通用弹窗
 * @author yadong
 */
$Import('module.layer');
$Import('ui.dialog');
$Import('comp.content.userCard');
STK.register('common.dialog.nameListLayer', function($){
    var template = '<div class="layer_namelist" node-type="outer" >' +
    '<ul class="face_name clearfix" node-type="inner">' +
    '<li node-type="facebox"><a href="javascript:void(0);" class="per" title=""><img usercard="赵与"  width="50" height="50" src="http://tp2.sinaimg.cn/1282005885/50/1283203874/1" alt="" class="headpic"><span usercard="赵与" class="name">蔡康永<img width="11" height="10" src="../../../images/common/transparent.gif" alt="" class="approve"></span></a></li>' +
    '<li node-type="facebox"><a href="javascript:void(0);" class="per" title=""><img usercard="赵与" width="50" height="50" src="http://tp2.sinaimg.cn/1282005885/50/1283203874/1" alt="" class="headpic"><span class="name">蔡康永<img width="11" height="10" src="../../../images/common/transparent.gif" alt="" class="approve"></span></a></li>' +
    '<li node-type="facebox"><a href="javascript:void(0);" class="per" title=""><img usercard="李开复" width="50" height="50" src="http://tp2.sinaimg.cn/1282005885/50/1283203874/1" alt="" class="headpic"><span class="name">蔡康永<img width="11" height="10" src="../../../images/common/transparent.gif" alt="" class="approve"></span></a></li>' +
    '<li node-type="facebox"><a href="javascript:void(0);" class="per" title=""><img usercard="李开复" width="50" height="50" src="http://tp2.sinaimg.cn/1282005885/50/1283203874/1" alt="" class="headpic"><span class="name">蔡康永<img width="11" height="10" src="../../../images/common/transparent.gif" alt="" class="approve"></span></a></li>' +
    '<li node-type="facebox"><a href="javascript:void(0);" class="per" title=""><img usercard="李开复" width="50" height="50" src="http://tp2.sinaimg.cn/1282005885/50/1283203874/1" alt="" class="headpic"><span class="name">蔡康永<img width="11" height="10" src="../../../images/common/transparent.gif" alt="" class="approve"></span></a></li>' +
    '<li node-type="facebox"><a href="javascript:void(0);" class="per" title=""><img usercard="李开复" width="50" height="50" src="http://tp2.sinaimg.cn/1282005885/50/1283203874/1" alt="" class="headpic"><span class="name">蔡康永<img width="11" height="10" src="../../../images/common/transparent.gif" alt="" class="approve"></span></a></li>' +
    '</ul>' +
    '<div class="W_pages_minibtn"><a class="reverse" href="javascript:void(0);"></a><a href="javascript:void(0);" action-type="page" action-data="num=1">1</a><a class="current" href="javascript:void(0)">2</a><a href="javascript:void(0)">3</a><a href="javascript:void(0)">4</a><a href="javascript:void(0)">5</a><a href="javascript:void(0)">6</a><a href="javascript:void(0)">7</a><span class="doccolor">...</span><a href="javascript:void(0)">48</a><a class="next" href="javascript:void(0)"></a></div>' +
    '</div>';
    var apis = {};
    var nameListDom, dialog, cardPlugin, delegate;
    var parseDOM = function(temp){
        nameListDom = $.module.layer(temp);
    };
    var bindDOMFuns = {
        "gotoPage": function(spec){
            alert(spec.data.num);
        }
    };
    var bindDOM = function(){
        delegate.add('page', 'click', bindDOMFuns.gotoPage);
    };
    var nameListLayer = {
        "init": function(temp){
            parseDOM(temp);
        },
        "show": function(spec){
            var defaults = {
                title: "共同关注",
                temp: template
            };
            var opts = $.core.obj.parseParam(defaults, spec);
            this.init(opts.temp ? opts.temp : template);
            dialog = $.ui.dialog();
            dialog.setTitle(opts.title ? opts.title : "共同关注");
            dialog.appendChild(nameListDom.getOuter());
            delegate = $.core.evt.delegatedEvent(nameListDom.getOuter());
            dialog.show();
            dialog.setMiddle();
            cardPlugin = $.comp.content.userCard(nameListDom.getOuter(), {
				'order': 't'
			});
            bindDOM();
        },
        "hidden": function(){
        }
    };
    return nameListLayer;
});
