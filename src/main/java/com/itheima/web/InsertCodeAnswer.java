package com.itheima.web;

import com.itheima.pojo.CodeQuestion;
import com.itheima.pojo.QforInsert;
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

@WebServlet("/insertCodeAnswer")
public class InsertCodeAnswer extends HttpServlet {
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
        String timer =request.getParameter("timer") ;
        //����Ŀid��answer�𿪣�����map��
        Map<Integer,String> noANDanswer = new HashMap<>();

        for (String key:map.keySet()){
            if(key.contains("exam")){
                String value = Arrays.toString(map.get(key));
                //����ƥ����������
                String regEx1="[^0-9]";
                Pattern p1 = Pattern.compile(regEx1);
                Matcher m1 = p1.matcher(key);

                int q_no = Integer.parseInt(m1.replaceAll("").trim());
                //��Ҫ������ƥ������� Matcher ����ת��
                if (q_no!=0){
                    noANDanswer.put(q_no, value);
                }

            }
        }

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

        //������������뵽���ݿ���
        int i = 0;
        //1.����questionID
        Date date = new Date();
        SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd :hh:mm:ss");
        String time = dateFormat.format(date);
        int paper_id = service.maxId();
        paper_id += 1;

        for (Integer q_no:noANDanswer.keySet()){
            //�Ѵ��Ᵽ�浽���ݿ���
            QforInsert myQuestion = new QforInsert();
            myQuestion.setqNo(q_no);
            String myAnswer = noANDanswer.get(q_no);
            myQuestion.setMyAnswer(myAnswer);
            myQuestion.setTime(time);
            myQuestion.setUsedTime(String.valueOf(timer));
            myQuestion.setQtype(12);
            myQuestion.setUsername(username);
            myQuestion.setPaper_id(paper_id);
            myQuestion.setTopic(Integer.parseInt(topic));
            service.insertCode(myQuestion);
            i += 1;
            if (i==1){
                service.insertCode1(myQuestion);
            }
        }
        response.setHeader("Access-Control-Allow-Origin", "*");//����������Դ��ͬ
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//������ʵķ�ʽ
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");


    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
