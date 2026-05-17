package com.dignamente.br.api.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.dignamente.br.api.dto.Admin.AdminRequestDTO;
import com.dignamente.br.api.entities.Admin;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    Admin toEntity(AdminRequestDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @org.mapstruct.Mapping(target = "email", ignore = true)
    @org.mapstruct.Mapping(target = "cpf", ignore = true)
    @org.mapstruct.Mapping(target = "password", ignore = true)
    @org.mapstruct.Mapping(target = "typeUser", ignore = true)
    void updateAdmin(AdminRequestDTO dto, @MappingTarget Admin entity);

}
