package com.d208.AIclerk.member.service;

import com.d208.AIclerk.entity.Member;
import com.d208.AIclerk.member.dto.responseDto.GetMemberResponse;
import com.d208.AIclerk.member.dto.responseDto.GetMemberResponseDTO;
import com.d208.AIclerk.member.dto.responseDto.SignInResponseDTO;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.security.jwt.JWTUtil;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.jwt.RefreshToken;
import com.d208.AIclerk.security.oauth.KakaoProfile;
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

@Service
@RequiredArgsConstructor
public class MemberService {

    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository; //(1)
    private final RefreshTokenRepository refreshTokenRepository;


    @Value("${KAKAO_CLIENT_ID}")
    String ClientKey;

    @Value("${KAKAO_CLIENT_SECRET}")
    String SecretKey;

    private int accessTokenMinute = 60;
    private int refreshTokenMinute = 300;

    public OauthToken getAccessToken(String code) {

        //(2)
        RestTemplate rt = new RestTemplate();

        //(3)
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //(4)
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", ClientKey);
        params.add("redirect_uri", "http://localhost:5173/oauth/callback/kakao");
        params.add("code", code);
        params.add("client_secret", SecretKey);

        //(5)
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        //(6)
        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        //(7)
        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
            System.out.println(oauthToken);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return oauthToken; //(8)
    }


    //(1-1)
    public KakaoProfile findProfile(String token) {

        //(1-2)
        RestTemplate rt = new RestTemplate();

        //(1-3)
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token); //(1-4)
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //(1-5)
        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
                new HttpEntity<>(headers);

        //(1-6)
        // Http 요청 (POST 방식) 후, response 변수에 응답을 받음
        ResponseEntity<String> kakaoProfileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                String.class
        );

        //(1-7)
        ObjectMapper objectMapper = new ObjectMapper();
        KakaoProfile kakaoProfile = null;
        try {
            kakaoProfile = objectMapper.readValue(kakaoProfileResponse.getBody(), KakaoProfile.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return kakaoProfile;
    }


    public ResponseEntity<GetMemberResponse> getMember() {

        String userid = JWTUtil.findEmailByToken();
        Member member = memberRepository.findByEmail(userid);
        if (member == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }


        GetMemberResponseDTO getMemberResponseDTO = GetMemberResponseDTO.builder()
                .email(member.getEmail())
                .nickname(member.getNickname())
                .image(member.getImage())
                .build();

        GetMemberResponse response = GetMemberResponse.creategetMemberResponse(
                "Success",
                getMemberResponseDTO
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    public Map<String, String> saveUserAndGetTokens(String token) { //(1)
        KakaoProfile profile = findProfile(token);

        Member member = memberRepository.findByEmail(profile.getKakao_account().getEmail());
        if (member == null) {
            member = Member.builder()
                    .id(profile.getId())
                    .image(profile.getKakao_account().getProfile().getProfile_image_url())
                    .nickname(profile.getKakao_account().getProfile().getNickname())
                    .email(profile.getKakao_account().getEmail())
                    .build();

            memberRepository.save(member);
        }

        String accessToken = createAccessToken(member);
        String refreshToken = createRefreshToken(member);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens; //(2)
    }


    public String createAccessToken(Member member) {
        try {
            return jwtUtil.createToken(member.getEmail(), accessTokenMinute);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String createRefreshToken(Member member) {
        try {
            return jwtUtil.createToken(member.getEmail(), refreshTokenMinute);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Optional<Member> findByEmail(String email) {
        return Optional.ofNullable(memberRepository.findByEmail(email));
    }

    // Service
    public ResponseEntity signIn(String code) {
        // 인가 코드를 사용하여 OAuth 액세스 토큰을 검색
        String oauthAccessToken = getAccessToken(code).getAccess_token();

        // OAuth 정보를 기반으로 사용자 정보를 저장하고 토큰 가져오기
        Map<String, String> tokens = saveUserAndGetTokens(oauthAccessToken);
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");

        // 저장소에 리프레시 토큰을 저장
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
                .refreshToken(refreshToken)
                .build();

        // 적절한 HTTP 헤더와 함께 토큰 응답을 반환
        return ResponseEntity.ok().headers(headers).body(signInResponseDTO);
    }

}