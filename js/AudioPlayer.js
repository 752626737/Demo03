window.player = window.player||{};

(function(){
    //todo:音频播放的核心代码 (注意 封装核心代码 尽量减少入口 添加有必要的（接口）出口（不需把所有接口公开）)
    //AudioPlayer:音频播放的核心代码 （逻辑部分）
    //urls:音频url的数组 -> 需要让播放器核心 知道 要播放的内容 （可以进行下一曲 随机）
    function AudioPlayer(urls){
        this.urls = urls;
        this.init();
    }
	
	//初始化音频播放器的函数
	AudioPlayer.prototype.init = function(){
		//当前播放音频的下标 随机播放 下一曲 通过currentSongIndex控制
		this.currentSongIndex = 0;
		//创建音频，并放大body里
		this.audioEle = document.createElement("audio");
		document.body.appendChild(this.audioEle);
		
		this.songName = document.querySelector(".songName");
		
		//设置音频播放的资源 通过数组小标获取
		this.audioEle.src = this.urls[this.currentSongIndex];
		
		this.audioEle.autoplay =  true;
		
		//0：单曲循环，1：随机播放，2：顺序播放
		this.PlayType = {
			single:0,
			random:1,
			order:2
		}
		
		//获得保存过状态
		this.currentPlayType = this.PlayType[localStorage.getItem("loopType")? localStorage.getItem("loopType") : "single"];
		
		this.listenEnd();
	}
	
	//播放和暂停切换
	AudioPlayer.prototype.playControl = function(){
		this.audioEle.paused ? this.audioEle.play() : this.audioEle.pause();
		return this.audioEle.paused;
	}
	
	//setPlayType:设置播放类型    0：单曲循环，1：随机播放，2：顺序播放
	AudioPlayer.prototype.setPlayType = function(type){
		this.currentPlayType = this.PlayType[type];
		localStorage.setItem("loopType",type);
	}
	
	var self = this;
	//两种情况： 单曲 顺序播放（音频列表的下一曲）；随机播放（随机下一曲）
	AudioPlayer.prototype.next = function(){
		//currentSongIndex 是用于获取或者设置当前播放音乐的下标
		//urls 整个音乐播放列表的数组
		//获得当前音乐：this.urls[this.currentSongIndex]
		if(this.currentPlayType!=1){
			//单曲顺序播放 currentSongIndex自加
			this.currentSongIndex++;
            this.currentSongIndex = this.currentSongIndex>=this.urls.length ? 0 : this.currentSongIndex;
		}else{
			//随机播放
			this.currentSongIndex = parseInt(Math.random()*this.urls.length);
		}
		
		//获得currentSongIndex(处理过的： 顺序、随机)
		//就可以 获得下一曲需要播放的音乐
		//需要播放的音乐：this.urls[this.currentSongIndex]
		//重新给播放器资源文件 this.audioEle.src = this.urls[this.currentSongIndex]
		this.audioEle.src = this.urls[this.currentSongIndex];
		this.songName.innerHTML = this.urls[this.currentSongIndex];
	}
	
	//两种情况： 单曲 顺序播放（音频列表的上一曲）；随机播放（随机上一曲）
	AudioPlayer.prototype.back = function(){
		//currentSongIndex 是用于获取或者设置当前播放音乐的下标
		//urls 整个音乐播放列表的数组
		//获得当前音乐：this.urls[this.currentSongIndex]
		if(this.currentPlayType!=1){
			//单曲顺序播放 currentSongIndex自减
			this.currentSongIndex--;
			//this.urls.length-1数组长度为5，所以要减1，这样就等于最后一首的下标[4]
            this.currentSongIndex = this.currentSongIndex < 0 ? this.urls.length-1 : this.currentSongIndex;
		}else{
			//随机播放
			this.currentSongIndex = parseInt(Math.random()*this.urls.length);
		}
		
		//获得currentSongIndex(处理过的： 顺序、随机)
		//就可以 获得上一曲需要播放的音乐
		//需要播放的音乐：this.urls[this.currentSongIndex]
		//重新给播放器资源文件 this.audioEle.src = this.urls[this.currentSongIndex]
		this.audioEle.src = this.urls[this.currentSongIndex];
		this.songName.innerHTML = this.urls[this.currentSongIndex];
	}
	
	//监听播放完成的状态
	AudioPlayer.prototype.listenEnd = function(){
		this.audioEle.addEventListener("ended",function(){
			this.next();
		}.bind(this));
	}
	
	//获取音频总时间的方法
	AudioPlayer.prototype.duration = function(callback){
		this.audioEle.addEventListener("loadedmetadata",function(event){
			callback(TimeTools.songTimeFromat(event.target.duration));
		});
	}
	
	//Promise写法
	//AudioPlayer.prototype.duration = function () {
        //var self = this;
        //function config(resloe,reject) {
            //self.audioEle.addEventListener("loadedmetadata",function (event) {
                //resloe(TimeTools.songTimeFromat(event.target.duration));
            //});
       	//}
        //return new Promise(config);
    //}
	
	//获取音频当前时间的方法
	AudioPlayer.prototype.getCurrentTime = function(callback){
		this.audioEle.addEventListener("timeupdate",function(event){
			callback(TimeTools.songTimeFromat(event.target.currentTime));
		});
	}
	
    window.player.AudioPlayer = AudioPlayer;
})();
