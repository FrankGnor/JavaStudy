var aid = 0;
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"2","bdSize":"16"},"share":{}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='https://7n.w3cschool.cn/plugins/baidushare/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];



!function (win, doc) {
        
    var docEle = doc.documentElement;
    var Support = {
        touch: (win.navigator.maxTouchPoints > 0) || ('ontouchstart' in win),
        passiveListener: (function checkPassiveListener () {
            var supportPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportPassive = true;
                    }
                });
                win.addEventListener('testPassiveListener', null, opts);
            } catch (e) { /* no support */ }
            return supportPassive;
        })()
    };
    var Event = (function Event () {
        return {
            preventDefault: function (event) { if (typeof event.cancelable !== 'boolean' || event.cancelable) event.preventDefault(); }
        }
    })();
    var passiveListener = Support.passiveListener ? { passive: false, capture: false } : false;
    var pageScroll = (function () {
        var bodyPreStyle;
        function saveBodyStyle () { bodyPreStyle = doc.body.style.cssText }
        function resetBodyStyle () { doc.body.style.cssText = bodyPreStyle }
        return {
            disable: function () {
                saveBodyStyle();
                doc.body.style.overflow = 'hidden';
                doc.body.style.paddingRight = (win.innerWidth - docEle.clientWidth) + 'px';
                Support.touch && doc.addEventListener('touchmove', Event.preventDefault, passiveListener);
            },
            enable: function () {
                if (bodyPreStyle !== void 0) resetBodyStyle();
                Support.touch && doc.removeEventListener('touchmove', Event.preventDefault, passiveListener);
            }
        }
    })();

    // 获取元素的大小及其与视口的距离（不会将滚动条计算在内）
    function getToWindowRect (el) {
        var rect = el.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            right: docEle.clientWidth - rect.right,
            bottom: docEle.clientHeight - rect.bottom
        }
    }

    // popover-card 接口
     win.LemmaPopover = function (win, doc) {
        var Default = {
            template: '' +
                '<div class="lemma-popover-mask"></div>' +
                '<div class="lemma-popover-wrap">' +
                    '<div class="lemma-popover">' +
                        '<div class="lemma-popover-inner">' +
                            '<div class="lemma-popover-arrow"></div>' +
                            '<div class="lemma-popover-close"><i class="i-icon i-icon-close"></i></div>' +
                            '<div class="single-ellipsis lemma-popover-title"><span class="decorate"></span><span class="word"></span></div>' +
                            '<div class="lemma-popover-content"></div>' +
                            '<a class="lemma-popover-link" target="_blank" href="">查看详解</a>' +
                        '</div>' +
                    '</div>' +
                '</div>'
        };
        
        return {
            popover: null,
            create: function () {  // 创建时就将元素插入页面中
                var popover = doc.createElement('div');
                    popover.innerHTML = Default.template;
                    popover.addEventListener('click', function (e) {
                        var targetCls = e.target.className;
                        if (targetCls === 'lemma-popover-wrap' || targetCls === 'i-icon i-icon-close') this.hide();
                    }.bind(this), false);
                doc.body.appendChild(popover);
                return popover;
            },
            getPopover: function () {
                if (!this.popover) this.popover = this.create();
                return this.popover;
            },
            setPosition: function (targetEle) {
                if (!this.popover) return;

                // 目标元素：根据此元素在页面中的位置对 popover 进行定位
                var targetToWindowRect = getToWindowRect(targetEle);
                var targetEleW = targetToWindowRect.width,
                    targetEleH = targetToWindowRect.height;

                // popover 元素
                var popoverEle = this.popover.querySelector('.lemma-popover');
                var popoverEleW = popoverEle.offsetWidth;
                var popoverArrowEle = popoverEle.querySelector('.lemma-popover-arrow');

                // x轴定位：哪个方位的位置小，就靠近哪边
                var XSideName = targetToWindowRect.left <= targetToWindowRect.right ? 'left' : 'right';
                var XPosition = targetToWindowRect[XSideName] - (popoverEleW - targetEleW) / 2;                                 // 理论上：popover 与 目标元素的中心对齐
                if (XPosition <= 0) XPosition = Math.min(10, targetToWindowRect[XSideName]);                                    // 超出屏幕时，与视口的最小间距为 10
                popoverEle.style[XSideName] = XPosition + 'px';
                popoverArrowEle.style[XSideName] = targetEleW / 2 + targetToWindowRect[XSideName] - XPosition - 16 / 2 + 'px';  // 箭头永远指向目标元素的中心（16是箭头的尺寸）

                // y轴定位：哪边的位置大，就在哪边显示
                if (targetToWindowRect.top <= targetToWindowRect.bottom) {
                    popoverEle.className = 'lemma-popover lemma-popover-placement-bottom';
                    popoverEle.style.top = targetToWindowRect.top + targetEleH + 'px';
                } else {
                    popoverEle.className = 'lemma-popover lemma-popover-placement-top';
                    popoverEle.style.bottom = targetToWindowRect.bottom + targetEleH + 'px';
                }
            },
            resetPosition: function () {
                var popover = this.getPopover();
                // 重置 popover 的定位
                var popoverEle = popover.querySelector('.lemma-popover');
                    popoverEle.style.cssText = '';
                    popoverEle.className = 'lemma-popover';
                // 重置 popover 的箭头
                var popoverArrowEle = popoverEle.querySelector('.lemma-popover-arrow');
                    popoverArrowEle.style.cssText = '';
            },

            show: function (options) {
                var popover = this.getPopover();

              
                // 设置内容
                popover.querySelector('.lemma-popover-title > .word').innerText = options.title || '';
                popover.querySelector('.lemma-popover-content').innerText = options.content || '';

                var link = options.link,
                    linkEle = popover.querySelector(".lemma-popover-link");
                if (link) {
                    linkEle.style.display = 'block';
                    linkEle.setAttribute('href', link);
                } else {
                    linkEle.style.display = 'none';
                }

                // 需要先显示出来，才能正确获取宽度
                popover.style.display = 'block';

                // 设置定位
                this.setPosition(options.el);
                pageScroll.disable();
            },
            hide: function () {
                this.getPopover().style.display = 'none';
                this.resetPosition();
                pageScroll.enable();
            }
        }
    }(win, doc);
}(window, document);

