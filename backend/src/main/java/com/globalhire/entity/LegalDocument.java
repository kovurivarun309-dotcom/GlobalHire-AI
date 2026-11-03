package com.globalhire.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "legal_documents", indexes = {
    @Index(name = "idx_legal_country_code", columnList = "country_code"),
    @Index(name = "idx_legal_category", columnList = "category")
})
public class LegalDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="country_code", nullable=false, length=3)
    private String countryCode;
    @Column(name="country_name", nullable=false, length=100)
    private String countryName;
    @Column(nullable=false, length=100)
    private String category;
    @Column(name="document_title", nullable=false, length=500)
    private String documentTitle;
    @Column(length=180)
    private String jurisdiction;
    @Column(name="issuing_authority", length=255)
    private String issuingAuthority;
    @Column(name="official_url", length=1500)
    private String officialUrl;
    @Column(name="source_portal", length=1500)
    private String sourcePortal;
    @Column(name="document_status", length=40)
    private String documentStatus;
    @Column(name="effective_date", length=40)
    private String effectiveDate;
    @Column(columnDefinition="TEXT")
    private String summary;
    @Column(columnDefinition="TEXT")
    private String notes;

    public Long getId(){return id;} public String getCountryCode(){return countryCode;}
    public String getCountryName(){return countryName;} public String getCategory(){return category;}
    public String getDocumentTitle(){return documentTitle;} public String getJurisdiction(){return jurisdiction;}
    public String getIssuingAuthority(){return issuingAuthority;} public String getOfficialUrl(){return officialUrl;}
    public String getSourcePortal(){return sourcePortal;} public String getDocumentStatus(){return documentStatus;}
    public String getEffectiveDate(){return effectiveDate;} public String getSummary(){return summary;}
    public String getNotes(){return notes;}
    public void setId(Long v){id=v;} public void setCountryCode(String v){countryCode=v;}
    public void setCountryName(String v){countryName=v;} public void setCategory(String v){category=v;}
    public void setDocumentTitle(String v){documentTitle=v;} public void setJurisdiction(String v){jurisdiction=v;}
    public void setIssuingAuthority(String v){issuingAuthority=v;} public void setOfficialUrl(String v){officialUrl=v;}
    public void setSourcePortal(String v){sourcePortal=v;} public void setDocumentStatus(String v){documentStatus=v;}
    public void setEffectiveDate(String v){effectiveDate=v;} public void setSummary(String v){summary=v;}
    public void setNotes(String v){notes=v;}
}
