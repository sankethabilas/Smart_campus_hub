package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketAssignDTO {

    private Long technicianId; // ID of technician to assign
    private String priority; // Optional: update priority when assigning
}