$(function(){

    $('.aside-hotarticle .aside-article-main').children().each(function () {
        var url = $(this).attr('href') + window.location.href.match(/[0-9]+/g)[1];
        $(this).attr('href', url);
    });

    $('.aside-article .aside-article-main').children().each(function () {
        var url = $(this).attr('href') + window.location.href.match(/[0-9]+/g)[1];
        $(this).attr('href', url);
    });

    $('.aside-new-tool .relevant-content ul').children().each(function () {
        var url = $(this).attr('href') + window.location.href.match(/[0-9]+/g)[1];
        $(this).attr('href', url);
    });
    
    $(".relevant-course .relevant-content").children().each(function () {
        var url = $(this).attr('href') + window.location.href.match(/[0-9]+/g)[1];
        $(this).attr('href', url);
    });

    $('.hot-course .aside-relevant-main').children().each(function () {
        var url = $(this).attr('href') + window.location.href.match(/[0-9]+/g)[1];
        $(this).attr('href', url);
    });

    $('.aside-hotCourse .aside-hotCourse-main').children().each(function () {
        var url = $(this).attr('href') + window.location.href.match(/[0-9]+/g)[1];
        $(this).attr('href', url);
    });

    var contentMain = document.getElementById('articleContent');
    // 监听网页的copy(复制)事件
    contentMain.addEventListener('copy', function (event) {

        var ypre_uid = $.cookie('ypre_uid');
        if(ypre_uid != null){
            return;
        }

        // clipboardData 对象是为通过编辑菜单、快捷菜单和快捷键执行的编辑操作所保留的，也就是你复制或者剪切内容
        var clipboardData = event.clipboardData || window.clipboardData;
        var tipWxLogin = sessionStorage.getItem('tipWxLogin');
        
        // 如果未复制或者未剪切，则return出去
        if (!clipboardData) return;

        if(tipWxLogin == 1) return;

        // Selection 对象，表示用户选择的文本范围或光标的当前位置。
        var text = window.getSelection().toString();
        var qrparams = {
            title: "复制成功!",
            tip: "<h4>登录后体验更佳!</h4>",
            refer: window.location.pathname,
            channel: 'article_copy_wx_scanner',
        };

        wechatqr(qrparams);
        sessionStorage.setItem('tipWxLogin',1);
    });


    var pswpElement = document.querySelectorAll('.pswp')[0];

    // 图片放大相关

    var articleImage = [];  // 图片放大后展示所用的数组
    var options = {
        index: 0 // 最先展示的图片索引
    };

    // 填充图片数组
    document.querySelectorAll('.article-page img').forEach(function (image) {
        if (image.parentNode.tagName !== 'A') articleImage.push({ src: image.src, w: image.clientWidth * 1.5, h: image.clientHeight * 1.5 });
    });

    $('.article-page img').each(function (index) {
        $(this).on('click', function () {
            // 修改为当前点击图片的索引
            options = { index: index };

            // 调用方法初始化放大插件
            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, articleImage, options);
            gallery.init();
        });
    });


    $('#feedBack').on('click', function () {
        $('.feedback').click();
    });

    $('body').on('click', 'a[target="_lemma"]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var targetElem = e.target;
        LemmaPopover.show({
            el: targetElem,
            title: targetElem.innerText,
            content: $(targetElem).data('lemma'),
            link: targetElem.getAttribute('href')
        })
    });

    $("#articleContent").find("pre").attr('style', 'max-width: 100%; position: relative');
    $("#articleContent").find("pre").each(function(){ // 给代码块添加复制按钮
        var codenode = $(this).find("code");
        var lang = $(this).attr("lang");
        var code = '';
        
        if(codenode.length == 0){
            code = $(this).html();
            $(this).wrapInner('<code class="text"></code>');
        }else{
            code = codenode.html();
        }
        $(this).data("code",HTMLDeCode(code));


        $(this).prepend('<a class="code-copy right0" title="复制到剪切板"><i class="icon-copy"></i></a>');
        

        
    });

    // // 阅读全文限制
    // if (isAppOpen == 0)  {
    //     $('#limitBtn').on('click', function () { $('#readLimitTip').show(); });
    //     $('.cancel').on('click', function () {
    //         $('#articleContent .content').removeClass('limit-content');
    //         $('#limitBtn').hide();
    //         $('#readLimitTip').hide();
    //     });
    //     $('.confirm').on('click', function () {
    //         $('#articleContent .content').removeClass('limit-content');
    //         $('#limitBtn').hide();
    //         $('#readLimitTip').hide();
    //         if (isAndroid()) {
    //             window.location.href = "https://7npmedia.w3cschool.cn/w3cschool_wap.apk";
    //         } else if (isIOS()) {
    //             window.location.href = "https://apps.apple.com/app/apple-store/id1215644262?pt=120078903&ct=w3cschool_wap&mt=8";
    //         }
    //     });
    // }
    
             /***** 复制按钮 开始*******/
    var clipboardSnippets = new Clipboard('.code-copy',{
    	'text': function(trigger){
           
    		var code = $(trigger).parents("pre").data("code");
    		return code;
    	}
	    // target: function(trigger) {
	    //     return trigger.nextElementSibling.nextElementSibling;
	    // },
	});
	clipboardSnippets.on('success', function(e) {
	    e.clearSelection();
	    toastr.success("复制成功");
	});
	clipboardSnippets.on('error', function(e) {
		toastr.warning("复制失败");

	});

    $('.ltime').each(function(){
        $(this).replaceWith(getHtml($(this).text()));
    });
});



