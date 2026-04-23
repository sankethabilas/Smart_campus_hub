package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.dtos.AssetDto;

import java.util.List;

public interface AssetService {
    AssetDto createAsset(AssetDto assetDto);
    List<AssetDto> getAllAssets();
    AssetDto getAssetById(Integer id);
    AssetDto updateAsset(Integer id, AssetDto assetDto);
    void deleteAsset(Integer id);
    List<AssetDto> searchAssets(String type, String status, Integer minCapacity, Integer locationId, Boolean available);
}
