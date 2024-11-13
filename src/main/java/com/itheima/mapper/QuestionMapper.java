package com.itheima.mapper;
import com.itheima.pojo.*;
import org.apache.ibatis.annotations.*;

import java.lang.reflect.Array;
import java.util.List;
public interface QuestionMapper {
    /**
     * 单元测试，抽取四项选择题
     * @return QUestion Object
     */
    @Select("SELECT * FROM question WHERE topic=#{topic} and qtype = 1 order by rand() limit 5")
    @ResultMap("questionResultMap")
    List<Question> selectQuestion(Integer topic);

    /**
     * 单元测试，抽取程序填空题
     * @param topic
     * @return
     */
    @Select("SELECT * FROM question WHERE topic=#{topic} and qtype = 5 order by rand() limit 1")
    @ResultMap("questionResultMap")
    List<Completion> selectCompletion(Integer topic);


    /**
     * 单元测试，抽取判断题
     * @param topic
     * @return
     */
    @Select("SELECT * FROM question WHERE topic=#{topic} and qtype = 3 order by rand() limit 2")
    @ResultMap("questionResultMap")
    List<TorF> selectTorF(Integer topic);

    /**
     * 期末，抽取四项选择题
     * @return QUestion Object
     */
    @Select("SELECT * FROM question WHERE  qtype = 1 order by rand() limit 10")
    @ResultMap("questionResultMap")
    List<Question> termEnd4();

    /**
     * 期末，抽取程序填空题
     *
     * @return
     */
    @Select("SELECT * FROM question WHERE  qtype = 5 order by rand() limit 3")
    @ResultMap("questionResultMap")
    List<Completion> termEndCompletion();
    /**
     * 期末，抽取判断题
     * @return
     */
    @Select("SELECT * FROM question WHERE  qtype = 3 order by rand() limit 5")
    @ResultMap("questionResultMap")
    List<TorF> termEndTorF();



    /**
     *
     * 错题集抽题
     * @return
     */
    @Select("SELECT * FROM question WHERE q_no IN (SELECT distinct(q_no) FROM user_question WHERE username = #{username} and delete_if=0)")
    @ResultMap("questionResultMap")
    List<Question> wrongQ(String username);

    /**
     * 错题集删题
     * @param username
     * @param q_no
     */
    @Update("UPDATE user_question SET delete_if=1 WHERE username = #{username} and q_no=#{q_no}")
    @ResultMap("questionResultMap")
    void DeletewrongQ(@Param("username") String username,@Param("q_no") int q_no);










    /**
     * 获得当前最大的paper_id
     * @param
     * @return
     */
    @Select("SELECT MAX(paper_id) FROM user_question")
    int maxId();


    /**
     * 按q_no去筛选出问题
     * @param q_no
     * @return
     */
    @Select("SELECT * FROM question WHERE q_no = #{q_no}")
    @ResultMap("QforInsertResultMap")
    QforInsert selectBYq_no(Integer q_no);


    /**
     * 将选择题的错题保存到数据库中
     * @param myQuestion
     */
//  进行了遇主键冲突即更新的操作  @Insert("INSERT INTO user_question(q_no,username,myAnswer,time,myStatus) VALUES(#{qNo},#{username},#{myAnswer},#{time},#{myStatus}) ON DUPLICATE KEY UPDATE q_no=VALUES(q_no), username=VALUES(username),myAnswer=VALUES(myAnswer),myStatus=VALUES(myStatus)")
    //导入到user_question表
    @Insert("INSERT INTO user_question(q_no,username,answer,paper_id,myStatus) VALUES(#{qNo},#{username},#{myAnswer},#{paper_id},#{myStatus})")
    @ResultMap("QforInsertResultMap")
    void insertError(QforInsert myQuestion);
    //导入到paper表
    @Insert("INSERT INTO paper(id,user_name,correct_user,knowledge_id,correct_status,finish_time,used_time,right_rate) VALUES(#{paper_id},#{username},'auto',#{topic},1,#{time},#{usedTime},#{right_rate})")
    @ResultMap("QforInsertResultMap")
    void insertError1(QforInsert myQuestion);




    /**
     * 代码考试，随机抽取题目
     * @param topic
     * @return
     */
    @Select("SELECT q_no,title,topic FROM question WHERE topic=#{topic} AND qtype=12 order by rand() limit 2")
    @ResultMap("questionResultMap")
    List<CodeQuestion> selectCodeQuestion(Integer topic);

    /**
     * 将代码题的结果保存到数据库中
     * @param myQuestion
     */
    //导入到user_question表
    @Insert("INSERT INTO user_question(q_no,username,answer,paper_id) VALUES(#{qNo},#{username},#{myAnswer},#{paper_id})")
    @ResultMap("QforInsertResultMap")
    void insertCode(QforInsert myQuestion);

    //导入到paper表
    @Insert("INSERT INTO paper(id,user_name,correct_user,knowledge_id,correct_status,finish_time,used_time) VALUES(#{paper_id},#{username},#{correct_user},#{topic},0,#{time},#{usedTime})")
    @ResultMap("QforInsertResultMap")
    void insertCode1(QforInsert myQuestion);


}