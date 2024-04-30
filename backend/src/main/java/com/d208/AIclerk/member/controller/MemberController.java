package com.d208.AIclerk.member.controller;


import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.member.dto.responseDto.GetMemberResponse;
import com.d208.AIclerk.member.dto.responseDto.SignInResponseDTO;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.member.service.MemberService;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.jwt.RefreshToken;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
@Log4j2
@CrossOrigin("*")
@RestController
@RequestMapping("/api/oauth")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/token")
    @Operation(summary = "로그인", description = "로그인 시도 후 토큰을 발급합니다.")
    public ResponseEntity signin(@RequestParam("code") String code) {
        return memberService.signIn(code);
    }



    @GetMapping("/mypage/profile")
    @Operation(summary = "개인 정보 조회", description = "접속한 유저의 개인정보를 조회합니다.")
    public ResponseEntity<GetMemberResponse> userProfile() {
        return memberService.getProfile();
    }

    @PutMapping("mypage/profile/edit")
    @Operation(summary = "개인 정보 수정", description = "개인 정보를 편집합니다.")
    public ResponseEntity editProfile() {
        return null;
    }


}