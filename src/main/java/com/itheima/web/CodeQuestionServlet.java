package com.itheima.web;

import com.alibaba.fastjson.JSON;
import com.itheima.pojo.CodeQuestion;
import com.itheima.service.QuestionService;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/codeQuestionServlet")
public class CodeQuestionServlet extends HttpServlet {
    private QuestionService service = new QuestionService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Integer topic = Integer.valueOf(request.getParameter("topic"));

        List<CodeQuestion> questions = service.selectCodeQuestion(topic);
        //System.out.println(questions.toString());
        String jsonString = JSON.toJSONString(questions);
        //System.out.println(jsonString);
        //响应数据
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.setContentType("text/json;charset=utf-8");
        response.getWriter().write(jsonString);
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
