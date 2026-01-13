package com.fsk.blogsitebackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fsk.blogsitebackend.entities.CategoryEntity;
import com.fsk.blogsitebackend.entities.PostEntity;
import com.fsk.blogsitebackend.entities.User;
import com.fsk.blogsitebackend.repository.CategoryRepository;
import com.fsk.blogsitebackend.repository.PostRepository;
import com.fsk.blogsitebackend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;

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

        if (categoryRepository.count() == 0) {
            createCategory("Java", "java", "Java programming language articles");
            createCategory("Spring Boot", "spring-boot", "Spring Boot framework tutorials");
            createCategory("React", "react", "Frontend development with React");
            createCategory("Architecture", "architecture", "Software design and architecture");
            createCategory("Personal", "personal", "Personal updates and thoughts");
            System.out.println("Default categories seeded.");
        }

        if (postRepository.count() <= 4) {
            CategoryEntity cat1 = categoryRepository.findBySlug("java").orElse(null);
            CategoryEntity cat2 = categoryRepository.findBySlug("spring-boot").orElse(null);
            CategoryEntity cat3 = categoryRepository.findBySlug("react").orElse(null);
            CategoryEntity cat4 = categoryRepository.findBySlug("architecture").orElse(null);
            CategoryEntity cat5 = categoryRepository.findBySlug("personal").orElse(null);

            User author = userRepository.findAll().get(0);

            // Seed original 4 if missing
            if (postRepository.count() == 0) {
                createPost("Spring Boot Microservices", "spring-boot-microservices", "Content about microservices...",
                        cat2, author);
                createPost("React Hooks Guide", "react-hooks-guide", "Content about hooks...", cat3, author);
                createPost("Java 21 Features", "java-21-features", "Content about Java 21...", cat1, author);
                createPost("Clean Code Principles", "clean-code-principles", "Content about clean code...", cat4,
                        author);
            }

            // Seed 10 additional posts for testing pagination and layout
            createPost("High Performance Java Persistence", "high-performance-java-persistence",
                    "Deep dive into JPA and Hibernate performance tuning...", cat1, author);
            createPost("Spring Security with JWT", "spring-security-jwt",
                    "Implementing stateless authentication in Spring Boot...", cat2, author);
            createPost("Mastering Next.js 14", "mastering-nextjs-14",
                    "Server components, streaming, and the new App Router...", cat3, author);
            createPost("Domain Driven Design in Practice", "ddd-in-practice",
                    "Applying strategic and tactical DDD patterns to complex domains...", cat4, author);
            createPost("My Journey into Open Source", "my-open-source-journey",
                    "How I started contributing to major Java libraries...", cat5, author);
            createPost("The Future of Cloud Native Java", "cloud-native-java-future",
                    "GraalVM, Quarks, and the evolution of JVM in the cloud...", cat1, author);
            createPost("Building Real-time Apps with WebSockets", "spring-boot-websockets",
                    "Real-time communication using Spring Boot and STOMP...", cat2, author);
            createPost("State Management in React 2026", "react-state-management-2026",
                    "Zustand vs Jotai vs Redux Toolkit in the modern era...", cat3, author);
            createPost("Micro-frontends Architecture", "micro-frontends-architecture",
                    "Decoupling your frontend for better scalability and faster teams...", cat4, author);
            createPost("A Day in the Life of a Senior Engineer", "day-in-life-senior-engineer",
                    "Focus, meetings, and deep work strategies...", cat5, author);

            System.out.println("Total 14 test posts seeded successfully.");
        }
    }

    private CategoryEntity createCategory(String name, String slug, String desc) {
        CategoryEntity cat = new CategoryEntity();
        cat.setName(name);
        cat.setSlug(slug);
        cat.setDescription(desc);
        return categoryRepository.save(cat);
    }

    private void createPost(String title, String slug, String content, CategoryEntity category, User author) {
        PostEntity post = new PostEntity();
        post.setTitle(title);
        post.setSlug(slug);
        post.setContent(content);
        post.setExcerpt("Excerpt for " + title);
        post.setStatus(PostEntity.PostStatus.PUBLISHED);
        post.setPublishedAt(LocalDateTime.now());
        post.setAuthor(author);
        post.setCategories(Set.of(category));
        postRepository.save(post);
    }
}
