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
    pillarNum : 7,
    space : 150,
    oPillarArr : [],
    pHArr: [],
    lastPillar : 6,
    score : 0,
    init : function () {
        this.animation();
        this.initData();
        this.handleStart();
    },
    initData : function () {//初始化变量
        this.oSky = document.getElementById('game');
        this.oStartBtn= this.oSky.getElementsByClassName('start')[0];
        this.oBird = this.oSky.getElementsByClassName('bird')[0];
        this.oScore = this.oSky.getElementsByClassName('score')[0];
        this.oMask = this.oSky.getElementsByClassName('mask')[0];
        this.oEnd = this.oSky.getElementsByClassName('end')[0];
        this.oFinalS = this.oEnd.getElementsByClassName('final-score')[0];
        this.oRestart = this.oEnd.getElementsByClassName('restart')[0];
        this.oDataBox = this.oEnd.getElementsByClassName('data-box')[0];
        this.dataArr = this.getData();
    },
    animation : function () {//所有动画函数
        var self = this;
        var count = 0;
        this.timer = setInterval(function () {
            self.skyRoll();
            if (!self.key) {
                self.birdDrop();
                self.clickFly();
                self.pillarMove();
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
            
            for(var i = 0; i < self.pillarNum; i ++) {
                self.pillarHeight();
                self.pillar(i);
            }
        }
    },
    birdDrop : function () {
        this.birdH += ++ this.g;
        this.oBird.style.top = this.birdH + 'px';
        this.oBird.style.transition = 'none';
        this.wallHit();
    },
    clickFly : function () {
        var self = this;
        this.oSky.onclick = function (e) {
            if(!e.target.classList.contains('start')) {//判断除start之外点击的区域
                self.g = -10;
            }
        }
    },
    pillar : function (x) {//柱子
        var HeightArr = this.pillarHeight();
        var up = HeightArr.up;
        var down = HeightArr.down;
        var oUpPillar = pillarCreate('div', ['pillar', 'pillar-up'], {
            height : up + 'px',
            left : (x + 1.5) * 300 + 'px'
        });
        var oDownPillar = pillarCreate('div', ['pillar', 'pillar-down'], {
            height : down + 'px',
            left : (x + 1.5) * 300 + 'px'
        });
        this.oPillarArr.push({
            oUp : oUpPillar,
            oDown : oDownPillar
        });
        this.pHArr.push({
            up : up,
            down : down
        })
        this.oSky.appendChild(oUpPillar);
        this.oSky.appendChild(oDownPillar);
    },
    pillarHeight : function () {
        var upHeight = Math.floor(Math.random() * 350 + 50);
        var downHeight = 600 - this.space - upHeight;
        return {
            up : upHeight,
            down : downHeight
        }
    },
    pillarMove : function () {
        this.pillarHit();
        this.addScore();
        for (var i = 0; i < this.pillarNum; i ++) {
            var pillarLeft = this.oPillarArr[i].oUp.offsetLeft;
            pillarLeft -= this.skySpeed;
            this.oPillarArr[i].oDown.style.left = this.oPillarArr[i].oUp.style.left = pillarLeft + 'px';
            this.pillarReborn(this.oPillarArr[i].oUp, this.oPillarArr[i].oDown, i);
        }
    },
    pillarReborn : function (eleUp, eleDown ,index) {
        if (eleUp.offsetLeft <= -52) {
            this.arrReset(index);
            var lastLeft = this.oPillarArr[this.lastPillar].oUp.offsetLeft;
            eleDown.style.left = eleUp.style.left = lastLeft + 300 + 'px';
            this.lastPillar = index;
            
            eleUp.style.height = this.pHArr[index].up + 'px';
            eleDown.style.height = this.pHArr[index].down + 'px';
        }
    },
    arrReset : function (index) {
        var HeightArr = this.pillarHeight();
        this.pHArr.splice(index, 1, HeightArr);
    },
    wallHit : function () {
        if (this.birdH >= this.maxTop || this.birdH <= this.minTop) {
            this.gameOver()
        }
    },
    pillarHit : function () {
        var index = this.score % this.pillarNum;
        if (this.oPillarArr[index].oUp.offsetLeft <= 110 && this.oPillarArr[index].oUp.offsetLeft >= 28) {
            if (this.oBird.offsetTop <= this.pHArr[index].up || this.oBird.offsetTop >= this.pHArr[index].up + this.space - this.oBird.offsetHeight) {
                this.gameOver()
            }
        }
    },
    addScore : function () {
        var index = this.score % this.pillarNum;
        if (this.oPillarArr[index].oUp.offsetLeft <= 28) {
            this.oScore.innerText = ++ this.score;
        }
    },
    gameOver : function () {
        clearInterval(this.timer);
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oFinalS.innerText = this.score;
        this.reStart();
        this.setData();
        this.renderDate();
    },
    reStart : function () {
        this.oRestart.onclick = function () {
            window.location.reload();
        }
    },
    getDate : function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDate());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());
    
        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
    },
    setData : function () {
        this.dataArr.push({
            score : this.score,
            time : this.getDate()
        })
        this.dataArr.sort(function (a, b) {
            return b.score - a.score;
        })
        setLocal('data', this.dataArr)
    },
    getData : function () {
        var dataArr = getLocal('data');
        return dataArr ? dataArr : [];
    },
    renderDate : function () {
        var data = this.dataArr;
        var str = '';
        for (var i = 0; i < data.length && i < 8; i ++) {
            var supplyClass = '';
            switch(i) {
                case 0 : supplyClass = 'first';
                        break;
                case 1 : supplyClass = 'second';
                        break;
                case 2 : supplyClass = 'third';
                        break;   
            }
            str += '<li class="data"><span class="rank ' + supplyClass + '">' + (i + 1) + '</span><span class="data-score">' + data[i].score + '</span><span class="time">' + data[i].time + '</span></li>';
        }
        this.oDataBox.innerHTML = str;

    }
}
bird.init()