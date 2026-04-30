package com.dignamente.br.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dignamente.br.api.entities.Admin;


@Repository
public interface AdminRepository  extends JpaRepository<Admin, UUID>{
    
}
