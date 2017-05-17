(function(){
	//类，抽象的事物
	//属性---特点：对象属性：使用《实例化》出来的对象去调用里面的属性 ；类属性：【静态属性】使用类名调用，不需要实例化对象
	//方法---行为：对象方法；类方法【静态方法】
	
	//设计模式---单例设计模式
	//只创建一个对象
	
	//function Person(){
		//Person.type = "人类";
		//console.log(Person.type)
	//}

	function TimeTools(){}
	
	//songTimeFromat：歌曲的时间格式，返回值是00:00
	//time：需要转换的时间---单位：秒
	TimeTools.songTimeFromat = function (time){
        var m = parseInt(time/60);
        var s = parseInt(time%60);
        return (m<10?"0"+m:m) + ":" + (s<10?"0"+s:s);
    }

    TimeTools.yymmdd = function (timestamp){
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        return y + (m<10?"0"+m:m) + (d<10?"0"+d:d);
    }

    TimeTools.week = function (timestamp){
        var date = new Date(timestamp);
        var weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        return weeks[date.getDay()];
    }
	
	window.TimeTools = TimeTools;
})();
