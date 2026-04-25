package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.TicketAttachmentResponseDTO;
import com.project.smart_campus_operationhub.services.TicketAttachmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/attachments")
public class TicketAttachmentController {

    private final TicketAttachmentService attachmentService;

    public TicketAttachmentController(TicketAttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    // UPLOAD FILE
    @PostMapping
    public TicketAttachmentResponseDTO uploadAttachment(
            @PathVariable Integer ticketId,
            @RequestParam Integer userId,
            @RequestParam("file") MultipartFile file) throws IOException {

        return attachmentService.uploadAttachment(ticketId, userId, file);
    }

    // GET ATTACHMENTS
    @GetMapping
    public List<TicketAttachmentResponseDTO> getAttachments(
            @PathVariable Integer ticketId) {
        return attachmentService.getAttachmentsByTicket(ticketId);
    }

    // DELETE ATTACHMENT
    @DeleteMapping("/{attachmentId}")
    public void deleteAttachment(
            @PathVariable Integer ticketId,
            @PathVariable Integer attachmentId) {
        attachmentService.deleteAttachment(attachmentId);
    }
}
