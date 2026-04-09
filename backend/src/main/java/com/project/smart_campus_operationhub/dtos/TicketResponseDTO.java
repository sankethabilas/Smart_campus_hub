package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketResponseDTO {

    private Integer id;
    private String title;
    private String description;
    private String priority;
    private String status;
}
