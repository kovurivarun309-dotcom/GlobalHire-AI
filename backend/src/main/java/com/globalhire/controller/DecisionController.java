package com.globalhire.controller;

import com.globalhire.entity.Country;
import com.globalhire.repository.CountryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/decision-support")
public class DecisionController {

    private final CountryRepository r;

    public DecisionController(CountryRepository x) {
        r = x;
    }

    @PostMapping("/analyze")
    public Map<String, Object> analyze(@RequestBody Map<String, Object> b) {

        List<String> names = (List<String>) b.getOrDefault(
                "preferredCountries",
                List.of("India", "Germany", "Australia", "Poland")
        );

        Map<String, Double> w = (Map<String, Double>) b.getOrDefault(
                "weights",
                Map.of(
                        "cost", 0.3,
                        "talent", 0.25,
                        "speed", 0.15,
                        "retention", 0.15,
                        "compliance", 0.15
                )
        );

        List<Map<String, Object>> out = new ArrayList<>();

        for (String n : names) {

            Country c = r.findByNameIgnoreCase(n).orElse(null);

            if (c == null) {
                continue;
            }

            double cost = c.getAverageSalary()
                    * (1 + c.getEmployerTax() / 100 + c.getSocialSecurity() / 100);

            double time = Math.max(
                    15,
                    55 - c.getAverageSalary() / 20000 - 75
            );

            double acceptance = 0.55
                    + 75.0 / 300.0
                    + (c.getAverageSalary() < 100000 ? 0.08 : 0);

            double retention = 0.60 + 75.0 / 400.0;

            double comp = c.isVisaRequirement() ? 60 : 85;

            double score =
                    w.getOrDefault("cost", 0.3)
                            * (100 / (1 + cost / 100000))
                    + w.getOrDefault("talent", 0.25) * 75
                    + w.getOrDefault("speed", 0.15) * (100 - time)
                    + w.getOrDefault("retention", 0.15) * retention * 100
                    + w.getOrDefault("compliance", 0.15) * comp;

            out.add(Map.of(
                    "country", c.getName(),
                    "totalCost", cost,
                    "hiringTime", time,
                    "acceptance", Math.min(0.95, acceptance),
                    "retention", Math.min(0.95, retention),
                    "compliance",
                            comp >= 75
                                    ? "LOW RISK"
                                    : comp >= 50
                                    ? "MEDIUM RISK"
                                    : "HIGHER COMPLIANCE ATTENTION",
                    "score", score
            ));
        }

        return Map.of(
                "countries", out,
                "explanation",
                "The index is a transparent weighted trade-off view. Changing weights changes the relative scores; it is not an objective ranking or legal recommendation."
        );
    }

    private double getTalentAvailabilitySafe() {
        return 75;
    }
}
