package com.project.smart_campus_operationhub.controllers;

import com.project.smart_campus_operationhub.services.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@AllArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        System.out.println("Success handler triggered");
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String token = authService.handleGoogleLogin(oAuth2User);
        String targetUrl = "http://localhost:5173/oauth-success?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
//        response.sendRedirect("http://localhost:3000/oauth-success?token=" + token);
    }
}
