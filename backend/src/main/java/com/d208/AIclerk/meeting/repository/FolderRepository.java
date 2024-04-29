package com.d208.AIclerk.meeting.repository;

import com.d208.AIclerk.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findAllByMemberId(Long memberId);

}
