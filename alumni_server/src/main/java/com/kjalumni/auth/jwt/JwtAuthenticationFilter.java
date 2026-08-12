package com.kjalumni.auth.jwt;

import com.kjalumni.auth.entity.User;
import com.kjalumni.auth.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter
{

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException
    {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer "))
        {

            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        String email = jwtService.extractUsername(jwt);

        if (email != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null)
        {

            User user = userDetailsService.loadUserByUsername(email);

            if (user != null &&
                    jwtService.isTokenValid(jwt, user))
            {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                user.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}