package com.project.smart_campus_operationhub.services.impl;

import com.project.smart_campus_operationhub.dtos.AssetDto;
import com.project.smart_campus_operationhub.entities.Asset;
import com.project.smart_campus_operationhub.entities.Location;
import com.project.smart_campus_operationhub.exceptions.ResourceNotFoundException;
import com.project.smart_campus_operationhub.repositories.AssetRepository;
import com.project.smart_campus_operationhub.repositories.LocationRepository;
import com.project.smart_campus_operationhub.services.AssetService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final LocationRepository locationRepository;

    @Override
    public AssetDto createAsset(AssetDto assetDto) {
        validateDates(assetDto.getStartDatetime(), assetDto.getEndDatetime());
        Asset asset = mapToEntity(assetDto, new Asset());
        Asset savedAsset = assetRepository.save(asset);
        return mapToDto(savedAsset);
    }

    @Override
    public List<AssetDto> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AssetDto getAssetById(Integer id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id " + id));
        return mapToDto(asset);
    }

    @Override
    public AssetDto updateAsset(Integer id, AssetDto assetDto) {
        Asset existingAsset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id " + id));
        
        validateDates(assetDto.getStartDatetime(), assetDto.getEndDatetime());
        
        Asset updatedAsset = mapToEntity(assetDto, existingAsset);
        assetRepository.save(updatedAsset);
        return mapToDto(updatedAsset);
    }

    @Override
    public void deleteAsset(Integer id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with id " + id);
        }
        assetRepository.deleteById(id);
    }

    @Override
    public List<AssetDto> searchAssets(String type, String status, Integer minCapacity, Integer locationId, Boolean available) {
        Specification<Asset> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (minCapacity != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), minCapacity));
            }
            if (locationId != null) {
                predicates.add(cb.equal(root.get("location").get("id"), locationId));
            }
            if (Boolean.TRUE.equals(available)) {
                Instant now = Instant.now();
                predicates.add(cb.lessThanOrEqualTo(root.get("startDatetime"), now));
                predicates.add(cb.greaterThanOrEqualTo(root.get("endDatetime"), now));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return assetRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void validateDates(Instant start, Instant end) {
        if (start != null && end != null && start.isAfter(end)) {
            throw new IllegalArgumentException("start_datetime must be before end_datetime");
        }
    }

    private Asset mapToEntity(AssetDto dto, Asset asset) {
        asset.setName(dto.getName());
        asset.setType(dto.getType());
        asset.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        asset.setCapacity(dto.getCapacity());
        asset.setStartDatetime(dto.getStartDatetime());
        asset.setEndDatetime(dto.getEndDatetime());

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + dto.getLocationId()));
            asset.setLocation(location);
        } else {
            asset.setLocation(null);
        }
        return asset;
    }

    private AssetDto mapToDto(Asset asset) {
        AssetDto dto = new AssetDto();
        dto.setId(asset.getId());
        dto.setName(asset.getName());
        dto.setType(asset.getType());
        dto.setStatus(asset.getStatus());
        dto.setCapacity(asset.getCapacity());
        dto.setStartDatetime(asset.getStartDatetime());
        dto.setEndDatetime(asset.getEndDatetime());
        
        if (asset.getLocation() != null) {
            dto.setLocationId(asset.getLocation().getId());
        }
        return dto;
    }
}
