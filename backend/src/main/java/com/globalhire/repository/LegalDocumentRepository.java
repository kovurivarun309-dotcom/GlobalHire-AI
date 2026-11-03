package com.globalhire.repository;

import com.globalhire.entity.LegalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LegalDocumentRepository extends JpaRepository<LegalDocument, Long> {
    List<LegalDocument> findByCountryCodeIgnoreCaseOrderByCategoryAscDocumentTitleAsc(String countryCode);
}
