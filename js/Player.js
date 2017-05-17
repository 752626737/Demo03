window.player = window.player||{};

(function(){
    //所有音频播放的 界面 、 逻辑  统一在Player中关联
    function Player(){
        var urls = ["res/songs/董小姐.mp3","res/songs/喜欢你.mp3","res/songs/小幸运.mp3","res/songs/你不是真正的快乐.mp3","res/songs/明天,你好.mp3"];
        this.audioPlayer = new player.AudioPlayer(urls);
		this.playTypes = ["single","random","order"];
		this.curTypeIndex = this.playTypes.indexOf(localStorage.getItem("loopType")? localStorage.getItem("loopType") : "single");
		
        this.getUI();
        this.addListener();
    }

    Player.prototype.getUI = function(){
    	this.playTypeControl = document.querySelector(".xunhuan");
    	this.playButton = document.querySelector(".playButton");
		this.nextButton = document.querySelector(".nextButton");
		this.backButton = document.querySelector(".backButton");
		this.playTypeControl.src = "res/img/"+this.playTypes[this.curTypeIndex]+".png";
    	this.endTimeLabel = document.querySelector(".endTime");
    	this.startTimeLabel = document.querySelector(".startTime");
    	this.timeRange = document.querySelector(".inpt");
		this.volumeRange = document.querySelector(".volumeRange");
		this.lrcBox = document.querySelector(".lrcBox");
		
      	this.audioPlayer.duration(function(time){
          	this.endTimeLabel.textContent = time;
        }.bind(this));
        
        //Promise写法
        //this.audioPlayer.duration().then(function(time){
        	//this.endTimeLabel.textContent = time;
        //}.bind(this));
        var lrc = new player.LRCReader();
        var lastLrc = "";
        this.audioPlayer.getCurrentTime(function(time){
        	this.startTimeLabel.textContent = time;
        	
        	//以秒为单位的时间
        	//总时间：this.audioPlayer.audioEle.duration
        	//百分比：当前时间/总时间
        	this.timeRange.value = this.audioPlayer.audioEle.currentTime / this.audioPlayer.audioEle.duration * 100;
       		
       		lrc.parseLRC("res/lrc/董小姐.lrc").then(function (lrcObj){
                var lrcString = lrcObj[parseInt(this.audioPlayer.audioEle.currentTime)];
                
                if (lrcString){
                    lastLrc = lrcString;
                }
                
                this.lrcBox.innerHTML = lastLrc;
            }.bind(this));
        }.bind(this));
        
        this.volumeRange.addEventListener("change",function(event){
        	this.audioPlayer.audioEle.volume = event.target.value/100;
        }.bind(this));
    }
    
    Player.prototype.addListener = function(){
    	var self = this;
    	this.playButton.onclick = function(){
    		this.src = self.audioPlayer.playControl()? "res/img/play.png" : "res/img/pause.png";
    	}
    	
    	this.nextButton.onclick = function(){
    		self.audioPlayer.next();
    	}
    	
    	this.backButton.onclick = function(){
    		self.audioPlayer.back();
    	}
    	
    	this.playTypeControl.onclick = function(){
    		self.curTypeIndex++;
    		if(self.curTypeIndex>2){
    			self.curTypeIndex = 0;
    		}
    		self.audioPlayer.setPlayType(self.playTypes[self.curTypeIndex]);
    		this.src = "res/img/"+self.playTypes[self.curTypeIndex]+".png";
    	}
    }

    window.player.Player = Player;
})();
