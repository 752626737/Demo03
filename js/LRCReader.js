window.player = window.player||{};

(function(){
	function LRCReader(){}
	
	//读取歌词文件
	LRCReader.prototype.readLRCFile = function(url){
        return new Promise(function(resole){
            var request = new XMLHttpRequest();
            request.open("GET",url);
            request.onload = function(){
                resole(request.response);
            }
            request.send();
        });
    }
	
	//解析歌词文件
	LRCReader.prototype.parseLRC = function(url){
        return new Promise (function(res){
            this.readLRCFile(url).then(function(lrcString){
                var lrcObj = {};
                var regEXP = /\[(\d{2}):(\d{2})\.(\d{2})\](.*)/g;

                while(1){
                    var result = regEXP.exec(lrcString);
                    if(result){
                        var m = parseInt(result[1])*60;
                        var s = parseInt(result[2]);
                        lrcObj[m+s] = result[4];
                    }else{
                        break;
                    }
                }
                res(lrcObj);
            });
        }.bind(this));
    }

    window.player.LRCReader = LRCReader;
})();
