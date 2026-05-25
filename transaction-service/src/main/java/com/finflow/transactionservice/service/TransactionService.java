package com.finflow.transactionservice.service;

import com.finflow.transactionservice.entity.Transaction;
import com.finflow.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;
    private final RestTemplate restTemplate;

    public Transaction createTransaction(Transaction transaction) {

        transaction.setTimestamp(LocalDateTime.now());

        Transaction saved = repository.save(transaction);

        restTemplate.postForObject(
                "https://finflow-demo.onrender.com/api/fraud/analyze",
                saved,
                Void.class
        );

        return saved;
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }
}