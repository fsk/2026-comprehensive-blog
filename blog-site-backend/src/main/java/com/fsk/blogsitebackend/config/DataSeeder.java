package com.fsk.blogsitebackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword("password");
            admin.setFirstName("Furkan Sahin");
            admin.setLastName("Kulaksiz");
            admin.setRole(User.UserRole.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin user created.");
        }
    }
}
