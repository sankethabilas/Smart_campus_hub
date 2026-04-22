package com.project.smart_campus_operationhub.repositories;

import com.project.smart_campus_operationhub.entities.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
}
