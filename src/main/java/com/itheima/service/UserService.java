package com.itheima.service;

import com.itheima.mapper.UserMapper;
import com.itheima.pojo.User;
import com.itheima.util.SqlSessionFactoryUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.Date;


public class UserService {
    SqlSessionFactory factory = SqlSessionFactoryUtils.getSqlSessionFactory();

    /**
     * 登录方法
     * @param username
     * @param password
     * @return
     */

    public User login(String username,String password){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //4. 调用方法
        User user = mapper.select(username, password);

        //释放资源
        sqlSession.close();

        return  user;
    }



    public User select(String username){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //4. 调用方法
        User user = mapper.selectByUsername(username);

        //释放资源
        sqlSession.close();

        return  user;
    }



    /**
     * 用户是否存在
     * @return
     */

    public boolean userexist(User user){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        String username = user.getUsername();
        //4. 判断用户名是否存在
        User u = mapper.selectByUsername(username);

        if(u == null){
            sqlSession.close();
            // 用户名不存在，可以注册，不能重置
            return true;
        }
        sqlSession.close();
        return false;
    }

    /**
     * 注册方法
     * @param user
     */
    public void register(User user){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        mapper.add(user);
        sqlSession.commit();
        sqlSession.close();
    }

    /**
     * 重置密码
     * @param user
     * @return
     */
    public void reset(User user){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        mapper.reset(user.getUsername(), user.getPassword());
        sqlSession.commit();

        sqlSession.close();


    }


    public Date date(String username){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //4. 调用方法
        Date date = mapper.date(username);
        //释放资源
        sqlSession.close();
        return  date;
    }

    public int num(String username){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //4. 调用方法
        int num = mapper.num(username);
        //释放资源
        sqlSession.close();
        return  num;
    }

    public int newscore(String username){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //4. 调用方法
        int newscore = mapper.newscore(username);
        //释放资源
        sqlSession.close();
        return  newscore;
    }

    public double avgscore(String username){
        //2. 获取SqlSession
        SqlSession sqlSession = factory.openSession();
        //3. 获取UserMapper
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //4. 调用方法
        double avgscore = mapper.avgscore(username);
        //释放资源
        sqlSession.close();
        return  avgscore;
    }
}
