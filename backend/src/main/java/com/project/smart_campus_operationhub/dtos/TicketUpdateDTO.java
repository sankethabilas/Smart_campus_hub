package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketUpdateDTO {

    private String title;
    private String description;
    private String contact;
    private String priority;
    private Integer assetId;
    private Integer locationId;
}
