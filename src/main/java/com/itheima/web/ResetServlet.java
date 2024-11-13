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
        response.setHeader("Access-Control-Allow-Origin", "*");//����������Դ��ͬ
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//������ʵķ�ʽ
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        //1. ��ȡ�û�������������
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        //�ֻ���֤����ֻ���
        String verifyCode = request.getParameter("verifyCode");
        String phone = request.getParameter("mobile");
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setPhone(phone);


        // ��ȡ�û��������֤��
        String checkCode = request.getParameter("checkCode");

        // �������ɵ���֤�룬��Session��ȡ
        HttpSession session = request.getSession();
        String checkCodeGen = (String) session.getAttribute("checkCodeGen");

        // �ȶ�
        if(!checkCodeGen.equalsIgnoreCase(checkCode)){

            request.setAttribute("register_msg","CheckCode eroor!");
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);

            // ������ע��
            return;
        }


        // �ֻ����͵���֤�룬��Session��ȡ
        String verifyCodeGen = (String) session.getAttribute("verifyCode");
        long createTime = (long) session.getAttribute("createTime");
        //�ȶ�
        if(!verifyCodeGen.equalsIgnoreCase(verifyCode)){
            String alert ="Phone's verifyCode is wrong";
            request.setAttribute("register_msg",alert);
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
            // ������ע��
            return;
        }
        //����5���Ӻ󣬶�����֤��ʧЧ
        long nowTime = System.currentTimeMillis();
        long timeDifference = (nowTime-createTime)/1000;
        if (timeDifference>=300){
            String alert ="Phone's verifyCode has been expired!";
            request.setAttribute("register_msg",alert);
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
            // ������ע��
            return;
        }




        //2. ����service ���û��Ƿ���ڣ����ڼ�������  trueΪ�û�������
        boolean flag = service.userexist(user);
        //3. �ж�ע��ɹ����
        if(!flag){

            //����ֻ����Ƿ�һ��
            User user1 = service.select(user.getUsername());
            if(!Objects.equals(user1.getPhone(), phone)){
                request.setAttribute("register_msg","Your phone number mismatches!");
                request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
            }

            service.reset(user);
            //ע��ɹ�����ת��½ҳ��
            request.setAttribute("register_msg","Reset successfull,please Login!");
            request.getRequestDispatcher("/demo/login.jsp").forward(request,response);
        }else {
            //�˺��Ѵ��ڣ�����ʧ�ܣ���ת������ҳ��

            request.setAttribute("register_msg","This username doesn't exist");
            request.getRequestDispatcher("/demo/reset.jsp").forward(request,response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
