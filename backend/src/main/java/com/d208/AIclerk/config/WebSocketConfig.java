package com.d208.AIclerk.config;

import com.d208.AIclerk.chatting.Interceptor.ChatErrorHandler;
import com.d208.AIclerk.chatting.Interceptor.ChatPreHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {




    private final ChatPreHandler chatPreHandler;
    private final ChatErrorHandler chatErrorHandler;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /**
         * 구독 클라이언트한테 전송
         * sub 이 채팅방 구독합니다!!
             * pub /pub/chat/123/SendMessage [ 이방에 메시지..합니다!]
         * */
        registry.enableSimpleBroker("/sub","/topic");  //수신임

         registry.setApplicationDestinationPrefixes("/pub"); //발신 어미사?임
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // 모든 도메인의 WebSocket 연결 허용
                .withSockJS();  // SockJS 클라이언트를 지원
//        registry.setErrorHandler(chatErrorHandler); 프론트가 혹시 로그찍어보고싶으면 주기!
    }


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(chatPreHandler);
    }





}
