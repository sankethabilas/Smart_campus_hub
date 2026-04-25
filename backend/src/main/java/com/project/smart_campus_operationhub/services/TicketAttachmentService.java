package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.TicketAttachmentResponseDTO;
import com.project.smart_campus_operationhub.entities.Ticket;
import com.project.smart_campus_operationhub.entities.TicketAttachment;
import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.TicketAttachmentRepository;
import com.project.smart_campus_operationhub.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketAttachmentService {

    private static final Logger logger = LoggerFactory.getLogger(TicketAttachmentService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final int MAX_ATTACHMENTS_PER_TICKET = 3;

    private final TicketAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final String uploadDir;

    public TicketAttachmentService(
            TicketAttachmentRepository attachmentRepository,
            UserRepository userRepository,
            @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
        this.uploadDir = uploadDir;
        logger.info("TicketAttachmentService initialized with upload dir: {}", uploadDir);
    }

    private Path getUploadDirPath() {
        Path configuredPath = Paths.get(uploadDir);
        if (configuredPath.isAbsolute()) {
            return configuredPath;
        } else {
            // If relative, resolve against current working directory
            String workingDir = System.getProperty("user.dir");
            return Paths.get(workingDir, uploadDir);
        }
    }

    // Upload attachment - accepts Integer userId from frontend, converts to Long
    // for Users entity
    public TicketAttachmentResponseDTO uploadAttachment(
            Integer ticketId,
            Integer userIdFromFrontend,
            MultipartFile file) throws IOException {

        logger.info("Starting attachment upload for ticket: {} by user: {}", ticketId, userIdFromFrontend);

        // Validate file is not null and not empty
        if (file == null || file.isEmpty()) {
            logger.error("File is empty or null for ticket: {}", ticketId);
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            logger.error("File size {} exceeds maximum {} bytes", file.getSize(), MAX_FILE_SIZE);
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        // Validate attachment count
        long count = attachmentRepository.countByTicketId(ticketId);
        if (count >= MAX_ATTACHMENTS_PER_TICKET) {
            logger.warn("Max attachments ({}) reached for ticket: {}", MAX_ATTACHMENTS_PER_TICKET, ticketId);
            throw new IllegalStateException(
                    "Maximum " + MAX_ATTACHMENTS_PER_TICKET + " attachments allowed per ticket");
        }

        // Validate and fetch user from database
        if (userIdFromFrontend == null) {
            logger.error("User ID cannot be null");
            throw new IllegalArgumentException("User ID is required");
        }

        Users user = userRepository.findById(userIdFromFrontend.longValue())
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", userIdFromFrontend);
                    return new IllegalArgumentException("User not found with ID: " + userIdFromFrontend);
                });

        logger.info("User found: {}", user.getId());

        try {
            // Get absolute path for upload directory
            Path uploadDirPath = getUploadDirPath();
            logger.info("Using upload directory: {}", uploadDirPath.toAbsolutePath());

            // Ensure upload directory exists
            if (!Files.exists(uploadDirPath)) {
                logger.info("Creating upload directory: {}", uploadDirPath.toAbsolutePath());
                Files.createDirectories(uploadDirPath);
                logger.info("Upload directory created successfully");
            } else {
                logger.info("Upload directory already exists: {}", uploadDirPath.toAbsolutePath());
            }

            // Save file to local folder
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDirPath.resolve(fileName);

            logger.info("Saving file to: {}", filePath.toAbsolutePath());
            logger.info("File size: {} bytes", file.getSize());

            file.transferTo(filePath.toFile());

            logger.info("File successfully saved at: {}", filePath.toAbsolutePath());

            // Verify file exists
            if (Files.exists(filePath)) {
                logger.info("File verification successful, file exists at: {}", filePath.toAbsolutePath());
            } else {
                logger.error("File verification failed - file does not exist at: {}", filePath.toAbsolutePath());
                throw new IOException("File was not saved properly to disk");
            }

            // Create entity
            TicketAttachment attachment = new TicketAttachment();

            Ticket ticket = new Ticket();
            ticket.setId(ticketId);
            attachment.setTicket(ticket);

            // Use the actual fetched Users entity from database
            attachment.setUploadedBy(user);

            attachment.setFileName(file.getOriginalFilename());
            attachment.setFilePath(filePath.toString());
            attachment.setFileType(file.getContentType());
            attachment.setUploadedAt(Instant.now());

            TicketAttachment saved = attachmentRepository.save(attachment);
            logger.info("Attachment successfully saved with ID: {}", saved.getId());

            return convertToDTO(saved);

        } catch (IOException e) {
            logger.error("IO error while uploading file for ticket {}: {}", ticketId, e.getMessage(), e);
            throw new IOException("Failed to save file: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while uploading attachment for ticket {}: {}", ticketId, e.getMessage(), e);
            throw new RuntimeException("Failed to upload attachment: " + e.getMessage(), e);
        }
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
                att.getUploadedBy() != null ? att.getUploadedBy().getId() : null);
        dto.setUploadedAt(att.getUploadedAt());

        return dto;
    }
}
