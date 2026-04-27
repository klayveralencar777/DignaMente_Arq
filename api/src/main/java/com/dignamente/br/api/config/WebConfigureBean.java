package com.dignamente.br.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfigureBean {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite explicitamente o seu React
        config.addAllowedOrigin("http://localhost:5173"); 
        
        // Libera todos os cabeçalhos
        config.addAllowedHeader("*");
        
        // Libera todos os métodos (GET, POST, PUT, DELETE, OPTIONS)
        config.addAllowedMethod("*");
        
        // Aplica para todas as rotas do projeto
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}