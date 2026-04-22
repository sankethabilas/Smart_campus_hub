package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class BookingResponseDTO {
    private Integer id;
    private Integer assetId;
    private String assetName;
    private String assetType;
    private Long requestedById;
    private String requestedByName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer headcount;
    private String status;
    private String reviewReason;
    private Instant createdAt;
}
