/**
 * 版本提示
 * @author zhaobo@staff.sina.com.cn
 */
$Import("kit.dom.parseDOM");
$Import("common.trans.versionTip");
$Import("common.guide.util.tipManager");
$Import("kit.dom.firstChild");
STK.register('comp.content.versionTip', function($) {
    var isNarrow = $CONFIG['isnarrow'] == '1';
		var getTargets = [
             function()
             {
                 var $top = $.E('pl_content_top');
                var $input = $.sizzle('[node-type="searchInput"]' , $top)[0];
                 return $input;
             },
			function() {
				var node = $.E("pl_content_homeFeed");
				var target = $.sizzle("ul[node-type='feedGroup'] li:eq(0)" , node)[0];
				return target; 				
			},
			function() {
				var node = $.E("pl_content_setskin");
				var target = $.sizzle("a[action-type='set_skin']" , node)[0];
				return target;				
			},
			function() {
				var wrapper = $.E("pl_content_homeFeed");
				var first =  $.sizzle("dl.feed_list:eq(0)" , wrapper)[0];
				return $.sizzle("a[action-type='feed_list_forward']" , first)[0];				
			},
			function() {
				var wrapper = $.E("pl_content_homeFeed");
				var first =  $.sizzle("dl.feed_list:eq(0)" , wrapper)[0];
				return $.sizzle("a[action-type='feed_list_comment']" , first)[0];				
			},
			function() {
				var node = $.E("pl_content_top");
				return $.sizzle("li[node-type='account']" , node)[0];				
			}
		];
		var get1 = function() {
			if(isNarrow) {
				return "bottom"; 				
			} else {
				return "right";				
			}
		};
		var get2 = function() {
			if(isNarrow) {
				return "fixed";				
			} else {
				return "absolute";				
			}
		};
		var get3 = function() {
			if(isNarrow) {
				return null;				
			} else {
				return {
					target : {
						top : 6						
					}
				}				
			}
		};
		var get4 = function() {
			if(isNarrow) {
				return {
					"z-index" : "10000"
				};				
			}			
		};
		var opts = [
            {pos : 'bottom' , position : "fixed",style : {
				"z-index" : "10000"
			}},
			{pos : 'top' , position : "absolute" , 
				offset : {
					target : {
						left : 80
					},
					arrow : {
						left : -80
					}
				}
			} , 
			{pos : 'bottom' , position : "absolute"} , 
			{pos : 'bottom' , position : "absolute" , 
				offset : {
					target : {
						top : 7
					}
				}
			} , 
			{pos : 'bottom' , position : "absolute" , 
				offset : {
					target : {
						top : 7
					}
				}
			} ,
			{pos : "bottom" , position : "fixed" , style : {
				"z-index" : "10000"				
			}}
		];
		var transOpt = {
			pointer : $.common.trans.versionTip,
			name : "save" 			
		};
    var firstChild = $.kit.dom.firstChild($.E('pl_content_versionTip'));
    if (firstChild && firstChild.getAttribute("messageTip")) {
        var type = firstChild.getAttribute("messageTip");
        switch (type) {
            case "1" :
                getTargets = [
                             function() {
                                 var node = $.E("pl_content_top");
                                 return $.sizzle("li[node-type='account']", node)[0];
                             }
                ];

                opts = [
                    {pos : "bottom" , position : "fixed" ,offset : {
                        target : {
                            left : -90
                        },
                        arrow : {
                            left : 90
                        }
                    }, style : {
                        "z-index" : "10000"
                    }}
                ];
                break;
            case "2" :
                getTargets = [
                             function() {
                                 var node = $.E("pl_content_top");
                                 return $.sizzle("li[node-type='plaza']", node)[0];
                             }
                ];

                opts = [
                    {pos : "bottom" , position : "fixed" , style : {
                        "z-index" : "10000"
                    }}
                ];
                break;
			case "3" :
				getTargets = [
                         function() {
							var node = $.E("pl_content_homeFeed");
							return $.sizzle("li[node-type='order_by_weiqun']" , node)[0];	
						}
                ];
				opts = [
                    {pos : "top" , position : "absolute" , style : {
                        "z-index" : "10000"
                    },
					offset : {
						target : {
							left : 80
						},
						arrow : {
							left : -80
						}
					}}
                ];
                break;
			case "11" :
				getTargets = [
                         function() {
							var node = $.E("pl_content_homeFeed");
							return $.sizzle("li[action-type='whisper']" , node)[0];	
						}
                ];
				opts = [
                    {pos : "top" , position : "absolute" , style : {
                        "z-index" : "10000"
                    },
					offset : {
						target : {
							left : 80
						},
						arrow : {
							left : -80
						}
					}}
                ];
                break;
			case "12"://心情"龙蛋"气泡,通知大家抽奖，提高活动的量
			/**
			 * 21是一个长期的心情气泡，触发规则比较复杂
			 * //每月1日   10点到24点  弹气泡一次
       		 * //昨天没发心情
         	 * //3天以外7天以内没发心情
			 */
			case "21":
				getTargets = [
                             function() {
                                 var node = $.sizzle("#pl_content_mood div[node-type='moodPublish']")[0];
                                 return node;
                             }
                ];

                opts = [
                    {pos : "bottom" , position : "absolute" , offset : {
						target : {
							top : 5,
							left : -20
						}
					}}
                ];
                break;
			case "17" ://私密群气泡 
                getTargets = [
                     function() {
                         var node = $.E("pl_content_top");
                         return $.sizzle("li[node-type='group']", node)[0];
                     }
                ];

                opts = [
                    {pos : "bottom" , position : "fixed" , style : {
                        "z-index" : "10000"
                    }}
                ];
                break;
			case "13" ://投票气泡
                getTargets = [
                     function() {
                         var node = $.E("pl_content_top");
                         return $.sizzle("li[node-type='app']", node)[0];
                     }
                ];

                opts = [
                    {pos : "bottom" , position : "fixed" , style : {
                        "z-index" : "10000"
                    }}
                ];
                break;
			case "14" ://微活动气泡
                getTargets = [
                     function() {
                         var node = $.E("pl_content_top");
                         return $.sizzle("li[node-type='app']", node)[0];
                     }
                ];

                opts = [
                    {pos : "bottom" , position : "fixed" , style : {
                        "z-index" : "10000"
                    }}
                ];
                break;
			case "15" ://音乐气泡
                getTargets = [
                     function() {
                         var node = $.E("pl_content_publisherTop");
                         return $.sizzle("a[action-type='music']", node)[0];
                     }
                ];

                opts = [
                    {pos : "bottom" , position : "absolute" , style : {
                        "z-index" : "10000"
                    }}
                ];
                break;
            default:
				throw('MessageTip key not exists');
            	break;
        }

        transOpt = {
            pointer : $.common.trans.versionTip,
            name : "closeBubble"
        };
        }
        
		return $.common.guide.util.tipManager($.E('pl_content_versionTip') , true , getTargets , opts , transOpt);
});
