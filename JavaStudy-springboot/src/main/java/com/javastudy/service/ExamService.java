package com.javastudy.service;

import com.javastudy.mapper.QuestionMapper;
import com.javastudy.pojo.QforInsert;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 */
@Service
public class ExamService {

    private final QuestionMapper questionMapper;

    public ExamService(QuestionMapper questionMapper) {
        this.questionMapper = questionMapper;
    }

    /**
     * @Transactional:
     */
    @Transactional
    public List<QforInsert> submitChoiceExam(Map<String, String> rawParams) {
        String username = require(rawParams, "username");
        Integer topic = Integer.valueOf(require(rawParams, "topic"));
        int timer = Integer.parseInt(rawParams.getOrDefault("timer", "0"));

        Map<Integer, String> answerMap = extractAnswers(rawParams, false);
        if (answerMap.isEmpty()) {
            throw new IllegalArgumentException("no exam answers found");
        }

        int paperId = nextPaperId();
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

        List<QforInsert> result = new ArrayList<QforInsert>();
        int rightCount = 0;

        for (Map.Entry<Integer, String> entry : answerMap.entrySet()) {
            QforInsert question = questionMapper.selectBYq_no(entry.getKey());
            if (question == null) {
                continue;
            }
            question.setMyAnswer(entry.getValue());
            question.setTime(now);
            question.setPaper_id(paperId);
            question.setUsername(username);
            question.setUsedTime(String.valueOf(timer));
            question.setTopic(topic);

            if (question.getAnswer().equalsIgnoreCase(entry.getValue())) {
                question.setMyStatus("right");
                rightCount++;
            } else if (entry.getValue().trim().isEmpty()) {
                question.setMyStatus("un");
            } else {
                question.setMyStatus("error");
            }

            questionMapper.insertError(question);
            result.add(question);
        }

        if (!result.isEmpty()) {
            int rightRate = (int) (rightCount * 100.0 / result.size());
            result.get(0).setRight_rate(rightRate);
            questionMapper.insertError1(result.get(0));
        }

        return result;
    }

    @Transactional
    public void submitCodeExam(Map<String, String> rawParams) {
        String username = require(rawParams, "username");
        Integer topic = Integer.valueOf(require(rawParams, "topic"));
        String timer = rawParams.getOrDefault("timer", "0");

        Map<Integer, String> answerMap = extractAnswers(rawParams, true);
        if (answerMap.isEmpty()) {
            throw new IllegalArgumentException("no code answers found");
        }

        int paperId = nextPaperId();
        String now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        int row = 0;

        for (Map.Entry<Integer, String> entry : answerMap.entrySet()) {
            QforInsert question = new QforInsert();
            question.setqNo(entry.getKey());
            question.setMyAnswer(entry.getValue());
            question.setTime(now);
            question.setUsedTime(timer);
            question.setQtype(12);
            question.setUsername(username);
            question.setPaper_id(paperId);
            question.setTopic(topic);
            questionMapper.insertCode(question);
            row++;
            if (row == 1) {
                questionMapper.insertCode1(question);
            }
        }
    }

    private int nextPaperId() {
        int max = questionMapper.maxId();
        return max + 1;
    }

    private String require(Map<String, String> rawParams, String key) {
        String value = rawParams.get(key);
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(key + " is required");
        }
        return value;
    }

    private Map<Integer, String> extractAnswers(Map<String, String> rawParams, boolean includeZero) {
        Map<Integer, String> answerMap = new HashMap<Integer, String>();
        List<Integer> allQuestionIds = new ArrayList<Integer>();

        for (Map.Entry<String, String> entry : rawParams.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (key.startsWith("exam")) {
                Integer qNo = extractNumber(key);
                if (qNo != null && qNo > 0) {
                    String normalized = value == null ? "" : value.trim();
                    if (includeZero || !"0".equals(normalized)) {
                        answerMap.put(qNo, normalized);
                    }
                }
            }

            if (key.startsWith("type")) {
                Integer qNo = extractNumber(key);
                if (qNo != null && qNo > 0) {
                    allQuestionIds.add(qNo);
                }
            }
        }

        for (Integer qNo : allQuestionIds) {
            if (!answerMap.containsKey(qNo)) {
                answerMap.put(qNo, "");
            }
        }

        return answerMap;
    }

    private Integer extractNumber(String key) {
        String digits = key.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) {
            return null;
        }
        return Integer.valueOf(digits);
    }
}
