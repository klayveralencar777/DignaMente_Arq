package com.dignamente.br.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dignamente.br.api.dto.Admin.AdminRequestDTO;
import com.dignamente.br.api.dto.Admin.AdminResponseDTO;
import com.dignamente.br.api.entities.Admin;
import com.dignamente.br.api.enums.TypeUser;
import com.dignamente.br.api.exceptions.CPFAlreadyExistsException;
import com.dignamente.br.api.exceptions.EmailAlreadyExistsException;
import com.dignamente.br.api.exceptions.EntityNotFoundException;
import com.dignamente.br.api.mapper.AdminMapper;
import com.dignamente.br.api.repository.AdminRepository;
import com.dignamente.br.api.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserValidationService userValidationService;

    AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<AdminResponseDTO> findAdmins() {
        return adminRepository.findAll()
            .stream()
            .map(this::toResponseDTO)
            .toList();
    }

    public AdminResponseDTO findAdminById(UUID id) {
        return toResponseDTO(findAdminEntityById(id));
    }

    public void createAdmin(AdminRequestDTO dto) {
        userValidationService.validateCpf(dto.cpf());
        userValidationService.validateEmail(dto.email());

        if (dto.password() == null || dto.password().isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        String hashPassword = passwordEncoder.encode(dto.password());

        Admin admin = adminMapper.toEntity(dto);
        admin.setTypeUser(TypeUser.ADMIN);
        admin.setPassword(hashPassword);
        adminRepository.save(admin);
    }

    public AdminResponseDTO updateAdmin(UUID id, AdminRequestDTO dto) {
        Admin admin = findAdminEntityById(id);

        if (dto.email() != null && !dto.email().equals(admin.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(dto.email(), id)) {
                throw new EmailAlreadyExistsException(
                    "Já existe um administrador com o email " + dto.email()
                );
            }
            admin.setEmail(dto.email());
        }

        if (dto.cpf() != null && !dto.cpf().equals(admin.getCpf())) {
            if (userRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
                throw new CPFAlreadyExistsException("Cpf já cadastrado!");
            }
            admin.setCpf(dto.cpf());
        }

        adminMapper.updateAdmin(dto, admin);

        if (dto.password() != null && !dto.password().isBlank()) {
            String hashPassword = passwordEncoder.encode(dto.password());
            admin.setPassword(hashPassword);
        }

        return toResponseDTO(adminRepository.save(admin));
    }

    public void deleteAdmin(UUID id) {
        findAdminEntityById(id);
        adminRepository.deleteById(id);
    }

    private Admin findAdminEntityById(UUID id) {
        return adminRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado com o ID: " + id));
    }

    private AdminResponseDTO toResponseDTO(Admin admin) {
        return new AdminResponseDTO(
            admin.getId(),
            admin.getName(),
            admin.getEmail(),
            admin.getCpf(),
            admin.getTypeUser(),
            admin.getRegistration(),
            admin.getCreatedAt(),
            admin.getUpdatedAt()
        );
    }
}
