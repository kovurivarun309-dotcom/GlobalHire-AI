package com.globalhire.repository;

import com.globalhire.entity.CountryScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface CountryScoreRepository extends JpaRepository<CountryScore, Long> {

    Optional<CountryScore> findByCountryId(Long countryId);

    List<CountryScore> findAllByCountryIdIn(Collection<Long> countryIds);
}
