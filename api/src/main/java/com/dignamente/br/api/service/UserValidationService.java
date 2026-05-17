package com.dignamente.br.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.exceptions.CPFAlreadyExistsException;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.repository.UserRepository;

@Service
public class UserValidationService {

    @Autowired
    private UserRepository userRepository;


    public void validateEmail(String email) {
        if(userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email já cadastrado");

        }
    }

    public void validateCpf(String cpf) {
        if(userRepository.existsByCpf(cpf)) {
            throw new CPFAlreadyExistsException("CPF já cadastrado, tente outro");        
        }
    }


    
}
