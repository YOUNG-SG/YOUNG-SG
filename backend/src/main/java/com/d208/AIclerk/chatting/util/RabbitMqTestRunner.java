package com.d208.AIclerk.chatting.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Component
public class RabbitMqTestRunner implements CommandLineRunner {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Sending a test message...");
        rabbitTemplate.convertAndSend("myDirectExchange", "asdvasdvsv", "Hello, RabbitMQ!");
        System.out.println("test ENd");
    }
}
