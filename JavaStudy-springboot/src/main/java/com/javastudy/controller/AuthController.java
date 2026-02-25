package com.javastudy.controller;

import com.javastudy.common.ApiResponse;
import com.javastudy.config.SmsProperties;
import com.javastudy.dto.LoginRequest;
import com.javastudy.dto.RegisterRequest;
import com.javastudy.dto.ResetPasswordRequest;
import com.javastudy.dto.SmsCodeRequest;
import com.javastudy.service.AuthService;
import com.javastudy.service.SmsService;
import com.javastudy.service.VerificationService;
import com.javastudy.pojo.User;
import com.javastudy.util.CheckCodeUtil;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 *
 */
@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final VerificationService verificationService;
    private final SmsService smsService;
    private final SmsProperties smsProperties;

    public AuthController(
            AuthService authService,
            VerificationService verificationService,
            SmsService smsService,
            SmsProperties smsProperties) {
        this.authService = authService;
        this.verificationService = verificationService;
        this.smsService = smsService;
        this.smsProperties = smsProperties;
    }

    @GetMapping(value = "/captcha", produces = MediaType.IMAGE_JPEG_VALUE)
    public void captcha(HttpSession session, HttpServletResponse response) throws IOException {
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        String checkCode = CheckCodeUtil.outputVerifyImage(100, 50, response.getOutputStream(), 4);
        session.setAttribute(VerificationService.CAPTCHA_SESSION_KEY, checkCode);
    }

    @PostMapping("/sms-code")
    public ApiResponse<Map<String, String>> sendSmsCode(@Valid @RequestBody SmsCodeRequest request, HttpSession session) {
        String code = smsService.sendCode(request.getMobile(), session);
        Map<String, String> data = new HashMap<String, String>();
        data.put("message", "sms code sent");
        if (!smsProperties.isEnabled()) {
            data.put("devCode", code);
        }
        return ApiResponse.ok(data);
    }

    @PostMapping("/login")
    public ApiResponse<User> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        User user = authService.login(request.getUsername(), request.getPassword());
        session.setAttribute("user", user);
        return ApiResponse.ok("login success", user);
    }

    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        verificationService.verifyCaptcha(session, request.getCheckCode());
        verificationService.verifySmsCode(session, request.getMobile(), request.getVerifyCode());
        authService.register(request.getUsername(), request.getPassword(), request.getMobile());
        return ApiResponse.ok("register success", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpSession session) {
        verificationService.verifyCaptcha(session, request.getCheckCode());
        verificationService.verifySmsCode(session, request.getMobile(), request.getVerifyCode());
        authService.resetPassword(request.getUsername(), request.getPassword(), request.getMobile());
        return ApiResponse.ok("reset password success", null);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.ok("logout success", null);
    }
}
