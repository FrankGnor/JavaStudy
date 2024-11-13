//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) {
        return window.decodeURIComponent(r[2]);
    }

    return null; //返回参数值
}

function toggleSetMenu(selectElement) {
    if (selectElement == '.set-background') {
        if ($('.toggle-dropdown-background').find('.w3c-icon').hasClass('w3c-icon-day')) {
            $('.toggle-dropdown-background').find('.w3c-icon').addClass('w3c-icon-night').removeClass('w3c-icon-day');
            $('.background-day').click();
            $('.toggle-dropdown-background').attr('title', '夜间模式');
        } else {
            $('.toggle-dropdown-background').find('.w3c-icon').addClass('w3c-icon-day').removeClass('w3c-icon-night');
            $('.background-night').click();
            $('.toggle-dropdown-background').attr('title', '日间模式');
        }
    } else {
        if ($(selectElement).is(":hidden")) {
            $(selectElement).show().siblings('.docblur').hide();
        } else {
            $(selectElement).hide();
        }
    }
};




function getviewkn() {
    var usernamestr = '';
    $.ajax({
        url: "/my/knowledge/getViewkn?pename=" + book.pename,
        dataType: "json",
        success: function(msg) {
            var objli, objtt;
            for (var p in msg) {
                objli = $("#nestable_handbook").find(".dd-item[data-id='" + msg[p]['kename'] + "']");
                if (objli.attr("ismenu") != 1) {
                    objli.addClass("readed").find("a").attr("title", "上次浏览时间:(" + msg[p]['lasttime'] + ")");
                }

            }

        }
    });
}

function openNote() {
    $(".onlinenote").trigger("click");
}





function isProjectLike() {

    getWechatQR('lesson_like', location.href);

}


function isProjectStar() {
	getWechatQR('lesson_star', location.href);
        
}


$(function() {

    //主要修复定位不准确BUG
    if (window.location.hash.indexOf('#') >= 0) {
        $('html,body').animate({
            scrollTop: ($(window.location.hash).offset().top - 100) + "px"
        },
        300);
    };

    $('#pro-mian a[href^=#][href!=#]').click(function() {
        var target = document.getElementById(this.hash.slice(1));
        if (!target) return;
        var targetOffset = $(target).offset().top - 100;
        $('html,body').animate({
            scrollTop: targetOffset
        },
        300);
        return false;
    }); 

    var contentMain = document.getElementById('pro-mian');

    // 监听网页的copy(复制)事件
    contentMain.addEventListener('copy', function(event) {

        // clipboardData 对象是为通过编辑菜单、快捷菜单和快捷键执行的编辑操作所保留的，也就是你复制或者剪切内容
        var clipboardData = event.clipboardData || window.clipboardData;
        var tipWxLogin = sessionStorage.getItem('tipWxLogin');

        // 如果未复制或者未剪切，则return出去
        if (!clipboardData) return;

        if (tipWxLogin == 1) return;

        // Selection 对象，表示用户选择的文本范围或光标的当前位置。
        var text = window.getSelection().toString();
        var qrparams = {
            title: "复制成功!",
            tip: "<h4>登录后体验更佳!</h4>",
            refer: window.location.pathname,
            channel: 'lesson_copy_wx_scanner',
        };

        wechatqr(qrparams);
        sessionStorage.setItem('tipWxLogin', 1);
    });


	if (typeof tempColor != 'undefined' && tempColor == 'color-theme-night') {
	    $('.toggle-dropdown-background').find('.w3c-icon').addClass('w3c-icon-day').removeClass('w3c-icon-night');
	}

	checkword = getUrlParam('checkword');
	if (checkword) {
	    var htmls = $('#pro-mian').html();
	    htmls = htmls.replace(new RegExp(checkword, 'g'), '<span class="checkword" style="background-color: skyblue;">$&</span>');
	    $('#pro-mian').html(htmls);


	    setTimeout(function() {
	        $('html').animate({ scrollTop: $('.checkword').offset().top - 95 }, 500);
	    }, 0);
	}

    if (kn.kename != '') {
        var lastviewUrl = '//' + window.location.host + '/' + kn.pename + '/' + kn.kename + '.html';
        localStorage.setItem("lastview_" + kn.pename, lastviewUrl);
    }

    $("#pro-mian").on("click", ".dshowtry", function(e) {

        e.stopPropagation();
        e.preventDefault();

        var pre = $(this).prev();
        var mself = this;

        var code;
        var elcode = pre.find("code");
        var lang = pre.attr("lang");
        if (!lang) {
            lang = elcode.attr("lang");
        }

        var num = elcode.attr("num");

        if (num) {
            let tarcode = $("code[num='" + num + "']").not("[class*='showdemo']");
            code = tarcode.parents("pre").data('code');
            lang = tarcode.attr("lang");
        } else {
            // 过滤掉代码块中高亮的span
            code = elcode.text();

        }

        if(lang == 'python'){
            lang = 'python2';
        }


        code = base64encode(utf16to8(code));
        code = encodeURIComponent(code);

        var url = '/tryrun/runcode?lang=' + lang + '&code=' + code;

        showtry(url + "&stype=nohead");

        


    });

    $(document).on("click", function() {
        $(".docblur").hide();
    });

    $(".onlinenote").show();

    if (location.hash !== "") { // 修复锚点定位失效的问题
        setTimeout(function() {
            location.href = location.hash;
        }, 300);
    }

    if (Gvar.activityflag > 0) { // 开启了活动
        $.ajax({
            url: "/getActivity",
            type: "get",
            dataType: "json",
            success: function(msg) {

                function loadad(content) {
                    var tpl = '<div class="activiey-area">' +
                        '<div class="activiey-bg"></div>' +
                        '<div class="activiey-main">' +
                        '<span class="close-btn"></span> <div style="max-height:500px;max-width:570px;">' + content + '</div></div>' +
                        '</div>';

                    $("body").append(tpl);

                    $(".activiey-main .close-btn").on("click", function() {
                        $(".activiey-area").hide();
                    });

                }

                if (msg.statusCode < 300) {

                    // 写入cookie
                    $.cookie("activity_showed", 1);
                    loadad(msg.data.wincontent);
                    toastr.success(msg.message);
                } else {
                    toastr.warning(msg.message);
                }
            }

        });
    }


    var kename = kn.kename;
    var fid = kn.fid;
    var uid = kn.uid;

    $(document).on('keyup', function(e) {
        var keyCode = e.keyCode;
        var prev, next;
        if (keyCode == 37) { // 上一篇
            prev = $(".navigation-prev");
            if (prev.length > 0 && !prev.is(":hidden")) {
                location.href = prev.attr("href");
            }

        }
        if (keyCode == 39) { // 下一篇
            next = $(".navigation-next");
            if (next.length > 0 && !next.is(":hidden")) {
                location.href = next.attr("href");
            }
        }
    });


    $(".toggle-dropdown").on('click', function(e) {
	    e.stopPropagation();
	    if ($(this).next().is(":hidden")) {
	        $(this).next().show();
	    } else {
	        $(this).next().hide();
	    }
	});

	$('.toggle-dropdown-size').on('click', function(e) {
	    e.stopPropagation();
	    toggleSetMenu('.set-size');
	});

	$('.toggle-dropdown-background').on('click', function(e) {
	    e.stopPropagation();
	    toggleSetMenu('.set-background');
	});

	$(".set-dropdown-menu").on("click", function(e) {
	    e.stopPropagation();
	});



	window._bd_share_config = { "common": { "bdSnsKey": {}, bdPopupOffsetTop: "5" }, "share": {} };
    with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'https://7n.w3cschool.cn/plugins/baidushare/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];


});






