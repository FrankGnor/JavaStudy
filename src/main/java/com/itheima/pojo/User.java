package com.itheima.pojo;

public class User {

    private Integer id = 0;
    private String username = "";
    private String password = "";
    private String phone = "";
    private String register_time="";
    private final int roleId = 2;
    private int learnDays = 0;
    private int testnum = 0;
    private int newscore = 0;
    private String avgscore = "";

    public int getLearnDays() {
        return learnDays;
    }

    public void setLearnDays(int learnDays) {
        this.learnDays = learnDays;
    }

    public int getTestnum() {
        return testnum;
    }

    public void setTestnum(int testnum) {
        this.testnum = testnum;
    }

    public int getNewscore() {
        return newscore;
    }

    public void setNewscore(int newscore) {
        this.newscore = newscore;
    }

    public String getAvgscore() {
        return avgscore;
    }

    public void setAvgscore(String avgscore) {
        this.avgscore = avgscore;
    }

    public String getRegister_time() {
        return register_time;
    }

    public void setRegister_time(String register_time) {
        this.register_time = register_time;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
