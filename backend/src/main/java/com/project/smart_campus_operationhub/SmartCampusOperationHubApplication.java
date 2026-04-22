package com.project.smart_campus_operationhub;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusOperationHubApplication {

    public static void main(String[] args) {
        // Manually load .env so Spring can resolve ${VAR} placeholders
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(SmartCampusOperationHubApplication.class, args);
    }

}
