package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.RegisterAdminRequest;
import com.project.smart_campus_operationhub.mappers.AdminMapper;
import com.project.smart_campus_operationhub.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> registerAdmin(
            @Valid @RequestBody RegisterAdminRequest request,
            UriComponentsBuilder uriBuilder) {

        if(userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(
                    Map.of("email", "Email is already registered")
            );
        }

        var admin = adminMapper.toEntity(request);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        userRepository.save(admin);

        var adminDto = adminMapper.toDto(admin);
        var uri = uriBuilder.path("admin/{id}").buildAndExpand(adminDto.getId()).toUri();

        return ResponseEntity.created(uri).body(adminDto);

    }
}
