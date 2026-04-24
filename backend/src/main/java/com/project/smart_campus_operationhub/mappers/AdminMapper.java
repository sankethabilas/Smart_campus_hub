package com.project.smart_campus_operationhub.mappers;

import com.project.smart_campus_operationhub.dtos.AdminDto;
import com.project.smart_campus_operationhub.dtos.RegisterAdminRequest;
import com.project.smart_campus_operationhub.entities.Users;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    AdminDto toDto(Users user);
    Users toEntity(RegisterAdminRequest request);
}
