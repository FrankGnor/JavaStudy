//四项选择题
//1.当页面加载完成后，发生ajax请求
$(document).ready(function () {
    //登陆后显示用户名
    let username = localStorage.getItem('username');
    if (username!=null){

        $("#right .login").text("欢迎您:"+username);
        $("#right .register #2").text("退出") ;
        $("#right .register #2").attr("href","login.jsp");
    }else {
        $("#bg").attr("display")
    }

    //获得topic
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;}
    let topic = getQueryString('topic');
    localStorage.setItem('topic',topic);


    axios({
        method: "post",
        url: "/demo/codeQuestionServlet",
        params:{topic:topic},
    }).then(function (resp) {
        let questions = resp.data;
        let questionsData = "";
        let listData = "";
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            questionsData +='<div class="play-item" data-qid="'+question.qNo+'" data-qtype="12" style="display:none;">\n'+
                '    <div class="play-exam-content">\n'+
                '        <!--题目描述显示区域-->\n'+
                '        <div class="content-intro">\n'+
                '            <div style="display: inline-block;vertical-align: top;">'+(i+1)+'.</div>\n'+
                '            <div style="display: inline-block;max-width:870px;margin-left: 5px;">\n'+
                '                <p> '+question.qTitle+'</p>\n'+
                '            </div>\n'+
                '        </div>\n'+
                '        <div class="answer-area">\n'+
                '            <div class="form-group" id="editorarea'+question.qNo+'" style="min-height:200px;">\n'+
                '                <textarea id="elmaaa'+question.qNo+'" class="form-control" name="elm'+question.qNo+'" rows="10" cols="80"\n'+
                '                    style="width:900px;"></textarea>\n'+
                '            </div>\n'+
                '        </div>\n'+
                '    </div>\n'+
                '    <!--题目显示区域结束-->\n'+
                '</div>\n';

            listData +='    <li data-qid="'+question.qNo+'" data-qtype="1"><div class="exam-card-sheet un"><a href="javascript:;" id="a'+question.qNo+'">'+(i+1)+'</a></div></li>';
        }

        document.getElementById("exam-card-list").innerHTML = listData;
        document.getElementById("exam-area").innerHTML = questionsData;
        $("#exam-id").attr("data-pid",questions[0].topic );
        if (questions[0].topic===0){
            $(".section-title").text("期末测试");
        }else {
            $(".section-title").text("第"+questions[0].topic+"章编程测试");
        }


    })
    setTimeout(loadset,1000);
    setTimeout(afterload,1000);
    function afterload() {
        if (typeof (Storage) === "undefined") {
            toastr.info("抱歉！您的浏览器不支持 Web Storage ...请确认您已经登录再进行答题,以免答题结果丢失", '', {"positionClass": "toast-top-center"});
        }
        if (localStorage.getItem("pid") != null) {
            setAnswer();
        }
        $("[id^='elmaaa']").on('change', function () {
            var qid = $(this).attr('id');
            qid = qid.replace('elmaaa', '');
            var mdcontent = $(this).val();
            myAnswer[qid] = mdcontent;
            console.log('dsfdsfdfsdfs');
            if ($.trim(mdcontent) != '') { // 如果内容不为空, 答题卡做标记
                $(".exam-card-list li[data-qid='" + qid + "'] .exam-card-sheet").removeClass("un");
                $(".exam-card-list li[data-qid='" + qid + "'] .exam-card-sheet").addClass("ed");
            }
        });
        //textarea支持tab缩进
        $("textarea").on(
            'keydown',
            function (e) {
                if (e.keyCode == 9) {
                    e.preventDefault();
                    var indent = '    ';
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    var selected = window.getSelection().toString();
                    selected = indent + selected.replace(/\n/g, '\n' + indent);
                    this.value = this.value.substring(0, start) + selected
                        + this.value.substring(end);
                    this.setSelectionRange(start + indent.length, start
                        + selected.length);
                }
            })
        setTimer();
    }

})



