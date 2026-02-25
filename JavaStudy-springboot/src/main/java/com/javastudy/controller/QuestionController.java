package com.javastudy.controller;

import com.javastudy.common.ApiResponse;
import com.javastudy.service.QuestionService;
import com.javastudy.pojo.CodeQuestion;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 */
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public ApiResponse<List<Object>> list(
            @RequestParam("topic") Integer topic,
            @RequestParam(value = "username", required = false) String username) {
        return ApiResponse.ok(questionService.listQuestions(topic, username));
    }

    @GetMapping("/code")
    public ApiResponse<List<CodeQuestion>> codeQuestions(@RequestParam("topic") Integer topic) {
        return ApiResponse.ok(questionService.codeQuestions(topic));
    }

    @DeleteMapping("/wrong/{qNo}")
    public ApiResponse<Void> deleteWrongQuestion(
            @PathVariable("qNo") int qNo,
            @RequestParam("username") String username) {
        questionService.deleteWrongQuestion(username, qNo);
        return ApiResponse.ok("deleted", null);
    }
}
