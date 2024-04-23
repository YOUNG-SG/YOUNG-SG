package com.d208.AIclerk.chatting.service;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessagingService {
    private final AmqpAdmin amqpAdmin;
    private final DirectExchange exchange;

    @Autowired
    public MessagingService(AmqpAdmin amqpAdmin, DirectExchange exchange) {
        this.amqpAdmin = amqpAdmin;
        this.exchange = exchange;
    }

    public void configureQueueForRoom(String roomId) {
        Queue queue = new Queue(roomId, true);
        amqpAdmin.declareQueue(queue);
        Binding binding = BindingBuilder.bind(queue).to(exchange).with(roomId);
        amqpAdmin.declareBinding(binding);
    }
}
