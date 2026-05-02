package com.dignamente.br.api.mapper;

import org.mapstruct.Mapper;

import com.dignamente.br.api.dto.Psychologist.PsychologistRequestDTO;
import com.dignamente.br.api.entities.Psychologist;

@Mapper(componentModel = "spring")
public interface PsychologistMapper {
     Psychologist toEntity(PsychologistRequestDTO dto);


    
}
