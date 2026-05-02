package com.dignamente.br.api.mapper;


import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.dignamente.br.api.dto.Patient.PatientRequestDTO;
import com.dignamente.br.api.entities.Patient;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Patient toEntity(PatientRequestDTO dto);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePatient(PatientRequestDTO dto, @MappingTarget Patient entity);



    

}
    