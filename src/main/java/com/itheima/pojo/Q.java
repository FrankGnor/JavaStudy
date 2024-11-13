package com.itheima.pojo;

public class Q {
    protected Integer qNo=0;
    protected Integer topic=0;
    protected String qTitle = "";
    protected String answer = "";


    protected Integer qtype = 0;
    protected String point = "";
    protected String detail = "";


    public String getPoint() {
        return point;
    }

    public void setPoint(String point) {
        this.point = point;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Integer getqNo() {
        return qNo;
    }

    public void setqNo(Integer qNo) {
        this.qNo = qNo;
    }

    public Integer getTopic() {
        return topic;
    }

    public void setTopic(Integer topic) {
        this.topic = topic;
    }

    public String getqTitle() {
        return qTitle;
    }

    public void setqTitle(String qTitle) {
        this.qTitle = qTitle;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Integer getQtype() {
        return qtype;
    }

    public void setQtype(Integer qtype) {
        this.qtype = qtype;
    }


}
