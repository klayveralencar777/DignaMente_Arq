package com.dignamente.br.api.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.service.RegistrationApprovalService;

@RestController
@RequestMapping("/registration")
public class RegistrationApprovedController {

    private RegistrationApprovalService service;

    @PatchMapping("/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approve(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        service.approve(id, user);
        return ResponseEntity.ok().build();
}

    
}
