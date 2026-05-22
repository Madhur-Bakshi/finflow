package com.finflow.transactionservice.service;

import com.finflow.transactionservice.entity.Transaction;
import com.finflow.transactionservice.kafka.TransactionProducer;
import com.finflow.transactionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repository;
    private final TransactionProducer producer;

    public Transaction createTransaction(Transaction transaction) {

        transaction.setTimestamp(LocalDateTime.now());

        Transaction saved = repository.save(transaction);

        producer.publishTransaction(saved);

        return saved;
    }

    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }
}