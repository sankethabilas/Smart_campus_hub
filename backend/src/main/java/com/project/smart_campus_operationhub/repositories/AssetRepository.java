package com.project.smart_campus_operationhub.repositories;

import com.project.smart_campus_operationhub.entities.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Integer>, JpaSpecificationExecutor<Asset> {
    boolean existsByNameAndLocationId(String name, Integer locationId);
    boolean existsByNameAndLocationIdAndIdNot(String name, Integer locationId, Integer id);
}
