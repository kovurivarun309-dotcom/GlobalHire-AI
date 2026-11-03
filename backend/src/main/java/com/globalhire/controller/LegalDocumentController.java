package com.globalhire.controller;

import com.globalhire.entity.LegalDocument;
import com.globalhire.repository.LegalDocumentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/legal-documents")
public class LegalDocumentController {
    private final LegalDocumentRepository repository;
    public LegalDocumentController(LegalDocumentRepository repository) { this.repository = repository; }

    @GetMapping
    public List<LegalDocument> list(
            @RequestParam(required=false) String countryCode,
            @RequestParam(required=false) String category,
            @RequestParam(required=false) String q) {
        return repository.findAll().stream()
            .filter(d -> countryCode == null || countryCode.isBlank() || d.getCountryCode().equalsIgnoreCase(countryCode))
            .filter(d -> category == null || category.isBlank() || d.getCategory().equalsIgnoreCase(category))
            .filter(d -> q == null || q.isBlank() ||
                (d.getDocumentTitle() != null && d.getDocumentTitle().toLowerCase().contains(q.toLowerCase())) ||
                (d.getCountryName() != null && d.getCountryName().toLowerCase().contains(q.toLowerCase())) ||
                (d.getSummary() != null && d.getSummary().toLowerCase().contains(q.toLowerCase())))
            .sorted(Comparator.comparing(LegalDocument::getCountryName).thenComparing(LegalDocument::getCategory).thenComparing(LegalDocument::getDocumentTitle))
            .collect(Collectors.toList());
    }

    @GetMapping("/countries")
    public List<Map<String,String>> countries() {
        Map<String,String> unique = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        repository.findAll().forEach(d -> unique.put(d.getCountryCode(), d.getCountryName()));
        return unique.entrySet().stream().map(e -> Map.of("code", e.getKey(), "name", e.getValue())).toList();
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return repository.findAll().stream().map(LegalDocument::getCategory).filter(Objects::nonNull).distinct().sorted().toList();
    }
}
