package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.TicketAttachmentResponseDTO;
import com.project.smart_campus_operationhub.entities.Ticket;
import com.project.smart_campus_operationhub.entities.TicketAttachment;
import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.TicketAttachmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketAttachmentService {

    private final TicketAttachmentRepository attachmentRepository;

    private final String uploadDir = "uploads/"; // folder to store files

    public TicketAttachmentService(TicketAttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    // Upload attachment 
    public TicketAttachmentResponseDTO uploadAttachment(
            Integer ticketId,
            Integer userId,
            MultipartFile file) throws IOException {

        // Set the Limit: max 3 attachments per ticket
        long count = attachmentRepository.countByTicketId(ticketId);
        if (count >= 3) {
            throw new RuntimeException("Maximum 3 attachments allowed per ticket");
        }

        // Save file to local folder
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + fileName;

        File dest = new File(filePath);
        dest.getParentFile().mkdirs();
        file.transferTo(dest);

        // Create entity
        TicketAttachment attachment = new TicketAttachment();

        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        attachment.setTicket(ticket);

        Users user = new Users();
        user.setId(Long.valueOf(userId));
        attachment.setUploadedBy(user);

        attachment.setFileName(file.getOriginalFilename());
        attachment.setFilePath(filePath);
        attachment.setFileType(file.getContentType());
        attachment.setUploadedAt(Instant.now());

        TicketAttachment saved = attachmentRepository.save(attachment);

        return convertToDTO(saved);
    }

    // GET BY TICKET
    public List<TicketAttachmentResponseDTO> getAttachmentsByTicket(Integer ticketId) {
        return attachmentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ENTITY → DTO
    private TicketAttachmentResponseDTO convertToDTO(TicketAttachment att) {

        TicketAttachmentResponseDTO dto = new TicketAttachmentResponseDTO();

        dto.setId(att.getId());
        dto.setTicketId(att.getTicket().getId());
        dto.setFileName(att.getFileName());
        dto.setFilePath(att.getFilePath());
        dto.setFileType(att.getFileType());
        dto.setUploadedById(
                att.getUploadedBy() != null ? att.getUploadedBy().getId().intValue() : null);
        dto.setUploadedAt(att.getUploadedAt());

        return dto;
    }
}
