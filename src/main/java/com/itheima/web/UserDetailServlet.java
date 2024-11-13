package com.itheima.web;

import com.alibaba.fastjson.JSON;
import com.itheima.mapper.UserMapper;
import com.itheima.pojo.User;
import com.itheima.service.QuestionService;
import com.itheima.service.UserService;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet("/UserDetailServlet")
public class UserDetailServlet extends HttpServlet {
    private UserService service = new UserService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        String username = request.getParameter("username");
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date register_time = service.date(username);
        int days = (int) ((date.getTime() - register_time.getTime()) / (1000 * 3600 * 24));
        int num = service.num(username);
        int newscore = service.newscore(username);
        double avgscore = service.avgscore(username);
        DecimalFormat df = new DecimalFormat(".00");
        User user = new User();
        user.setLearnDays(days);
        user.setTestnum(num);
        user.setNewscore(newscore);
        user.setAvgscore(df.format(avgscore));
        String jsonString = JSON.toJSONString(user);
        response.setContentType("text/json;charset=utf-8");
        response.getWriter().write(jsonString);



    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
