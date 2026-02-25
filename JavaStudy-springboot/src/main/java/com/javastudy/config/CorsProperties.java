package com.javastudy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    private String allowedOrigins = "http://localhost:5173";

    public String getAllowedOrigins() {
        return allowedOrigins;
    }

    public void setAllowedOrigins(String allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }
}
