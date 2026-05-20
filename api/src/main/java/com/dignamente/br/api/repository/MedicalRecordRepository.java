package com.dignamente.br.api.repository;

import com.dignamente.br.api.entities.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {

    Optional<MedicalRecord> findByAppointmentId(UUID appointmentId);

    List<MedicalRecord> findByPatientId(UUID patientId);

    List<MedicalRecord> findByPsychologistId(UUID psychologistId);

    boolean existsByAppointmentId(UUID appointmentId);
}
