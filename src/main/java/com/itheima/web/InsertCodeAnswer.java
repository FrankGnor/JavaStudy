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

//        //在控制台显示传入的数据
//        for (String key:map.keySet()){
//            System.out.print(key+":");
//
//            String[] values = map.get(key);
//            for (String value:values){
//                System.out.print(value+" ");
//            }
//            System.out.println();
//        }

        //做题花的时间
        String timer =request.getParameter("timer") ;
        //把题目id和answer拆开，放入map中
        Map<Integer,String> noANDanswer = new HashMap<>();

        for (String key:map.keySet()){
            if(key.contains("exam")){
                String value = Arrays.toString(map.get(key));
                //正则匹配里面的题号
                String regEx1="[^0-9]";
                Pattern p1 = Pattern.compile(regEx1);
                Matcher m1 = p1.matcher(key);

                int q_no = Integer.parseInt(m1.replaceAll("").trim());
                //需要对正则匹配出来的 Matcher 进行转换
                if (q_no!=0){
                    noANDanswer.put(q_no, value);
                }

            }
        }

        //获得所有的题目id
        List<Integer> id = new ArrayList<>();
        for (String key:map.keySet()){
            if(key.contains("type")){
                //正则匹配里面的题号
                String regEx1="[^0-9]";
                Pattern p1 = Pattern.compile(regEx1);
                Matcher m1 = p1.matcher(key);
                id.add(Integer.parseInt(m1.replaceAll("").trim()));
            }
        }
        //获得没有答案的题目id,并把他加到noANDanswer中
        for (Integer integer : id) {
            boolean flag = true;
            for (Integer q_no : noANDanswer.keySet()) {
                if (Objects.equals(q_no, integer)) {
                    flag = false;   //该id已存在noANDanswer中
                    break;
                }
            }
            if(flag){
                noANDanswer.put(integer,"");
            }
        }


        String username = request.getParameter("username");
        String topic = request.getParameter("topic");

        //把做题情况输入到数据库中
        int i = 0;
        //1.设置questionID
        Date date = new Date();
        SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd :hh:mm:ss");
        String time = dateFormat.format(date);
        int paper_id = service.maxId();
        paper_id += 1;

        for (Integer q_no:noANDanswer.keySet()){
            //把错题保存到数据库中
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
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");


    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
