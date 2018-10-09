var app = getApp();
//起始位置坐标
var startX = 0;
var startY = 0;


//蛇头坐标
var snakeHead = {
    x: 0,
    y: 0,
    color: "red",
    w: 10,
    h: 10,
};

//身体对象（数组）
var snakeBodys = [];
//食物对象
var foods = [];

var ifStop = false;

//手指方向 
var direction = null;
var snakDirection = "right";
//窗口的宽高
var windowWidth = 0;
var windowHeight = 0;

var collideBo = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    canvasTabFun: function(e) {
        // ifStop = !ifStop;
    },
    canvasStartFun: function(e) {
        startX = e.touches[0].x;
        startY = e.touches[0].y;
    },
    canvasEndFun: function(e) {
        snakDirection = direction;
    },
    canvasMoveFun: function(e) {
        //移动结束时坐标
        var moveX = e.touches[0].x;
        var moveY = e.touches[0].y;

        //x和y移动的距离
        var X = moveX - startX;
        var Y = moveY - startY;
        if (Math.abs(X) > Math.abs(Y) && X > 0) {
            direction = "right";
        } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
            direction = "left";
        } else if (Math.abs(X) < Math.abs(Y) && Y > 0) {
            direction = "bottom";
        } else if (Math.abs(X) < Math.abs(Y) && Y < 0) {
            direction = "top";
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        function Food() {
            this.x = randomFun(0, windowWidth - 10);
            this.y = randomFun(0, windowHeight - 10);
            this.w = 10;
            this.h = 10;
            this.color = "black";

            this.resetNew = function(){
                this.x = randomFun(0, windowWidth - 10);
                this.y = randomFun(0, windowHeight - 10);
            }
        }
        //碰撞函数
        function collideFun(obj1, obj2) {
            var l1 = obj1.x;
            var r1 = l1 + obj1.w;
            var t1 = obj1.y;
            var b1 = t1 + obj1.h;

            var l2 = obj2.x;
            var r2 = l2 + obj2.w;
            var t2 = obj2.y;
            var b2 = t2 + obj2.h;

            if (r1>l2 && l1<r2 && b1>t2 && t1<b2) {
                return true;
            } else {
                return false;
            }

        }

        //获取画布上下文
        var context = wx.createCanvasContext('snakCanvas');

        //帧数
        var frameTemp = 0;

        function draw(obj) {
            context.setFillStyle(obj.color);
            context.beginPath();
            context.rect(obj.x, obj.y, obj.w, obj.h);
            context.closePath();
            context.fill();
        }

        function animate() {
            if (ifStop) {
                console.log(snakeBodys);
                return;
            }
            frameTemp++;
            if (frameTemp % 60 == 0) {
                snakeBodys.push({
                    x: snakeHead.x,
                    y: snakeHead.y,
                    w: snakeHead.w,
                    h: snakeHead.h,
                    color: "#00ff00"
                });
                console.log(snakeBodys);
                if (snakeBodys.length > 4) {
                    //移除不用的身体位置
                    if (collideBo) {
                        snakeBodys.shift();
                    } else {
                        collideBo = !collideBo;
                    }
                }
                switch (snakDirection) {
                    case "left":
                        snakeHead.x -= snakeHead.w;
                        break;
                    case "right":
                        snakeHead.x += snakeHead.w;
                        break;
                    case "top":
                        snakeHead.y -= snakeHead.h;
                        break;
                    case "bottom":
                        snakeHead.y += snakeHead.h;
                        break;
                    default:
                        break;
                }

            }
            //绘制食物
            for (var i = 0; i < foods.length; i++) {
                var food = foods[i];
                draw(food);

                if (collideFun(food,snakeHead)) {
                    //蛇身新增一个
                    food.resetNew();
                    collideBo = false;
                }
            }

            //绘制蛇头
            draw(snakeHead);

            //绘制蛇身
            for (var i = 0; i < snakeBodys.length; i++) {
                var bodyObj = snakeBodys[i];
                draw(bodyObj);
            }

            context.draw();

            requestAnimationFrame(animate);
        }

        function randomFun(min, max) {
            return parseInt(Math.random() * (max - min) + min);
        }

        wx.getSystemInfo({
            success: function(res) {
                console.log("系统信息:", res);
                windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;

                //页面初始化随机创建20个食物
                for (var i = 0; i <= 20; i++) {
                    var foodObj = new Food();
                    foods.push(foodObj);
                }
                animate();
            }
        });

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})