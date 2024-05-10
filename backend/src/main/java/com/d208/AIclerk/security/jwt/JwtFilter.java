package com.d208.AIclerk.security.jwt;

import com.d208.AIclerk.member.dto.MemberDTO;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Log4j2
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JwtFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // 웹소켓 연결 경로 추가
        if (path.startsWith("/ws/")) {
            return true;
        }

        // 기존 제외 경로
        if (request.getMethod().equals("OPTIONS") ||
                path.startsWith("/api/oauth/token") ||
                path.startsWith("/swagger-ui/") ||
                path.startsWith("/v3/api-docs")) {
            return true;
        }

        return false;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException {


        String authHeaderStr = request.getHeader("Authorization");
        if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
            // 적절하지 않은 Authorization 헤더일 경우 401 에러 반환
            UnauthorizedError(response);
            return;
        }

        // Bearer // 7 Jwt 문자열
        try {
            String accessToken;

            accessToken = authHeaderStr.substring(7);

            Map<String, Object> claims = JWTUtil.validateToken(accessToken);

            String username = (String) claims.get("iss");

            Object roleNamesObj = claims.get("roleNames");
            List<String> roleNames = new ArrayList<>();

            if (roleNamesObj instanceof List<?>) {
                for (Object item : (List<?>) roleNamesObj) {
                    if (item instanceof Map<?, ?> authMap) {
                        Object authority = authMap.get("authority");
                        if (authority instanceof String) {
                            roleNames.add((String) authority);
                        }
                    }
                }
            }

            MemberDTO memberDTO = new MemberDTO(username, "", roleNames);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(memberDTO, null, memberDTO.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            chain.doFilter(request, response);
        } catch (Exception e) {
            log.error("An error occurred during sign-in process", e);

            Gson gson = new Gson();
            String msg = gson.toJson(Collections.singletonMap("message", "Fail"));

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }

    }
    private void UnauthorizedError(HttpServletResponse response) throws IOException {
        Gson gson = new Gson();
        String msg = gson.toJson(Collections.singletonMap("message", "Fail"));

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(msg);
        printWriter.close();
    }
}