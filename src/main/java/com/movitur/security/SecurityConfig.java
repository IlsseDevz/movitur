package com.movitur.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(
                        "/assets/**", "/index.html", "/vite.svg", "/favicon.ico",
                        "/", "/cliente", "/cliente/**",
                        "/admin", "/admin/login", "/admin/**"
                );
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                        // Recursos estaticos (React) e rotas do SPA
                        .requestMatchers("/", "/index.html", "/assets/**", "/vite.svg", "/_next/**",
                                "/cliente", "/cliente/**",
                                "/admin/login",
                                "/admin", "/admin/**",
                                "/login", "/registo", "/categorias", "/destinos", "/guias",
                                "/simulador", "/painel", "/painel/").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        // Perfil do utilizador autenticado
                        .requestMatchers("/api/auth/me", "/api/auth/perfil", "/api/auth/alterar-senha").authenticated()
                        // Autenticacao (registo/login publicos)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Consulta publica (front office)
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**", "/api/destinos/**", "/api/guias/**", "/api/estabelecimentos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/feedback/publicos", "/api/feedback/resumo", "/api/feedback/recentes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/avaliacoes/guia/**").permitAll()
                        // Feedback - clientes autenticados
                        .requestMatchers("/api/feedback/**").hasRole("CLIENTE")
                        // Avaliacoes - apenas clientes autenticados
                        .requestMatchers("/api/avaliacoes/**").hasRole("CLIENTE")
                        // Simulador - apenas utilizadores autenticados (simulacoes por utilizador)
                        .requestMatchers("/api/simulador/**").authenticated()
                        // Reservas - apenas clientes autenticados
                        .requestMatchers("/api/reservas/**").hasRole("CLIENTE")
                        // Poupancas e pagamentos - apenas clientes
                        .requestMatchers("/api/poupancas/**", "/api/pagamentos/**").hasRole("CLIENTE")
                        // Favoritos - apenas clientes
                        .requestMatchers("/api/favoritos/**").hasRole("CLIENTE")
                        // Notificacoes - utilizadores autenticados
                        .requestMatchers("/api/notificacoes/**").authenticated()
                        // Back office - apenas ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Restante escrita em catalogo - apenas ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/categorias/**", "/api/destinos/**", "/api/guias/**", "/api/estabelecimentos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**", "/api/destinos/**", "/api/guias/**", "/api/estabelecimentos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**", "/api/destinos/**", "/api/guias/**", "/api/estabelecimentos/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
