package com.dignamente.br.api.config.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.dto.Login.LoginRequestDTO;
import com.dignamente.br.api.dto.Login.LoginResponseDTO;
import com.dignamente.br.api.dto.User.ForgotPasswordRequestDTO;
import com.dignamente.br.api.dto.User.ResetPasswordRequestDTO;
import com.dignamente.br.api.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authLogin(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.authLogin(loginRequest);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDTO dto) {
        String response = authService.resetPassword(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequestDTO dto) {
        authService.forgotPassword(dto);
        return ResponseEntity.ok().build();
    }

}
