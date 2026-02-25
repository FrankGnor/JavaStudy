package com.javastudy.service;

import com.javastudy.mapper.QuestionMapper;
import com.javastudy.pojo.CodeQuestion;
import com.javastudy.pojo.Completion;
import com.javastudy.pojo.Question;
import com.javastudy.pojo.TorF;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 */
@Service
public class QuestionService {

    private final QuestionMapper questionMapper;

    public QuestionService(QuestionMapper questionMapper) {
        this.questionMapper = questionMapper;
    }

    public List<Object> listQuestions(Integer topic, String username) {
        List<Object> result = new ArrayList<Object>();
        if (topic == null) {
            throw new IllegalArgumentException("topic is required");
        }

        if (topic > 0) {
            List<Question> questions = questionMapper.selectQuestion(topic);
            List<Completion> completion = questionMapper.selectCompletion(topic);
            List<TorF> torF = questionMapper.selectTorF(topic);
            result.addAll(questions);
            result.addAll(completion);
            result.addAll(torF);
            return result;
        }

        if (topic == -1) {
            if (username == null || username.trim().isEmpty()) {
                throw new IllegalArgumentException("username is required when topic=-1");
            }
            result.addAll(questionMapper.wrongQ(username));
            return result;
        }

        List<Question> questions = questionMapper.termEnd4();
        List<Completion> completion = questionMapper.termEndCompletion();
        List<TorF> torF = questionMapper.termEndTorF();
        result.addAll(questions);
        result.addAll(completion);
        result.addAll(torF);
        return result;
    }

    public List<CodeQuestion> codeQuestions(Integer topic) {
        if (topic == null) {
            throw new IllegalArgumentException("topic is required");
        }
        return questionMapper.selectCodeQuestion(topic);
    }

    public void deleteWrongQuestion(String username, int qNo) {
        questionMapper.DeletewrongQ(username, qNo);
    }
}
