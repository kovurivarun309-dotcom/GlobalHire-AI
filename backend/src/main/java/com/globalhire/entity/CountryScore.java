package com.globalhire.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "country_scores")
public class CountryScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country_id", nullable = false, unique = true)
    private Long countryId;

    @Column(name = "talent_availability")
    private Double talentAvailability;

    @Column(name = "talent_affordability")
    private Double talentAffordability;

    @Column(name = "digital_infrastructure")
    private Double digitalInfrastructure;

    @Column(name = "innovation")
    private Double innovation;

    @Column(name = "compliance_score")
    private Double complianceScore;

    public CountryScore() {
    }

    public Long getId() {
        return id;
    }

    public Long getCountryId() {
        return countryId;
    }

    public Double getTalentAvailability() {
        return talentAvailability;
    }

    public Double getTalentAffordability() {
        return talentAffordability;
    }

    public Double getDigitalInfrastructure() {
        return digitalInfrastructure;
    }

    public Double getInnovation() {
        return innovation;
    }

    public Double getComplianceScore() {
        return complianceScore;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public void setTalentAvailability(Double talentAvailability) {
        this.talentAvailability = talentAvailability;
    }

    public void setTalentAffordability(Double talentAffordability) {
        this.talentAffordability = talentAffordability;
    }

    public void setDigitalInfrastructure(Double digitalInfrastructure) {
        this.digitalInfrastructure = digitalInfrastructure;
    }

    public void setInnovation(Double innovation) {
        this.innovation = innovation;
    }

    public void setComplianceScore(Double complianceScore) {
        this.complianceScore = complianceScore;
    }
}