function getHtml(times){
    var html='';
    if(!check_Datetime(times)){
        html+='请输入正确时间';
    }else{
        html+=' <div class="timer-simple-seconds"  datetime="'+times+'">剩余时间： ';
        html+=' <span class="day">0</span>天';
        html+=' <span class="hour">00</span>时';
        html+=' <span class="minute">00</span>分';
        html+=' <span class="second">00</span>秒';
        html+=' </div>';
    }
    return html;
}
function check_Datetime(t){
    var t = new Date(t);
    if(t.getTime()){
        return true;
    }else{
        return false;
    }
}
$(function(){
    //对所有的计时器进行处理
    var timers=$(".timer-simple-seconds");
    for(var i=0;i<timers.length;i++){
        var timer=$(timers[i]);
        //处理时间格式为倒计时秒数
        prepareProcessDatetime2Timer(timer);
        //先调用一次，避免误差
        processTimer(timer);
        setInterval(processTimer,1000,timer);
    }
    function prepareProcessTimestamp2Timer(timer){
        var total=parseInt(timer.attr("timestamp"));
        total=Math.round(total/1000);
        var now=new Date().getTime()/1000;
        timer.attr("timer",total-now);
    }

    /**
     * 将日期时间格式转为倒计时格式
     */
    function prepareProcessDatetime2Timer(timer){
        var timestamp=new Date(timer.attr("datetime")).getTime();
        timer.attr("timestamp",timestamp);
        prepareProcessTimestamp2Timer(timer);
    }

    /**
     * 倒计时，滴答滴答...
     */
    function processTimer(timer){
        var total=parseInt(timer.attr("timer"));
        var t=total;
        //倒计时不能为负
        if(total<0) return; //后续版本加上计时完毕可以回调函数
        //找到显示时间的元素
        var day=timer.find(".day");
        var hour=timer.find(".hour");
        var minute=timer.find(".minute");
        var second=timer.find(".second");
        //刷新计时器显示的值
        if(day.length){
            var d=Math.floor(t/(60*60*24));
            day.text(d);
            t-=d*(60*60*24);
        }
        if(hour.length){
            var h=Math.floor(t/(60*60));
            hour.text((h<10?"0":"")+h);
            t-=h*(60*60);
        }
        if(minute.length){
            var m=Math.floor(t/60);
            minute.text((m<10?"0":"")+m);
            t-=m*60;
        }
        if(second.length){
            second.text((t<10?"0":"")+t);
        }
        //一秒过去了...
        total--;
        timer.attr("timer",total);
    }


    // 过滤内容链接
    if(platform == 'baidu'){
        let filterLink = function(){
            let href = $(this).attr("href");
            $(this).attr('outhref', href);
            $(this).attr('title', "小程序暂不支持该链接跳转");
            $(this).removeAttr('href');
        }

        $("#articleContent a").each(filterLink);
        $(".nav-footer a").each(filterLink);

    }
});

