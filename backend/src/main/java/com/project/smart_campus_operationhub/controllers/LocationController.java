package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.ApiResponse;
import com.project.smart_campus_operationhub.dtos.LocationDto;
import com.project.smart_campus_operationhub.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationDto>>> getAllLocations() {
        List<LocationDto> locations = locationService.getAllLocations();
        ApiResponse<List<LocationDto>> response = new ApiResponse<>(locations, "Locations retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
