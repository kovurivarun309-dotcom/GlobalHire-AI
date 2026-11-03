package com.globalhire.config;
import com.globalhire.entity.User;import com.globalhire.repository.UserRepository;import org.springframework.boot.CommandLineRunner;import org.springframework.context.annotation.*;import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration public class DataInitializer{
 @Bean CommandLineRunner seedUsers(UserRepository r,PasswordEncoder e){return a->{create(r,e,"admin@globalhire.local","Admin@123","ADMIN","GlobalHire Admin");create(r,e,"hr@globalhire.local","HrManager@123","HR_MANAGER","HR Manager");create(r,e,"user@globalhire.local","User@123","USER","Demo User");};}
 void create(UserRepository r,PasswordEncoder e,String mail,String pass,String role,String name){if(r.findByEmail(mail).isEmpty()){User u=new User();u.setEmail(mail);u.setFullName(name);u.setRole(role);u.setPasswordHash(e.encode(pass));r.save(u);}}
}