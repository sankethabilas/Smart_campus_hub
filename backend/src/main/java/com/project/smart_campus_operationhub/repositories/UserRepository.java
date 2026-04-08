package com.project.smart_campus_operationhub.repositories;

import com.project.smart_campus_operationhub.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {
}
