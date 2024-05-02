package com.d208.AIclerk.member.service;

import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.member.dto.requestDto.EditMemberRequestDto;
import com.d208.AIclerk.member.dto.responseDto.EditMemberResponseDto;
import com.d208.AIclerk.member.dto.responseDto.GetMemberResponse;
import com.d208.AIclerk.member.dto.responseDto.GetMemberResponseDTO;
import com.d208.AIclerk.member.dto.responseDto.SignInResponseDTO;
import com.d208.AIclerk.member.exception.MemberNotFoundException;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.security.jwt.JWTUtil;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.jwt.RefreshToken;
import com.d208.AIclerk.security.oauth.KakaoProfile;
import com.d208.AIclerk.utill.CommonUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

public interface MemberService {
    OauthToken getAccessToken(String code);
    KakaoProfile findProfile(String token);
    ResponseEntity<GetMemberResponse> getProfile();
    Map<String, String> saveUserAndGetTokens(String token);
    String createAccessToken(Member member);
    String createRefreshToken(Member member);
    ResponseEntity signIn(String code);

    ResponseEntity<EditMemberResponseDto> editProfile(EditMemberRequestDto dto);
}