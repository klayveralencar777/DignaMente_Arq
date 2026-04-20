package com.dignamente.br.api.controller;

import com.dignamente.br.api.entities.Psicologo;
import com.dignamente.br.api.repository.PsicologoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/psicologos") // Todos os comandos vão começar com /psicologos
public class PsicologoController {

    @Autowired
    private PsicologoRepository repository;

    // CREATE - Criar um novo psicólogo
    @PostMapping
    public ResponseEntity<Psicologo> criar(@RequestBody Psicologo psicologo) {
        Psicologo novoPsicologo = repository.save(psicologo);
        return ResponseEntity.ok(novoPsicologo);
    }

    // READ - Listar todos
    @GetMapping
    public List<Psicologo> listarTodos() {
        return repository.findAll();
    }

    // READ - Buscar um por ID
    @GetMapping("/{id}")
    public ResponseEntity<Psicologo> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE - Atualizar dados
    @PutMapping("/{id}")
    public ResponseEntity<Psicologo> atualizar(@PathVariable Long id, @RequestBody Psicologo psicologoAtualizado) {
        return repository.findById(id)
                .map(p -> {
                    p.setCrp(psicologoAtualizado.getCrp());
                    p.setDataNascimento(psicologoAtualizado.getDataNascimento());
                    // Adicione aqui outros campos que o Usuario.java possua, como nome ou email
                    Psicologo salvo = repository.save(p);
                    return ResponseEntity.ok(salvo);
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Remover
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}