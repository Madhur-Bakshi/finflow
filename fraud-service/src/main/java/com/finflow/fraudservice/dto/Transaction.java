package com.finflow.fraudservice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    private Long id;

    private String userId;

    private String merchant;

    private Double amount;

    private String category;

    private LocalDateTime timestamp;
}