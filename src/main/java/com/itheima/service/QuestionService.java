package com.itheima.service;

import com.itheima.mapper.QuestionMapper;
import com.itheima.pojo.*;
import com.itheima.util.SqlSessionFactoryUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;

public class QuestionService {
    SqlSessionFactory factory = SqlSessionFactoryUtils.getSqlSessionFactory();

    /**
     * ��Ԫ���Է���ѡ���⡢��������⡢�ж���
     * @param topic
     * @return List<Question>
     */
    public List<Question> topicTest(Integer topic){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<Question> questions = mapper.selectQuestion(topic);

        sqlSession.close();
        return questions;
    }

    public List<Completion> topicTestCompletion(Integer topic){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<Completion> questions = mapper.selectCompletion(topic);

        sqlSession.close();
        return questions;
    }

    public List<TorF> selectTorF(Integer topic){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<TorF> questions = mapper.selectTorF(topic);

        sqlSession.close();
        return questions;
    }

    /**
     * ��ĩ���Գ���
     * @return
     */
    public List<Question> termEnd4(){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<Question> questions = mapper.termEnd4();
        sqlSession.close();
        return questions;
    }

    public List<Completion> termEndCompletion(){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<Completion> questions = mapper.termEndCompletion();

        sqlSession.close();
        return questions;
    }

    public List<TorF> termEndTorF(){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<TorF> questions = mapper.termEndTorF();

        sqlSession.close();
        return questions;
    }

    /**
     * ��ȡ����
     * @return
     */
    public List<Question> wrongQ(String username){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        List<Question> questions = mapper.wrongQ(username);
        sqlSession.close();
        return questions;
    }

    /**
     * ɾ������
     * @param username
     * @param q_no
     */
    public void DeletewrongQ(String username,int q_no){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        mapper.DeletewrongQ(username,q_no);
        sqlSession.commit();
        sqlSession.close();
    }



    /**
     * ��q_noȥɸѡ������
     * @param q_no
     * @return
     */

    public QforInsert testAnswer(Integer q_no){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        QforInsert question = mapper.selectBYq_no(q_no);

        sqlSession.close();
        return question;
    }

    /**
     * ��õ�ǰ����paper_id
     * @param
     * @return paper_id
     */


    public int maxId(){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        int paper_id = mapper.maxId();

        sqlSession.close();
        return paper_id;
    }
    /**
     * �ύ��������ݿⱣ��
     * @param myQuestion  �������
     */
    public void insertError(QforInsert myQuestion){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        mapper.insertError(myQuestion);
        sqlSession.commit();
        sqlSession.close();
    }
    public void insertError1(QforInsert myQuestion){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        mapper.insertError1(myQuestion);
        sqlSession.commit();
        sqlSession.close();
    }

    /**
     * ���ش�������û�
     * @param topic
     * @return
     */
    public List<CodeQuestion> selectCodeQuestion(Integer topic){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);

        List<CodeQuestion> questions = mapper.selectCodeQuestion(topic);

        sqlSession.close();
        return questions;

    }

    /**
     * �ύ��������û��Ĵ𰸸����ݿⱣ��
     * @param myQuestion  �������
     */
    public void insertCode(QforInsert myQuestion){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        mapper.insertCode(myQuestion);
        sqlSession.commit();
        sqlSession.close();
    }
    public void insertCode1(QforInsert myQuestion){
        SqlSession sqlSession = factory.openSession();
        QuestionMapper mapper = sqlSession.getMapper(QuestionMapper.class);
        mapper.insertCode1(myQuestion);
        sqlSession.commit();
        sqlSession.close();
    }

}
