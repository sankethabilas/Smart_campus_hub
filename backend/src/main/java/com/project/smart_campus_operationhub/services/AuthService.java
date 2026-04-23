package com.project.smart_campus_operationhub.services;

import com.project.smart_campus_operationhub.entities.Users;
import com.project.smart_campus_operationhub.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public String handleGoogleLogin(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        Users user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new Users();
            user.setEmail(email);
            user.setName(name);
            user.setOauthProvider("google");
            user.setOauthProviderId(providerId);
            userRepository.save(user);
        }

        return jwtService.generateToken(user);
    }
}
