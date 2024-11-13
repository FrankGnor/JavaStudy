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
        response.setHeader("Access-Control-Allow-Origin", "*");//允许所有来源访同
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//允许访问的方式
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");

        Map<String,String[]> map = request.getParameterMap();

        //在控制台显示传入的数据
        for (String key:map.keySet()){
            System.out.print(key+":");

            String[] values = map.get(key);
            for (String value:values){
                System.out.print(value+" ");
            }
            System.out.println();
        }
//        //做题花的时间
//        Integer timer =Integer.parseInt(request.getParameter("timer")) ;
//        //把题目id和answer拆开，放入map中
//        Map<Integer,String> noANDanswer = new HashMap<>();
//
//        for (String key:map.keySet()){
//            if(key.contains("exam")){
//                String value = Arrays.toString(map.get(key));
//
//                //正则匹配里面的题号
//                String regEx1="[^0-9]";
//                Pattern p1 = Pattern.compile(regEx1);
//                Matcher m1 = p1.matcher(value);
//
//                //正则匹配里面的答案
//                String regEx2="[^A-Z]";
//                Pattern p2 = Pattern.compile(regEx2);
//                Matcher m2 = p2.matcher(value);
//
//
//                //需要对正则匹配出来的 Matcher 进行转换
//                if (Integer.parseInt(m1.replaceAll("").trim())!=0){
//                    noANDanswer.put(Integer.parseInt(m1.replaceAll("").trim()), m2.replaceAll("").trim());
//                }
//
//            }
//        }
//
//        //获得所有的题目id
//        List<Integer> id = new ArrayList<>();
//        for (String key:map.keySet()){
//            if(key.contains("type")){
//                //正则匹配里面的题号
//                String regEx1="[^0-9]";
//                Pattern p1 = Pattern.compile(regEx1);
//                Matcher m1 = p1.matcher(key);
//                id.add(Integer.parseInt(m1.replaceAll("").trim()));
//            }
//        }
//        //获得没有答案的题目id,并把他加到noANDanswer中
//        for (Integer integer : id) {
//            boolean flag = true;
//            for (Integer q_no : noANDanswer.keySet()) {
//                if (Objects.equals(q_no, integer)) {
//                    flag = false;   //该id已存在noANDanswer中
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
//        //遍历你做的每一道题
//        List<Question> myQuestions = new ArrayList<Question>();
//        //与数据库正确答案进行对比，给出每个题目是 error un right，题目id+正确答案+你的答案+你的情况+知识点+解析
//        int i = 0;
//        for (Integer q_no:noANDanswer.keySet()){
//            myQuestions.add(service.testAnswer(q_no));
//            String myAnswer = noANDanswer.get(q_no);
//            myQuestions.get(i).setMyAnswer(myAnswer);
//            //判定你的情况并记录到
//            if (myQuestions.get(i).getAnswer().equalsIgnoreCase(myAnswer)){
//                myQuestions.get(i).setMyStatus("right");
//                //把错题保存到数据库中
//                //1.设置questionID
//                String time = username+myQuestions.get(i).getqNo();
//                myQuestions.get(i).setTime(time);
//                myQuestions.get(i).setUsername(username);
//                service.insertError(myQuestions.get(i));
//            } else if ("".equalsIgnoreCase(myAnswer)) {
//                myQuestions.get(i).setMyStatus("un");
//                //把错题保存到数据库中
//                //1.设置questionID
//                String time = username+myQuestions.get(i).getqNo();
//                myQuestions.get(i).setTime(time);
//                myQuestions.get(i).setUsername(username);
//                service.insertError(myQuestions.get(i));
//            }else {
//                myQuestions.get(i).setMyStatus("error");
//
//                //把错题保存到数据库中
//                //1.设置questionID
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
//        //响应数据
//        response.setContentType("text/json;charset=utf-8");
//        response.getWriter().write(jsonString);

    }






    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
