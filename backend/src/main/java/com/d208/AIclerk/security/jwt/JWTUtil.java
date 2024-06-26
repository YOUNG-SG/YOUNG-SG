package com.d208.AIclerk.security.jwt;


import com.d208.AIclerk.member.repository.MemberRepository;
import com.d208.AIclerk.security.exception.CustomJWTException;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Log4j2
@Service
@RequiredArgsConstructor
public class JWTUtil {

    private final MemberRepository memberRepository;

    private static final String SECRET_KEY = "abcd123aaaaaaaaaaaaaaaaaaaazvxvcvzxvxzczxvcxvzxcvcvzxvzxcvzxcv" ;
    private static final SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());

    public static String createToken(String email, int minute){
        System.out.println(email);
        return Jwts.builder()
                .signWith(key)
                .issuer(email)
                .expiration(Date.from(ZonedDateTime.now().plusMinutes(minute).toInstant()))
                .subject("USER")
                .compact();
    }

    // 토큰에서 클레임 추출
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰이 만료되었는지 확인
    public boolean isTokenExpired(String token) {
        final Date expiration = extractClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public static Map<String, Object> validateToken(String token) {

        Map<String, Object> claim = null;

        try{
            claim = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token) // 파싱 및 검증, 실패 시 에러
                    .getPayload();
        } catch (MalformedJwtException malformedJwtException) {
            throw new CustomJWTException("MALFORMED_TOKEN");
        } catch (ExpiredJwtException expiredJwtException) {
            throw new CustomJWTException("TOKEN_EXPIRED");
        } catch (InvalidClaimException invalidClaimException) {
            throw new CustomJWTException("INVALID_TOKEN");
        } catch (JwtException jwtException) {
            throw new CustomJWTException("JWT_TOKEN_ERROR");
        }
        return claim;
    }
}