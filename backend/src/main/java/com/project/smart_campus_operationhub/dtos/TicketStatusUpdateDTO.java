package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketStatusUpdateDTO {

    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    private String notes; // Resolution notes or rejection reason
    private Integer technicianId; // ID of technician making the update
}
