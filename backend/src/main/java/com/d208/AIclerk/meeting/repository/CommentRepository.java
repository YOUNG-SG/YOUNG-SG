package com.d208.AIclerk.meeting.repository;


import com.d208.AIclerk.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Optional<Comment> findByIdAndMemberId(Long id, Long member_id);

    List<Comment> findAllByMeetingDetail_Id(Long detailId);

}
