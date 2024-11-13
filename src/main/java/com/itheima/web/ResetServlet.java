package com.itheima.web;

import com.alibaba.fastjson.JSONObject;
import com.itheima.pojo.User;
import com.itheima.service.UserService;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@WebServlet("/ResetServlet")
public class ResetServlet extends HttpServlet {
    private UserService service = new UserService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        //1. 获取用户名和密码数据
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        //手机验证码和手机号
        String verifyCode = request.getParameter("verifyCode");
        String phone = request.getParameter("mobile");
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setPhone(phone);


        // 获取用户输入的验证码
        String checkCode = request.getParameter("checkCode");

        // 程序生成的验证码，从Session获取
        HttpSession session = request.getSession();
        String checkCodeGen = (String) session.getAttribute("checkCodeGen");

        // 比对
        if(!checkCodeGen.equalsIgnoreCase(checkCode)){

            request.setAttribute("register_msg","CheckCode eroor!");
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);

            // 不允许注册
            return;
        }


        // 手机发送的验证码，从Session获取
        String verifyCodeGen = (String) session.getAttribute("verifyCode");
        long createTime = (long) session.getAttribute("createTime");
        //比对
        if(!verifyCodeGen.equalsIgnoreCase(verifyCode)){
            String alert ="Phone's verifyCode is wrong";
            request.setAttribute("register_msg",alert);
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
            // 不允许注册
            return;
        }
        //超过5分钟后，短信验证码失效
        long nowTime = System.currentTimeMillis();
        long timeDifference = (nowTime-createTime)/1000;
        if (timeDifference>=300){
            String alert ="Phone's verifyCode has been expired!";
            request.setAttribute("register_msg",alert);
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
            // 不允许注册
            return;
        }




        //2. 调用service 该用户是否存在，存在即改密码  true为用户不存在
        boolean flag = service.userexist(user);
        //3. 判断注册成功与否
        if(!flag){

            //检查手机号是否一致
            User user1 = service.select(user.getUsername());
            if(!Objects.equals(user1.getPhone(), phone)){
                request.setAttribute("register_msg","Your phone number mismatches!");
                request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
            }

            service.reset(user);
            //注册成功，跳转登陆页面
            request.setAttribute("register_msg","Reset successfull,please Login!");
            request.getRequestDispatcher("/demo/login.jsp").forward(request,response);
        }else {
            //账号已存在，重置失败，跳转到重置页面

            request.setAttribute("register_msg","This username doesn't exist");
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
