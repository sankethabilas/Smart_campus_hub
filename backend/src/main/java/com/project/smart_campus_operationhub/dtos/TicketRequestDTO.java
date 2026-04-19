package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketRequestDTO {

    private Integer reportedById;
    private Integer assetId;
    private Integer locationId;

    private String priority;
    private String title;
    private String description;
    private String contact;
}
