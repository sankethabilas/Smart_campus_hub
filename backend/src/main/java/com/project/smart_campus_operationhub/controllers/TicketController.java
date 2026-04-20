package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.TicketAssignDTO;
import com.project.smart_campus_operationhub.dtos.TicketRequestDTO;
import com.project.smart_campus_operationhub.dtos.TicketResponseDTO;
import com.project.smart_campus_operationhub.dtos.TicketStatusUpdateDTO;
import com.project.smart_campus_operationhub.services.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // GET ALL
    @GetMapping
    public List<TicketResponseDTO> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public TicketResponseDTO getTicketById(@PathVariable Integer id) {
        return ticketService.getTicketById(id);
    }

    // CREATE TICKET
    @PostMapping
    public TicketResponseDTO createTicket(@RequestBody TicketRequestDTO request) {
        return ticketService.createTicket(request);
    }

    //TECHNICIAN WORKFLOW ENDPOINTS 

    /**
     * STEP 2: Admin assigns technician to ticket
     * PUT /api/tickets/{id}/assign
     */
    @PutMapping("/{id}/assign")
    public TicketResponseDTO assignTechnician(
            @PathVariable Integer id,
            @RequestBody TicketAssignDTO request) {
        return ticketService.assignTechnician(id, request);
    }

    /**
     * STEP 3: Technician updates ticket status to IN_PROGRESS
     * PUT /api/tickets/{id}/status
     */
    @PutMapping("/{id}/status")
    public TicketResponseDTO updateTicketStatus(
            @PathVariable Integer id,
            @RequestBody TicketStatusUpdateDTO request) {
        return ticketService.updateTicketStatus(id, request);
    }

    /**
     * STEP 4: Technician resolves ticket with notes
     * PUT /api/tickets/{id}/resolve
     */
    @PutMapping("/{id}/resolve")
    public TicketResponseDTO resolveTicket(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String resolutionNotes = request.get("resolutionNotes");
        return ticketService.resolveTicket(id, resolutionNotes);
    }

    /**
     * STEP 5: Admin closes ticket after verification
     * PUT /api/tickets/{id}/close
     */
    @PutMapping("/{id}/close")
    public TicketResponseDTO closeTicket(@PathVariable Integer id) {
        return ticketService.closeTicket(id);
    }

    /**
     * Scenario 2: Admin rejects invalid ticket
     * PUT /api/tickets/{id}/reject
     */
    @PutMapping("/{id}/reject")
    public TicketResponseDTO rejectTicket(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String rejectionReason = request.get("rejectionReason");
        return ticketService.rejectTicket(id, rejectionReason);
    }
}
