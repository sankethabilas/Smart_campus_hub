package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.dtos.ApiResponse;
import com.project.smart_campus_operationhub.dtos.AssetDto;
import com.project.smart_campus_operationhub.services.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public ResponseEntity<ApiResponse<AssetDto>> createAsset(@Valid @RequestBody AssetDto assetDto) {
        AssetDto createdAsset = assetService.createAsset(assetDto);
        return new ResponseEntity<>(
                new ApiResponse<>(true, "Asset created successfully", createdAsset),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetDto>>> getAllAssets() {
        List<AssetDto> assets = assetService.getAllAssets();
        return ResponseEntity.ok(new ApiResponse<>(true, "Assets retrieved successfully", assets));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto>> getAssetById(@PathVariable Integer id) {
        AssetDto asset = assetService.getAssetById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Asset retrieved successfully", asset));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto>> updateAsset(@PathVariable Integer id, @Valid @RequestBody AssetDto assetDto) {
        AssetDto updatedAsset = assetService.updateAsset(id, assetDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Asset updated successfully", updatedAsset));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable Integer id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Asset deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<AssetDto>>> searchAssets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) Integer location_id,
            @RequestParam(required = false) Boolean available) {

        List<AssetDto> assets = assetService.searchAssets(type, status, capacity, location_id, available);
        return ResponseEntity.ok(new ApiResponse<>(true, "Assets search results", assets));
    }
}
