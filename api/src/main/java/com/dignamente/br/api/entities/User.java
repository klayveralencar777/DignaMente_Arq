package com.dignamente.br.api.entities;



import java.time.LocalDateTime;
import java.util.UUID;

import com.dignamente.br.api.enums.TypeUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Users")
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

     
    @Column(nullable = false)
    @NotBlank(message = "O nome é obrigatório")
    private String name;
    
   
    @Column(nullable = false, unique = true)
    @NotBlank(message = "O email é obrigatório")
    @Email(message = "O email deve ter um formato válido")
    private String email;
    
    @Column(nullable = false)
    @NotBlank(message = "A senha é obrigatória")
    private String password;

   
    @Column(nullable = false, unique = true)
    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "O tipo de usuário é obrigatório")
    private TypeUser typeUser;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;



    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

 
}
