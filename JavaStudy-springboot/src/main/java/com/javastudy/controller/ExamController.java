package com.javastudy.controller;

import com.javastudy.common.ApiResponse;
import com.javastudy.service.ExamService;
import com.javastudy.pojo.QforInsert;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 */
@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping(value = "/choice/submit", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ApiResponse<List<QforInsert>> submitChoiceByForm(@RequestParam Map<String, String> payload) {
        return ApiResponse.ok(examService.submitChoiceExam(payload));
    }

    @PostMapping(value = "/choice/submit", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<List<QforInsert>> submitChoiceByJson(@RequestBody Map<String, String> payload) {
        return ApiResponse.ok(examService.submitChoiceExam(payload));
    }

    @PostMapping(value = "/code/submit", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ApiResponse<Void> submitCodeByForm(@RequestParam Map<String, String> payload) {
        examService.submitCodeExam(payload);
        return ApiResponse.ok("submitted", null);
    }

    @PostMapping(value = "/code/submit", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<Void> submitCodeByJson(@RequestBody Map<String, String> payload) {
        examService.submitCodeExam(payload);
        return ApiResponse.ok("submitted", null);
    }
}
