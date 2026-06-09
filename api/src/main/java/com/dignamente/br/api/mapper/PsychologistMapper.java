package com.dignamente.br.api.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.dignamente.br.api.dto.Psychologist.PsychologistRequestDTO;

import com.dignamente.br.api.entities.Psychologist;

@Mapper(componentModel = "spring")
public interface PsychologistMapper {
     Psychologist toEntity(PsychologistRequestDTO dto);

     @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
     @org.mapstruct.Mapping(target = "email", ignore = true)
     @org.mapstruct.Mapping(target = "cpf", ignore = true)
     @org.mapstruct.Mapping(target = "password", ignore = true)
     @org.mapstruct.Mapping(target = "typeUser", ignore = true)
     void updatePsychologist(PsychologistRequestDTO dto, @MappingTarget Psychologist entity);

}