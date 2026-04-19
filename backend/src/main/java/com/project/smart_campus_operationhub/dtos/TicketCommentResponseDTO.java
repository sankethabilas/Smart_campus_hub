package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class TicketCommentResponseDTO {
    private Integer id;
    private Integer ticketId;
    private Integer commentedById;
    private String commentedByName;
    private String comment;
    private Instant createdAt;
    private Instant updatedAt;
}
