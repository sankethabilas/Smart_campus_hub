package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCommentRequestDTO {
    private Integer ticketId;
    private Integer commentedById;
    private String comment;
}
