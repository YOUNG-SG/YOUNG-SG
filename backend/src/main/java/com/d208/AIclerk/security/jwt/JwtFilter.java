package com.d208.AIclerk.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JwtFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String jwtHeader = request.getHeader("Authorization");

        String email = null;
        String jwtToken = null;

        if (jwtHeader != null && jwtHeader.startsWith("Bearer ")) {
            jwtToken = jwtHeader.substring(7);
            logger.info(jwtToken);
            try {
                Map<String, Object> claims = JWTUtil.validateToken(jwtToken);
                email = (String) claims.get("iss");
            } catch (Exception e) {
                logger.error("JWT 토큰을 가져오지 못하였거나 토큰이 만료되었습니다");
                request.setAttribute("exception", e.getMessage());
            }
        }

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                    email, null, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);


        chain.doFilter(request, response);
    }
    
    
    // swagger 로그인 왜 안됨
}