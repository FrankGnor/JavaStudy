package com.javastudy.mapper;
import com.javastudy.pojo.*;
import org.apache.ibatis.annotations.*;

import java.lang.reflect.Array;
import java.util.List;
public interface QuestionMapper {
    /**
     * @return QUestion Object
     */
    @Select("SELECT * FROM question WHERE topic=#{topic} and qtype = 1 order by rand() limit 5")
    @ResultMap("questionResultMap")
    List<Question> selectQuestion(Integer topic);

    /**
     * @param topic
     * @return
     */
    @Select("SELECT * FROM question WHERE topic=#{topic} and qtype = 5 order by rand() limit 1")
    @ResultMap("questionResultMap")
    List<Completion> selectCompletion(Integer topic);


    /**
     * @param topic
     * @return
     */
    @Select("SELECT * FROM question WHERE topic=#{topic} and qtype = 3 order by rand() limit 2")
    @ResultMap("questionResultMap")
    List<TorF> selectTorF(Integer topic);

    /**
     * @return QUestion Object
     */
    @Select("SELECT * FROM question WHERE  qtype = 1 order by rand() limit 10")
    @ResultMap("questionResultMap")
    List<Question> termEnd4();

    /**
     *
     * @return
     */
    @Select("SELECT * FROM question WHERE  qtype = 5 order by rand() limit 3")
    @ResultMap("questionResultMap")
    List<Completion> termEndCompletion();
    /**
     * @return
     */
    @Select("SELECT * FROM question WHERE  qtype = 3 order by rand() limit 5")
    @ResultMap("questionResultMap")
    List<TorF> termEndTorF();



    /**
     *
     * @return
     */
    @Select("SELECT * FROM question WHERE q_no IN (SELECT distinct(q_no) FROM user_question WHERE username = #{username} and delete_if=0)")
    @ResultMap("questionResultMap")
    List<Question> wrongQ(String username);

    /**
     * @param username
     * @param q_no
     */
    @Update("UPDATE user_question SET delete_if=1 WHERE username = #{username} and q_no=#{q_no}")
    @ResultMap("questionResultMap")
    void DeletewrongQ(@Param("username") String username,@Param("q_no") int q_no);










    /**
     * @param
     * @return
     */
    @Select("SELECT MAX(paper_id) FROM user_question")
    int maxId();


    /**
     * @param q_no
     * @return
     */
    @Select("SELECT * FROM question WHERE q_no = #{q_no}")
    @ResultMap("QforInsertResultMap")
    QforInsert selectBYq_no(Integer q_no);


    /**
     * @param myQuestion
     */
    @Insert("INSERT INTO user_question(q_no,username,answer,paper_id,myStatus) VALUES(#{qNo},#{username},#{myAnswer},#{paper_id},#{myStatus})")
    @ResultMap("QforInsertResultMap")
    void insertError(QforInsert myQuestion);
    @Insert("INSERT INTO paper(id,user_name,correct_user,knowledge_id,correct_status,finish_time,used_time,right_rate) VALUES(#{paper_id},#{username},'auto',#{topic},1,#{time},#{usedTime},#{right_rate})")
    @ResultMap("QforInsertResultMap")
    void insertError1(QforInsert myQuestion);




    /**
     * @param topic
     * @return
     */
    @Select("SELECT q_no,title,topic FROM question WHERE topic=#{topic} AND qtype=12 order by rand() limit 2")
    @ResultMap("questionResultMap")
    List<CodeQuestion> selectCodeQuestion(Integer topic);

    /**
     * @param myQuestion
     */
    @Insert("INSERT INTO user_question(q_no,username,answer,paper_id) VALUES(#{qNo},#{username},#{myAnswer},#{paper_id})")
    @ResultMap("QforInsertResultMap")
    void insertCode(QforInsert myQuestion);

    @Insert("INSERT INTO paper(id,user_name,correct_user,knowledge_id,correct_status,finish_time,used_time) VALUES(#{paper_id},#{username},#{correct_user},#{topic},0,#{time},#{usedTime})")
    @ResultMap("QforInsertResultMap")
    void insertCode1(QforInsert myQuestion);


}