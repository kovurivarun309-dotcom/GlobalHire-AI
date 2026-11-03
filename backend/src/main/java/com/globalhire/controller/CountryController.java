package com.globalhire.controller;

import com.globalhire.entity.Country;
import com.globalhire.entity.CountryScore;
import com.globalhire.repository.CountryRepository;
import com.globalhire.repository.CountryScoreRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    private final CountryRepository countryRepository;
    private final CountryScoreRepository countryScoreRepository;

    public CountryController(
            CountryRepository countryRepository,
            CountryScoreRepository countryScoreRepository) {
        this.countryRepository = countryRepository;
        this.countryScoreRepository = countryScoreRepository;
    }

    @GetMapping
    public List<Country> all() {

        List<Country> countries = countryRepository.findAll();

        if (countries.isEmpty()) {
            return countries;
        }

        List<Long> countryIds = countries.stream()
                .map(Country::getId)
                .filter(Objects::nonNull)
                .toList();

        Map<Long, CountryScore> scores = countryScoreRepository
                .findAllByCountryIdIn(countryIds)
                .stream()
                .collect(Collectors.toMap(
                        CountryScore::getCountryId,
                        Function.identity()
                ));

        countries.forEach(country -> applyScore(country, scores.get(country.getId())));

        return countries;
    }

    @GetMapping("/{id}")
    public Country one(@PathVariable Long id) {

        Country country = countryRepository.findById(id)
                .orElseThrow();

        CountryScore score = countryScoreRepository
                .findByCountryId(id)
                .orElse(null);

        applyScore(country, score);

        return country;
    }

    private void applyScore(Country country, CountryScore score) {

        if (score == null) {
            return;
        }

        country.setTalentAvailability(score.getTalentAvailability());
        country.setTalentAffordability(score.getTalentAffordability());
        country.setDigitalInfrastructure(score.getDigitalInfrastructure());
        country.setInnovation(score.getInnovation());
        country.setComplianceScore(score.getComplianceScore());
    }
}
