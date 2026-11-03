package com.globalhire.security;
import jakarta.servlet.*;import jakarta.servlet.http.*;import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;import org.springframework.security.core.authority.SimpleGrantedAuthority;import org.springframework.security.core.context.SecurityContextHolder;import org.springframework.web.filter.OncePerRequestFilter;import org.springframework.stereotype.Component;import java.io.IOException;import java.util.*;
@Component public class JwtFilter extends OncePerRequestFilter{
 private final JwtService jwt; public JwtFilter(JwtService j){jwt=j;}
 @Override protected void doFilterInternal(HttpServletRequest r,HttpServletResponse s,FilterChain chain)throws ServletException,IOException{
  String h=r.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")){try{String t=h.substring(7);String email=jwt.email(t);String role=jwt.role(t);var auth=new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority("ROLE_"+role)));SecurityContextHolder.getContext().setAuthentication(auth);}catch(Exception ignored){}}
  chain.doFilter(r,s);
 }
}