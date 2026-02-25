package com.javastudy.service;

import com.javastudy.mapper.UserMapper;
import com.javastudy.pojo.User;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 */
@Service
public class AuthService {

    private final UserMapper userMapper;

    public AuthService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public User login(String username, String password) {
        User user = userMapper.select(username, password);
        if (user == null) {
            throw new IllegalArgumentException("username or password is not correct");
        }
        user.setPassword("");
        return user;
    }

    public void register(String username, String password, String mobile) {
        User existed = userMapper.selectByUsername(username);
        if (existed != null) {
            throw new IllegalArgumentException("username already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setPhone(mobile);
        user.setRegister_time(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        userMapper.add(user);
    }

    public void resetPassword(String username, String newPassword, String mobile) {
        User existed = userMapper.selectByUsername(username);
        if (existed == null) {
            throw new IllegalArgumentException("username does not exist");
        }
        if (!mobile.equals(existed.getPhone())) {
            throw new IllegalArgumentException("mobile number mismatch");
        }
        userMapper.reset(username, newPassword);
    }
}
