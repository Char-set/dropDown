/**
 * Vue Drop Down
 * 
 *
 * @param dropDown 下拉 刷新过程中需要执行的函数
 * @param stop 下拉刷新停止的标识，组件会watch
 * @param top 组件的style top值
 *
 * 例子:
 * <ui-drop-down :on-pull-down="dropDown" :stop.sync="stopDropDown" :top="'0'">
 * 
 */



<template>
    <div class="ui-drop-down" style="border-top:0;position:relative ;" :style="{top:this.top+'px'}">
        <div style="height:85px;overflow:hidden;">
            <div class="drop-loading marT10">
                <div class="gif">
                    <img src="http://ojc83pmmg.bkt.clouddn.com/FmA3g0niYzy3NltLDqXFBlf-TYXa" loop=infinite>
                </div>
                <div class="text">
                    <p class="f13 c3 marT20" v-if="status == 0">下拉即可刷新</p>
                    <p class="f13 c3 marT20" v-if="status == 1">松开立即刷新</p>
                    <p class="f13 c3 marT20" v-if="status == 2">正在刷新中...</p>
                    <p class="f11 cc7 mart5 ">最后更新：{{day}} {{lastDate|dateformat 'hh:mm'}}</p>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<style lang="less">
    .drop-loading {
        height:85px;
        position: relative;
        overflow: hidden;
        .gif{
            height:80px;
            width: 30%;
            float: left;
            margin-left: 50px;
            img{
                display: block;
                width: 80%;
            }
        }
        .text{
            float: left;
        }
        .f11{
            font-size: 11px;
        }
        .f13{
            font-size: 13px;
        }
        .cc7{
            color: #c7c7c7;
        }
    }
</style>
<script>
    import Vue from "vue";
    export default {
        watch: {
            'stop': function (val) {
                if(val) {
                    this.stopPullDown();
                    this.stop = false;
                }
            }
        },
        data: function () {
            return {
                isLoading: false,
                status: 0,
                lastDate: null,
                day: '第一次刷新',
                oldTop:0,
                ios:Vue.browser.ios(),
                iosVer:Vue.browser.getIosVersion(),
            }
        },
        props: ["onPullDown", "stop", "top"],
        ready: function() {
            this.bindScrollEvent();
        },
        methods: {
            bindScrollEvent: function () {
                var startX = 0, endX = 0, startY = 0, endY = 0, m = 0, that = this;
                var body = $('.ui-drop-down');
                document.body.addEventListener('touchstart', (e) => {
                    if(this.isLoading) {
                        return;
                    }
                    startY = e.touches[0].pageY;
                    startX = e.touches[0].pageX;

                    if($(window).scrollTop() == 0) {
                        body.css('transition', 'none')
                        m = 0;
                        this.oldTop = body.position().top;
                        document.body.addEventListener('touchmove', animate);

                        this.lastDate = Vue.sessionStorage.getItem('drop-down-time');
                        if(this.lastDate) {
                            var date = new Date(this.lastDate);
                            var curr = new Date();
                            if(date.getFullYear() == curr.getFullYear() && date.getMonth() == curr.getMonth() && date.getDate() == curr.getDate()) {
                                this.day = '今天';
                            }else {
                                this.day = date.getMonth() + '-' + date.getDate();
                            }
                        }
                            
                    } else{
                        return;
                    }
                });
                document.body.addEventListener('touchend', (e) => {
                    if(this.isLoading) {
                        return;
                    }
                    this.status = 2;
                    Vue.sessionStorage.setItem('drop-down-time', new Date().getTime());
                    document.body.removeEventListener('touchmove', animate);
                    //下拉距离不够长
                    if(m > 0 && m < 60) {
                        if(this.iosVer<=8 && this.ios){
                            body.css('transition', 'all 0.5s').css('top', this.oldTop+'px');
                        } else{
                            body.css('transition', 'all 0.5s').css('transform', 'translate3d(0,0,0)');
                        }
                        this.isLoading = false;
                    }else if(m <= 0){

                    }else if(typeof this.onPullDown == 'function') {
                        if(this.iosVer<=8 && this.ios){
                            body.css('transition', 'all 0.5s').css('top', this.oldTop+85+'px');
                        } else{
                            body.css('transition', 'all 0.5s').css('transform', 'translate3d(0,85px,0)');
                        }
                        this.isLoading = true;
                        this.onPullDown();
                        //初始化数据
                        m = 0, startY = 0, endY = 0, startX = 0, endX = 0;
                    }
                });

                function animate(e) {
                    endY = e.touches[0].pageY;
                    endX = e.touches[0].pageX;
                    var m1 = endY - startY;
                    var direction = that.getSlideDirection(startX,startY, endX, endY);
                    if(direction==2) {
                        //阻止浏览器默认的下拉事件，针对安卓手机
                        e.preventDefault();                        
                        if(m1 > 0) {
                            //曲线运动，下拉越来越困难
                            m = Math.log2(m1) * 25 - 100;
                            //ios8以下的版本，不支持transform
                            if(that.iosVer<=8 && that.ios){
                                body.css('top', m+ that.oldTop +'px');
                            } else{
                                body.css('transform', 'translate3d(0,'+ m +'px,0)');
                            }
                            //达到滑动的最小距离时，文字状态变化
                            if(m > 60){
                                that.status=1;
                            }    
                            
                        }
                    } else if(direction==1){
                        body.css('transition', 'none');
                    }
                        
                }
            },
            //还原状态动画
            stopPullDown: function () {
                var body = $('.ui-drop-down');
                if(this.iosVer<=8 && this.ios){
                    body.css('transition', 'all 0.5s').css('top', this.oldTop+'px');
                } else{
                    body.css('transition', 'all 0.5s').css('transform', 'translate3d(0,0,0)');
                }
                
                this.isLoading = false;
                this.status=0;
            },
            //返回角度
            getSlideAngle:function (dx, dy) {
                return Math.atan2(dy, dx) * 180 / Math.PI;
            },
            //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动  
            getSlideDirection:function (startX, startY, endX, endY) {
                var dy = startY - endY;  
                var dx = endX - startX;  
                var result = 0;  
    
                //如果滑动距离太短  
                if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {  
                    return result;  
                }  
    
                var angle = this.getSlideAngle(dx, dy);  
                if(angle >= -45 && angle < 45) {  
                    result = 4;  
                }else if (angle >= 45 && angle < 135) {  
                    result = 1;  
                }else if (angle >= -135 && angle < -45) {  
                    result = 2;  
                }  
                else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {  
                    result = 3;  
                }  
    
                return result; 
            }
        }
    }
</script>
