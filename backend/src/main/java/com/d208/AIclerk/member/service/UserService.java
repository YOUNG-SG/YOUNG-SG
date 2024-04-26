package com.d208.AIclerk.member.service;

import com.d208.AIclerk.entity.User;
import com.d208.AIclerk.member.repository.RefreshTokenRepository;
import com.d208.AIclerk.member.repository.UserRepository;
import com.d208.AIclerk.security.jwt.JWTUtil;
import com.d208.AIclerk.security.oauth.KakaoProfile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository; //(1)
    private final RefreshTokenRepository refreshTokenRepository;


    @Value("${KAKAO_CLIENT_ID}")
    String ClientKey;

    @Value("${KAKAO_CLIENT_SECRET}")
    String SecretKey;

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
        params.add("redirect_uri", "https://localhost:5173/oauth/callback/kakao");
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


    public User saveUser(String token) {

        //(1)
        KakaoProfile profile = findProfile(token);
        if (profile == null || profile.getKakao_account() == null) {
            throw new IllegalStateException("Failed to fetch user profile from Kakao.");
        }

        //(2)
        User user = userRepository.findByEmail(profile.getKakao_account().getEmail());

        //(3)
        if(user == null) {
            user = User.builder()
                    .id(profile.getId())
                    //(4)
                    .image(profile.getKakao_account().getProfile().getProfile_image_url())
                    .nickname(profile.getKakao_account().getProfile().getNickname())
                    .email(profile.getKakao_account().getEmail())
                    //(5)
                    .build();

            userRepository.save(user);
        }

        return user;
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



    public Map<String, String> saveUserAndGetTokens(String token) { //(1)
        KakaoProfile profile = findProfile(token);

        User user = userRepository.findByEmail(profile.getKakao_account().getEmail());
        if(user == null) {
            user = User.builder()
                    .id(profile.getId())
                    .image(profile.getKakao_account().getProfile().getProfile_image_url())
                    .nickname(profile.getKakao_account().getProfile().getNickname())
                    .email(profile.getKakao_account().getEmail())
                    .build();

            userRepository.save(user);
        }

        String accessToken = createAccessToken(user);
        String refreshToken = createRefreshToken(user);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens; //(2)
    }


    public String createAccessToken(User user) {
        int accessTokenValidityMinutes = 60; // 액세스 토큰의 유효기간을 60분으로 설정
        try {
            return jwtUtil.createToken(user.getEmail(), accessTokenValidityMinutes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String createRefreshToken(User user) {
        int refreshTokenValidityMinutes = 1440 * 7; // 리프레시 토큰의 유효기간을 7일로 설정
        try {
            return jwtUtil.createToken(user.getEmail(), refreshTokenValidityMinutes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Optional<User> getUser(HttpServletRequest request) { //(1)
        Long userCode = (Long) request.getAttribute("userCode");
        Optional<User> user = userRepository.findById(userCode);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userRepository.findByEmail(email));
    }
}
