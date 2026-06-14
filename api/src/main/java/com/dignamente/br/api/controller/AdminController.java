package com.dignamente.br.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.dto.Admin.AdminRequestDTO;
import com.dignamente.br.api.dto.Admin.AdminResponseDTO;

import com.dignamente.br.api.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admins")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("")
    public ResponseEntity<List<AdminResponseDTO>> findAdmins() {
        return ResponseEntity.ok(adminService.findAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> findAdminById(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.findAdminById(id));
    }

    @PostMapping("")
    public ResponseEntity<Void> createAdmin(@Valid @RequestBody AdminRequestDTO dto) {
        adminService.createAdmin(dto);
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(@PathVariable UUID id,
            @Valid @RequestBody AdminRequestDTO dto) {
        return ResponseEntity.ok(adminService.updateAdmin(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable UUID id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

}
