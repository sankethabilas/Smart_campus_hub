package com.project.smart_campus_operationhub.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // Vite default ports
public class TestController {

    @GetMapping("/test")
    public Map<String, String> testConnection() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend is connected successfully!");
        response.put("status", "success");
        return response;
    }
}
