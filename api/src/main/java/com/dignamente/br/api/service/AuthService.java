package com.dignamente.br.api.service;

import com.dignamente.br.api.exceptions.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Login.LoginRequestDTO;
import com.dignamente.br.api.dto.Login.LoginResponseDTO;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.exceptions.IncorrectPasswordException;
import com.dignamente.br.api.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponseDTO authLogin(LoginRequestDTO loginRequest) {
            User user = userRepository.findByEmail(loginRequest.email()).
            orElseThrow(() -> 
            new EntityNotFoundException("Usuário não encontrado com o email "+ loginRequest.email()));

            if(!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
                throw new IncorrectPasswordException("Senha inválida, tente novamente");

            }

            String token = jwtService.generateToken(user);
            return new LoginResponseDTO(
                user.getId(),
                user.getTypeUser(),
                token
            );
            

    }
    
    
}
