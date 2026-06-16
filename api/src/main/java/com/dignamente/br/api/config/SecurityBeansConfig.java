package com.dignamente.br.api.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityBeansConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter)
            throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/medical-records").authenticated()

                        // 1. Rota de leitura (GET) para psicólogos continua livre para todos
                        .requestMatchers(HttpMethod.GET, "/psychologists", "/psychologists/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/psychologists").permitAll()

                        // 2. Rotas protegidas de exclusão e edição de psicólogos
                        .requestMatchers(HttpMethod.DELETE, "/psychologists/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/psychologists/**").hasRole("ADMIN")

                        // 3. Demais regras (Pacientes, Arquivos, etc)
                        .requestMatchers("/patients", "/patients/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/files/upload").permitAll()
                        .requestMatchers("/files/**").permitAll()

                        // 👇 SEGURANÇA RESTAURADA: Apenas Admins podem mexer nos Admins!
                        .requestMatchers("/admins", "/admins/**").hasRole("ADMIN")
                        .requestMatchers("/registration/*").hasRole("ADMIN")

                        // Libera as consultas para quem estiver logado (Psicólogo, Paciente ou Admin)
                        .requestMatchers("/appointments", "/appointments/**").authenticated()

                        .requestMatchers("/psychologists-registration/**").permitAll()
                        .requestMatchers("/test/**").permitAll()
                        .anyRequest().authenticated());

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

   @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 👇 Mude de setAllowedOrigins para setAllowedOriginPatterns com "*"
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}