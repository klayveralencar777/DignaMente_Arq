package com.dignamente.br.api.service;

import org.springframework.stereotype.Service;

import com.dignamente.br.api.entities.Appointment;

@Service
public class GoogleMeetService {

    // Mantemos o nome da classe e do método para não quebrar o AppointmentService,
    // mas agora ele gera uma sala de videoconferência real e automática via Jitsi Meet!

    public GoogleMeetEvent createMeet(Appointment appointment) {
        
        // 1. Criamos um nome único e seguro para a sala baseado no ID exclusivo da consulta
        // Exemplo: DignaMente-Consulta-550e8400-e29b-41d4-a716-446655440000
        String roomName = "DignaMente-Consulta-" + appointment.getId().toString();
        
        // 2. O Jitsi Meet cria a sala de vídeo real instantaneamente assim que este link é acessado.
        // Não precisa de credenciais, JSON, OAuth ou chaves de API.
        String meetingLink = "https://meet.ffmuc.net/" + roomName;
        
        System.out.println("✅ Sala de videoconferência gerada com sucesso: " + meetingLink);
        
        // 3. Retornamos o nome da sala como ID e o link real gerado
        return new GoogleMeetEvent(roomName, meetingLink);
    }

    public record GoogleMeetEvent(String eventId, String meetingLink) {
    }
}