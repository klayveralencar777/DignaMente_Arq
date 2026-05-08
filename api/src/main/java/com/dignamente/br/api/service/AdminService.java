package com.dignamente.br.api.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.dignamente.br.api.dto.Admin.AdminRequestDTO;

import com.dignamente.br.api.entities.Admin;
import com.dignamente.br.api.entities.User;
import com.dignamente.br.api.enums.TypeUser;

import com.dignamente.br.api.mapper.AdminMapper;
import com.dignamente.br.api.repository.AdminRepository;


@Service
public class AdminService {


    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserValidationService userValidationService;


    public void createAdmin(AdminRequestDTO dto, User loggedUser) {
        
        userValidationService.validateCpf(dto.cpf());
        userValidationService.validateEmail(dto.email());
    
        String hashPassword = passwordEncoder.encode(dto.password());

        Admin admin = adminMapper.toEntity(dto);
        admin.setTypeUser(TypeUser.ADMIN);
        admin.setPassword(hashPassword);
        adminRepository.save(admin);

    }

    


}
