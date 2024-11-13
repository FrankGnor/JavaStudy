package com.itheima.mapper;
import com.itheima.pojo.*;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface TutorialMapper {
    /**
     * ����tutorial_id��ɸѡ��tutorial��point������
     * @param tutorial_id
     * @return
     */
    @Select("SELECT * FROM knowledge WHERE id=#{tutorial_id}")
    @ResultMap("TutorialMap")
    Tutorial selectTutorial(int tutorial_id);

    /**
     * ģ������keyword
     * @return
     */
    @Select("SELECT id,level,point,parent_id FROM knowledge")
    @ResultMap("TutorialMap")
    List<Tutorial> selectcata();

    @Select("SELECT * FROM knowledge WHERE content LIKE CONCAT('%',#{keyword},'%') or point LIKE CONCAT('%',#{keyword},'%') LIMIT 1")
    @ResultMap("TutorialMap")
    Tutorial seach(String keyword);
}
