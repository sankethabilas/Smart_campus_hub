package com.project.smart_campus_operationhub.dtos;

import lombok.Data;

@Data
public class UpdateUserRequest {
    public String name;
    public String email;
    public String phone;
}
