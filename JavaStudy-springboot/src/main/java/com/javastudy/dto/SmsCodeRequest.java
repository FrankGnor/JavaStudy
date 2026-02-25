package com.javastudy.dto;

import javax.validation.constraints.NotBlank;

/**
 * Request payload for sending SMS verification code.
 */
public class SmsCodeRequest {

    @NotBlank
    private String mobile;

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}
