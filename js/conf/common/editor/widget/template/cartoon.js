STK.register('common.bubble.template.cartoon', function($) {
	var data = {
		template : 	'<#et temp data>'+

			'            <div class="tab_c W_textb">'+
			'              <p>'+



			'<#list data.typeData as list>'+

			//'${list_index}'+
			'<#if (list_index != 0)>'+
			'<em class="W_vline">|</em>'+
			'</#if>'+

			'<#if (list == data.type)>'+
			'<a href="javascript:void(0);" class="current W_texta" action-type="changeType" action-data="type=${list}">${list}</a>'+
			'<#else>'+
			'<a href="javascript:void(0);" action-type="changeType" action-data="type=${list}">${list}</a>'+
			'</#if>'+

			'</#list>'+


			'</p>'+
			'<p class="second W_linkb" node-type="categoryList"><span class="right" node-type="cPage" pointer="0"><a class="pre_d" href="javascript:void(0);" action-type="prev" node-type="prev"></a><a class="next" href="javascript:void(0);" action-type="next" node-type="next"></a></span>'+

			'<#list data.categoryData as list>'+
			'<#if (list_index != 0)>'+
			'<em class="W_vline"'+
			'<#if (list_index > 5)>'+
			' style="display:none"'+
			'</#if>'+
			'>|</em>'+
			'</#if>'+
			'<a href="javascript:void(0);" node-type="${list}" class="'+
			'<#if (list == data.category)>'+
			'current W_texta'+
			'</#if>'+
			'"'+
			'<#if (list_index > 5)>'+
			' style="display:none"'+
			'</#if>'+
			'  action-type="changeCategory" action-data="c=${list}">${list}</a>'+
			'</#list>'+


			'</p>'+
			'            </div>'+
			'            '+
			'            <!--魔法表情-->'+
			'            <div style="" class="">'+
			'              <div class="detail">'+
			'                <ul class="faces_magic_list clearfix">'+

			'<#list data.itemList as list>'+
			'<li action-type="insertSmiley"'+

			'<#if (list_index > 11)>'+
			'style="display:none"'+
			'</#if>'+
			'action-data="url=${list.thumb}" original="${list.original}"><a class="img" href=""><img src="${list.thumb}" original="${list.original}" alt="${list.phrase}" /></a><span>${list.phrase}</span></li>'+
			'</#list>'+




			'                </ul>'+

			'                <div class="W_pages W_pages_comment">'+

			'<a class="current" href="javascript:void(0);" action-type="changePage" action-data="page=1">1</a>'+
			'<a href="javascript:void(0);" action-type="changePage" action-data="page=2">2</a>'+
			'<a href="javascript:void(0);" action-type="changePage" action-data="page=3">3</a>'+
			'<a href="javascript:void(0);" action-type="changePage" action-data="page=4">4</a>'+
			'</div>'+
			'              </div>'+
			'            </div>'+
			'            <!--/魔法表情--> '+
		'</#et>'
	
	}
	return data;
});







