package com.project.smart_campus_operationhub;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusOperationHubApplication {

    public static void main(String[] args) {
        // Load .env from the backend directory
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        // Map .env variables to System properties for Spring Boot to pick them up
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        SpringApplication.run(SmartCampusOperationHubApplication.class, args);
    }

}
