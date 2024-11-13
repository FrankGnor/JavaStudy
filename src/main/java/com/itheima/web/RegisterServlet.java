package com.itheima.web;

import com.alibaba.fastjson.JSONObject;
import com.itheima.pojo.User;
import com.itheima.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

@WebServlet("/registerServlet")
public class RegisterServlet extends HttpServlet {
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
        //手机验证码
        String verifyCode = request.getParameter("verifyCode");
        String phone = request.getParameter("mobile");
        Date date = new Date();
        SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd");
        String time = dateFormat.format(date);
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setPhone(phone);
        user.setRegister_time(time);

        // 获取用户输入的验证码
        String checkCode = request.getParameter("checkCode");

        // 程序生成的验证码，从Session获取
        HttpSession session = request.getSession();
        String checkCodeGen = (String) session.getAttribute("checkCodeGen");

        // 图形验证码比对
        if(!checkCodeGen.equalsIgnoreCase(checkCode)){

            request.setAttribute("register_msg","CheckCode eroor!");
            request.getRequestDispatcher("/demo/register.jsp").forward(request,response);

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
            request.getRequestDispatcher("/demo/register.jsp").forward(request,response);
            // 不允许注册
            return;
        }
        //超过5分钟后，短信验证码失效
        long nowTime = System.currentTimeMillis();
        long timeDifference = (nowTime-createTime)/1000;
        if (timeDifference>=300){
            String alert ="Phone's verifyCode has been expired!";
            request.setAttribute("register_msg",alert);
            request.getRequestDispatcher("/demo/register.jsp").forward(request,response);
            // 不允许注册
            return;
        }




        //2. 调用service 查看用户是否存在  true为用户不存在
        boolean flag = service.userexist(user);
        //3. 判断用户是否存在
        if(flag){
            //判断手机号码是否与留存的手机号码一致


            service.register(user);
            //注册功能，跳转登陆页面
            request.setAttribute("register_msg","Register successfully,please Login!");
            request.getRequestDispatcher("/demo/login.jsp").forward(request,response);
        }else {
            //注册失败，跳转到注册页面

            request.setAttribute("register_msg","This username has exist");
            request.getRequestDispatcher("/demo/login.jsp").forward(request,response);
        }


    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}