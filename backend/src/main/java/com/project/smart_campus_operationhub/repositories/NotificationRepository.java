package com.project.smart_campus_operationhub.repositories;

import com.project.smart_campus_operationhub.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUsersEmailOrderByCreatedAtDesc(String email);
    long countByUsersEmailAndIsReadFalse(String email);
}
