package com.project.smart_campus_operationhub.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class TicketAttachmentResponseDTO {

    private Integer id;
    private Integer ticketId;
    private String fileName;
    private String filePath;
    private String fileType;
    private Long uploadedById;
    private Instant uploadedAt;
}
