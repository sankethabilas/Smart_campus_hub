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
            Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            request.setRequestedById(userId);
            return ResponseEntity.ok(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {
        Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Integer id) {
        try {
            Long adminId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(bookingService.approveBooking(id, adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Integer id, @RequestBody BookingActionDTO action) {
        try {
            Long adminId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(bookingService.rejectBooking(id, action.getReviewReason(), adminId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        try {
            Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
