package com.itheima.service;


import com.itheima.mapper.TutorialMapper;
import com.itheima.pojo.Tutorial;
import com.itheima.util.SqlSessionFactoryUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;

public class TutorialService {
    SqlSessionFactory factory = SqlSessionFactoryUtils.getSqlSessionFactory();

    /**
     *   根据tutorial_id，筛选出tutorial的point和内容
     *
     * @param tutorial_id
     * @return
     */
    public Tutorial selectTutorial(int tutorial_id){
        SqlSession sqlSession = factory.openSession();
        TutorialMapper mapper = sqlSession.getMapper(TutorialMapper.class);
        Tutorial tutorial = mapper.selectTutorial(tutorial_id);

        sqlSession.close();
        return tutorial;
    }

    /**
     * 获取目录
     * @return
     */
    public List<Tutorial> selectcata(){
        SqlSession sqlSession = factory.openSession();
        TutorialMapper mapper = sqlSession.getMapper(TutorialMapper.class);
        List<Tutorial> tutorial = mapper.selectcata();

        sqlSession.close();
        return tutorial;
    }


    public Tutorial seach(String keyword){
        SqlSession sqlSession = factory.openSession();
        TutorialMapper mapper = sqlSession.getMapper(TutorialMapper.class);
        Tutorial tutorial = mapper.seach(keyword);
        sqlSession.close();
        return tutorial;
    }
}
