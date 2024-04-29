package com.d208.AIclerk.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value = "refresh_token", timeToLive = 60 * 5)
public class RefreshToken {

    @Id
    String refreshToken;

    String accessToken;

    String email;

}


