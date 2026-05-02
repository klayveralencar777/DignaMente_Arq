package com.dignamente.br.api.mapper;


import org.mapstruct.Mapper;

import com.dignamente.br.api.dto.Patient.PatientRequestDTO;
import com.dignamente.br.api.entities.Patient;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Patient toEntity(PatientRequestDTO dto);



    

}
    