/**
 * 提供方法用于快速使用json数据渲染日历模板
 */
STK.register("module.calendar" , function($) {
	/**
	 * 返回给外层调用的句柄
	 */
	var calendar = {
		/**
		 * 转换成整数，使用parseInt(num , 10);能迅速把09转换成9 
		 */
		toInt : function(num) {
			return typeof num === 'number' ? num : parseInt(num , 10);			
		},
		/**
		 *  得到某一个月有多少天
		 *  2月闰年为29天，平年为28天
		 *  4,6,9,11为30天，其他都为31天
		 */
		getMaxDay : function(date) {
			var month = date.getMonth() + 1;
			if(month == 2) {
				var year = date.getFullYear();
				return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 29 : 28;
			} else {
				return $.core.arr.indexOf(month , [4,6,9,11]) != -1 ? 30 : 31; 				
			}
		},
		/**
		 *  可变参数传参，返回一个Date对象
		 *  支持，parseParam("2009","09" , "09");
		 *  	  parseParam(2009,9 , 9);
		 *        parseParam("2009-09-09");
		 *        parseParam(new Date(2009,9,9))
		 */
		parseParam : function(argu) {
			var resultDate;
			if(argu.length === 3) {
				argu[0] = this.toInt(argu[0]);
				argu[1] = this.toInt(argu[1]);
				argu[2] = this.toInt(argu[2]);
				resultDate = new Date(argu[0] , argu[1] - 1 , argu[2]);				
			} else {
				argu = argu[0];
				if(typeof argu === 'string') {
					if(!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(argu)) {
						throw '请传入正确的日期';						
					} else {
						var arr = argu.split("-");
						arr[0] = this.toInt(arr[0]);
						arr[1] = this.toInt(arr[1]);
						arr[2] = this.toInt(arr[2]);
						resultDate = new Date(arr[0] , arr[1] - 1 , arr[2]); 						
					}
				} else {
					resultDate = argu;					
				}			
			}
			return resultDate;
		},
		/**
		 * 得到某个日期对应的月的1号是星期几
		 */
		getFirstDay:function(date) {
			var d = new Date(date.getFullYear() , date.getMonth() , date.getDate());
			d.setDate(1);
			return d.getDay();
		},
		/*入口，支持 "2009-09-09"
					 "2009-9-9"
					 2009,9,9
					 "2009","9","9"
					 "2009","09","09"
					 new Date(2009,8,9)
					 注意，传入Date时，date.getMonth是从0-11的，别忘了
		*/
		/**
		 * 		  
		 * 		  parseData("2009","09" , "09");
		 *  	  parseData(2009,9 , 9);
		 *        parseData("2009-09-09");
		 *        parseData(new Date(2009,9,9))
		 *        返回{
		 *        	firstDay : 这个月1号星期几,
		 *        	result : ['' , '' , '' , '1' , '2' , '3' ....... , '31' , '' , '' , '']一个月日历的格子数组
		 *          leftDay : 这个月后面剩下多少天，
		 *          prefix : "2009-09-"
		 *        }
		 */
		parseData : function() {
			var argu = arguments;
			var date = this.parseParam(argu);
			//这个月一共多少天
			var maxDay = this.getMaxDay(date);
			//这个月1号是周几
			var firstDay = this.getFirstDay(date);
			//轮询多少次
			var loop;
			if(firstDay == 0 && maxDay == 28) {
				loop = 28;			
			} else if((firstDay + maxDay) > 35) {
				loop = 42;	
			} else {
				loop = 35;	
			}
			var result = [];
			//前面多少天
			for(var i = 0 ; i < firstDay; i++) {
				result.push('');				
			} 
			//中间多少天
			for(var i = 1 ; i <= maxDay ; i++) {
				result.push(i);				
			}
			var leftDay = 0;
			//后面多少天
			for(var i = 1 ; i <= loop - maxDay - firstDay ; i++ ) {
				leftDay++;
				result.push('');				
			}
			var prefix = date.getFullYear();
			var m = date.getMonth() + 1;
			if(m < 10) {
				m = '0' + m;
			}
			return {
				firstDay : firstDay,
				result : result,
				leftDay : leftDay,
				prefix : prefix + "-" + m + "-"
			};
		},
		/*
		传入格式:
					 "2009-09-09" , {a:'test'},"<div></div>"
					 "2009-9-9",{a:'test'},"<div></div>"
					 [2009,9,9], {a:'test'},"<div></div>"
					 ["2009","9","9"], {a:'test'},"<div></div>"
					 ["2009","09","09"], {a:'test'},"<div></div>"
					 new Date(2009,8,9), {a:'test'},"<div></div>"
		*/
		/**
		 *    var TEMPLATE = '<#et moodlist data><ul class="week clearfix W_linecolor"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="day clearfix">' + 
			   '<#list data as list>' + 
			   '<li class="W_linecolor"><span>${list._day_}</span><img moodconf="day=${list.date}" src="${list.face}" alt="" /></li>' + 
			   '</#list>' + 
			   '</ul></#et>';
			  $.module.calendar(new Date(2009,9,9) , [服务器json数组] , TEMPLATE); 
			  
			  该例子中，服务器list数据每个元素只需要有date和face就行了，_day_是动态扩展上去的
		 */
		parseHTML : function(date ,  json , html) {
			if(!$.isArray(date)) {
				date = [date];
			}
			var data = this.parseData.apply(this,date);
			var firstDay = data.firstDay;
			var result = data.result;
			for(var i = 0 ; i < result.length ; i++) {
				if(result[i]) {
					json[i]['_day_'] = result[i];
				} else {
					if(i < firstDay) {
						json.unshift({'_day_' : ''});	
					} else {
						json.push({'_day_' : ''});
					}
				}
			}
			
			return $.core.util.easyTemplate(html , json);
		},
		/**
		 * 这种情况是服务器偷懒，返回给你一个月的数据是json object，并且不全,比如
		 * var json = {
	     * 	 2011-12-03 : {face ： "当天心情img_url" , date : "当天日期" , content : "鼠标移到这一天的时候显示的提示层html"}
	     * 	 2011-12-04 : {face ： "当天心情img_url" , date : "当天日期" , content : "鼠标移到这一天的时候显示的提示层html"}
	     * };
		 * 会先给他补全了，再easyTemplate
		 * 
		 * var TEMPLATE = '<#et moodlist data><ul class="week clearfix W_linecolor"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul><ul class="day clearfix">' + 
			   '<#list data as list>' + 
			   '<li class="W_linecolor"><span>${list._day_}</span><#if (list.face)><img moodconf="day=${list.date}" src="${list.face}" alt="" /></#if></li>' + 
			   '</#list>' + 
			   '</ul></#et>';
			   
		 * $.module.calendar.parseMapHtml("2009-09-09" , list , TEMPLATE)
		 */
		parseMapHtml : function(date , json , html) {
			if(!$.isArray(date)) {
				date = [date];
			}
			var data = this.parseData.apply(this,date);
			var firstDay = data.firstDay;
			var resultArr = [];
			var result = data.result;
			for(var i = 0 ; i < result.length ; i++) {
				if(result[i]) {
					var tmp = i - firstDay + 1;
					var day = data.prefix + (tmp < 10 ? "0" + tmp : tmp);
					if(json[day]) {
						json[day]['_day_'] = tmp;
						resultArr[i] = json[day];	
					} else {
						resultArr[i] = {'_day_' : tmp};					
					}
				} else {
					if(i < firstDay) {
						resultArr.unshift({'_day_' : ''});	
					} else {
						resultArr.push({'_day_' : ''});
					}
				}
			}
			return $.core.util.easyTemplate(html , resultArr);
		}
	};
	return calendar;
});
