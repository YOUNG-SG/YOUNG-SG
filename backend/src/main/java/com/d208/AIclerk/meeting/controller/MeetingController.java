package com.d208.AIclerk.meeting.controller;

import com.d208.AIclerk.meeting.dto.requestDto.CreateCommentRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.CreateFolderRequestDto;
import com.d208.AIclerk.meeting.dto.requestDto.OpenAiRequestDto;
import com.d208.AIclerk.meeting.dto.response.*;
import com.d208.AIclerk.meeting.service.MeetingService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/api/meeting")
@Slf4j
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/send-text")
    @Operation(summary = "텍스트 요약", description = "텍스트 요약 후 db에 저장")
    public ResponseEntity<String> summaryText(@RequestBody OpenAiRequestDto dto) throws Exception {
        log.info("(MeetingController) 시작");
        return meetingService.summaryText(dto);
    }

    @PostMapping("/comment")
    @Operation(summary = "댓글 작성", description = "회의 상세에 댓글 작성")
    public ResponseEntity<CreateCommentResponse> createComment(@RequestBody CreateCommentRequestDto dto){
        return meetingService.createComment(dto);
    }

    @DeleteMapping("/comment/{commentId}")
    @Operation(summary = "책 코멘트 삭제", description = "책 코멘트 삭제")
    public ResponseEntity<CommentDeleteResponse> deleteComment(@PathVariable("commentId") Long commentId) {
        return meetingService.deleteComment(commentId);
    }

    @GetMapping("/comment/{detailId}")
    @Operation(summary = "댓글 리스트 조회", description = "댓글 리스트 조회 api")
    public ResponseEntity<ReadCommentResponse> readComment(@PathVariable("detailId") Long detailId) {
        return meetingService.readComment(detailId);
    }

    @GetMapping("/detail/{roomId}")
    @Operation(summary = "회의 상세 페이지", description = "회의 종료 후 생성되는 상세페이지")
    public ResponseEntity<MeetingDetailResponse> readMeetingDetail(@PathVariable("roomId") Long roomId){
        return meetingService.readMeetingDetail(roomId);
    }

    @PostMapping("/folder/create")
    @Operation(summary = "폴더 생성", description = "회의정보를 저장할 폴더 생성")
    public ResponseEntity<CreateFolderResponse> createFoler(@RequestBody CreateFolderRequestDto dto) {
        return meetingService.createFolder(dto);
    }

    @GetMapping("/folder-list")
    @Operation(summary = "폴더 목록 조회", description = "회의정보를 저장할 폴더 목록 조회 (개인별로 다름)")
    public ResponseEntity<FolderResponse> readFolderList(){
        return meetingService.readFolderList();
    }

    @GetMapping("hello")
    public ResponseEntity<String> checkhello(){
        return meetingService.checkhello();
    }
}
