package com.project.smart_campus_operationhub.services.impl;

import com.project.smart_campus_operationhub.dtos.LocationDto;
import com.project.smart_campus_operationhub.entities.Location;
import com.project.smart_campus_operationhub.repositories.LocationRepository;
import com.project.smart_campus_operationhub.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private LocationDto mapToDto(Location location) {
        LocationDto dto = new LocationDto();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setBuildingName(location.getBuildingName());
        dto.setFloorNo(location.getFloorNo());
        return dto;
    }
}
