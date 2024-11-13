//1.��ҳ�������ɺ󣬷���ajax����
window.onload = function () {
    //1.��������content
    //���tutorial_id
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;}
    let tutorial_id = getQueryString('id');
    if (tutorial_id !== null && parseInt(tutorial_id)!==-1){
        axios({
            method: "post",
            url: "/demo/tutorialServlet",
            params:{tutorial_id:tutorial_id},
        }).then(function (resp) {

            let tutorial = resp.data;
            let content = "";
            document.getElementById("content-bg").innerHTML = tutorial.content;
            $("#content-top").text(tutorial.point);
            $(".navigation-next").attr("href","tutorial_index.html?id="+(parseInt(tutorial_id)+1))


        })
    }else if (parseInt(tutorial_id)===-1){
        alert("Your keyword isn't in our tutorials,Please change another keyword!")
    }


    //2.���²����
    axios({
        method: "post",
        url: "/demo/CataServlet",
    }).then(function (resp) {
        let catas = resp.data;
        let sonData = "";
        let parentData = "";
        let flag1 = false; //���parentData�Ƿ񱻸�ֵ
        let flag= false;  //����innerHTML�Ƿ��Ѿ�����ȥ��
        let parent = [];//���游�ڵ��id
        for (let i = 0; i < catas.length; i++) {
            let cata = catas[i];
            if (parseInt(cata.level)===1){
                parent.push(cata.tutorial_id);
                parentData +=
                    '<li class="dd-item" data-id="'+cata.tutorial_id+'" >\n'+
                    '  <div class="dd-content folder-open  active ">\n'+
                    '    <i class="folder icon-folder-open"></i>\n'+
                    '    <a title="Java �̳�">'+cata.point+'</a>\n'+
                    '  </div>\n'+
                    '  <ol class="dd-list" id="parent'+cata.tutorial_id+'">\n'+
                    '  </ol>\n'+
                    '</li>'
                flag1 = true;
            }
        }
        if (flag1===true){
            document.getElementById("catalogue").innerHTML = parentData;
            flag = true;
        }
        if (flag){
                for (let j = 0; j < parent.length; j++){
                    let flag2 = false;//���sonData�Ƿ񱻸�ֵ
                    for (let i = 0; i < catas.length; i++) {
                        let cata = catas[i];
                    if (parseInt(cata.level)===2){
                        if (cata.parent_id===parent[j]){
                            sonData += '  <li class="dd-item" data-id="'+cata.tutorial_id+'">\n'+
                                '    <div class="dd-content">\n'+
                                '      <i class="ic-folder-open2"></i>\n'+
                                '      <a href="tutorial_index.html?id='+cata.tutorial_id+'" title="'+cata.point+'">'+cata.point+'</a>\n'+
                                '    </div>\n'+
                                '  </li>'
                            flag2 = true;
                        }
                    }
                }
                    if (flag2){
                        document.getElementById("parent"+parent[j] ).innerHTML = sonData;
                        sonData="";
                    }
            }
        }

    });



}



