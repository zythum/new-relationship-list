<?php
	
	$f = !(count($_POST) && isset($_POST['ff']) && $_POST['ff']=='1');
	$c = $f? '100003': '100000';
	$h = $f? '<p on&#99;click="alert(1)">错了: 输入个1呗</p><sc ript>alert(1)</sc ript><a href="java&%20script:alert(1)">xss</a><a href="java&#32;script:alert(1)">xss</a><img src="javascr%20ipt:alert(1)"/><img src=&#x6a;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41/>' : '<div id="holdit" class="form" component="widget.component.form" component-param="appkey=demo"><input type="text" name="ff"/>提交成功<a href="#" style="display:block;" onclick="alert(1);return false;" class="button" component="widget.component.submit">提 交</a><div class=\\\'error\\\' component="widget.component.fail"><p><input type="checkbox" checked/><script>alert("２吧你，让你输你就输")</script><a href="javas&#67;ript:alert(1)" style="width:expression(alert(\\\'XSS\\\'))">xss</a></p></div></div>';
	$t = 'http://weibo.com/8bugs';
	echo "{'code':'$c','data':'$h','text':'$t'}"
?>