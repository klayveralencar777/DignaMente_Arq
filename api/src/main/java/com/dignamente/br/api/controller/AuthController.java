package com.dignamente.br.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dignamente.br.api.dto.Login.LoginRequestDTO;
import com.dignamente.br.api.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> authLogin(@RequestBody LoginRequestDTO loginRequest) {
        String token = authService.authLogin(loginRequest);
        return ResponseEntity.ok(token);

    }
 
}
