package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.BookingActionDTO;
import com.project.smart_campus_operationhub.dtos.BookingRequestDTO;
import com.project.smart_campus_operationhub.dtos.BookingResponseDTO;
import com.project.smart_campus_operationhub.services.BookingService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO request) {
        try {
            // Hardcode mock user ID for now as requested
            request.setRequestedById(1L);
            return ResponseEntity.ok(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {
        // Hardcode mock user ID 1L
        return ResponseEntity.ok(bookingService.getMyBookings(1L));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Integer id) {
        try {
            // Mock admin ID 1L
            return ResponseEntity.ok(bookingService.approveBooking(id, 1L));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Integer id, @RequestBody BookingActionDTO action) {
        try {
            // Mock admin ID 1L
            return ResponseEntity.ok(bookingService.rejectBooking(id, action.getReviewReason(), 1L));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        try {
            // Mock user ID 1L
            return ResponseEntity.ok(bookingService.cancelBooking(id, 1L));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
