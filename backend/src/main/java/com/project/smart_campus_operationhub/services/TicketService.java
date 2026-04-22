package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.TicketAssignDTO;
import com.project.smart_campus_operationhub.dtos.TicketRequestDTO;
import com.project.smart_campus_operationhub.dtos.TicketResponseDTO;
import com.project.smart_campus_operationhub.dtos.TicketStatusUpdateDTO;
import com.project.smart_campus_operationhub.entities.Asset;
import com.project.smart_campus_operationhub.entities.Location;
import com.project.smart_campus_operationhub.entities.Ticket;
import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // GET ALL
    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public TicketResponseDTO getTicketById(Integer id) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        return (ticket != null) ? convertToDTO(ticket) : null;
    }

    // CREATE TICKET
    public TicketResponseDTO createTicket(TicketRequestDTO request) {

        Ticket ticket = new Ticket();

        // Basic fields
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setContact(request.getContact());

        // Default values
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        ticket.setStatus("OPEN");

        ticket.setCreatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        // Relationships (set only IDs)
        if (request.getReportedById() != null) {
            Users user = new Users();
            user.setId(Long.valueOf(request.getReportedById()));
            ticket.setReportedBy(user);
        }

        if (request.getAssetId() != null) {
            Asset asset = new Asset();
            asset.setId(request.getAssetId());
            ticket.setAsset(asset);
        }

        if (request.getLocationId() != null) {
            Location location = new Location();
            location.setId(request.getLocationId());
            ticket.setLocation(location);
        }

        // Save
        Ticket savedTicket = ticketRepository.save(ticket);

        // Return full DTO
        return convertToDTO(savedTicket);
    }

    // ASSIGN TECHNICIAN (Admin only)
    public TicketResponseDTO assignTechnician(Integer ticketId, TicketAssignDTO request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Assign technician
        if (request.getTechnicianId() != null) {
            Users technician = new Users();
            technician.setId(request.getTechnicianId());
            ticket.setAssignedTo(technician);
        }

        // Update priority if provided
        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }

        ticket.setUpdatedAt(Instant.now());
        Ticket updatedTicket = ticketRepository.save(ticket);

        return convertToDTO(updatedTicket);
    }

    // UPDATE TICKET STATUS (Technician workflow)
    public TicketResponseDTO updateTicketStatus(Integer ticketId, TicketStatusUpdateDTO request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        String newStatus = request.getStatus();

        // Validate status transitions
        String currentStatus = ticket.getStatus();
        validateStatusTransition(currentStatus, newStatus);

        // Update status
        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(Instant.now());

        // Handle status-specific actions
        if ("IN_PROGRESS".equals(newStatus)) {
            // Technician starts working
            // No additional fields needed
        } else if ("RESOLVED".equals(newStatus)) {
            // Technician resolved the issue
            ticket.setResolutionNotes(request.getNotes());
            ticket.setResolvedAt(Instant.now());
        } else if ("CLOSED".equals(newStatus)) {
            // Admin closes the ticket after verification
            ticket.setClosedAt(Instant.now());
        } else if ("REJECTED".equals(newStatus)) {
            // Admin rejects the ticket
            ticket.setRejectionReason(request.getNotes());
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDTO(updatedTicket);
    }

    // RESOLVE TICKET (Technician updates to RESOLVED with notes)
    public TicketResponseDTO resolveTicket(Integer ticketId, String resolutionNotes) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Only allow resolution from IN_PROGRESS status
        if (!"IN_PROGRESS".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket must be IN_PROGRESS to resolve");
        }

        ticket.setStatus("RESOLVED");
        ticket.setResolutionNotes(resolutionNotes);
        ticket.setResolvedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDTO(updatedTicket);
    }

    // REJECT TICKET (Admin rejects ticket)
    public TicketResponseDTO rejectTicket(Integer ticketId, String rejectionReason) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Only allow rejection from OPEN status
        if (!"OPEN".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket must be OPEN to reject");
        }

        ticket.setStatus("REJECTED");
        ticket.setRejectionReason(rejectionReason);
        ticket.setUpdatedAt(Instant.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDTO(updatedTicket);
    }

    // CLOSE TICKET (Admin closes ticket after verification)
    public TicketResponseDTO closeTicket(Integer ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Only allow closing from RESOLVED status
        if (!"RESOLVED".equals(ticket.getStatus())) {
            throw new RuntimeException("Ticket must be RESOLVED to close");
        }

        ticket.setStatus("CLOSED");
        ticket.setClosedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDTO(updatedTicket);
    }

    // Validate status transitions
    private void validateStatusTransition(String currentStatus, String newStatus) {
        // Define allowed transitions
        if (currentStatus.equals(newStatus)) {
            throw new RuntimeException("Status is already " + currentStatus);
        }

        // Valid transitions:
        // OPEN -> IN_PROGRESS, REJECTED
        // IN_PROGRESS -> RESOLVED
        // RESOLVED -> CLOSED
        // No other transitions allowed

        boolean validTransition = false;

        if ("OPEN".equals(currentStatus) && ("IN_PROGRESS".equals(newStatus) || "REJECTED".equals(newStatus))) {
            validTransition = true;
        } else if ("IN_PROGRESS".equals(currentStatus) && "RESOLVED".equals(newStatus)) {
            validTransition = true;
        } else if ("RESOLVED".equals(currentStatus) && "CLOSED".equals(newStatus)) {
            validTransition = true;
        }

        if (!validTransition) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }

    // ENTITY ---> DTO
    private TicketResponseDTO convertToDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();

        dto.setId(ticket.getId());

        // Relationships (null safe)
        dto.setReportedById(
                ticket.getReportedBy() != null ? ticket.getReportedBy().getId().intValue() : null);

        dto.setAssetId(
                ticket.getAsset() != null ? ticket.getAsset().getId() : null);

        dto.setLocationId(
                ticket.getLocation() != null ? ticket.getLocation().getId() : null);

        dto.setAssignedToId(
                ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId().intValue() : null);

        dto.setPriority(ticket.getPriority());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setContact(ticket.getContact());
        dto.setStatus(ticket.getStatus());

        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectionReason(ticket.getRejectionReason());

        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setClosedAt(ticket.getClosedAt());

        return dto;
    }
}
