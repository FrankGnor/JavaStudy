//四项选择题
//1.当页面加载完成后，发生ajax请求
window.onload = function () {
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
    localStorage.setItem("topic",topic);


    axios({
        method: "post",
        url: "/demo/questionServlet",
        params:{topic:topic,username:username},
    }).then(function (resp) {
        console.log(resp.data)
        let questions = resp.data;
        let questionsData = "";
        let listData = "";
        let flag = false; //监控questionsData和questionsList是否被赋值
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i];
            if (question.qtype == 1)
            {
                questionsData +='                        <div class="play-item" data-qid="'+question.qNo+'" data-qtype="1" style="display:none;">\n'+
                '                            <div class="play-title">\n'+
                '                                <div class="exam-title"><div style="display: inline-block;vertical-align: top; float:left;">'+(i+1)+'.</div><div style="display: inline-block;max-width:870px;margin-left: 5px;">'+question.qTitle+'</div></div>\n'+
                '                            </div>\n'+
                '                            <div class="play-exam-content">\n'+
                '                                <!--题目描述显示区域-->\n'+
                '                                <div class="content-intro">\n'+
                '                                    <p><br></p>\n'+
                '                                </div>\n'+
                '                                <div class="answer-area">\n'+
                '                                    <!--单选-->\n'+
                '                                    <div class="exam-option exam-choose">\n'+
                '                                        <div class="radio">\n'+
                '                                            <span class="icons"></span>\n'+
                '                                            <input type="radio" name="'+question.qNo+'" class="exam-radio" value="A">\n'+
                '                                            <span class="exam-option-content">\n'+
                '                                                <div style="display: inline-block;vertical-align: top;">A.</div>\n'+
                '                                                <div style="display: inline-block;max-width:830px;margin-left: 5px;">'+question.choice1+'</div>\n'+
                '                                            </span>\n'+
                '                                        </div>\n'+
                '                                    </div>\n'+
                '                                    <div class="exam-option exam-choose">\n'+
                '                                        <div class="radio">\n'+
                '                                            <span class="icons"></span>\n'+
                '                                            <input type="radio" name="'+question.qNo+'" class="exam-radio" value="B">\n'+
                '                                            <span class="exam-option-content">\n'+
                '                                                <div style="display: inline-block;vertical-align: top;">B.</div>\n'+
                '                                                <div style="display: inline-block;max-width:830px;margin-left: 5px;">'+question.choice2+'</div>\n'+
                '                                            </span>\n'+
                '                                        </div>\n'+
                '                                    </div>\n'+
                '                                    <div class="exam-option exam-choose">\n'+
                '                                        <div class="radio">\n'+
                '                                            <span class="icons"></span>\n'+
                '                                            <input type="radio" name="'+question.qNo+'" class="exam-radio" value="C">\n'+
                '                                            <span class="exam-option-content">\n'+
                '                                                <div style="display: inline-block;vertical-align: top;">C.</div>\n'+
                '                                                <div style="display: inline-block;max-width:830px;margin-left: 5px;">'+question.choice3+'</div>\n'+
                '                                            </span>\n'+
                '                                        </div>\n'+
                '                                    </div>\n'+
                '                                    <div class="exam-option exam-choose">\n'+
                '                                        <div class="radio">\n'+
                '                                            <span class="icons"></span>\n'+
                '                                            <input type="radio" name="'+question.qNo+'" class="exam-radio" value="D">\n'+
                '                                            <span class="exam-option-content">\n'+
                '                                                <div style="display: inline-block;vertical-align: top;">D.</div>\n'+
                '                                                <div style="display: inline-block;max-width:830px;margin-left: 5px;">'+question.choice4+'</div>\n'+
                '                                            </span>\n'+
                '                                        </div>\n'+
                '                                    </div>\n'+
                '                                </div>\n'+
                '                            </div>\n'+
                '                        </div>';
                flag = true;
            }else if (question.qtype == 3)
            {
                questionsData +='<div class="play-item" data-qid="'+question.qNo+'" data-qtype="3" style="display: none;">\n'+
                    '    <div class="play-title">\n'+
                    '        <div class="exam-title"><div style="display: inline-block;vertical-align: top; float:left;">'+(i+1)+'.</div><div style="display: inline-block;max-width:870px;margin-left: 5px;">判断题</div></div>\n'+
                    '    </div>\n'+
                    '    <div class="play-exam-content">\n'+
                    '        <!--题目描述显示区域-->\n'+
                    '        <div class="content-intro">\n'+
                    '            <blockquote><p>&nbsp;'+question.qTitle+'</p></blockquote><p><br></p></div>\n'+
                    '        <div class="answer-area">\n'+
                    '            <!--判断-->\n'+
                    '            <div class="exam-option exam-choose">\n'+
                    '                <label class="radio">\n'+
                    '                    <span class="icons"></span>\n'+
                    '                    <input type="radio" name="'+question.qNo+'" class="exam-radio" value="T">\n'+
                    '                    <span class="exam-option-content">A.正确</span>\n'+
                    '                </label>\n'+
                    '            </div>\n'+
                    '            <div class="exam-option exam-choose">\n'+
                    '                <label class="radio">\n'+
                    '                    <span class="icons"></span>\n'+
                    '                    <input type="radio" name="'+question.qNo+'" class="exam-radio" value="F">\n'+
                    '                    <span class="exam-option-content">B.错误</span>\n'+
                    '                </label>\n'+
                    '            </div>\n'+
                    '        </div>\n'+
                    '    </div>\n'+
                    '    <!--题目显示区域结束-->\n'+
                    '</div>\n';
                flag = true;
            }else if (question.qtype == 5)
            {
                let ansline = '';
                for (let j=0;j<parseInt(question.choice1);j++){
                    ansline += '<p>第'+(j+1)+'处填写：<input type="text" class="fill-box input-box" style="width: 300px;"></p>\n';
                }
                questionsData += '<div class="play-item" data-qid="'+question.qNo+'" data-qtype="5" style="display: none;">\n'+
                '    <div class="play-title">\n'+
                '        <div class="exam-title">\n'+
                '            <div style="display: inline-block;vertical-align: top; float:left;">'+(i+1)+'.程序填空题 (请遵守编译器对空格的规范，否则系统将自动识别为错误)</div>\n'+
                '        </div>\n'+
                '    </div>\n'+
                '    <div class="play-exam-content">\n'+
                '        <!--题目描述显示区域-->\n'+
                '        <div class="content-intro">\n'+
                '            <p style="text-align:center"><img src="'+question.qTitle+'" alt="t'+(i+1)+'"></p>\n'+ ansline+
                '            <p><br></p>\n'+
                '        </div>\n'+
                '        <div class="answer-area">\n'+
                '        </div>\n'+
                '    </div>\n'+
                '    <!--题目显示区域结束-->\n'+
                '</div>\n';
                flag = true;
            }

            listData +='<li data-qid="'+question.qNo+'" data-qtype="'+question.qtype+'"><div class="exam-card-sheet un"><a href="javascript:;" id="a'+question.qNo+'">'+(i+1)+'</a></div></li>';
        }
        let flag1= false;  //监视innerHTML是否已经加上去了
        if (flag===true){
            document.getElementById("exam-card-list").innerHTML = listData;
            document.getElementById("exam-area").innerHTML = questionsData;
            flag1 = true;
        }
        $("#exam-id").attr("data-pid",questions[0].topic );
        if (parseInt(topic)===0){
            $(".section-title").text("期末测试");
        }else if (parseInt(topic)===-1){
            $(".section-title").text("我的错题集");
        }else{
            $(".section-title").text("第"+questions[0].topic+"章测试");
        }
        if (flag1 === true){
            loadset();
        }

    })


}



