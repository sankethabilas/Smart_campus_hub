package com.project.smart_campus_operationhub.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
}
