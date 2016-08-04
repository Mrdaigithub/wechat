((DOC,WIN)=>{
    const BODY = DOC.body;
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

    /**
     * 随机获取数组的某个元素
     * @param arr
     * @param num
     * @returns {*}
     */
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
        let sumNumView = DOC.querySelector('.signIn header i'),
            signView = DOC.querySelector('.signIn ul'),
            postData = 0;

        let poll = (url)=>{
            $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                data: JSON.stringify(postData),
                success: (data)=> {
                    data = JSON.parse(data);
                    postData = data.length;

                    let signHtml = '';
                    sumNumView.innerHTML = data.length;
                    data.forEach((e)=> {
                        if (!e.headImgUrl) e.headImgUrl = "http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png";
                        signHtml += '<li><img src=' + e.headImgUrl + ' alt="headImg"><p>' + e.nickname + '</p></li>';
                    });
                    signView.innerHTML = signHtml;
                    poll(url);
                },
                error: ()=> {
                    poll(url);
                }
            })
        };

        DOC.querySelector('#SignBtn').addEventListener('click',()=>{
            hideOtherModule();
            if(DOC.querySelector('main').style.display === 'none') DOC.querySelector('main').style.display = 'block';
            DOC.querySelector('.signIn').style.display = 'block';
            poll('http://120.26.53.25/wechat/Project/api/getActiveUser/');
        },false);
    };

    /**
     * 消息上墙
     */
    let messageView = ()=>{
        let postData = 0;
        let updateMsg = (url)=>{
            $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                data: JSON.stringify(postData),
                success: (data)=>{
                    data = JSON.parse(data);
                    postData = data.length;
                    let htmlStr = '';
                    data.forEach((e)=>{
                        htmlStr += '<li><img src="'+ e.headImgUrl+'" alt=""><div><p>'+ e.nickname +'</p><strong>'+ e.content +'</strong></div></li>';
                    });
                    DOC.querySelector('.message .pull-right').innerHTML = htmlStr;
                    updateMsg(url);
                },
                error: ()=>{
                    updateMsg(url);
                }
            });
        };


        // 开启消息模块
        DOC.querySelector('#msgBtn').addEventListener('click',()=>{
            hideOtherModule();
            if(DOC.querySelector('main').style.display === 'none') DOC.querySelector('main').style.display = 'block';
            DOC.querySelector('.message').style.display = 'block';
            updateMsg('http://120.26.53.25/wechat/Project/api/getMessage/');
        },false)
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
        // 动画开关
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

        /**
         * 抽奖动画
         * @param toPrizeUser
         * @param singleToPrizeUserArr
         * @param intervalTime
         * @param flag
         */
        let prizeAnimation = (toPrizeUser,singleToPrizeUserArr,intervalTime,flag=0)=>{
            let li = Array.prototype.slice.call(DOC.querySelectorAll('.prize .pull-left ul li'));
            if (flag>=singleToPrizeUserArr.length) flag = 0;
            li.forEach((e)=>{
                e.querySelector('img').src = toPrizeUser[singleToPrizeUserArr[flag]].headImgUrl;
                e.querySelector('p').innerHTML = toPrizeUser[singleToPrizeUserArr[flag]].nickname;
            });
            setTimeout(()=>{
                if (!animationSwitch) return;
                prizeAnimation(toPrizeUser,singleToPrizeUserArr,intervalTime,++flag);
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

            prizeAnimation(toPrizeUser,singleToPrizeUserArr,100);
        };

        /**
         * 构建中奖的用户组
         * @param toPrizeUser
         * @returns {Array}
         */
        let createWinningUsers = (toPrizeUser)=>{
            let arr = [],
                winningUsersSub = [],
                winningUsers = [];
            for (let i=0; i<toPrizeUser.length; i++){
                arr.push(i);
            }
            winningUsersSub = getRandomArrEle(arr,DOC.querySelectorAll('.prize .pull-left ul li').length);
            winningUsersSub.forEach((e)=>{
                winningUsers.push(toPrizeUser[e]);
            });
            return winningUsers;
        };

        /**
         * 填充中奖的用户到左侧小窗口
         * @param winningUsers
         */
        let paddingWinningUsers = (winningUsers)=>{
            let li = Array.prototype.slice.call(DOC.querySelectorAll('.prize .pull-left ul li'));
            for (let i=0; i<li.length; i++){
                li[i].querySelector('img').src = winningUsers[i].headImgUrl;
                li[i].querySelector('p').innerHTML = winningUsers[i].nickname;
            }
        };

        /**
         * 将中奖用户数据保存到数据库
         * @param prizeData
         * @param prizewinningUsers
         */
        let saveWinningUsersToServer = (prizeData,prizewinningUsers)=>{
            let resultData = [],
                prizeId = null;
            // 获取当前的奖品等级
            prizeData.forEach((e)=>{
                if (DOC.querySelector('.prizeLevel p i').innerHTML === e.level) prizeId = e.id;
            });
            // 构建要传输的数据包
            prizewinningUsers.forEach((e)=>{
                let arr = {};
                arr.openid = e.openid;
                arr.prizeId = prizeId;
                resultData.push(arr);
            });
            resultData = JSON.stringify(resultData);
            $.post('http://120.26.53.25/wechat/Project/api/receivePrizeUser/',resultData);
        };

        // 初始化
        let init = ()=>{

            // 获取到数据库的奖品数据
            $.getJSON('http://120.26.53.25/wechat/Project/api/getPrizeData/',(prizeData)=>{

                // 获取数据库可以参加抽奖的用户数据
                $.getJSON('http://120.26.53.25/wechat/Project/api/getToPrizeUser/',(toPrizeUsers)=>{

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
                            updateToPrizeUserNumView(prizeData,toPrizeUsers);
                        }
                    },false);

                    // 减少左侧选定用户的数量
                    DOC.querySelector('.lessBtn').addEventListener('click',()=>{
                        var num = parseInt(DOC.querySelector('.prizeNum span').innerHTML);
                        if (num > 0){
                            DOC.querySelector('.prizeNum span').innerHTML = --num;
                            updateToPrizeUserNumView(prizeData,toPrizeUsers);
                        }
                    },false);

                    // 添加左侧选定用户的数量
                    DOC.querySelector('.addBtn').addEventListener('click',()=>{
                        let userNum = toPrizeUsers.length,
                            prizeNum = 0;
                        if (userNum <= 0){
                            
                        }
                        prizeData.forEach((e)=>{
                            if (e.level === DOC.querySelector('.prizeLevel i').innerHTML){
                                prizeNum = e.num;
                            }
                        });
                        let num = parseInt(DOC.querySelector('.prizeNum span').innerHTML);
                        if (num < Math.min(userNum,prizeNum)){
                            DOC.querySelector('.prizeNum span').innerHTML = ++num;
                            updateToPrizeUserNumView(prizeData,toPrizeUsers);
                        }
                    },false);

                    // 开始或停止抽奖
                    DOC.querySelector('.prizeBtn').addEventListener('click',(event)=>{
                        let e = WIN.event || event;
                        if (e.target.innerHTML === 'start'){
                            if (toPrizeUsers.length <= 0){
                                DOC.querySelector('.weui_dialog_alert').style.display = 'block';
                                return 0;
                            }
                            // 开始抽奖
                            animationSwitch = true;
                            e.target.innerHTML = 'stop';
                            prizeBomb(prizeData,toPrizeUsers);
                        }else {
                            // 停止抽奖
                            animationSwitch = false;
                            e.target.innerHTML = 'start';
                            let winningUsers = createWinningUsers(toPrizeUsers);
                            paddingWinningUsers(winningUsers);
                            saveWinningUsersToServer(prizeData,winningUsers);
                        }
                        $.getJSON('http://120.26.53.25/wechat/Project/api/getToPrizeUser/',(toPrizeUser)=>{
                            toPrizeUsers = toPrizeUser;
                        })
                    },false);
                })
            });
        };

        // 开启抽奖模块视图
        DOC.querySelector('#giftBtn').addEventListener('click',()=>{
            init();
            hideOtherModule();
            if(DOC.querySelector('main').style.display === 'none') DOC.querySelector('main').style.display = 'block';
            DOC.querySelector('.prize').style.display = 'block';
        },false);
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

    let toggleAlert = ()=>{
        DOC.querySelector('.weui_dialog_alert').addEventListener('click',(event)=>{
            let e = WIN.event || event;
            if (e.target.nodeName === 'A' && DOC.querySelector('.weui_dialog_alert').style.display === 'block'){
                DOC.querySelector('.weui_dialog_alert').style.display = 'none';
            }else if (e.target.nodeName === 'A' && DOC.querySelector('.weui_dialog_alert').style.display === 'none'){
                DOC.querySelector('.weui_dialog_alert').style.display = 'block';
            }
        },false)
    };

    // 加载界面
    WIN.addEventListener('load',()=>{
        DOC.querySelector('#loadingToast').style.display = 'none';
    });

    index();
    signInView();
    messageView();
    countdown();
    prize();
    // vote();
    footerAnimation();
    setting();
    toggleAlert();

})(document,window);
