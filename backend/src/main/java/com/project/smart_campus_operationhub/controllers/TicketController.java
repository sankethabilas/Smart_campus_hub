package com.project.smart_campus_operationhub.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*") 
public class TicketController {

    @GetMapping("/hello")
    public String hello() {
        return "hello this is TicketController";
    }
}
