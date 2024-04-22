package com.d208.AIclerk;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

@Component
public class MessageListener {

    @Autowired
    private SimpMessagingTemplate template;

    @RabbitListener(queues = "#{queueName}")
    public void receiveMessage(String message) {
        template.convertAndSend("/topic/messages", message);
    }
}

