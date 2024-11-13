package com.itheima.web;

import com.alibaba.fastjson.JSON;
import com.itheima.pojo.Tutorial;
import com.itheima.service.TutorialService;
import com.itheima.service.UserService;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/SearchServlet")
public class SearchServlet extends HttpServlet {
    private TutorialService service = new TutorialService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        String keyword = request.getParameter("keyword");
        keyword = new String(keyword.getBytes("iso8859-1"), "utf-8");
        System.out.println(keyword);
        Tutorial searchResult = service.seach(keyword);
        if (searchResult != null){
            int tutorial_id = searchResult.tutorial_id;

            response.sendRedirect("/demo/tutorial/tutorial_index.html?id="+tutorial_id);
        }else {
//            Map<String, String> m=new HashMap<>();
//            m.put("alert","Your keyword isn't in our tutorials,Please change another keyword!");
//            String jsonString = JSON.toJSONString(m);
//            //响应数据
//            response.setContentType("text/json;charset=utf-8");
//            response.getWriter().write(jsonString);
            response.sendRedirect("/demo/tutorial/tutorial_index.html?id=-1");
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
