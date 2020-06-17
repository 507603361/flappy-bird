// 面向对象编程
var bird = {
    num : 1,
    skyPos : 0,
    skySpeed : 2,
    birdH : 220,
    g : 0,
    key : true,
    nowClass : 'white',
    minTop : 0,
    maxTop : 570,
    init : function () {
        this.animation();
        this.initData();
        this.handleStart();
        this.hitDetection();
    },
    initData : function () {//初始化变量
        this.oSky = document.getElementById('game');
        this.oStartBtn= this.oSky.getElementsByClassName('start')[0];
        this.oBird = this.oSky.getElementsByClassName('bird')[0];
        this.oScore = this.oSky.getElementsByClassName('score')[0];
        this.oMask = this.oSky.getElementsByClassName('mask')[0];
        this.oEnd = this.oSky.getElementsByClassName('end')[0];
    },
    animation : function () {//所有动画函数
        var self = this;
        var count = 0;
        this.timer = setInterval(function () {
            self.skyRoll();
            if (!self.key) {
                self.birdStart();
            }
            if(++ count % 10 === 0){
                if (self.key) {
                    self.startBound();
                    self.birdJump();
                }
                self.birdFly();
            }
        },30)
    },
    skyRoll : function () {//天空滚动
        this.skyPos -= this.skySpeed;
        this.oSky.style.backgroundPositionX = this.skyPos + 'px';
    },
    startBound : function () {//开始游戏按钮动画
        var prevClass = this.nowClass;
        this.nowClass = prevClass === 'white' ? 'blue' : 'white';
        
        this.oStartBtn.classList.remove('start-' + prevClass);
        this.oStartBtn.classList.add('start-' + this.nowClass);
    },
    birdFly : function () {//小鸟煽动翅膀
        if (this.num === 3) {
            this.num = 1;
            this.oBird.style.backgroundPositionX = -this.num * 30 + 'px';
            this.num --;
        } else {
            this.oBird.style.backgroundPositionX = -this.num * 30 + 'px';
            this.num ++;
        }
    },
    birdJump : function () {//小鸟跳
        this.birdH = this.birdH === 220 ? 260 : 220;
        this.oBird.style.top = this.birdH + 'px';
    },
    handleStart : function () {
        var self = this;
        this.oStartBtn.onclick = function () {
            self.key = false;
            this.style.display = 'none';
            self.oScore.style.display = 'block';
            self.oBird.style.left = '80px';
            self.skySpeed = 5;
            self.pillar();
            
        }
    },
    birdStart : function () {
        this.birdH += ++ this.g;
        this.oBird.style.top = this.birdH + 'px';
        this.oBird.style.transition = 'none';
        this.wallHit();
    },
    pillar : function () {//柱子

    },
    hitDetection : function () {
        this.wallHit();
        this.pillarHit();
    },
    wallHit : function () {
        if (this.birdH >= 570 || this.birdH <= 0) {
            this.gameOver()
        }
    },
    pillarHit : function () {
        // this.gameOver();
    },
    gameOver : function () {
        clearInterval(this.timer);
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
    }

}
bird.init()