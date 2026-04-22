package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.TicketCommentRequestDTO;
import com.project.smart_campus_operationhub.dtos.TicketCommentResponseDTO;
import com.project.smart_campus_operationhub.entities.Ticket;
import com.project.smart_campus_operationhub.entities.TicketComment;
import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.TicketCommentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;

    public TicketCommentService(TicketCommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // Create a comment on a ticket
    public TicketCommentResponseDTO createComment(TicketCommentRequestDTO request) {
        TicketComment comment = new TicketComment();

        // Set ticket
        Ticket ticket = new Ticket();
        ticket.setId(request.getTicketId());
        comment.setTicket(ticket);

        // Set user who commented
        Users user = new Users();
        user.setId(Long.valueOf(request.getCommentedById()));
        comment.setCommentedBy(user);

        // Set comment text
        comment.setComment(request.getComment());

        // Set timestamps
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());

        // Save and return
        TicketComment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    // Get all comments for a ticket
    public List<TicketCommentResponseDTO> getCommentsByTicketId(Integer ticketId) {
        return commentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get a single comment by ID
    public TicketCommentResponseDTO getCommentById(Integer commentId) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElse(null);
        return (comment != null) ? convertToDTO(comment) : null;
    }

    // Update a comment (only owner or admin can update)
    public TicketCommentResponseDTO updateComment(Integer commentId, TicketCommentRequestDTO request,
            Integer currentUserId) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check ownership - only the comment owner or admin can edit
        if (!comment.getCommentedBy().getId().equals(Long.valueOf(currentUserId))) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setComment(request.getComment());
        comment.setUpdatedAt(Instant.now());

        TicketComment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }

    // Delete a comment (only owner or admin can delete)
    public void deleteComment(Integer commentId, Integer currentUserId) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check ownership - only the comment owner or admin can delete
        if (!comment.getCommentedBy().getId().equals(Long.valueOf(currentUserId))) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.deleteById(commentId);
    }

    // Helper method to convert entity to DTO
    private TicketCommentResponseDTO convertToDTO(TicketComment comment) {
        TicketCommentResponseDTO dto = new TicketCommentResponseDTO();
        dto.setId(comment.getId());
        dto.setTicketId(comment.getTicket().getId());
        dto.setCommentedById(comment.getCommentedBy().getId().intValue());
        dto.setCommentedByName(comment.getCommentedBy().getName());
        dto.setComment(comment.getComment());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
