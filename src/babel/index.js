((DOC,WIN)=>{
    const BODY = DOC.body;
    const MAIN = DOC.querySelector('main');
    const FOOTER = DOC.querySelector('footer');

    // 工具函数

    /**
     * 随机重排数组
     * @param arr
     * @returns {*}
     */
    let randomArr = (arr)=>{
        Array.prototype.sort.call(arr,function () {
            return Math.random()>0.5? 1 : -1;
        });
        return arr;
    };

    // 随机获取数组的某个元素
    let getRandomArrEle = (arr,num)=>{
        if (num > arr.length || num <= 0) return false;
        let result = [];
        for (let i=0; i<num; i++){
            let singleElement = Math.floor(Math.random() * arr.length + 1)-1;
            result.push(arr.splice(singleElement,1)[0]);
        }
        return result;
    };

    /**
     * 隐藏所有模块
     */
    let hideOtherModule = ()=>{
        let modules = Array.prototype.slice.call(DOC.querySelectorAll('main>div'));
        modules.forEach((e)=>{
            if (e.style.display === 'block') e.style.display = 'none';
        })
    };

    // main

    /**
     * 主屏按钮
     */
    let index = ()=>{
        let indexBtn = DOC.querySelector('#indexBtn');
        indexBtn.addEventListener('click',()=>{
            hideOtherModule();
            DOC.querySelector('main').style.display = 'none';
        },false);
    };

    /**
     * 填充签到页面的内容
     */
    let signInView = ()=>{
        let jsonStr = '',
            sumNumView = DOC.querySelector('.signIn header i'),
            signView = DOC.querySelector('.signIn ul');
        let poll = (url)=>{
            $.getJSON(url,(json)=>{
                if (jsonStr !== JSON.stringify(json)){
                    let signHtml = '';
                    jsonStr = JSON.stringify(json);

                    sumNumView.innerHTML = json.length;
                    json.forEach((e)=>{
                        if (!e.headimgurl) e.headimgurl = "http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png";
                        signHtml += '<li><img src='+e.headimgurl+' alt="headImg"><p>'+e.nickname+'</p></li>';
                    });
                    signView.innerHTML = signHtml;
                }
            });
            setTimeout(()=>{
                poll(url);
            },5000)
        };

        DOC.querySelector('#SignBtn').addEventListener('click',()=>{
            hideOtherModule();
            if(DOC.querySelector('main').style.display === 'none') DOC.querySelector('main').style.display = 'block';
            DOC.querySelector('.signIn').style.display = 'block';
            poll('http://120.26.53.25/wechat/Project/api/getActiveUser/');
        },false);
    };

    /**
     * 倒计时按钮
     */
    let countdown = ()=>{
        let timeBtn = DOC.querySelector('#timeBtn');
        timeBtn.addEventListener('click',()=>{
            let timeDom = DOC.querySelector('.time'),
                timeText = DOC.querySelector('#timeText'),
                btn = DOC.querySelector('.time button');
            hideOtherModule();
            if(DOC.querySelector('main').style.display === 'none') DOC.querySelector('main').style.display = 'block';
            timeDom.style.display = 'block';
            let timeBox = echarts.init(document.getElementById('timeBox'));
            let time = {
                total: 60,
                used: 0
            };

            timeText.innerHTML = time.total - time.used;
            timeText.style.marginLeft = (-parseInt(WIN.getComputedStyle(timeText,null).width)/2)+'px';
            timeText.style.marginTop = (-parseInt(WIN.getComputedStyle(timeText,null).height)/2)+'px';
            let option = {
                series: [
                    {
                        type:'pie',
                        radius: ['50%', '70%'],
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        data:[
                            {value:time.used, name:''},
                            {value:time.total-time.used, name:''}
                        ]
                    }
                ]
            };
            timeBox.setOption(option);

            let timeAnimation = ()=>{
                if (time.used >= 60) {
                    timeText.innerHTML = '时间到';
                    timeText.style.marginLeft = (-parseInt(WIN.getComputedStyle(timeText,null).width)/2)+'px';
                    timeText.style.marginTop = (-parseInt(WIN.getComputedStyle(timeText,null).height)/2)+'px';
                    btn.removeAttribute('disabled');
                    return true
                }
                time.used++;
                timeText.style.marginLeft = (-parseInt(WIN.getComputedStyle(timeText,null).width)/2)+'px';
                timeText.style.marginTop = (-parseInt(WIN.getComputedStyle(timeText,null).height)/2)+'px';
                let option = {
                    series: [
                        {
                            type:'pie',
                            radius: ['50%', '70%'],
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data:[
                                {value:time.used, name:''},
                                {value:time.total-time.used, name:''}
                            ]
                        }
                    ]
                };
                timeBox.setOption(option);
                timeText.innerHTML = time.total - time.used;
                setTimeout(timeAnimation,1000);
            };
            btn.addEventListener('click',()=>{
                btn.setAttribute('disabled','disabled');
                timeAnimation();
            },false);
        },false);
    };

    /**
     * 抽奖
     */
    let prize = ()=>{
        let animationSwitch = false;


        // 抽奖内部函数

        /**
         * 填充奖品等级选项卡
         * @param prizeData
         */
        let paddingPrizeLevel = (prizeData)=>{
            let prizeLevelList = '';
            prizeData.forEach((e)=>{
                prizeLevelList += '<li>'+ e.level +'</li>'
            });
            DOC.querySelector('.prizeLevel ul').innerHTML = prizeLevelList;
            DOC.querySelector('.prizeLevel p i').innerHTML = DOC.querySelector('.prizeLevel ul').firstElementChild.innerHTML;
        };

        /**
         * 显示隐藏奖品选项卡
         */
        let togglePrizeLevel = ()=>{
            if (DOC.querySelector('.prizeLevel ul').className === 'hide'){
                DOC.querySelector('.prizeLevel ul').className = 'show';
            }else{
                DOC.querySelector('.prizeLevel ul').className = 'hide';
            }
        };

        /**
         * 填充下方的奖品图片
         * @param prizeData
         */
        let paddingPrizeImg = (prizeData)=>{
            prizeData.forEach((e)=>{
                if (e.level === DOC.querySelector('.prizeLevel p i').innerHTML){
                    DOC.querySelector('.prizePic img').src = e.picUrl;
                }
            });
        };

        /**
         * 更新左侧选中抽奖的用户和右侧的数量
         * @param prizeData
         * @param toPrizeUser
         * 判断奖品数量
         * 判断剩余没中奖的用户数量
         * 让两者同步
         */
        let updateToPrizeUserNumView = (prizeData,toPrizeUser)=>{
            let prizeNum = 0,
                toPrizeUserNum = toPrizeUser.length;
            prizeData.forEach((e)=>{
                if (DOC.querySelector('.prizeLevel p i').innerHTML === e.level){
                    prizeNum = e.num;
                }
            });
            if (DOC.querySelector('.prizeNum span').innerHTML > Math.min(prizeNum,toPrizeUserNum)){
                DOC.querySelector('.prizeNum span').innerHTML = Math.min(prizeNum,toPrizeUserNum);
            }
            let htmlStr = '';
            for (let i=0; i<DOC.querySelector('.prize .pull-right .prizeNum span').innerHTML; i++){
                htmlStr += '<li><img src="http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png"><p>...</p></li>';
            }
            DOC.querySelector('.prize .pull-left ul').innerHTML = htmlStr;
        };

        let prizeAnimation = (toPrizeUser,singleToPrizeUserArr,intervalTime,flag)=>{
            let li = Array.prototype.slice.call(DOC.querySelectorAll('.prize .pull-left ul li'));
            console.log(singleToPrizeUserArr);
            for (let j=0; j<singleToPrizeUserArr.length; j++){
                li.forEach((e)=>{
                    e.querySelector('img').src = toPrizeUser[singleToPrizeUserArr[j]].headimgurl;
                    e.querySelector('p').innerHTML = toPrizeUser[singleToPrizeUserArr[j]].nickname;
                })
            }
            setTimeout(()=>{
                prizeAnimation(singleToPrizeUserArr,intervalTime,flag);
            },intervalTime);
        };
        /**
         * 抽奖烟雾弹
         * @param prizeData
         * @param toPrizeUser
         * @param intervalTime
         * 构建单组顺序的要抽奖的用户组
         * 构建左侧视图是混乱的全部用户组
         */
        let prizeBomb = (prizeData,toPrizeUser)=>{
            // 单组顺序的要抽奖的用户组
            let singleToPrizeUserArr = [];
            for(let i=0; i<toPrizeUser.length; i++){
                singleToPrizeUserArr.push(i);
            }
            singleToPrizeUserArr = randomArr(singleToPrizeUserArr);

            prizeAnimation(toPrizeUser,singleToPrizeUserArr,1000,0);
        };



        // 开启抽奖模块视图
        DOC.querySelector('#giftBtn').addEventListener('click',()=>{
            hideOtherModule();
            if(DOC.querySelector('main').style.display === 'none') DOC.querySelector('main').style.display = 'block';
            DOC.querySelector('.prize').style.display = 'block';
        },false);

        // 获取到数据库的奖品数据
        $.getJSON('http://120.26.53.25/wechat/Project/api/getPrizeData/',(prizeData)=>{
            $.getJSON('http://120.26.53.25/wechat/Project/api/getToPrizeUser/',(toPrizeUser)=>{
                // 填充奖品等级选项卡
                paddingPrizeLevel(prizeData);

                // 填充下方的奖品图片
                paddingPrizeImg(prizeData);

                // 显示隐藏奖品选项卡
                DOC.querySelector('.prizeLevel').addEventListener('click',togglePrizeLevel,false);

                // 切换奖品选项
                DOC.querySelector('.prizeLevel ul').addEventListener('click',(event)=>{
                    let e = WIN.event || event;
                    if (e.target.nodeName === 'LI'){
                        DOC.querySelector('.prizeLevel p i').innerHTML = e.target.innerHTML;
                        paddingPrizeImg(prizeData);
                        updateToPrizeUserNumView(prizeData,toPrizeUser);
                    }
                },false);

                // 减少左侧选定用户的数量
                DOC.querySelector('.lessBtn').addEventListener('click',()=>{
                    var num = parseInt(DOC.querySelector('.prizeNum span').innerHTML);
                    if (num > 0){
                        DOC.querySelector('.prizeNum span').innerHTML = --num;
                        updateToPrizeUserNumView(prizeData,toPrizeUser);
                    }
                },false);

                // 减少左侧选定用户的数量
                DOC.querySelector('.addBtn').addEventListener('click',()=>{
                    let userNum = toPrizeUser.length,
                        prizeNum = 0;
                    prizeData.forEach((e)=>{
                        if (e.level === DOC.querySelector('.prizeLevel i').innerHTML){
                            prizeNum = e.num;
                        }
                    });
                    let num = parseInt(DOC.querySelector('.prizeNum span').innerHTML);
                    if (num < Math.min(userNum,prizeNum)){
                        DOC.querySelector('.prizeNum span').innerHTML = ++num;
                        updateToPrizeUserNumView(prizeData,toPrizeUser);
                    }
                },false);

                // 开始抽奖
                DOC.querySelector('.prizeBtn').addEventListener('click',()=>{
                    prizeBomb(prizeData,toPrizeUser);
                },false)
            })
        });
    };

    /**
     * 排名
     */
    let vote = ()=>{
        let voteBtn = DOC.querySelector('#voteBtn');
        voteBtn.addEventListener('click',()=>{
            let vote = DOC.querySelector('.vote'),
                jsonStr = '';
            vote.className = 'vote show';
            let voteMain = echarts.init(DOC.querySelector('.voteMain')),
                num = DOC.querySelector('.vote i');

            let poll = (url)=>{
                $.getJSON(url, function(json){
                    if (jsonStr !== JSON.stringify(json)){
                        let sum = 0;
                        json.forEach((e)=>{
                            sum += parseInt(e.num);
                        });
                        num.innerHTML = sum;
                        let option = {
                            color: ['#3398DB'],
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : [json[0].lead, json[1].lead, json[2].lead, json[3].lead],
                                    axisTick: {
                                        alignWithLabel: true
                                    },
                                    axisLabel:{
                                        textStyle:{
                                            color:'#fff'
                                        }
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel:{
                                        textStyle:{
                                            color:'#fff'
                                        }
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:'票数',
                                    type:'bar',
                                    barWidth: '60%',
                                    data:[json[0].num, json[1].num, json[2].num, json[3].num]
                                }
                            ]
                        };
                        voteMain.setOption(option);
                        jsonStr = JSON.stringify(json);
                    }
                });
                setTimeout(()=>{
                    poll(url);
                },5000);
            };
            poll('http://120.26.53.25/wechat/Project/api/vote');
        },false)
    };

    /**
     * footer移入移出的动画效果
     */
    let footerAnimation = ()=>{
        FOOTER.addEventListener('mouseover',()=>{
            FOOTER.className = 'hover';
        },false);
        FOOTER.addEventListener('mouseout',()=>{
            FOOTER.className = '';
        },false);
    };

    /**
     * 设置背景
     */
    let setting = ()=>{
        let setCloseBtn = DOC.querySelector('#setCloseBtn'),
            setBtn = DOC.querySelector('#setBtn');

        let bgUrls = {
            bg1Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg1.jpg',
            bg2Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg2.jpg',
            bg3Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg3.jpg',
            bg4Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg4.jpg',
            bg5Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg5.jpg',
            bg6Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg6.jpg',
            bg7Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg7.jpg',
            bg8Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg8.jpg',
            bg9Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg9.jpg',
            bg10Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg10.jpg',
            bg11Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg11.jpg',
            bg12Url: 'http://o7qephszd.bkt.clouddn.com/wechatBg12.jpg'
        };
        setBtn.addEventListener('click',()=>{
            setCloseBtn.parentNode.parentNode.className = 'show';
            setTimeout(()=>{
                setCloseBtn.parentNode.parentNode.style = 'opacity:1';
            },1);
        },false);
        setCloseBtn.addEventListener('click',()=>{
            setCloseBtn.parentNode.parentNode.style = 'opacity:0';
            setTimeout(()=>{
                setCloseBtn.parentNode.parentNode.className = 'hide';
            },500);
        },false);
        DOC.querySelector('#setBgBox ul').addEventListener('click',(event)=>{
            let e = WIN.event || event;
            if (e.target.nodeName === 'IMG'){
                BODY.style.background = 'url('+bgUrls[e.target.dataset['flag']]+') center no-repeat';
            }
        },false);
    };

    index();
    signInView();
    countdown();
    prize();
    vote();
    footerAnimation();
    setting();

})(document,window);
