package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class TicketResponseDTO {

    private Integer id;

    // Relationships (only IDs to avoid heavy objects)
    private Long reportedById;
    private Integer assetId;
    private Integer locationId;
    private Long assignedToId;

    private String priority;
    private String title;
    private String description;
    private String contact;
    private String status;

    private String resolutionNotes;
    private String rejectionReason;

    private Instant createdAt;
    private Instant updatedAt;
    private Instant resolvedAt;
    private Instant closedAt;
}
