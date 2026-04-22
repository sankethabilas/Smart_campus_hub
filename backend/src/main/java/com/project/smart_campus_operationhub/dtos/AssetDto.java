package com.project.smart_campus_operationhub.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.Instant;

@Data
public class AssetDto {
    private Integer id;

    @NotBlank(message = "Name is required")
    private String name;

    @Pattern(regexp = "^(ROOM|LAB|EQUIPMENT)$", message = "Type must be ROOM, LAB, or EQUIPMENT")
    private String type;

    @Pattern(regexp = "^(ACTIVE|OUT_OF_SERVICE)$", message = "Status must be ACTIVE or OUT_OF_SERVICE")
    private String status = "ACTIVE";

    private Integer capacity;

    private Integer locationId;

    private Instant startDatetime;
    private Instant endDatetime;
}
