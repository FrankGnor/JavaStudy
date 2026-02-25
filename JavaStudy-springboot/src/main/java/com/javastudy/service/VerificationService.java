package com.javastudy.service;

import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;

/**
 */
@Service
public class VerificationService {

    public static final String CAPTCHA_SESSION_KEY = "checkCodeGen";
    public static final String SMS_CODE_SESSION_KEY = "verifyCode";
    public static final String SMS_CREATE_TIME_SESSION_KEY = "createTime";
    public static final String SMS_MOBILE_SESSION_KEY = "mobile";

    public void verifyCaptcha(HttpSession session, String input) {
        Object saved = session.getAttribute(CAPTCHA_SESSION_KEY);
        if (saved == null || input == null || !saved.toString().equalsIgnoreCase(input)) {
            throw new IllegalArgumentException("captcha code is invalid");
        }
    }

    public void verifySmsCode(HttpSession session, String mobile, String code) {
        Object savedCode = session.getAttribute(SMS_CODE_SESSION_KEY);
        Object savedMobile = session.getAttribute(SMS_MOBILE_SESSION_KEY);
        Object createdAt = session.getAttribute(SMS_CREATE_TIME_SESSION_KEY);

        if (savedCode == null || savedMobile == null || createdAt == null) {
            throw new IllegalArgumentException("sms code is missing, send code first");
        }

        if (!savedMobile.toString().equals(mobile)) {
            throw new IllegalArgumentException("mobile number mismatch");
        }

        if (!savedCode.toString().equalsIgnoreCase(code)) {
            throw new IllegalArgumentException("sms code is invalid");
        }

        long ageSeconds = (System.currentTimeMillis() - Long.parseLong(createdAt.toString())) / 1000;
        if (ageSeconds >= 300) {
            throw new IllegalArgumentException("sms code expired");
        }
    }
}
