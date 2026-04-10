package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.TicketRequestDTO;
import com.project.smart_campus_operationhub.dtos.TicketResponseDTO;
import com.project.smart_campus_operationhub.services.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
