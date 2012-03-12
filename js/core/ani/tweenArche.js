/**
 * 动画运算类
 * @id STK.core.ani.tweenArche
 * @alias STK.core.ani.tweenArche
 * @param {Function} tween 循环执行的函数
 * @param {Object} 
		{
			'animationType' : 'linear',		//动画类型
			'distance' : 1,					//动作距离
			'duration' : 500,				//持续时间(毫秒)
			'callback' : $.core.func.empty,	//执行后的返回函数
			'algorithmParams' : {},			//动画算法所需要的额外参数
			'extra' : 5,					//基本动画需要的偏移量信息
			'delay' : 25					//动画间隔时间
		}
 * @return {Object} 
		{
			{Function}getStatus	: //获取当点状态
			{Function}play		: //播放动画
			{Function}stop		: //停止动画
			{Function}resume	: //继续播放
			{Function}pause		: //暂停动画
			{Function}destroy	: //销毁对象
		}
 * @author FlashSoft | fangchao@staff.sina.com.cn
		modify by Robin Young | yonglin@staff.sina.com.cn
 * @import STK.core.ani.tweenValue
 */
$Import("core.ani.algorithm");
$Import('core.func.empty');
$Import('core.obj.parseParam');
STK.register('core.ani.tweenArche', function($){
	
	return function(tween, spec){
		var conf, that, currTime, startTime, currValue, timer, pauseTime, status;
		that = {};
		conf = $.core.obj.parseParam({
			'animationType' : 'linear',
			'distance' : 1,
			'duration' : 500,
			'callback' : $.core.func.empty,
			'algorithmParams' : {},
			'extra' : 5,
			'delay' : 25
		}, spec);
		
		var onTween = function(){
			currTime = (+new Date() - startTime);
			if(currTime < conf['duration']){
				currValue = $.core.ani.algorithm.compute(
					conf['animationType'],
					0,
					conf['distance'],
					currTime,
					conf['duration'],
					conf['extra'],
					conf['algorithmParams']
				);
				tween(currValue);
				
				timer = setTimeout(onTween, conf['delay']);
			}else{
				status = 'stop';
				conf['callback']();
			}
		};
		
		status = 'stop';
		
		that.getStatus = function(){
			return status;
		};
		
		that.play = function(){
			startTime = +new Date();
			currValue = null;
			onTween();
			status = 'play';
			return that;
		};
		
		that.stop = function(){
			clearTimeout(timer);
			status = 'stop';
			return that;
		};
		
		that.resume = function(){
			if(pauseTime){
				startTime += (+new Date() - pauseTime);
				onTween();
			}
			return that;
		};
		
		that.pause = function(){
			clearTimeout(timer);
			pauseTime = +new Date();
			status = 'pause';
			return that;
		};
		
		that.destroy = function(){
			clearTimeout(timer);
			pauseTime = 0;
			status = 'stop';
		};
		return that;
	};
});
