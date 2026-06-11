package com.dignamente.br.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dignamente.br.api.dto.Login.LoginRequestDTO;
import com.dignamente.br.api.dto.Login.LoginResponseDTO;
import com.dignamente.br.api.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.authLogin(loginRequest);
        return ResponseEntity.ok(response);
    }
}