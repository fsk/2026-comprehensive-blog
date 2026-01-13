package com.fsk.blogsitebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BlogSiteBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlogSiteBackendApplication.class, args);
    }

}
