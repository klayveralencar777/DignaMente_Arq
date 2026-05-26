package com.dignamente.br.api.service;

import com.dignamente.br.api.exceptions.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Email.EmailNotificationEvent;
import com.dignamente.br.api.dto.Login.LoginRequestDTO;
import com.dignamente.br.api.dto.Login.LoginResponseDTO;
import com.dignamente.br.api.dto.User.ForgotPasswordRequestDTO;
import com.dignamente.br.api.dto.User.ResetPasswordRequestDTO;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.exceptions.IncorrectPasswordException;
import com.dignamente.br.api.notifications.publisher.NotificationPublisher;
import com.dignamente.br.api.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private NotificationPublisher notificationPublisher;

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

    public void forgotPassword(ForgotPasswordRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email()).
                    orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
        String token = UUID.randomUUID().toString();

        user.setResetPasswordToken(token);
        user.setResetPasswordExpiresAt(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);


          String link =
                "http://localhost:3000/reset-password?token="
                        + token;

        notificationPublisher.sendEmail(
            new EmailNotificationEvent(
                user.getEmail(),
                "Redefinição de senha",
                "Clique no link: " + link 
            )
        );


    }

    public String resetPassword(ResetPasswordRequestDTO dto) {
        User user = userRepository.findByResetPasswordToken(dto.token()).orElseThrow();

        user.setPassword(passwordEncoder.encode(dto.newPassword()));

        user.setResetPasswordToken(null);

        userRepository.save(user);
        
        return "Senha redefinda com sucesso!";
        
    }

    
}
