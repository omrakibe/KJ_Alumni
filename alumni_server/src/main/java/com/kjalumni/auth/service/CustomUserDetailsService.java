package com.kjalumni.auth.service;

import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService
{

    private final UserRepository userRepository;

    @Override
    public User loadUserByUsername(String email)
            throws UsernameNotFoundException
    {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + email
                        )
                );
    }
}