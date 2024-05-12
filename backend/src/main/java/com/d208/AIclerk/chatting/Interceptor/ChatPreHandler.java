package com.d208.AIclerk.chatting.Interceptor;

import com.d208.AIclerk.security.jwt.JWTUtil;
import com.d208.AIclerk.utill.CommonUtil;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Filter Chain에서 객체를 통과시키고 컨트롤러 가기전에  stomp Message 객체를 슬쩍갖고와서
 *  jwt유효성검사하고 내맘대로 주문하고 리턴시키는 클래스
 */

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ChatPreHandler implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final CommonUtil commonUtil;

    long memberId;
    @Override
    public Message<?> preSend(org.springframework.messaging.Message<?> message, MessageChannel channel) {
        try {
            StompHeaderAccessor headerAccessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

            String authorizationHeader = String.valueOf(headerAccessor.getNativeHeader("Authorization"));

            StompCommand command = headerAccessor.getCommand();


            if(command.equals(StompCommand.UNSUBSCRIBE) || command.equals(StompCommand.MESSAGE) ||
                    command.equals(StompCommand.CONNECTED) || command.equals(StompCommand.SEND)) {
                return message;
            } else if (command.equals(StompCommand.ERROR)) {
                throw new MessageDeliveryException("error");
            }


            if (authorizationHeader == null) {
                log.info("chat header가 없는 요청입니다.");
                throw new MalformedJwtException("jwt");
            }

            //token 분리
            String token = "";
            String authorizationHeaderStr = authorizationHeader.replace("[","").replace("]","");
            if (authorizationHeaderStr.startsWith("Bearer ")) {
                token = authorizationHeaderStr.replace("Bearer ", "");
            } else {
                log.error("Authorization 헤더 형식이 틀립니다. : {}", authorizationHeader);
                throw new MalformedJwtException("jwt");
            }

            //유저아이디
            try {
                memberId = commonUtil.getMember().getId();
            } catch (Exception e) {
                throw new RuntimeException("아디 존재안함", e);
            }

            //토큰이상
            boolean isTokenValid = jwtUtil.isTokenExpired(token);

            if (isTokenValid) {
                this.setAuthentication(message, headerAccessor);
            }
        }
         catch (MessageDeliveryException e) {
            log.error("메시지 에러");
            throw new MessageDeliveryException("error");
        }
        return message;
    }



    /**
     *  STOMP 메시지와 관련된 인증 정보를 설정
     *  현재 스레드(현재 요청을 처리하는 스레드)의 인증 정보를 저장
     *  AIclerk에선 멤버아이디, 비번 (없슴) , 멤버롤( 업슴)
     */

    private void setAuthentication(Message message, StompHeaderAccessor headerAccessor) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(memberId,
                null);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        headerAccessor.setUser(authentication);
    }
}