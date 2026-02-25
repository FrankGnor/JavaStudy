package com.javastudy.service;

import com.javastudy.config.SmsProperties;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.Random;

/**
 */
@Service
public class SmsService {

    private final SmsProperties smsProperties;

    public SmsService(SmsProperties smsProperties) {
        this.smsProperties = smsProperties;
    }

    public String sendCode(String mobile, HttpSession session) {
        String code = String.valueOf(100000 + new Random().nextInt(900000));

        if (!smsProperties.isEnabled()) {
            saveSession(session, mobile, code);
            return code;
        }

        if (isBlank(smsProperties.getApiUrl()) || isBlank(smsProperties.getAccount()) || isBlank(smsProperties.getPassword())) {
            throw new IllegalArgumentException("sms config missing, please set app.sms.* in application.yml");
        }

        try {
            HttpClient client = new HttpClient();
            PostMethod method = new PostMethod(smsProperties.getApiUrl());
            client.getParams().setContentCharset("GBK");
            method.setRequestHeader("ContentType", "application/x-www-form-urlencoded;charset=GBK");

            String content = "[JavaStudy] Verification code: " + code + ". Do not share with anyone.";
            NameValuePair[] data = {
                    new NameValuePair("account", smsProperties.getAccount()),
                    new NameValuePair("password", smsProperties.getPassword()),
                    new NameValuePair("mobile", mobile),
                    new NameValuePair("content", content)
            };
            method.setRequestBody(data);

            client.executeMethod(method);
            String resultXml = method.getResponseBodyAsString();
            Document doc = DocumentHelper.parseText(resultXml);
            Element root = doc.getRootElement();
            String resultCode = root.elementText("code");

            if (!"2".equals(resultCode)) {
                throw new IllegalArgumentException("sms send failed: " + root.elementText("msg"));
            }

            saveSession(session, mobile, code);
            return code;
        } catch (Exception ex) {
            throw new IllegalArgumentException("sms send failed: " + ex.getMessage());
        }
    }

    private void saveSession(HttpSession session, String mobile, String code) {
        session.setAttribute(VerificationService.SMS_CODE_SESSION_KEY, code);
        session.setAttribute(VerificationService.SMS_CREATE_TIME_SESSION_KEY, System.currentTimeMillis());
        session.setAttribute(VerificationService.SMS_MOBILE_SESSION_KEY, mobile);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
