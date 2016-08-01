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
                setTimeout(timeAnimation,50);
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
        let ul = DOC.querySelector('.prizeLevel ul'),
            prizeNum = DOC.querySelector('.prizeNum'),
            giftBtn = DOC.querySelector('#giftBtn'),
            prize = DOC.querySelector('.prize'),
            animationSwitch = false;

        giftBtn.addEventListener('click',()=>{
            hideOtherModule();
            prize.style.display = 'block';
        },false);

        $.getJSON('http://120.26.53.25/wechat/Project/api/getPrizeInfo/',(prizeData)=>{
            let levelList = '';
            prizeData.forEach((e)=>{
                levelList += '<li>'+e.level+'</li>';
            });
            ul.innerHTML = levelList;
            DOC.querySelector('.prizeLevel p i').innerHTML = ul.firstChild.innerHTML;
            $.getJSON('http://120.26.53.25/wechat/Project/api/getActiveUser/',(userData)=>{

                // 抽奖动画
                let animation = (viewUsers,dataUsers,intervalTime,flag=0)=>{
                    let animationArr = [];
                    // 帮每个视图用户构建随机的数组

                    // 动画烟雾弹
                    for (let i=0; i<viewUsers.length; i++){
                        let arr = [];
                        for (let j=0; j<dataUsers.length; j++){
                            arr.push(j);
                        }
                        animationArr.push(randomArr(arr));
                    }
                    if (flag >= animationArr[0].length) flag = 0;
                    for (let i=0; i<viewUsers.length; i++){
                        if (!dataUsers[animationArr[i][flag]].headimgurl) dataUsers[animationArr[i][flag]].headimgurl = 'http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png';
                        viewUsers[i].querySelector('img').src = dataUsers[animationArr[i][flag]].headimgurl;
                        viewUsers[i].querySelector('p').innerHTML = dataUsers[animationArr[i][flag]].nickname;
                    }
                    setTimeout(()=>{
                        if (!animationSwitch){

                            // 构建真实的中奖用户
                            let trueUsers = [];
                            for (let i=0; i<dataUsers.length; i++){
                                trueUsers.push(i);
                            }
                            let trueUsersSub = getRandomArrEle(trueUsers,DOC.querySelectorAll('.prize .pull-left li').length);
                            for (let i=0; i<DOC.querySelectorAll('.prize .pull-left li').length; i++){
                                viewUsers[i].querySelector('img').src = dataUsers[trueUsersSub[i]].headimgurl;
                                viewUsers[i].querySelector('p').innerHTML = dataUsers[trueUsersSub[i]].nickname;
                            }


                            // 将中奖的用户的openid和奖项通过ajax发送到服务器
                            let sendData = [];
                            viewUsers.forEach((e)=>{
                                let obj = {};
                                obj.openid = userData;
                                userData.forEach((g)=>{
                                    if (e.querySelector('p').innerHTML === g.nickname){
                                        obj.openid = g.openid;
                                        prizeData.forEach((k)=>{
                                            if (k.picUrl === DOC.querySelector('.prizePic img').src){
                                                obj.prizeid = k.id;
                                            }
                                        });
                                    }
                                });
                                sendData.push(obj);
                            });
                            $.ajax({
                                type: "POST",
                                url: "http://120.26.53.25/wechat/Project/api/receivePrizeUser/",
                                data: JSON.stringify(sendData),
                                success: function(msg){}
                            });
                            return 0;
                        }
                        animation(viewUsers,dataUsers,intervalTime,++flag);
                    },intervalTime)
                };

                prizeData.forEach((e)=>{
                    if (e.level === DOC.querySelector('.prizeLevel p i').innerHTML){
                        DOC.querySelector('.prizePic img').src = e.picUrl;
                    }
                });
                ul.addEventListener('click',(event)=>{
                    let e = WIN.event || event;
                    if (e.target.nodeName === 'LI'){
                        DOC.querySelector('.prizeLevel p i').innerHTML = e.target.innerHTML;
                        ul.className = 'hide';
                        DOC.querySelector('.prizeLevel p span').className = 'caret';
                        prizeData.forEach((e)=>{
                            if (e.level === DOC.querySelector('.prizeLevel p i').innerHTML){
                                DOC.querySelector('.prizePic img').src = e.picUrl;
                                if (parseInt(DOC.querySelector('.prizeNum span').innerHTML) > parseInt(e.num)){
                                    DOC.querySelector('.prizeNum span').innerHTML = e.num;
                                    DOC.querySelector('.prize .pull-left ul').innerHTML = '';
                                    for (let i=0; i<parseInt(e.num); i++){
                                        DOC.querySelector('.prize .pull-left ul').innerHTML += '<li><img src="http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png"><p>...</p></li>';
                                    }
                                    DOC.querySelector('.prizeBtn').addEventListener('click',()=>{

                                    },false)
                                }
                            }
                        });

                    }
                },false);
                DOC.querySelector('.prizeLevel p').addEventListener('click',()=>{
                    if (ul.className === 'hide'){
                        ul.className = 'show';
                        DOC.querySelector('.prizeLevel p span').className = 'caret toTop';
                    }else{
                        ul.className = 'hide';
                        DOC.querySelector('.prizeLevel p span').className = 'caret';
                    }
                },false);
                DOC.querySelector('.lessBtn ').addEventListener('click',()=>{
                    var num = parseInt(DOC.querySelector('.prizeNum span').innerHTML);
                    if (num > 0){
                        DOC.querySelector('.prizeNum span').innerHTML = --num;
                        DOC.querySelector('.prize .pull-left ul').innerHTML = DOC.querySelector('.prize .pull-left ul').innerHTML.replace(/<li><img.+?\/li>/i,'');
                    }
                },false);
                DOC.querySelector('.addBtn ').addEventListener('click',()=>{
                    let userNum = userData.length,
                        prizeNum = 0;
                    prizeData.forEach((e)=>{
                        if (e.level === DOC.querySelector('.prizeLevel i').innerHTML){
                            prizeNum = e.num;
                        }
                    });
                    let num = parseInt(DOC.querySelector('.prizeNum span').innerHTML);
                    if (num < Math.min(userNum,prizeNum)){
                        DOC.querySelector('.prizeNum span').innerHTML = ++num;
                        DOC.querySelector('.prize .pull-left ul').innerHTML += '<li><img src="http://o7qephszd.bkt.clouddn.com/wechatDefaultHeadImg.png"><p>...</p></li>';
                    }
                },false);
                DOC.querySelector('.prizeBtn').addEventListener('click',()=>{
                    if (DOC.querySelector('.prizeBtn').innerHTML === 'start'){
                        DOC.querySelector('.prizeBtn').innerHTML = 'stop';
                        $.getJSON('http://120.26.53.25/wechat/Project/api/getToPrizeUser/',(userData)=>{
                            animationSwitch = true;
                            animation(DOC.querySelectorAll('.prize .pull-left li'),userData,100);
                        });
                    } else{
                        DOC.querySelector('.prizeBtn').innerHTML = 'start';
                        animationSwitch = false;
                    }
                },false)
            });
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
            console.log('as');
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
