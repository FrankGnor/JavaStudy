package com.itheima.web;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@WebServlet("/servletForTest")
public class ServletForTest extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//����������Դ��ͬ
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//������ʵķ�ʽ
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");

        Map<String,String[]> map = request.getParameterMap();

        //�ڿ���̨��ʾ���������
        for (String key:map.keySet()){
            System.out.print(key+":");

            String[] values = map.get(key);
            for (String value:values){
                System.out.print(value+" ");
            }
            System.out.println();
        }
//        //���⻨��ʱ��
//        Integer timer =Integer.parseInt(request.getParameter("timer")) ;
//        //����Ŀid��answer�𿪣�����map��
//        Map<Integer,String> noANDanswer = new HashMap<>();
//
//        for (String key:map.keySet()){
//            if(key.contains("exam")){
//                String value = Arrays.toString(map.get(key));
//
//                //����ƥ����������
//                String regEx1="[^0-9]";
//                Pattern p1 = Pattern.compile(regEx1);
//                Matcher m1 = p1.matcher(value);
//
//                //����ƥ������Ĵ�
//                String regEx2="[^A-Z]";
//                Pattern p2 = Pattern.compile(regEx2);
//                Matcher m2 = p2.matcher(value);
//
//
//                //��Ҫ������ƥ������� Matcher ����ת��
//                if (Integer.parseInt(m1.replaceAll("").trim())!=0){
//                    noANDanswer.put(Integer.parseInt(m1.replaceAll("").trim()), m2.replaceAll("").trim());
//                }
//
//            }
//        }
//
//        //������е���Ŀid
//        List<Integer> id = new ArrayList<>();
//        for (String key:map.keySet()){
//            if(key.contains("type")){
//                //����ƥ����������
//                String regEx1="[^0-9]";
//                Pattern p1 = Pattern.compile(regEx1);
//                Matcher m1 = p1.matcher(key);
//                id.add(Integer.parseInt(m1.replaceAll("").trim()));
//            }
//        }
//        //���û�д𰸵���Ŀid,�������ӵ�noANDanswer��
//        for (Integer integer : id) {
//            boolean flag = true;
//            for (Integer q_no : noANDanswer.keySet()) {
//                if (Objects.equals(q_no, integer)) {
//                    flag = false;   //��id�Ѵ���noANDanswer��
//                    break;
//                }
//            }
//            if(flag){
//                noANDanswer.put(integer,"");
//            }
//        }
//
//
//        String username = request.getParameter("username");
//        //����������ÿһ����
//        List<Question> myQuestions = new ArrayList<Question>();
//        //�����ݿ���ȷ�𰸽��жԱȣ�����ÿ����Ŀ�� error un right����Ŀid+��ȷ��+��Ĵ�+������+֪ʶ��+����
//        int i = 0;
//        for (Integer q_no:noANDanswer.keySet()){
//            myQuestions.add(service.testAnswer(q_no));
//            String myAnswer = noANDanswer.get(q_no);
//            myQuestions.get(i).setMyAnswer(myAnswer);
//            //�ж�����������¼��
//            if (myQuestions.get(i).getAnswer().equalsIgnoreCase(myAnswer)){
//                myQuestions.get(i).setMyStatus("right");
//                //�Ѵ��Ᵽ�浽���ݿ���
//                //1.����questionID
//                String time = username+myQuestions.get(i).getqNo();
//                myQuestions.get(i).setTime(time);
//                myQuestions.get(i).setUsername(username);
//                service.insertError(myQuestions.get(i));
//            } else if ("".equalsIgnoreCase(myAnswer)) {
//                myQuestions.get(i).setMyStatus("un");
//                //�Ѵ��Ᵽ�浽���ݿ���
//                //1.����questionID
//                String time = username+myQuestions.get(i).getqNo();
//                myQuestions.get(i).setTime(time);
//                myQuestions.get(i).setUsername(username);
//                service.insertError(myQuestions.get(i));
//            }else {
//                myQuestions.get(i).setMyStatus("error");
//
//                //�Ѵ��Ᵽ�浽���ݿ���
//                //1.����questionID
//                String time = username+myQuestions.get(i).getqNo();
//                myQuestions.get(i).setTime(time);
//                myQuestions.get(i).setUsername(username);
//                service.insertError(myQuestions.get(i));
//            }
//            i += 1;
//
//
//
//        }
//        String jsonString = JSON.toJSONString(myQuestions);
//        //��Ӧ����
//        response.setContentType("text/json;charset=utf-8");
//        response.getWriter().write(jsonString);

    }






    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
