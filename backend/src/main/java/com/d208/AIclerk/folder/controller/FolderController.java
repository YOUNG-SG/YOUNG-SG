package com.d208.AIclerk.folder.controller;


import com.d208.AIclerk.chatting.dto.requestDto.MessageDto;
import com.d208.AIclerk.folder.dto.RequestDto.FolderSelectRequestDto;
import com.d208.AIclerk.folder.dto.ResponseDto.FolderListResponseDTO;
import com.d208.AIclerk.folder.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {


    private final FolderService folderService;

    @Autowired
    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }




    @GetMapping("/api/meeting/folder/list")
    public void folderList(@DestinationVariable String roomId, FolderListResponseDTO folder) {
        // 메시지를 해당 방의 모든 구독자에게 브로드캐스트

    }

    @PostMapping("/api/meeting/folder/create")
    public void foldercreate(@DestinationVariable String roomId, MessageDto message) {
        // 메시지를 해당 방의 모든 구독자에게 브로드캐스트

    }
    @PostMapping("/api/meeting/folder/{folderId}")
    public void folderselect(@DestinationVariable String roomId, FolderSelectRequestDto folder) {

    }





}