// 如果需要给后台返值的话，返回 $(".star_score span.select").size()的值即可。
$(function() {
    //生成5个星星
    var starCheck = ['根本没帮助', '文档较差', '文档一般', '文档不错', '文档很好'];
    for (var i = 0; i < starCheck.length; i++) {
        var _html = '<span title="' + starCheck[i] + '"></span>';
        $(".star_score").append(_html);
    }
    //鼠标滑过，星星背景图片改成选中图片
    $(".star_score span").hover(function() {
        var index = $(this).index();
        for (var i = 0; i <= index; i++) {
            $(".star_score span").eq(i).addClass("active");
        }
        //鼠标移除去掉激活效果
    }, function() {
        $(".star_score span").removeClass("active");
    });
    var tourist = -parseInt(10000000 * Math.random()); //给游客随机id
    //星星点击，这颗星星之前的所有星星加上选中效果
    $(".star_score span").on("click", function() {
        var x = $(this).index();
        $(".star_score span").removeClass('select');
        for (var i = 0; i <= x; i++) {
            $(".star_score span").eq(i).addClass('select');
        };
        evaluate(x + 1);
    });
});

function evaluate(scores) {
    if (scores < 4) {
        $('#evaluatesContent').show();
        $('#submitEvaluate').attr('data-score', scores);
        return false;
    } else {
        $('#evaluatesContent').hide();
        evaluateSubmit(scores);
    }
}

function evaluateSubmit(scores, advise = '') {
    var pid = kn.pid;
    var aid = kn.kmid;
    var uid = 0;

    $.ajax({
        url: "/index/evaluate",
        type: "post",
        data: {
            score: scores,
            pid: pid,
            aid: aid,
            uid: uid,
            title: book.bookname,
            mintitle: kn.ktitle,
            advise: advise
        },
        dataType: "json",
        success: function(msg) {
            if (msg.statusCode == 200) {
                toastr.success(msg.message);
            } else {
                toastr.error(msg.message);
            }
        }
    });
}

function submitEvaluate() {
    var score = $('#submitEvaluate').attr('data-score');
    var advise = '';
    $.each($('.evaluateSelect'), function() {
        if (this.checked) {
            advise = $(this).val() + ',' + advise;
        }
    });
    var otheradvise = $('#otheradvise').val();
    advise = advise + otheradvise;
    evaluateSubmit(score, advise);

}


function openNoteList(obj) {
	var display = $('#notelist_content').css('display');
	if (display == 'none') {
	    $(obj).children('i').addClass('icon-circle-arrow-up');
	    $(obj).children('i').removeClass('icon-circle-arrow-down');
	    $('#notelist_content').show();
	} else {
	    $(obj).children('i').addClass('icon-circle-arrow-down');
	    $(obj).children('i').removeClass('icon-circle-arrow-up');
	    $('#notelist_content').hide();
	}
}

getNotelist();

//笔记
function islikeNote(obj, kmid) {
	toastr.warning('请先登录');
}



$("#pro-mian").on("click", "[showtry]", function(e) {
    e.stopPropagation();
    e.preventDefault();

    var url = $(this).attr('href');
    kn.tryurl = url;

    url += url.includes('?') ? '&stype=nohead' : '?stype=nohead';

    showtry(url);

});

function showtry(url) {
    $("#tryframebox").show();
    $("#tryframe").attr("src", url);
}

function hidetry() {
    if (!$("#tryframebox").is(":hidden")){

        $("html").css("overflow-y", "auto");

        $("#tryframebox").hide();

    }

}


$(document).on("click", function() {
    $(".docblur").hide();
    hidetry();
});


//打开补充内容
function showSupplemen() {
    toastr.warning('请先登录');
}

$('.closeifream').click(function(){
    $(this).parents('#supplementbox').hide();
});