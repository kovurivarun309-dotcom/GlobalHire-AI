package com.globalhire.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "countries")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;
    private String flag;
    private String currency;
    private String currencySymbol;
    private Double minimumWage;
    private Double averageSalary;
    private Double salaryMin;
    private Double salaryMax;
    private Double employerTax;
    private Double socialSecurity;
    private Integer paidLeave;
    private Integer sickLeave;
    private Integer maternityLeave;
    private Integer paternityLeave;
    private Integer publicHolidays;
    private Integer workingHours;
    private String payrollCycle;
    private String timezone;
    private String languages;
    private String taxYear;
    private String visaRequirement;
    private String workPermit;
    private String sponsorship;
    private String contractRequirements;
    private String terminationRules;
    private String dataProtection;
    private String professionalLicensing;
    private String complianceRequirements;
    private String dataStatus;

    @Transient
    private Double talentAvailability;

    @Transient
    private Double talentAffordability;

    @Transient
    private Double digitalInfrastructure;

    @Transient
    private Double innovation;

    @Transient
    private Double complianceScore;

    public Country() {
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCode() { return code; }
    public String getFlag() { return flag; }
    public String getCurrency() { return currency; }
    public String getCurrencySymbol() { return currencySymbol; }
    public Double getMinimumWage() { return minimumWage; }
    public Double getAverageSalary() { return averageSalary; }
    public Double getSalaryMin() { return salaryMin; }
    public Double getSalaryMax() { return salaryMax; }
    public Double getEmployerTax() { return employerTax; }
    public Double getSocialSecurity() { return socialSecurity; }
    public Integer getPaidLeave() { return paidLeave; }
    public Integer getSickLeave() { return sickLeave; }
    public Integer getMaternityLeave() { return maternityLeave; }
    public Integer getPaternityLeave() { return paternityLeave; }
    public Integer getPublicHolidays() { return publicHolidays; }
    public Integer getWorkingHours() { return workingHours; }
    public String getPayrollCycle() { return payrollCycle; }
    public String getTimezone() { return timezone; }
    public String getLanguages() { return languages; }
    public String getTaxYear() { return taxYear; }
    public String getVisaRequirement() { return visaRequirement; }
    public boolean isVisaRequirement() { return parseBoolean(visaRequirement); }
    public String getWorkPermit() { return workPermit; }
    public boolean isWorkPermit() { return parseBoolean(workPermit); }
    public String getSponsorship() { return sponsorship; }
    public boolean isSponsorship() { return parseBoolean(sponsorship); }
    public String getContractRequirements() { return contractRequirements; }
    public String getTerminationRules() { return terminationRules; }
    public String getDataProtection() { return dataProtection; }
    public String getProfessionalLicensing() { return professionalLicensing; }
    public String getComplianceRequirements() { return complianceRequirements; }
    public String getDataStatus() { return dataStatus; }

    public Double getTalentAvailability() { return talentAvailability; }
    public Double getTalentAffordability() { return talentAffordability; }
    public Double getDigitalInfrastructure() { return digitalInfrastructure; }
    public Double getInnovation() { return innovation; }
    public Double getComplianceScore() { return complianceScore; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCode(String code) { this.code = code; }
    public void setFlag(String flag) { this.flag = flag; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }
    public void setMinimumWage(Double minimumWage) { this.minimumWage = minimumWage; }
    public void setAverageSalary(Double averageSalary) { this.averageSalary = averageSalary; }
    public void setSalaryMin(Double salaryMin) { this.salaryMin = salaryMin; }
    public void setSalaryMax(Double salaryMax) { this.salaryMax = salaryMax; }
    public void setEmployerTax(Double employerTax) { this.employerTax = employerTax; }
    public void setSocialSecurity(Double socialSecurity) { this.socialSecurity = socialSecurity; }
    public void setPaidLeave(Integer paidLeave) { this.paidLeave = paidLeave; }
    public void setSickLeave(Integer sickLeave) { this.sickLeave = sickLeave; }
    public void setMaternityLeave(Integer maternityLeave) { this.maternityLeave = maternityLeave; }
    public void setPaternityLeave(Integer paternityLeave) { this.paternityLeave = paternityLeave; }
    public void setPublicHolidays(Integer publicHolidays) { this.publicHolidays = publicHolidays; }
    public void setWorkingHours(Integer workingHours) { this.workingHours = workingHours; }
    public void setPayrollCycle(String payrollCycle) { this.payrollCycle = payrollCycle; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    public void setLanguages(String languages) { this.languages = languages; }
    public void setTaxYear(String taxYear) { this.taxYear = taxYear; }
    public void setVisaRequirement(String visaRequirement) { this.visaRequirement = visaRequirement; }
    public void setWorkPermit(String workPermit) { this.workPermit = workPermit; }
    public void setSponsorship(String sponsorship) { this.sponsorship = sponsorship; }
    public void setContractRequirements(String contractRequirements) { this.contractRequirements = contractRequirements; }
    public void setTerminationRules(String terminationRules) { this.terminationRules = terminationRules; }
    public void setDataProtection(String dataProtection) { this.dataProtection = dataProtection; }
    public void setProfessionalLicensing(String professionalLicensing) { this.professionalLicensing = professionalLicensing; }
    public void setComplianceRequirements(String complianceRequirements) { this.complianceRequirements = complianceRequirements; }
    public void setDataStatus(String dataStatus) { this.dataStatus = dataStatus; }

    public void setTalentAvailability(Double talentAvailability) { this.talentAvailability = talentAvailability; }
    public void setTalentAffordability(Double talentAffordability) { this.talentAffordability = talentAffordability; }
    public void setDigitalInfrastructure(Double digitalInfrastructure) { this.digitalInfrastructure = digitalInfrastructure; }
    public void setInnovation(Double innovation) { this.innovation = innovation; }
    public void setComplianceScore(Double complianceScore) { this.complianceScore = complianceScore; }

    private boolean parseBoolean(String value) {
        if (value == null) return false;
        return value.equalsIgnoreCase("true")
                || value.equalsIgnoreCase("yes")
                || value.equalsIgnoreCase("required")
                || value.equalsIgnoreCase("mandatory");
    }
}
