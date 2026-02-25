package com.javastudy;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 *
 * @SpringBootApplication:
 *
 * @MapperScan:
 */
@SpringBootApplication(scanBasePackages = "com.javastudy")
@MapperScan("com.javastudy.mapper")
public class JavaStudyBootApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaStudyBootApplication.class, args);
    }
}
