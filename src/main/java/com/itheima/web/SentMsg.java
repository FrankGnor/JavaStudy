//�ӿ����ͣ��������ߴ������Žӿڣ�֧�ַ�����֤����š�����֪ͨ���ŵȡ�
// �˻�ע�᣺��ͨ���õ�ַ��ͨ�˻�https://user.ihuyi.com/new/userexist.html
// ע�����
//��1�������ڼ䣬��ʹ����ϵͳĬ�ϵĶ������ݣ�������֤���ǣ������������벻Ҫ����֤��й¶�������ˡ�
//��2����ʹ�� APIID �� APIKEY�����ýӿڣ����ڻ�Ա���Ļ�ȡ��
//��3���ô���������뻥�����߶��Žӿڲο�ʹ�ã��ͻ��ɸ���ʵ����Ҫ���б�д��
package com.itheima.web;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/sentMsg")
public class SentMsg extends HttpServlet {
    private static String Url = "http://106.ihuyi.com/webservice/sms.php?method=Submit";
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");//����������Դ��ͬ
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");//������ʵķ�ʽ
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        //1. ��ȡ�绰����
        String mobile = request.getParameter("mobile");


        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(Url);

        client.getParams().setContentCharset("GBK");
        method.setRequestHeader("ContentType","application/x-www-form-urlencoded;charset=GBK");

        int mobile_code = (int)((Math.random()*9+1)*100000);

        String content = new String("������֤���ǣ�" + mobile_code + "���벻Ҫ����֤��й¶�������ˡ�");

        NameValuePair[] data = {//�ύ����
                new NameValuePair("account", "C72541125"), //�鿴�û��� ��¼�û�����->��֤��֪ͨ����>��Ʒ����->API�ӿ���Ϣ->APIID
                new NameValuePair("password", "54748c5f33afb882a16e67acc115214f"), //�鿴���� ��¼�û�����->��֤��֪ͨ����>��Ʒ����->API�ӿ���Ϣ->APIKEY
                //new NameValuePair("password", util.StringUtil.MD5Encode("����")),
                new NameValuePair("mobile", mobile),
                new NameValuePair("content", content),
        };
        method.setRequestBody(data);

        try {
            client.executeMethod(method);

            String SubmitResult =method.getResponseBodyAsString();

            //System.out.println(SubmitResult);

            Document doc = DocumentHelper.parseText(SubmitResult);
            Element root = doc.getRootElement();

            String code = root.elementText("code");
            String msg = root.elementText("msg");
            String smsid = root.elementText("smsid");

            System.out.println(code);
            System.out.println(msg);
            System.out.println(smsid);

            if("2".equals(code)){
                System.out.println("�����ύ�ɹ�");
                HttpSession session = request.getSession();
                // ����֤�����SESSION
                request.getSession().setAttribute("verifyCode", String.valueOf(mobile_code));
                request.getSession().setAttribute("createTime",System.currentTimeMillis());
                request.getSession().setAttribute("mobile",mobile);
            }

        } catch (HttpException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (DocumentException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
