package com.project.smart_campus_operationhub.mappers;

import com.project.smart_campus_operationhub.dtos.RegisterUserRequest;
import com.project.smart_campus_operationhub.dtos.UpdateUserRequest;
import com.project.smart_campus_operationhub.dtos.UserDto;
import com.project.smart_campus_operationhub.entities.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(Users user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "oauthProvider", ignore = true)
    @Mapping(target = "oauthProviderId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "audits", ignore = true)
    @Mapping(target = "requestedBookings", ignore = true)
    @Mapping(target = "reviewedBookings", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "reportedTickets", ignore = true)
    @Mapping(target = "assignedTickets", ignore = true)
    @Mapping(target = "ticketAttachments", ignore = true)
    @Mapping(target = "ticketComments", ignore = true)
    Users toEntity(RegisterUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "oauthProvider", ignore = true)
    @Mapping(target = "oauthProviderId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "audits", ignore = true)
    @Mapping(target = "requestedBookings", ignore = true)
    @Mapping(target = "reviewedBookings", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "reportedTickets", ignore = true)
    @Mapping(target = "assignedTickets", ignore = true)
    @Mapping(target = "ticketAttachments", ignore = true)
    @Mapping(target = "ticketComments", ignore = true)
    void update(UpdateUserRequest request, @MappingTarget Users user);
}
