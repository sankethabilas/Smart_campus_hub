package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.TicketResponseDTO;
import com.project.smart_campus_operationhub.entities.Ticket;
import com.project.smart_campus_operationhub.repositories.TicketRepository;
import org.springframework.stereotype.Service;

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

    // ENTITY ---> DTO
    private TicketResponseDTO convertToDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();

        dto.setId(ticket.getId());

        // Relationships (null safe)
        dto.setReportedById(
                ticket.getReportedBy() != null ? ticket.getReportedBy().getId() : null);

        dto.setAssetId(
                ticket.getAsset() != null ? ticket.getAsset().getId() : null);

        dto.setLocationId(
                ticket.getLocation() != null ? ticket.getLocation().getId() : null);

        dto.setAssignedToId(
                ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null);

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
