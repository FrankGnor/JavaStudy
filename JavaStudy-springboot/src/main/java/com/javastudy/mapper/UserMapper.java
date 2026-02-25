package com.javastudy.mapper;

import com.javastudy.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Date;

public interface UserMapper {


    /**
     * @param username
     * @param password
     * @return
     */
    @Select("select * from sys_user where username = #{username} and password = #{password}")
    User select(@Param("username") String username,@Param("password")  String password);

    /**
     * @param username
     * @return
     */
    @Select("select * from sys_user where username = #{username}")
    User selectByUsername(String username);

    /**
     * @param user
     */
    @Insert("insert into sys_user(username,password,phone,register_time) values(#{username},#{password},#{phone},#{register_time})")
    void add(User user);

    /**
     * @param username
     * @param password
     */
    @Update("update sys_user set password=#{password} where username=#{username}")
    void reset(@Param("username") String username,@Param("password") String password);


    /**
     * @param username
     */
    @Select("select register_time from sys_user where username = #{username}")
    Date date(String username);


    /**
     * @param username
     */
    @Select("select count(id) from user_question where username = #{username}")
    int num(String username);

    /**
     * @param username
     */
    @Select("SELECT right_rate FROM `paper` WHERE user_name=#{username} and id = (SELECT MAX(id) FROM `paper` WHERE user_name=#{username})")
    int newscore(String username);

    /**
     * @param username
     */
    @Select("SELECT AVG(right_rate) FROM `paper` WHERE user_name=#{username} ")
    double avgscore(String username);
}
