package com.project.smart_campus_operationhub.mappers;

import com.project.smart_campus_operationhub.dtos.RegisterUserRequest;
import com.project.smart_campus_operationhub.dtos.UpdateUserRequest;
import com.project.smart_campus_operationhub.dtos.UserDto;
import com.project.smart_campus_operationhub.entities.Users;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(Users user);
    Users toEntity(RegisterUserRequest request);
    void update(UpdateUserRequest request, @MappingTarget Users user);
}
