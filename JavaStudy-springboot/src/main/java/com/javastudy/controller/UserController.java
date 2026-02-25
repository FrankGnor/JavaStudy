package com.javastudy.controller;

import com.javastudy.common.ApiResponse;
import com.javastudy.service.UserStatsService;
import com.javastudy.pojo.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserStatsService userStatsService;

    public UserController(UserStatsService userStatsService) {
        this.userStatsService = userStatsService;
    }

    @GetMapping("/{username}/stats")
    public ApiResponse<User> userStats(@PathVariable("username") String username) {
        return ApiResponse.ok(userStatsService.userStats(username));
    }
}