$('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});

// 点赞
$('#handleThumbsUp').on('click', function () {
    $.ajax({
        url: '/articleLike',
        type: 'post',
        datatype: 'json',
        async: false,
        data: {
            aid: phpData.aid
        },
        success: function (res) {
            res = JSON.parse(res);
            console.log(res)
            switch (res.statusCode)
            {
                case 300:
                    window.location.href = '/login?refer=' + window.encodeURIComponent(window.location.pathname + window.location.search);
                    break;
                case 301:
                    console.log(222)

                    window.open('/articlelist');
                    break;
                case 200:
                    if (res.message == '您已经点赞过了') {
                        alert(res.message);
                        // $('#handleThumbsUp').addClass('icon-already');
                    } else {
                        $('#likeNum').html(parseInt(phpData.likeNum) + 1);
                    }
                    break;
            }
        }
    })
})

if ($('.relevant-course').length > 0 || $('.hot-course').length > 0) {
    window.addEventListener('scroll', function() {
        if ($('.relevant-course').length > 0) {
            var scrollDom = $('.relevant-course');
        } else {
            var scrollDom = $('.hot-course');
        }
        var scrollTop = Scroll.getScrollTop();
        var hotCourseHeight = Scroll.getBoundingPageRect(scrollDom[0]).bottom - Scroll.getBoundingPageRect(scrollDom[0]).top;
        var mainFlBottom = Scroll.getBoundingPageRect($('.article-main-fl')[0]).bottom;
        var relevantCourselBottom = Scroll.getBoundingPageRect($('.aside-hotCourse')[0]).bottom;
        
        var hotCourseBottom = relevantCourselBottom + hotCourseHeight + 24;
    
        if (mainFlBottom < hotCourseBottom) return;
        if (mainFlBottom > scrollTop && scrollTop > relevantCourselBottom) {
            scrollDom.addClass('ranking-fixed').removeClass('ranking-absolute');
        } else if (mainFlBottom < scrollTop) {
            scrollDom.addClass('ranking-absolute').removeClass('ranking-fixed');
        } else {
            scrollDom.removeClass('ranking-absolute ranking-fixed');
        }
    })
}

function uploadSingleArticle(){
    $.ajax({
        url: '/project/singleArticleCurl',
        type: 'post',
        data: {
            aid: phpData.aid
        },
        dataType: 'json',
        success: function(res){
            console.log(res)
            if(res.statusCode < 300){
                $(".upline").hide();
                alert(res.message);
            }else{
                alert(res.message);
            }
        }
    });
}

function HTMLEnCode(str){
	var s = "";  
	if(str.length == 0)    return "";  
	s = str.replace(/&/g, "&amp;");  
	s = s.replace(/</g, "&lt;");  
	s = s.replace(/>/g, "&gt;");  
	s = s.replace(/ /g, "&nbsp;");  
	s = s.replace(/\'/g, "'");  
	s = s.replace(/\"/g, "&quot;");  
	s = s.replace(/\n/g, "<br>");  
	return s;  
}

function HTMLDeCode(str){
	var s = "";  
	if(str.length == 0)    return  "";  
	s = str.replace(/&amp;/g, "&");  
	s = s.replace(/&lt;/g, "<");  
	s = s.replace(/&gt;/g, ">");  
	s = s.replace(/&nbsp;/g,  " ");  
	s = s.replace(/'/g, "\'");  
	s = s.replace(/&quot;/g, "\"");  
	s = s.replace(/<br>/g, "\n");  
	s = s.replace(/&#8211;/g, "-");  
	return  s;  
}

function isIOS() {
    /* istanbul ignore next */
    return /ios|iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isAndroid() {
    /* istanbul ignore next */
    return /android/i.test(navigator.userAgent)
}
