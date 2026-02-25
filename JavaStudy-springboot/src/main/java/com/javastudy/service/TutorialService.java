package com.javastudy.service;

import com.javastudy.mapper.TutorialMapper;
import com.javastudy.pojo.Tutorial;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 */
@Service
public class TutorialService {

    private final TutorialMapper tutorialMapper;

    public TutorialService(TutorialMapper tutorialMapper) {
        this.tutorialMapper = tutorialMapper;
    }

    public Tutorial getById(int tutorialId) {
        return tutorialMapper.selectTutorial(tutorialId);
    }

    public List<Tutorial> catalog() {
        return tutorialMapper.selectcata();
    }

    public Tutorial search(String keyword) {
        return tutorialMapper.seach(keyword);
    }
}
