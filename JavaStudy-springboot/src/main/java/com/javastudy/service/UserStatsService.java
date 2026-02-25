package com.javastudy.service;

import com.javastudy.mapper.UserMapper;
import com.javastudy.pojo.User;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Date;

/**
 */
@Service
public class UserStatsService {

    private final UserMapper userMapper;

    public UserStatsService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public User userStats(String username) {
        Date registerTime = userMapper.date(username);
        int days = 0;
        if (registerTime != null) {
            days = (int) ((System.currentTimeMillis() - registerTime.getTime()) / (1000 * 3600 * 24));
        }

        int testNum = userMapper.num(username);
        int newScore = userMapper.newscore(username);
        double avgScore = userMapper.avgscore(username);

        User user = new User();
        user.setLearnDays(days);
        user.setTestnum(testNum);
        user.setNewscore(newScore);
        user.setAvgscore(new DecimalFormat("0.00").format(avgScore));
        return user;
    }
}
