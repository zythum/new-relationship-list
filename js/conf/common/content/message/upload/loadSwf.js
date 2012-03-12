/**
 * common.content.message.upload.loadSwf
 * @id STK.
 * @author WK | wukan@staff.sina.com.cn
 * @example
 *
 */
$Import('common.content.message.upload.start');
$Import('common.content.message.upload.complete');
$Import('common.content.message.upload.showMsg');
$Import('common.content.message.upload.deleteItem');
$Import('common.content.message.upload.addItem');
$Import('common.content.message.upload.cancel');
$Import('common.content.message.upload.getExt');
$Import('module.getLang');
$Import('kit.extra.language');
$Import('ui.dialog');
$Import('kit.io.cssLoader');
STK.register('common.content.message.upload.loadSwf', function($) {

    $.kit.io.cssLoader('style/css/module/layer/layer_version_upgrade.css', 'js_style_css_module_layer_layer_version_upgrade');
    return function(parentDom,opts) {
        var _ran = parseInt(Math.random() * 10000, 10);

        var conf  =  {
		        'width':'110',
                'height':'16',
                 'paras' : {
                    allowScriptAccess: "always",
                    wmode: "transparent"

                },
                'flashvars':{
                    'space' : '15',
                    'maxNum' :10,
                    'width' : '40',
                    'height' :'15',
                    'swfid':_ran,
                    'maxSize':1024 * 1024 * 50,
                    'iExt':'*.jpg; *.gif; *.jpeg; *.png',
                    'fExt':'',//空表示所有
                    'domain':'http://' + document.domain
                }
            };
            var flashopts =  opts && opts.flashvars;
            if(flashopts)
            {
                for(o in flashopts)
                {
                  conf.flashvars[o] = flashopts[o];
                }
            }


        var FlashDom = '<div class="layer_version_upgrade">' +
                '<dl class="point clearfix">' +
                '<dt><span class="icon_versionup"></span></dt>' +
                '<dd><p class="W_texta">#L{你的Flash版本过低，请安装更高版本的Flash插件后，再刷新页面重试}</p></dd>' +
                '</dl>' +
                '<div class="versionup_btn"><a class="btn_l" href="http://get.adobe.com/cn/flashplayer/" target="_blank"><img width="16" height="16" class="icon_install" title="" src="' + $CONFIG.imgPath + 'style/images/common/transparent.gif">' +
                '<span class="txt">#L{安装更新}</span></a><a class="btn_r" href="javascript:void(0);" onclick="window.location.reload()">' +
                ' <img width="16" height="16" class="icon_refreshpage" title="" src="' + $CONFIG.imgPath + 'style/images/common/transparent.gif">' +
                '<span class="txt">#L{刷新页面}</span></a></div>' +
                '</div>';

        var getFlashVersion = function() {
            var f = "1", n = navigator;
            if (n.plugins && n.plugins.length) {
                for (var ii = 0; ii < n.plugins.length; ii++) {
                    if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) {
                        f = n.plugins[ii].description.split('Shockwave Flash ')[1];
                        break;
                    }
                }
            } else if (window.ActiveXObject) {
                for (var ii = 10; ii >= 2; ii--) {
                    try {
                        var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + ii + "');");
                        if (fl) {
                            f = ii + '.0';
                            break;
                        }
                    } catch (e) {
                    }
                }
            }
            return f.split(".")[0];
        };
        $.log('parrentDom', parentDom, STK.sizzle('[node-type="uploadSwf"]', parentDom));
        var showTip = function() {
            $.kit.io.cssLoader('style/css/module/layer/layer_version_upgrade.css', 'js_style_css_module_layer_layer_version_upgrade', function() {
                if (parseInt(getFlashVersion()) < 10) {
                    var showtDig = $.ui.dialog();
                    showtDig.setTitle($L('#L{提示}'));
                    var tipDiv = $.C("div");
                    tipDiv.innerHTML = $.kit.extra.language(FlashDom);
                    showtDig.appendChild(tipDiv);
                    tipDiv = null;
                    showtDig.show();
                    showtDig.setMiddle();
                }
            });
        };
        if (parseInt(getFlashVersion()) >= 10) {
            var swfObj = STK.core.util.swf.create(STK.sizzle('[node-type="uploadSwf"]', parentDom)[0], $CONFIG['jsPath'] + 'home/static/swf/upload.swf?ver=' + $CONFIG['version'], conf);
            swfObj.setAttribute('flashObj', _ran);
            swfObj.flashObj = _ran;
            $.sizzle('[node-type="uploadList"]', parentDom)[0].setAttribute('swfid', _ran);
        }
        else {
            var dom = STK.sizzle('[node-type="uploadSwf"]', parentDom)[0];
            $.addEvent(dom, "click", showTip);

        }
        //return swfObj;
        return _ran;
    }
});
