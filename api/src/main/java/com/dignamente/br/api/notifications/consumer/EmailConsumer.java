package com.dignamente.br.api.notifications.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.dignamente.br.api.config.RabbitMQConfig;
import com.dignamente.br.api.dto.Email.EmailNotificationEvent;
import com.dignamente.br.api.notifications.services.EmailService;

@Component
public class EmailConsumer {

    @Autowired
    private EmailService emailService;

     @RabbitListener(
            queues = RabbitMQConfig.EMAIL_QUEUE
    )
    public void receive(EmailNotificationEvent event) {

        emailService.send(
                event.to(),
                event.subject(),
                event.body()
        );

        System.out.println(
                "Email enviado para: "
                        + event.to()
        );
    }

    
}
