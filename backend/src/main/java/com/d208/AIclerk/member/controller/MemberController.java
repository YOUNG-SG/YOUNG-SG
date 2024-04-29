package com.d208.AIclerk.member.controller;


import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.member.dto.responseDto.GetMemberResponse;
import com.d208.AIclerk.member.dto.responseDto.SignInResponseDTO;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.member.service.MemberService;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.jwt.RefreshToken;
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
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/oauth/token")
    public ResponseEntity signin(@RequestParam("code") String code) {
        return memberService.signIn(code);
    }

    @GetMapping("/mypage/profile")
    public ResponseEntity<GetMemberResponse> userProfile() {
        return memberService.getMember();
    }
}