/*
modified by lianyi@staff.sina.com.cn 2011.7.11
加入进入首页uc用户展示层逻辑 引入pl.guide.ucUser
see MINIBLOGREQ-6193
modified by chenjian2@staff.sina.com.cn 2011.10.14
加入进入首页新用户向导层逻辑 引入pl.guide.newUser
*/
$Import('pl.content.publisherTop');
$Import('pl.content.homeFeed');
$Import('pl.content.top');
$Import('pl.leftNav.common');
$Import('pl.leftNav.app');
$Import('pl.leftNav.game');
$Import('pl.content.personInfo');
//$Import('pl.content.myPersonalInfo');
$Import('pl.content.changeLanguage');
$Import('pl.content.homeInterest');
$Import('pl.content.customService');
$Import('pl.content.promotetopic');
$Import('pl.content.setSkin');
$Import('pl.content.versionTip');
$Import('pl.content.userGuider');
$Import('pl.content.base');
$Import('pl.guide.ucUser');
$Import('pl.guide.newUser');
$Import('pl.ad.backFill');
$Import('pl.content.pullylist');
$Import('pl.content.help');
$Import('pl.relation.recommendPopularUsers');
$Import('pl.content.interestgroup');
$Import('pl.content.allInOne');
$Import('pl.content.topic');
//首页热门话题引导发微博弹层
$Import('pl.content.publishbubble');
$Import('pl.content.thirdModule');
$Import('pl.content.topTip');
//心情微博开始
$Import('pl.content.mood');
//心情微博结束
$Import('pl.content.tasks');

$Import('pl.content.bubBox');

//Feed筛选区引用
$Import('pl.apps.weiqun.groupsfeed');
$Import('pl.apps.chosen.groupsfeed');
STK.pageletM.start();
