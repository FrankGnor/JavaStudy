package com.javastudy.pojo;

/**
 * Tutorial catalog node/content model.
 */
public class Tutorial {
    private int tutorial_id = 0;
    private int parent_id = 0;
    private String point = "";
    private String content = "";
    // 1: catalog, 2: article
    private int level = 0;

    public int getTutorial_id() {
        return tutorial_id;
    }

    public int getTutorialId() {
        return tutorial_id;
    }

    public void setTutorial_id(int tutorial_id) {
        this.tutorial_id = tutorial_id;
    }

    public void setTutorialId(int tutorialId) {
        this.tutorial_id = tutorialId;
    }

    public int getParent_id() {
        return parent_id;
    }

    public int getParentId() {
        return parent_id;
    }

    public void setParent_id(int parent_id) {
        this.parent_id = parent_id;
    }

    public void setParentId(int parentId) {
        this.parent_id = parentId;
    }

    public String getPoint() {
        return point;
    }

    public void setPoint(String point) {
        this.point = point;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
