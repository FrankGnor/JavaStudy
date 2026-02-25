package com.javastudy.pojo;

/**
 * Payload used when saving exam answers and paper records.
 */
public class QforInsert extends Question {
    private int paper_id = 0;
    private String myAnswer = "";
    private String myStatus = "";
    private String time = "";
    private String usedTime = "";
    private String username = "";
    private String correct_user = "";
    private int right_rate = 0;

    public int getRight_rate() {
        return right_rate;
    }

    public int getRightRate() {
        return right_rate;
    }

    public void setRight_rate(int right_rate) {
        this.right_rate = right_rate;
    }

    public void setRightRate(int rightRate) {
        this.right_rate = rightRate;
    }

    public String getCorrect_user() {
        return correct_user;
    }

    public String getCorrectUser() {
        return correct_user;
    }

    public void setCorrect_user(String correct_user) {
        this.correct_user = correct_user;
    }

    public void setCorrectUser(String correctUser) {
        this.correct_user = correctUser;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getPaper_id() {
        return paper_id;
    }

    public int getPaperId() {
        return paper_id;
    }

    public void setPaper_id(int paper_id) {
        this.paper_id = paper_id;
    }

    public void setPaperId(int paperId) {
        this.paper_id = paperId;
    }

    public String getMyAnswer() {
        return myAnswer;
    }

    public void setMyAnswer(String myAnswer) {
        this.myAnswer = myAnswer;
    }

    public String getMyStatus() {
        return myStatus;
    }

    public void setMyStatus(String myStatus) {
        this.myStatus = myStatus;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getUsedTime() {
        return usedTime;
    }

    public void setUsedTime(String usedTime) {
        this.usedTime = usedTime;
    }
}
