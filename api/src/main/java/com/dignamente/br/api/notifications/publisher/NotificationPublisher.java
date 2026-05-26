package com.dignamente.br.api.notifications.publisher;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.dignamente.br.api.config.RabbitMQConfig;
import com.dignamente.br.api.dto.Email.EmailNotificationEvent;

@Component
public class NotificationPublisher {


    @Autowired
    private  RabbitTemplate rabbitTemplate;


    public void sendEmail(
            EmailNotificationEvent event
    ) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                event
        );
    }

    
}
