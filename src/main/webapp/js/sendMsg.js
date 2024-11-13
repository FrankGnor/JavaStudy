$(function(){
    //·¢ËÍÑéÖ¤Âë
    $(".sendVerifyCode").on("click", function(){
        var mobile = $("input[name=mobile]").val();
        console.log(mobile)
        $.ajax({
            url: "/demo/sentMsg",
            async : true,
            type: "post",
            dataType: "json",
            data: {"mobile":mobile},
            success: function (data) {
                console.log("send msg successfully!")
                alert("send msg successfully!")
            }
        });
    })
});