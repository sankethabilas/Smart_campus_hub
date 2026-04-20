package com.project.smart_campus_operationhub.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Size(max = 255, message = "Name must be less than 255 characters")
    public String name;

    @Email(message = "Email must be valid")
    public String email;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    public String phone;
}
