package com.itheima.web;

import com.alibaba.fastjson.JSON;
import com.itheima.pojo.Completion;
import com.itheima.pojo.Question;
import com.itheima.pojo.TorF;
import com.itheima.service.QuestionService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/questionServlet")
public class QuestionServlet extends HttpServlet {

    private QuestionService service = new QuestionService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        String username = request.getParameter("username");
        Integer topic = Integer.valueOf(request.getParameter("topic"));
        System.out.println(topic);
        List<Object> q = new ArrayList<>();
        if (topic>0){
            //单元测试
            List<Question> questions1 = service.topicTest(topic);
            List<Completion> questions2 = service.topicTestCompletion(topic);
            List<TorF> questions3 = service.selectTorF(topic);
            //System.out.println(questions.toString());
            q.addAll(questions1);
            q.addAll(questions2);
            q.addAll(questions3);
        } else if (topic==-1) {
            List<Question> wrongQ = service.wrongQ(username);
            q.addAll(wrongQ);
        } else if (topic==0){//期末考试
            List<Question> questions1 = service.termEnd4();
            List<Completion> questions2 = service.termEndCompletion();
            List<TorF> questions3 = service.termEndTorF();
            //System.out.println(questions.toString());
            q.addAll(questions1);
            q.addAll(questions2);
            q.addAll(questions3);
        }


        String jsonString = JSON.toJSONString(q);

        System.out.println(jsonString);
        //响应数据
        response.setContentType("text/json;charset=utf-8");
        response.getWriter().write(jsonString);


    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
