package com.finflow.transactionservice.controller;

import com.finflow.transactionservice.entity.Transaction;
import com.finflow.transactionservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    public Transaction create(
            @RequestBody Transaction transaction
    ) {
        return service.createTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getAll() {
        return service.getAllTransactions();
    }
}