package com.itheima.web;

import com.alibaba.fastjson.JSON;
import com.itheima.pojo.QforInsert;
import com.itheima.pojo.Question;
import com.itheima.service.QuestionService;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/checkExam")
public class CheckExam extends HttpServlet {
    private QuestionService service = new QuestionService();
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Map<String,String[]> map = request.getParameterMap();

//        //�ڿ���̨��ʾ���������
//        for (String key:map.keySet()){
//            System.out.print(key+":");
//
//            String[] values = map.get(key);
//            for (String value:values){
//                System.out.print(value+" ");
//            }
//            System.out.println();
//        }

        //���⻨��ʱ��
        Integer timer =Integer.parseInt(request.getParameter("timer")) ;
        //����Ŀid��answer�𿪣�����map��
        Map<Integer,String> noANDanswer = new HashMap<>();

        for (String key:map.keySet()){
            if(key.contains("exam")){
                String value = map.get(key)[0];

                //����ƥ����������
                String regEx1="[^0-9]";
                Pattern p1 = Pattern.compile(regEx1);
                Matcher m1 = p1.matcher(key);


                //��Ҫ������ƥ������� Matcher ����ת��
                //���𰸼�ֵ�����ֵΪ0ʱ��������δ���
                if (!"0".equals(value)){
                    noANDanswer.put(Integer.parseInt(m1.replaceAll("").trim()), value);
                }

            }
            }
        System.out.println(noANDanswer);


        //������е���Ŀid
        List<Integer> id = new ArrayList<>();
        for (String key:map.keySet()){
            if(key.contains("type")){
                //����ƥ����������
                String regEx1="[^0-9]";
                Pattern p1 = Pattern.compile(regEx1);
                Matcher m1 = p1.matcher(key);
                id.add(Integer.parseInt(m1.replaceAll("").trim()));
            }
        }
        //���û�д𰸵���Ŀid,�������ӵ�noANDanswer��
        for (Integer integer : id) {
            boolean flag = true;
            for (Integer q_no : noANDanswer.keySet()) {
                if (Objects.equals(q_no, integer)) {
                    flag = false;   //��id�Ѵ���noANDanswer��
                    break;
                }
            }
            if(flag){
                noANDanswer.put(integer,"");
            }
        }


        String username = request.getParameter("username");
        String topic = request.getParameter("topic");
        //����������ÿһ����
        List<QforInsert> myQuestions = new ArrayList<QforInsert>();
        //�����ݿ���ȷ�𰸽��жԱȣ�����ÿ����Ŀ�� error un right����Ŀid+��ȷ��+��Ĵ�+������+֪ʶ��+����
        int i = 0;//����
        int j = 0;//��ȷ������
        double rightPercent = 0;
        int paper_id = service.maxId();
        paper_id += 1;
        Date date = new Date();
        SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd :hh:mm:ss");
        for (Integer q_no:noANDanswer.keySet()){
            myQuestions.add(service.testAnswer(q_no));
            String myAnswer = noANDanswer.get(q_no);
            myQuestions.get(i).setMyAnswer(myAnswer);
            String time = dateFormat.format(date);
            myQuestions.get(i).setTime(time);
            myQuestions.get(i).setPaper_id(paper_id);
            myQuestions.get(i).setUsername(username);
            myQuestions.get(i).setUsedTime(String.valueOf(timer));
            myQuestions.get(i).setTopic(Integer.parseInt(topic));
            //�ж�����������¼��
            if (myQuestions.get(i).getAnswer().equalsIgnoreCase(myAnswer)){
                myQuestions.get(i).setMyStatus("right");
                //�Ѵ��Ᵽ�浽���ݿ���
                service.insertError(myQuestions.get(i));
                j+=1;
            } else if ("".equalsIgnoreCase(myAnswer)) {
                myQuestions.get(i).setMyStatus("un");
                //�Ѵ��Ᵽ�浽���ݿ���
                service.insertError(myQuestions.get(i));
            }else {
                myQuestions.get(i).setMyStatus("error");
                //�Ѵ��Ᵽ�浽���ݿ���
                service.insertError(myQuestions.get(i));
            }
            i += 1;
        }
        rightPercent = (float)(j)/i;
        rightPercent = (rightPercent*100);
        myQuestions.get(0).setRight_rate((int) rightPercent);
        System.out.println(rightPercent);
        service.insertError1(myQuestions.get(0));

        String jsonString = JSON.toJSONString(myQuestions);
        //��Ӧ����
        response.setHeader("Access-Control-Allow-Origin", "*");//����������Դ��ͬ
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//������ʵķ�ʽ
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
