package com.d208.AIclerk.chatting.Interceptor;


import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;


import java.nio.charset.StandardCharsets;

@Component
public class ChatErrorHandler extends StompSubProtocolErrorHandler {

    public ChatErrorHandler() {
        super();
    }

    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        if(ex.getCause().getMessage().equals("jwt")) {
            return jwtException(clientMessage, ex);
        }

        if(ex.getCause().getMessage().equals("error")) {
            return messageException(clientMessage, ex);
        }

        return super.handleClientMessageProcessingError(clientMessage, ex);
    }

    //메시지 예외
    private Message<byte[]> messageException(Message<byte[]> clientMessage, Throwable ex) {
        return errorMessage("메시지가없다 ;");
    }

    //jwt 예외
    private Message<byte[]> jwtException(Message<byte[]> clientMessage, Throwable ex) {
        return errorMessage("토큰이 인벨리드하다");
    }

    //메시지 생성
    private Message<byte[]> errorMessage(String errorCode) {
        String code = String.valueOf(errorCode);

        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);

        accessor.setMessage(String.valueOf(errorCode));
        accessor.setLeaveMutable(true);

        return MessageBuilder.createMessage(code.getBytes(StandardCharsets.UTF_8), accessor.getMessageHeaders());
    }
}