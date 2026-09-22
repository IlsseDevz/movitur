package com.movitur.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${movitur.jwt.secret}") String secret,
            @Value("${movitur.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
    }

    public String gerarToken(String email, Map<String, Object> claimsExtra) {
        Date agora = new Date();
        Date expira = new Date(agora.getTime() + expirationMs);
        return Jwts.builder()
                .claims(claimsExtra)
                .subject(email)
                .issuedAt(agora)
                .expiration(expira)
                .signWith(key)
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public boolean tokenValido(String token, String email) {
        final String emailToken = extrairEmail(token);
        return emailToken.equalsIgnoreCase(email) && !tokenExpirado(token);
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    private boolean tokenExpirado(String token) {
        return extrairClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extrairClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}
