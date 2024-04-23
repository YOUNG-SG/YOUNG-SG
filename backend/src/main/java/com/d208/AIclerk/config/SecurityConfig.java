package com.d208.AIclerk.config;

<<<<<<< HEAD
<<<<<<< HEAD
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                );
        // 나머지 필요한 보안 설정들...

        return http.build();
=======
=======
>>>>>>> 916214828916ac98687b79acbc3a9cf80e681fe9
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(Authorize ->
                Authorize.requestMatchers("/**").
                        permitAll().anyRequest().authenticated());

        return httpSecurity.build();
<<<<<<< HEAD
>>>>>>> 916214828916ac98687b79acbc3a9cf80e681fe9
=======
>>>>>>> 916214828916ac98687b79acbc3a9cf80e681fe9
    }
}
