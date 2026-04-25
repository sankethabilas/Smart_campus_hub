package com.project.smart_campus_operationhub.config;

import com.project.smart_campus_operationhub.controllers.OAuth2SuccessHandler;
import com.project.smart_campus_operationhub.filters.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(c -> c
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(c -> c
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers("/login/**").permitAll()
                        .requestMatchers("/error").permitAll() // From main branch
                        .requestMatchers(HttpMethod.GET, "/api/assets/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/*/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/bookings/*/reject").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/bookings").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN") // From rolemanagement branch
                        .requestMatchers(HttpMethod.GET, "/api/tickets/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/tickets").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/assign").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/close").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/reject").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/status").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*/resolve").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.PUT, "/api/tickets/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                        }))
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2SuccessHandler))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
