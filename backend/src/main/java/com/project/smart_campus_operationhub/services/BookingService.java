package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.BookingRequestDTO;
import com.project.smart_campus_operationhub.dtos.BookingResponseDTO;
import com.project.smart_campus_operationhub.entities.Asset;
import com.project.smart_campus_operationhub.entities.Booking;
import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.AssetRepository;
import com.project.smart_campus_operationhub.repositories.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AssetRepository assetRepository;

    public BookingService(BookingRepository bookingRepository, AssetRepository assetRepository) {
        this.bookingRepository = bookingRepository;
        this.assetRepository = assetRepository;
    }

    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // 1. Validate Asset exists
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if ("OUT_OF_SERVICE".equalsIgnoreCase(asset.getStatus())) {
            throw new RuntimeException("Resource is currently out of service and cannot be booked");
        }

        // 2. Validate Capacity
        if (request.getHeadcount() != null && asset.getCapacity() != null) {
            if (request.getHeadcount() > asset.getCapacity()) {
                throw new RuntimeException("Headcount exceeds resource capacity (" + asset.getCapacity() + ")");
            }
        }

        // 3. Validate Availability (Resource-Based Availability)
        if (asset.getStartDatetime() != null && asset.getEndDatetime() != null) {
            java.time.LocalTime assetStart = asset.getStartDatetime().atZone(java.time.ZoneId.systemDefault()).toLocalTime();
            java.time.LocalTime assetEnd = asset.getEndDatetime().atZone(java.time.ZoneId.systemDefault()).toLocalTime();
            
            if (request.getStartTime().isBefore(assetStart) || request.getEndTime().isAfter(assetEnd)) {
                throw new RuntimeException("Booking time falls outside the resource's available hours (" 
                    + assetStart + " to " + assetEnd + ")");
            }
        }

        // 4. Run Conflict Detection
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                request.getAssetId(), request.getBookingDate(), request.getStartTime(), request.getEndTime());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot is already booked for this resource");
        }

        // 5. Create Booking
        Booking booking = new Booking();
        booking.setAsset(asset);
        
        Users user = new Users();
        // Fallback to mock user ID 1 if not provided
        user.setId(request.getRequestedById() != null ? request.getRequestedById() : 1L);
        booking.setRequestedBy(user);

        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setHeadcount(request.getHeadcount());
        booking.setStatus("PENDING");
        booking.setCreatedAt(Instant.now());
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    public List<BookingResponseDTO> getMyBookings(Long userId) {
        return bookingRepository.findByRequestedByIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO approveBooking(Integer bookingId, Long adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus("APPROVED");
        Users admin = new Users();
        admin.setId(adminId);
        booking.setReviewedBy(admin);
        booking.setUpdatedAt(Instant.now());

        return convertToDTO(bookingRepository.save(booking));
    }

    public BookingResponseDTO rejectBooking(Integer bookingId, String reason, Long adminId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus("REJECTED");
        booking.setReviewReason(reason);
        Users admin = new Users();
        admin.setId(adminId);
        booking.setReviewedBy(admin);
        booking.setUpdatedAt(Instant.now());

        return convertToDTO(bookingRepository.save(booking));
    }

    public BookingResponseDTO cancelBooking(Integer bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getRequestedBy().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(Instant.now());

        return convertToDTO(bookingRepository.save(booking));
    }

    private BookingResponseDTO convertToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        if (booking.getAsset() != null) {
            dto.setAssetId(booking.getAsset().getId());
            dto.setAssetName(booking.getAsset().getName());
            dto.setAssetType(booking.getAsset().getType());
        }
        if (booking.getRequestedBy() != null) {
            dto.setRequestedById(booking.getRequestedBy().getId());
            dto.setRequestedByName(booking.getRequestedBy().getName());
        }
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setHeadcount(booking.getHeadcount());
        dto.setStatus(booking.getStatus());
        dto.setReviewReason(booking.getReviewReason());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
