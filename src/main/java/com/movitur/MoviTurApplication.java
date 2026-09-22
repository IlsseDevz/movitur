package com.movitur;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MoviTurApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoviTurApplication.class, args);
    }
}
