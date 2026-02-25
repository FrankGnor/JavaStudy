package com.javastudy.controller;

import com.javastudy.common.ApiResponse;
import com.javastudy.service.TutorialService;
import com.javastudy.pojo.Tutorial;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 */
@RestController
@RequestMapping("/api/tutorials")
public class TutorialController {

    private final TutorialService tutorialService;

    public TutorialController(TutorialService tutorialService) {
        this.tutorialService = tutorialService;
    }

    @GetMapping("/{id}")
    public ApiResponse<Tutorial> getById(@PathVariable("id") int id) {
        return ApiResponse.ok(tutorialService.getById(id));
    }

    @GetMapping("/catalog")
    public ApiResponse<List<Tutorial>> catalog() {
        return ApiResponse.ok(tutorialService.catalog());
    }

    @GetMapping("/search")
    public ApiResponse<Tutorial> search(@RequestParam("keyword") String keyword) {
        return ApiResponse.ok(tutorialService.search(keyword));
    }
}
