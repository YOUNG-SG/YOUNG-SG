package com.d208.AIclerk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /**
         * 구독 클라이언트한테 전송
         * sub 이 채팅방 구독합니다!!
         * pub /pub/chat/123/SendMessage [ 이방에 메시지..합니다!]
         * */
<<<<<<< HEAD
        registry.enableSimpleBroker("/sub");
        registry.setApplicationDestinationPrefixes("/pub");
=======
        registry.enableSimpleBroker("/sub");  //수신임

         registry.setApplicationDestinationPrefixes("/pub"); //발신 어미사?임
>>>>>>> daf8e28886ad45ffc7b399ef22baeb238a46a07f
    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
<<<<<<< HEAD
        registry.addEndpoint("/wchat").setAllowedOrigins("*"); //실시간채팅
        registry.addEndpoint("/wstat").setAllowedOrigins("*"); // 방상태정보
        registry.addEndpoint("/wstt").setAllowedOrigins("*"); //STT ->Redis
        registry.addEndpoint("/wmotion").setAllowedOrigins("*"); //모션인식 관련정보
=======
        registry.addEndpoint("/ws").setAllowedOrigins("*");  //서버에 연결한 endpoint ws://localhost:8000/ws
>>>>>>> daf8e28886ad45ffc7b399ef22baeb238a46a07f

    }








}
