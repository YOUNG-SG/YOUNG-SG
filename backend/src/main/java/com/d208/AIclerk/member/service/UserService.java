package com.d208.AIclerk.member.service;

import com.auth0.jwt.algorithms.Algorithm;
import com.d208.AIclerk.entity.User;
import com.d208.AIclerk.member.repository.UserRepository;
import com.d208.AIclerk.security.jwt.JwtProperties;
import com.d208.AIclerk.security.oauth.KakaoProfile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository; //(1)

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
        params.add("redirect_uri", "https://localhost:8080/oauth/callback/kakao");
        params.add("code", code);
        params.add("client_secret", SecretKey); // 생략 가능!

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



    public String saveUserAndGetToken(String token) { //(1)
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

        return createToken(user); //(2)
    }

    public String createToken(User user) {
        try {
            String jwtToken = com.auth0.jwt.JWT.create()
                    .withSubject(user.getEmail())
                    .withExpiresAt(new Date(System.currentTimeMillis() + JwtProperties.EXPIRATION_TIME))
                    .withClaim("id", user.getId())
                    .withClaim("nickname", user.getNickname())
                    .sign(Algorithm.HMAC512(JwtProperties.SECRET));

            System.out.println("Generated JWT: " + jwtToken); // 로그 출력
            return jwtToken;
        } catch (Exception e) {
            e.printStackTrace();
            return null; // 예외 발생 시 null 반환 또는 적절한 예외 처리
        }
    }

    public Optional<User> getUser(HttpServletRequest request) { //(1)
        //(2)
        Long userCode = (Long) request.getAttribute("userCode");

        //(3)
        Optional<User> user = userRepository.findById(userCode);

        //(4)
        return user;
    }

}
