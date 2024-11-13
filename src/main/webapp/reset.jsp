<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>重设密码</title>
    <link href="css/register.css" rel="stylesheet">
    <link href="imgs/favicon.ico" rel="shortcut icon">
    <script src="js/jquery-1.8.3.min.js"></script>
    <script src="js/sendMsg.js"></script>

</head>
<body>

<div class="form-div" style="height: 625px;">
    <div class="reg-content">
        <h1>重设密码</h1>
        <span>记得密码？</span> <a href="login.jsp">登录</a>
    </div>
    <form id="reg-form" action="/demo/ResetServlet" method="post">

        <table>

            <tr>
                <td>用户名</td>
                <td class="inputs">
                    <input name="username" type="text" id="username" style="margin-top: 20px;">
                    <br>
                    <span id="username_err" class="err_msg" >${register_msg}</span>
                </td>

            </tr>

            <tr>
                <td>新密码</td>
                <td class="inputs">
                    <input name="password" type="password" id="password" style="margin-top: 20px;">
                    <br>
                    <span id="password_err" class="err_msg" style="display: none">密码格式有误</span>
                </td>
            </tr>


            <tr>
                <td>验证码</td>
                <td class="inputs">
                    <input name="checkCode" type="text" id="checkCode" style="margin-top: 20px;" >
                    <img id="checkCodeImg" src="http://localhost：8080/demo/checkCodeServlet">
                    <a href="#" id="changeImg" >看不清？</a>
                </td>
            </tr>
            <tr>
                <td>手机号码</td>
                <td class="inputs">
                    <input name="mobile" type="text" id="mobile" style="padding-top: 10px;margin-top: 20px;">

                </td>
            </tr>
            <tr>
                <td>手机验证码</td>
                <td class="inputs">
                    <input name="verifyCode" type="text" id="verifyCode" style="width: 170px;padding-top: 10px;margin-top: 20px;">
                    <button type="button" class="sendVerifyCode">获取短信验证码</button>
                </td>
            </tr>

        </table>

        <div class="buttons">
            <input value="修改密码" type="submit" id="reg_btn">
<%--             style="margin-right: 70px;margin-top: 60px;"--%>
        </div>
        <br class="clear">
    </form>

</div>


</body>
<script>
    document.getElementById("changeImg").onclick = function () {
        document.getElementById("checkCodeImg").src = "/demo/checkCodeServlet?"+new Date().getMilliseconds();
    }
    document.getElementById("checkCodeImg").onclick = function () {
        document.getElementById("checkCodeImg").src = "/demo/checkCodeServlet?"+new Date().getMilliseconds();
    }


</script>
</html>