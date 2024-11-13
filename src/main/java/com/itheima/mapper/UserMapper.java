package com.itheima.mapper;

import com.itheima.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Date;

public interface UserMapper {


    /**
     * 根据用户名和密码查询用户对象
     * @param username
     * @param password
     * @return
     */
    @Select("select * from sys_user where username = #{username} and password = #{password}")
    User select(@Param("username") String username,@Param("password")  String password);

    /**
     * 根据用户名查询用户对象
     * @param username
     * @return
     */
    @Select("select * from sys_user where username = #{username}")
    User selectByUsername(String username);

    /**
     * 添加用户
     * @param user
     */
    @Insert("insert into sys_user(username,password,phone,register_time) values(#{username},#{password},#{phone},#{register_time})")
    void add(User user);

    /**
     * 重置密码
     * @param username
     * @param password
     */
    @Update("update sys_user set password=#{password} where username=#{username}")
    void reset(@Param("username") String username,@Param("password") String password);


    /**
     * 查询用户注册日期
     * @param username
     */
    @Select("select register_time from sys_user where username = #{username}")
    Date date(String username);


    /**
     * 做题数
     * @param username
     */
    @Select("select count(id) from user_question where username = #{username}")
    int num(String username);

    /**
     * 做题数
     * @param username
     */
    @Select("SELECT right_rate FROM `paper` WHERE user_name=#{username} and id = (SELECT MAX(id) FROM `paper` WHERE user_name=#{username})")
    int newscore(String username);

    /**
     * 平均成绩
     * @param username
     */
    @Select("SELECT AVG(right_rate) FROM `paper` WHERE user_name=#{username} ")
    double avgscore(String username);
}
