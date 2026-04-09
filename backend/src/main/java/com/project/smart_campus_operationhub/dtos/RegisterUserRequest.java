package com.project.smart_campus_operationhub.dtos;

import lombok.Data;

@Data
public class RegisterUserRequest {
    private String name;
    private String email;
    private String phone;
    private String password;

}
