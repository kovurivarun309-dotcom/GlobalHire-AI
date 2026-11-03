package com.globalhire.security;
import io.jsonwebtoken.*;import io.jsonwebtoken.security.Keys;import org.springframework.beans.factory.annotation.Value;import org.springframework.stereotype.Service;import javax.crypto.SecretKey;import java.nio.charset.StandardCharsets;import java.util.*;
@Service public class JwtService{
 @Value("${app.jwt.secret}") String secret; @Value("${app.jwt.expiration-ms}") long exp;
 SecretKey key(){return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));}
 public String generate(String email,String role){return Jwts.builder().subject(email).claim("role",role).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+exp)).signWith(key()).compact();}
 public Claims claims(String t){return Jwts.parser().verifyWith(key()).build().parseSignedClaims(t).getPayload();}
 public String email(String t){return claims(t).getSubject();} public String role(String t){return claims(t).get("role",String.class);}
}