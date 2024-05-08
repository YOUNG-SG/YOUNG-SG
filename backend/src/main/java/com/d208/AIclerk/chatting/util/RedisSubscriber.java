package com.d208.AIclerk.chatting.util;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisSubscriber implements MessageListener {
    private final SimpMessagingTemplate messagingTemplate;


    /**
     * Redis로부터 메시지를 받고, 이를 WebSocket을 통해 연결된 클라이언트에 전달g하는기능들
     * */

    public RedisSubscriber(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * 메세지를 받을떄 실행되는 콜백같은 느낌의 함수임 비동기함수
     *
     * channel: chatroom
     * */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        String messageContent = new String(message.getBody());
       System.out.println("메시지받기 내용: " + messageContent); //에러를 잡으십쇼

        String[] messageParts = messageContent.split(":");
        if (messageParts.length == 2) {
            String roomId = messageParts[0];
            String notification = messageParts[1];

            messagingTemplate.convertAndSend("/sub/chat/" + roomId, notification); // /sub/chat/{roomId} 에다가다 뿌려줌
            System.out.println( roomId + "..." + notification);  // 로그 추가
        }
    }

}

