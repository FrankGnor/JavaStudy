package com.itheima.web;

import com.alibaba.fastjson.JSON;
import com.itheima.pojo.Question;
import com.itheima.pojo.Tutorial;
import com.itheima.service.QuestionService;
import com.itheima.service.TutorialService;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/tutorialServlet")
public class TutorialServlet extends HttpServlet {
    private TutorialService service = new TutorialService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//����������Դ��ͬ
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//������ʵķ�ʽ
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        int tutorial_id = Integer.parseInt(request.getParameter("tutorial_id"));

        //1. ����TutorialService��ɲ�ѯ
        Tutorial tutorial = service.selectTutorial(tutorial_id);

        String jsonString = JSON.toJSONString(tutorial);

//        System.out.println(jsonString);
        //��Ӧ����
        response.setContentType("text/json;charset=utf-8");
        response.getWriter().write(jsonString);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
