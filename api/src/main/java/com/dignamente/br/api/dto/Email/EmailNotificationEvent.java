package com.dignamente.br.api.dto.Email;

public record EmailNotificationEvent(
    String to,
    String subject,
    String body
) {
    
}
