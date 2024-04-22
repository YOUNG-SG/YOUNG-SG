package com.d208.AIclerk.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.springframework.amqp.core.ExchangeBuilder.directExchange;

@Configuration
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.host}")
    private String rabbitmqHost;

    @Value("${spring.rabbitmq.port}")
    private int rabbitmqPort;

    @Value("${spring.rabbitmq.username}")
    private String rabbitmqUsername;

    @Value("${spring.rabbitmq.password}")
    private String rabbitmqPassword;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Autowired
    private AmqpAdmin amqpAdmin;

    /**
     * DirectExchange 빈을 생성
     *
     * @return DirectExchange 객체
     */
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(exchangeName);
    }
    /**
     * RabbitMQ 연결을 위한 ConnectionFactory 빈을 생성
     */
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory(rabbitmqHost, rabbitmqPort);
        connectionFactory.setUsername(rabbitmqUsername);
        connectionFactory.setPassword(rabbitmqPassword);
        return connectionFactory;
    }

    /**
     * RabbitTemplate을 생성하여 반환
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jackson2JsonMessageConverter());
        return rabbitTemplate;
    }

    /**
     * 메시지를 JSON 형식으로 변환하는 MessageConverter 빈을 생성
     */
    @Bean
    public MessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * 주어진 방 이름으로 Queue와 Binding을 동적으로 생성
     */
    public void configureQueueForRoom(String roomId) {
        Queue queue = new Queue(roomId, true);  // Create a durable queue with the room ID as the queue name
        amqpAdmin.declareQueue(queue);  // Declare the queue in RabbitMQ

        Binding binding = BindingBuilder.bind(queue).to(exchange()).with(roomId);
        amqpAdmin.declareBinding(binding);  // Declare the binding in RabbitMQ
    }

}
