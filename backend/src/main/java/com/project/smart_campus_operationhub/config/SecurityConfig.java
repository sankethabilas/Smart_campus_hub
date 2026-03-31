package com.project.smart_campus_operationhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http)) // Enables CORS integration
                .csrf(csrf -> csrf.disable()) // Disables CSRF for easy testing
                .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll() //ensure every endpoint accessible without authentication
                        );
        return http.build();
    }
}
