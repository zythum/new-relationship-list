$Import('ui.bubble');
$Import('kit.dom.parseDOM');
$Import('module.editorPlugin.tab');

STK.register('common.bubble.music', function($){
	var TEMP = '' + 
	'<div class="layer_send_music" node-type="outer">'+
		'<div class="tab W_textb">'+
			'<p><a class="current W_texta" action-type="tabSelect" node-type="tabSelect" href="javascript:void(0);">#L{搜索歌曲}</a><a class="" action-type="tabSelect" node-type="tabSelect" href="javascript:void(0);">#L{喜欢的歌}</a><a href="javascript:void(0);" action-type="tabSelect" node-type="tabSelect">#L{输入音乐链接}</a>'+
			'<span style="float:left" node-type="miniplayer"></span></p>'+
		'</div>'+
		'<div node-type="block" class="laMed_border" >'+
		'<div class="laMed_inp">'+
			'<input type="text" autocomplete="off" style="color: rgb(153, 153, 153);" value="#L{请输入歌曲名}" class="W_input inp_music" node-type="songInput"><a class="W_btn_a" href="javascript:void(0);" onclick="return false;" node-type="nameSearch"><span>#L{搜索}</span></a>'+
			'<div style="display:none" class="layer_menu_list" node-type="suggestLay"></div>'+
			'<p style="display: none;" node-type="searchError" class="laMed_err W_error">#L{抱歉，没有找到和}"<span node-type="searchKey"></span>"#L{有关的歌曲，换个词再试一下}</p>'+
		'</div>'+
		'<div class="laMed_titS" node-type="searchRusult" style="display:none">新浪乐库搜索结果：<span class="right W_textb">试听</span></div>'+
		'<div class="laMed_mulist" node-type="songList" style="display:none"></div>'+
		'</div>'+
		//喜欢的歌
		'<div node-type="block" class="laMed_border" style="display:none">'+
			'<div node-type="favRusult" class="laMed_titS" style="display:none">我有<a class="W_fb" href="http://music.weibo.com/ting/?musicpublisher=1#like" target="_blank" node-type="favSongCount">199</a>首喜欢的歌<i>(在<a href="http://ting.weibo.com?musicpublisher=2" target="_blank">微博音乐盒</a>标记为红心)</i></div>'+
			'<div class="laMed_mulist" node-type="favSongList" style="display:none"></div>'+
			'<div class="W_pages_minibtn" node-type="favPagingBar" style="display:none"></div>'+
			'<p class="no_music" node-type="favNoSongs" style="display:none">你还没有标记为喜欢的歌，快去 <a href="http://ting.weibo.com?musicpublisher=3" target="_blank">微博音乐盒</a> 听听</p>'+
		'</div>'+
		//end喜欢的歌
		'<div node-type="block" class="laMed_border" style="display:none">'+
		'<div class="laMed_con W_textb W_linkb">#L{目前已支持}<a href="http://music.sina.com.cn/" target="_blank">#L{新浪乐库}</a>、<a href="http://www.xiami.com/" target="_blank">#L{虾米网}</a>、<a href="http://www.songtaste.com/" target="_blank">#L{Songtaste}</a> #L{的播放页面链接，也支持MP3格式歌曲链接。}</div>'+
		'<div class="laMed_inp">'+
			'<input action-type="inputAction" type="text" style="color: rgb(153, 153, 153);" node-type="linkInput" value="#L{请输入MP3链接或新浪乐库单曲播放页链接}" class="W_input inp_music"><a class="W_btn_a" onclick="return false;" node-type="searchLink" href="javascript:void(0)"><span>#L{搜索}</span></a>'+
			'<p node-type="linkError" style="display: none;" class="laMed_err W_error">#L{没有识别出相应的歌曲信息}</p>'+
			'<p node-type="linkOptional" style="display: none;" class="laMed_err"><a href="javascript:void(0)" action-type="normalLink">#L{作为普通的链接发布}</a>&nbsp;#L{或}&nbsp;<a href="javascript:void(0)" action-type="closeLayer">#L{取消操作}</a></p>'+
		'</div>'+
		'<div class="laMed_titS" node-type="integrity" style="display:none">#L{为了更好的分享音乐，请花一点时间完善歌曲资料}</div>'+
		'<div class="laMed_muinfo" node-type="songInfo" style="display:none"></div>'+
		'</div>'+
	'</div>';

	var TSUGG = '<#et tname data>'+
		'<ul>'+
		'<#list data.music_list as list>'+
			'<li action-type="songItem" action-data="index=${list_index}" songKeyWord="${list.title}"><a onclick="return false" href="javascript:void(0);">${list.title}</a></li>'+
		'</#list>'+
		'</ul>'+
	'</#et>';

	var TLIST = '<#et tname data>'+
	'<ul>'+
	'<#list data.music_list as list>'+
		'<li artist="${list.artist}" title="${list.title}" mp3_url="${list.mp3_url}">'+
			'<div class="mu_name" action-type="song">${list.title}</div>'+
			'<div class="play" songUrl="${list.mp3_url}" action-type="player" ><span></span></div>'+
		'</li>'+
	'</#list>'+
	'</ul>'+
	'</#et>';

	var TINFO = '<table><tbody>'+
		'<tr><th><em class="W_spetxt">*</em>#L{歌曲名}</th>'+
		'<td><input type="text" value="" node-type="songName" class="W_input"></td></tr>'+
		'<tr><th>#L{演唱者}</th>'+
		'<td><input type="text" value="" node-type="artist" class="W_input"></td></tr>'+
		'<tr class="laMed_err W_error"><th></th>' +
		'<td><span class="W_error" node-type="errorSongName" style="display:none"></span></td></tr>'+
		'<tr class="laMed_btn"><th></th>'+
		'<td><a href="javascript:void(0);" class="W_btn_a" action-type="addSong"><span>#L{添加}</span></a></td></tr>'+
	'</tbody></table>';

	var TFAVLIST = '<#et tname data>'+
	'<ul>'+
	'<#list data.music_list as list>'+
		'<li artist="${list.artist}" title="${list.title}" mp3_url="${list.mp3_url}">'+
			'<div class="mu_name" action-type="favsong">${list.title}</div>'+
			'<div class="play" songUrl="${list.mp3_url}" action-type="player" ><span></span></div>'+
		'</li>'+
	'</#list>'+
	'</ul>'+
	'</#et>';

	var PAGE_TEMP = '<a action-type="favSongPage" action-data="num=#{number}" href="javascript:;" onclick="return false;">#{label}</a>';

	var PAGE_CURRENT_TEMP = '<a action-data="num=#{number}" href="javascript:;" class="current" onclick="return false;">#{label}</a>';
	
	var PAGE_PREV_TEMP = '<a class="reverse" action-type="favPagPrev" href="javascript:;" onclick="return false;"></a>';

	var PAGE_NEXT_TEMP = '<a class="next" action-type="favPagNext" href="javascript:;" onclick="return false;"></a>';

	var dom, conf, bub, outer, cont;

	var inited,songNameCache,mp3Cache,searchCache,songTimer,blurTimer,playIndex,_flashplayer,suggestIndex = -1,lastKey,suggest,favSongCache;

	var jsdomain = $CONFIG['jsPath'],L = $.kit.extra.language;

	var msg = {
		'songInput' : L('#L{请输入歌曲名}'),
		'linkInput' : L('#L{请输入MP3链接或新浪乐库单曲播放页链接}'),
		'songError' : L('#L{歌曲名不能超过15个汉字}'),
		'artistError' : L('#L{演唱者不能超过15个汉字}'),
		'interError' : L('#L{接口错误}')
	}

	var tabInfos = {
		'searchTab' : {
			'idx' : 0,
			'logstatus' : false,
			'logfn' : function(){
				inter.tabLog.request({'coflag':500010,'action':'search_click'});
				this.logstatus = true;
			}
		},
		'favTab' : {
			'idx' : 1,
			'logstatus' : false,
			'logfn' : function(){
				inter.tabLog.request({'coflag':500010,'action':'collect_click'});
				this.logstatus = true;
			}
		},
		'linkTab' : {
			'idx' : 2,
			'logstatus' : false,
			'logfn' : function(){
				inter.tabLog.request({'coflag':500010,'action':'link_click'});
				this.logstatus = true;
			}
		}
	}

	var that={};
	var getTrans = $.common.trans.editor.getTrans;
	var trim = $.core.str.trim;
	var template = $.core.util.easyTemplate;
	var prevent = $.core.evt.preventDefault;
	var init = function(){
		dom = $.kit.dom.parseDOM($.core.dom.builder(L(TEMP)).list);
		cont = dom.outer;
		bub = $.ui.bubble();
		bind();
		$.custEvent.add(bub, 'hide', (function(bub){
			return function(){
				$.custEvent.remove(bub, 'hide', arguments.callee);
				$.custEvent.fire(that, 'hide', {});
				favSongCache = false;
			};
		})(bub));

		!tabInfos.searchTab.logstatus && tabInfos.searchTab.logfn();//默认记录searchtab点击日志
	};

	var favPaging = {
		currentPage : 0,
		maxShowPage : 6,
		limit : 10
	}

	var	inter = {
		suggestMusic :  getTrans('suggestMusic',{
			'onSuccess': function(data){
				if(data.data){
					callBack.rendSugg(data);
				}
			}
		}),
		searchMusic : getTrans('searchMusic',{
			'onSuccess' : function(data){
				callBack.rendList(data);
			},
			'onError' : function(data){
				callBack.rendError();
			}
		}),
		parseMusic : getTrans('parseMusic',{
			'onSuccess' : function(data){
				callBack.rendInfo(data);
			},
			'onComplete': function(data){
				if(data.code != '100000') {
					callBack.urlError(data);
				}
			}
		}),
		addMusic : getTrans('addMusic',{
			'onSuccess' : function(data){
				callBack.urlSucc(data);
			},
			'onError' : function(){
				errorNode = $.sizzle('[node-type="errorSongName"]',dom.outer)[0];
				errorNode.innerHTML = msg.interError;
			}
		}),
		favSongSearch : getTrans('favSongSearch',{
			'onSuccess' : function(data){
				callBack.rendFavList(data);
			}
		}),
		getOutlinkInfo : function(outlink){
			return getTrans('getOutlinkInfo',{
				'onComplete': function(data){
					if(data.code == '1') {
						callBack.listenOutLinkSong(outlink,data);
					}
				}
			})
		},
		tabLog : getTrans('tabLog')
	};

	var callBack = {
		rendSugg : function(data){
			var wrap = dom.suggestLay,
				readyStr,odata = data.data;
			if(data.key != lastKey || odata === null){
				return ;
			}

			for(var i=0,l=odata.music_list.length; i<l; i++){
				odata.music_list[i].title = $.leftB(odata.music_list[i].title,30);
			}

			readyStr = template(TSUGG,odata);
			wrap.innerHTML = readyStr;
			song.showSugg();
			dom.suggestList = $.sizzle('[action-type="songItem"]',wrap);
		},
		rendError : function(){
			var value = trim(dom.songInput.value);
			value = ($.bLength(value) > 25)?($.leftB(value,25) + '...'):value;
			song.clean();

			$.core.dom.insertHTML(dom.searchKey,value);
			$.setStyle(dom.searchError,'display','');
			song.hideSugg();
		},
		rendList : function(data){
			var wrap = dom.songList,
				readyStr,odata = data.data,arr;

			song.clean();
			song.hideSugg();
			arr = odata.music_list;

			for(var i = 0; i < arr.length; i++){
				arr[i].title = [arr[i].title,arr[i].artist,arr[i].album].join('-');

				if($.bLength(arr[i].title) > 40){
					arr[i].title = [$.leftB(arr[i].title,40),'...'].join('');
				}
			}
			
			readyStr = template(TLIST,odata);
			wrap.innerHTML = readyStr;
			$.setStyle(dom.searchRusult,'display','');
			$.setStyle(dom.songList,'display','');
			$.setStyle(wrap,'display','');
		},
		rendInfo : function(data){
			var	songNodes = $.core.dom.builder(L(TINFO)),
				node = dom.songInfo,
				artistNode = songNodes.list.artist[0],
				titleNode = songNodes.list.songName[0],
				artist = data.data.artist?data.data.artist:'',
				title = data.data.title?data.data.title:'';

			node.innerHTML = '';
			node.appendChild(songNodes.box);
			titleNode.value = title;
			artistNode.value = artist;
			link.clean();
			$.setStyle(dom.integrity,'display','');
			$.setStyle(node,'display','');
		},
		urlError : function(data){
			link.clean();
			$.setStyle(dom.linkError,'display','');
			$.setStyle(dom.linkOptional,'display','');
		},
		urlSucc : function(data){
			var content = data.data.text;
			$.custEvent.fire(that,'insert',{value:content});
			link.clean();
			bub.hide();
		},
		//喜欢的歌tab点击监听
		favTabClick : function(){
			var args = arguments;
			if(args[0].idx == tabInfos.favTab.idx&&!favSongCache){
				favSongCache = true;
				song.favSong(0);
			}
			if(args[0].idx == tabInfos.searchTab.idx&&!tabInfos.searchTab.logstatus){
				tabInfos.searchTab.logfn();
			}else if(args[0].idx == tabInfos.favTab.idx&&!tabInfos.favTab.logstatus){
				tabInfos.favTab.logfn();
			}else if(args[0].idx == tabInfos.linkTab.idx&&!tabInfos.linkTab.logstatus){
				tabInfos.linkTab.logfn();
			}
		},
		setFavPagingBar : function(tpage){
			var cpage = favPaging.currentPage,
				favPagingBar = dom.favPagingBar,
				buff = [];
			
			function build(buff,start,end){
				for(var i = start; i < end; i += 1){
					if(cpage == i){
						buff.push($.templet(PAGE_CURRENT_TEMP,{
							'number':i,
							'label': i + 1
						}));
					}else{
						buff.push($.templet(PAGE_TEMP,{
							'number':i,
							'label': i + 1
						}));
					}
				}
			}

			function buildB(buff){
				buff.push($.templet(PAGE_TEMP,{
					'number':0,
					'label': 1
				}));
				buff.push('...');
			}

			function buildE(buff,tpage){
				buff.push('...');
				buff.push($.templet(PAGE_TEMP,{
					'number':tpage-1,
					'label': tpage
				}));
			}

			if(tpage <= favPaging.maxShowPage+2){
				build(buff,0,tpage);
			}else{
				if(favPaging.currentPage < favPaging.maxShowPage/2+1){
					build(buff,0,favPaging.maxShowPage);
					buildE(buff,tpage);
				}else if(favPaging.currentPage+(favPaging.maxShowPage/2+1) >= tpage){
					buildB(buff);
					build(buff,tpage-favPaging.maxShowPage,tpage);
				}else{
					buildB(buff);
					build(buff,favPaging.currentPage-(favPaging.maxShowPage/2-1),favPaging.currentPage+(favPaging.maxShowPage/2-1)+1);
					buildE(buff,tpage);
				}
			}

			if(tpage>1){
				buff.unshift($.templet(PAGE_PREV_TEMP));
				buff.push($.templet(PAGE_NEXT_TEMP));
			}

			favPagingBar.innerHTML = buff.join('');
		},
		rendFavList : function(data){
			var wrap = dom.favSongList,
				favSongCount = dom.favSongCount,
				readyStr,odata = data.data,arr,total,tpages;

			arr = odata.music_list;
			total = odata.music_num;
			tpages = Math.ceil(total/favPaging.limit);			
			favPaging.totalPage = tpages;
			
			if(arr.length<1){
				$.setStyle(dom.favNoSongs,'display','');
				$.setStyle(dom.favSongList,'display','none');
				$.setStyle(dom.favRusult,'display','none');
				$.setStyle(dom.favPagingBar,'display','none');
				return;
			}

			for(var i = 0; i < arr.length; i++){
				arr[i].title = [arr[i].title,arr[i].artist].join('-');

				if($.bLength(arr[i].title) > 40){
					arr[i].title = [$.leftB(arr[i].title,40),'...'].join('');
				}
			}
			
			readyStr = template(TFAVLIST,odata);
			wrap.innerHTML = readyStr;
			favSongCount.innerHTML = total;
			callBack.setFavPagingBar(tpages);
			$.setStyle(dom.favSongList,'display','');
			$.setStyle(dom.favRusult,'display','');
			$.setStyle(dom.favPagingBar,'display','');
			$.setStyle(dom.favNoSongs,'display','none');
			$.setStyle(wrap,'display','');
		},
		listenOutLinkSong : function(outlink,data){
			_flashplayer.setUrl(data.data[outlink]['songurl']);
		}
	};

	var song = {
		focus : function(e){
			var target = $.fixEvent(e).target,
				value = trim(target.value),
				hasContent = (value == msg.songInput || value === '')?false:true;

			clearTimeout(blurTimer);
			
			if(!hasContent){
				target.value = '';
			}else if(trim(dom.suggestLay.innerHTML) !== ''){
				song.showSugg();
			}
		},
		blur : function(e){
			var target = $.fixEvent(e).target,
				value = trim(target.value),
				hasContent = (value === '' || value == msg.songInput)?false:true;

			if(!hasContent){
				target.value = msg.songInput;
			}

			clearTimeout(blurTimer);
			blurTimer = setTimeout(song.hideSugg,1000);
		},
		keyhandler : function(e){
			if(e.keyCode == 13){
				setTimeout(song.search,0);
			}

			if(e.keyCode == 27){
				song.hideSugg();
			}
		},
		showSugg : function(){
			suggestIndex = -1;
			$.setStyle(dom.suggestLay,'display','');
			$.custEvent.fire(suggest,'open',dom.songInput);
			$.addEvent(document,'click',song.hideSugg);
		},
		hideSugg : function(e){
			var target = e?$.core.evt.fixEvent(e).target:null,
				node = dom.suggestLay,
				input = dom.songInput;

			if(target && (target == input || $.core.dom.contains(node,target))){
				return false;
			}

			if(suggestIndex > -1 && dom.suggestList[suggestIndex]){
				$.removeClassName(dom.suggestList[suggestIndex],'cur');
			}
			$.setStyle(node,'display','none');
			$.custEvent.fire(suggest,'close');
			$.removeEvent(document,'click',song.hideSugg);
		},
		goSugg : function(e){
			var node = dom.songInput,
				value = trim(node.value);

			clearTimeout(songTimer);

			if(value == msg.songInput || value == songNameCache){
				return ;
			}else if(value === '' ){
				song.hideSugg();
				return ;
			}else{
				dom.suggestLay.innerHTML = '';
				$.setStyle(dom.suggestLay,'display','none');
			}

			songTimer = setTimeout(function(){
				lastKey = $.core.util.getUniqueKey();
				inter.suggestMusic.request({'key':value,'_k':lastKey});
				songNameCache = value;
			},200);
		},
		searchChoose : function(evt,idx){
			var songInput = dom.songInput,
				node,value;

			if(suggestIndex >= 0){
				node = dom.suggestList[idx];
				value = node.getAttribute('songkeyword');
				songInput.value = value;
				songNameCache = value;
			}
		},
		search : function(){
			var songInput = dom.songInput,
				val = trim(songInput.value);

			if(val === '' || val == msg.songInput){
				return;
			}

			if(_flashplayer && _flashplayer.songStop){
				_flashplayer.songStop();
			}
			
			window.setTimeout(function(){
				inter.searchMusic.request({'key':val});
				searchCache = val;
			},0);
		},
		clean : function(){
			var error = dom.searchError,
				result = dom.searchRusult,
				list = dom.songList

			songIndex = null;
			songNameCache = '';
			list.innerHTML = '';
			dom.searchKey.innerHTML = '';
			$.setStyle(error,'display','none');
			$.setStyle(result,'display','none');
		},
		add : function(opts){
			var songIndex = opts.el.parentNode,
				mp3_url = songIndex.getAttribute('mp3_url'),
				title = songIndex.getAttribute('title'),
				artist = songIndex.getAttribute('artist');

			prevent();
			inter.addMusic.request({'url':mp3_url,'title':title,'artist':artist});
		},
		setIndex : function(evt,idx){
			var node;
			if(suggestIndex >= 0){
				node = dom.suggestList[suggestIndex]?dom.suggestList[suggestIndex]:null;
				if(node.parentNode && node.parentNode.nodeType != 11){
					$.removeClassName(node,'cur');
				}
			}

			if(dom.suggestList[idx]){
				$.addClassName(dom.suggestList[idx],'cur');
			}

			suggestIndex = idx;
		},
		controlSong : function(opts){
			var el = opts.el;

			if(playIndex && playIndex != el){
				playIndex.className = 'play';
			}

			playIndex = el;

			if(el.className == 'W_loading'){
				return;
			}else if(el.className == 'play'){
				player.playSong(el);
			}else if(el.className == 'stop'){
				player.pauseSong();
			}
		},
		//喜欢的歌
		addfavSong : function(opts){
			var songIndex = opts.el.parentNode,
				mp3_url = songIndex.getAttribute('mp3_url'),
				title = songIndex.getAttribute('title'),
				artist = songIndex.getAttribute('artist');

			prevent();
			
			if(mp3_url.indexOf('http://t.cn')>=0){
				var content = title+'-'+mp3_url;
				$.custEvent.fire(that,'insert',{value:content});
				bub.hide();
			}else{
				inter.addMusic.request({'url':mp3_url,'title':title,'artist':artist});
			}
		},
		favSong : function(start){
			favPaging.currentPage = Math.floor(start/favPaging.limit);
			inter.favSongSearch.request({'start':start,'limit':favPaging.limit});
		},
		favSongPage : function(pinfo){
			song.favSong(pinfo.data.num*favPaging.limit);
		},
		favSongPrev : function(){
			if(favPaging.currentPage<1){
				return;
			}
			favPaging.currentPage--;
			song.favSong(favPaging.currentPage*favPaging.limit);
		},
		favSongNext : function(){
			if(favPaging.currentPage >= favPaging.totalPage-1){
				return;
			}
			favPaging.currentPage++;
			song.favSong(favPaging.currentPage*favPaging.limit);
		},
		getOutlinkInfo : function(outlink){
			inter.getOutlinkInfo(outlink).request({'short_url':outlink,'source':'872034675'});
		}
		//end
	};

	var link = {
		focus : function(e){
			var target = $.fixEvent(e).target,
				value = trim(target.value),
				hasContent = (value == msg.linkInput || value === '')?false:true;

			if(!hasContent){
				target.value = '';
			}

			target.select();
		},
		blur : function(e){
			var target = $.fixEvent(e).target,
				value = trim(target.value),
				hasContent = (value === '' || value == msg.linkInput)?false:true;

			if(!hasContent){
				target.value = msg.linkInput;
			}
		},
		clean : function(){
			$.setStyle(dom.integrity,'display','none');
			$.setStyle(dom.songInfo,'display','none');
			$.setStyle(dom.linkError,'display','none');
			$.setStyle(dom.linkOptional,'display','none');
		},
		addSong : function(){
			var title = trim($.sizzle('[node-type="songName"]',dom.outer)[0].value),
				artist = trim($.sizzle('[node-type="artist"]',dom.outer)[0].value),
				mp3_url = trim(dom.linkInput.value),
				errorNode = $.sizzle('[node-type="errorSongName"]',dom.outer)[0];

			prevent();
			if(title === ''){
				errorNode.innerHTML = msg.songInput;
				$.setStyle(errorNode,'display','');
				return;
			}else if($.bLength(title)>30){
				errorNode.innerHTML = msg.songError;
				$.setStyle(errorNode,'display','');
				return;
			}else if($.bLength(artist)>30){
				errorNode.innerHTML = msg.artistError;
				$.setStyle(errorNode,'display','');
				return;
			}
			inter.addMusic.request({'title':title,'url':mp3_url,'artist':artist});
		},
		search : function(){
			var value = trim(dom.linkInput.value);

			if(value === '' || value === msg.linkInput){
				return;
			}
			inter.parseMusic.request({'url':value});
		},
		normal : function(){
			var value = trim(dom.linkInput.value);

			$.custEvent.fire(that,'insert',{'value':value + ' '});
			custFuncs.closeLayer();
		}
	};

	window.origin_miniplayer_music = function(status,type){
		var cls;

		if(type != 'buffer' && type != 'playing'){
			return ;
		}else if(type == 'playing'){
			cls = 'stop';
		}else if(type == 'buffer'){
			cls = 'W_loading';
		}

		if($.core.dom.isNode(playIndex)){
			playIndex.className = cls;
		}
	};

	var player = {
		init : function(){
			var wrap = dom.miniplayer;
			var uniqueId = $.getUniqueKey();
			_flashplayer = $.core.util.swf.create(wrap,jsdomain + '/home/static/swf/player/MiniPlayer.swf',{
				'id' : uniqueId,  
				'flashvars': {
					'statusListener' : 'origin_miniplayer_music'
				},
				'paras' : {
					quality: "high",
					allowScriptAccess: "always",
					wmode: "transparent",
					allowFullscreen: true
				},
				'attrs' : {
					name : uniqueId			
				}
			});
		},

		playSong : function(el){
			var url = el.getAttribute('songUrl');

			if(url == mp3Cache){
				_flashplayer.songPlay();
				return ;
			}

			if(_flashplayer && _flashplayer.setUrl){
				if(url.indexOf('http://t.cn/')>=0){
					var outlink = url.replace('http://t.cn/','');
					song.getOutlinkInfo(outlink)
				}else{
					_flashplayer.setUrl(url);
				}
				mp3Cache = url;
			}
		},
		pauseSong : function(){
			playIndex.className = 'play';
			_flashplayer.songStop();
		}
	};

	var custFuncs = {
		closeLayer : function(){
			bub.hide();
		}
	};

	var bind = function(){
		var d = $.core.evt.delegatedEvent(dom.outer);
		$.custEvent.define(that, 'insert');
		$.custEvent.define(that, 'hide');

		d.add('player','click',song.controlSong);
		d.add('addSong','click',link.addSong);
		d.add('normalLink','click',link.normal);
		d.add('closeLayer','click',custFuncs.closeLayer);
		d.add('song','click',song.add);
		d.add('favsong','click',song.addfavSong);
		d.add('favSongPage','click',song.favSongPage);
		d.add('favPagPrev','click',song.favSongPrev);
		d.add('favPagNext','click',song.favSongNext);

		$.addEvent(dom.songInput,'focus',song.focus);
		$.addEvent(dom.songInput,'blur',song.blur);
		$.addEvent(dom.songInput,'keyup',song.goSugg);
		$.addEvent(dom.songInput,'keydown',song.keyhandler);
		$.addEvent(dom.nameSearch,'click',song.search);
		$.addEvent(dom.linkInput,'focus',link.focus);
		$.addEvent(dom.linkInput,'blur',link.blur);
		$.addEvent(dom.searchLink,'click',link.search);

		$.module.editorPlugin.tab(dom.outer,{
			'evtType' : 'click',
			'tNodes' : '[node-type="tabSelect"]',
			'dNodes' : '[node-type="block"]',
			'className' : 'current W_texta',
			'cb' : callBack.favTabClick
		});
		
		suggest = $.module.suggest({
			'textNode' : dom.songInput,
			'uiNode'   : dom.suggestLay,
			'actionType': 'songItem',
			'actionData': 'index'
		});

		$.custEvent.add(suggest,'onIndexChange',song.setIndex);
		$.custEvent.add(suggest,'onSelect',song.searchChoose);

		setTimeout(player.init,100);
	};
	return function(el){
		init();

		if(!$.isNode(el)){
			throw 'common.bubble.music need el as first parameter!';
		}

		bub.setContent(cont);
		bub.setLayout(el,{'offsetX':-29, 'offsetY':5});
		bub.show();

		return that;
	};
});
