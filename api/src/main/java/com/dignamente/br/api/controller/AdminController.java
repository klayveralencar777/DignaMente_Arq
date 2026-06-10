package com.dignamente.br.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.dto.Admin.AdminRequestDTO;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.service.AdminService;

@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<Void> createAdmin(@RequestBody AdminRequestDTO dto,
            @AuthenticationPrincipal User loggedUser) {
        adminService.createAdmin(dto, loggedUser);
        return ResponseEntity.status(201).build();
    }

    
   


}