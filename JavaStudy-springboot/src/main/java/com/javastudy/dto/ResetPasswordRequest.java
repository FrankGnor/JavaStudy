package com.javastudy.dto;

import javax.validation.constraints.NotBlank;

/**
 * Request payload for password reset.
 */
public class ResetPasswordRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String mobile;

    @NotBlank
    private String verifyCode;

    @NotBlank
    private String checkCode;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getVerifyCode() {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode) {
        this.verifyCode = verifyCode;
    }

    public String getCheckCode() {
        return checkCode;
    }

    public void setCheckCode(String checkCode) {
        this.checkCode = checkCode;
    }
}
