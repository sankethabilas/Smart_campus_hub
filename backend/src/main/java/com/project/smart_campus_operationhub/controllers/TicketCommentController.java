package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.TicketCommentRequestDTO;
import com.project.smart_campus_operationhub.dtos.TicketCommentResponseDTO;
import com.project.smart_campus_operationhub.services.TicketCommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class TicketCommentController {

    private final TicketCommentService commentService;

    public TicketCommentController(TicketCommentService commentService) {
        this.commentService = commentService;
    }

    // CREATE - Add a new comment to a ticket
    @PostMapping
    public TicketCommentResponseDTO createComment(
            @PathVariable Integer ticketId,
            @RequestBody TicketCommentRequestDTO request) {
        request.setTicketId(ticketId);
        return commentService.createComment(request);
    }

    // READ - Get all comments for a ticket
    @GetMapping
    public List<TicketCommentResponseDTO> getTicketComments(
            @PathVariable Integer ticketId) {
        return commentService.getCommentsByTicketId(ticketId);
    }

    // READ - Get a single comment by ID
    @GetMapping("/{commentId}")
    public TicketCommentResponseDTO getCommentById(
            @PathVariable Integer ticketId,
            @PathVariable Integer commentId) {
        return commentService.getCommentById(commentId);
    }

    // UPDATE - Update a comment (only owner can edit)
    @PutMapping("/{commentId}")
    public TicketCommentResponseDTO updateComment(
            @PathVariable Integer ticketId,
            @PathVariable Integer commentId,
            @RequestBody TicketCommentRequestDTO request,
            @RequestParam Integer userId) {
        return commentService.updateComment(commentId, request, userId);
    }

    // DELETE - Delete a comment (only owner can delete)
    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Integer ticketId,
            @PathVariable Integer commentId,
            @RequestParam Integer userId) {
        commentService.deleteComment(commentId, userId);
    }
}
