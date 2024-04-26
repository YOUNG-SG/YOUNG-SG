package com.d208.AIclerk.member.controller;


import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.member.dto.responseDto.SignInResponseDTO;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.member.service.MemberService;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.jwt.RefreshToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final RefreshTokenRepository refreshTokenRepository;
    @GetMapping("/oauth/token")
    ResponseEntity signin(@RequestParam("code") String code) {
        // 인가 코드를 사용하여 OAuth 액세스 토큰을 검색
        String oauthAccessToken = memberService.getAccessToken(code).getAccess_token();

        // OAuth 정보를 기반으로 사용자 정보를 저장하고 토큰을 가져옵니다
        Map<String, String> tokens = memberService.saveUserAndGetTokens(oauthAccessToken);
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");

        // 저장소에 새로 고침 토큰을 저장
        refreshTokenRepository.save(RefreshToken.builder()
                .email(tokens.get("userEmail")) // 이메일도 토큰 맵에서 추출
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build());

        // JWT를 표준 Authorization 헤더에 포함시켜 응답 헤더를 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + accessToken);

        // 액세스 토큰과 새로 고침 토큰을 포함한 응답 객체 생성
        SignInResponseDTO signInResponseDTO = SignInResponseDTO.builder()
                .accessToken(accessToken)
                .build();

        // 적절한 HTTP 헤더와 함께 토큰 응답을 반환
        return ResponseEntity.ok().headers(headers).body(signInResponseDTO);
    }


    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();  // 사용자의 이메일을 식별자로 사용
            Optional<Member> member = memberService.findByEmail(email);

            if (member.isPresent()) {
                return ResponseEntity.ok().body(member.get());
            } else {
                return ResponseEntity.badRequest().body("User not found");
            }
        } else {
            return ResponseEntity.badRequest().body("No user logged in");
        }
    }

}