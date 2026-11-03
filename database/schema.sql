CREATE DATABASE IF NOT EXISTS globalhire_db; USE globalhire_db;
CREATE TABLE IF NOT EXISTS users(id BIGINT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(120) NOT NULL,email VARCHAR(190) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,role VARCHAR(30) NOT NULL DEFAULT 'USER',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS countries(id BIGINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) UNIQUE NOT NULL,code VARCHAR(3),flag VARCHAR(10),currency VARCHAR(50),currency_symbol VARCHAR(8),minimum_wage DECIMAL(14,2),average_salary DECIMAL(14,2),salary_min DECIMAL(14,2),salary_max DECIMAL(14,2),employer_tax DECIMAL(6,3),social_security DECIMAL(6,3),paid_leave INT,sick_leave INT,maternity_leave INT,paternity_leave INT,public_holidays INT,working_hours DECIMAL(5,2),payroll_cycle VARCHAR(40),timezone VARCHAR(80),languages VARCHAR(255),tax_year VARCHAR(20),visa_requirement BOOLEAN,work_permit BOOLEAN,sponsorship BOOLEAN,contract_requirements TEXT,termination_rules TEXT,data_protection TEXT,professional_licensing TEXT,compliance_requirements TEXT,data_status VARCHAR(30) DEFAULT 'DEMO');
CREATE TABLE IF NOT EXISTS country_employment(id BIGINT AUTO_INCREMENT PRIMARY KEY,country_id BIGINT NOT NULL,benefits_pct DECIMAL(6,3),overtime_rules TEXT,FOREIGN KEY(country_id) REFERENCES countries(id));
CREATE TABLE IF NOT EXISTS country_tax(id BIGINT AUTO_INCREMENT PRIMARY KEY,country_id BIGINT NOT NULL,tax_notes TEXT,FOREIGN KEY(country_id) REFERENCES countries(id));
CREATE TABLE IF NOT EXISTS country_benefits(id BIGINT AUTO_INCREMENT PRIMARY KEY,country_id BIGINT NOT NULL,benefit_notes TEXT,FOREIGN KEY(country_id) REFERENCES countries(id));
CREATE TABLE IF NOT EXISTS country_legal(id BIGINT AUTO_INCREMENT PRIMARY KEY,country_id BIGINT NOT NULL,legal_notes TEXT,FOREIGN KEY(country_id) REFERENCES countries(id));
CREATE TABLE IF NOT EXISTS country_scores(id BIGINT AUTO_INCREMENT PRIMARY KEY,country_id BIGINT UNIQUE NOT NULL,talent_availability DECIMAL(5,2),talent_affordability DECIMAL(5,2),digital_infrastructure DECIMAL(5,2),innovation DECIMAL(5,2),compliance_score DECIMAL(5,2),FOREIGN KEY(country_id) REFERENCES countries(id));
CREATE TABLE IF NOT EXISTS job_roles(id BIGINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(120) UNIQUE NOT NULL,category VARCHAR(80));
CREATE TABLE IF NOT EXISTS hiring_scenarios(id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id BIGINT NOT NULL,job_role VARCHAR(120),experience_years DECIMAL(5,2),salary_budget DECIMAL(14,2),employees INT,employment_type VARCHAR(40),company_country VARCHAR(100),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS hiring_scenario_countries(id BIGINT AUTO_INCREMENT PRIMARY KEY,scenario_id BIGINT NOT NULL,country_id BIGINT NOT NULL,FOREIGN KEY(scenario_id) REFERENCES hiring_scenarios(id),FOREIGN KEY(country_id) REFERENCES countries(id));
CREATE TABLE IF NOT EXISTS cost_calculations(id BIGINT AUTO_INCREMENT PRIMARY KEY,scenario_id BIGINT,company_country VARCHAR(100),hiring_country VARCHAR(100),base_salary DECIMAL(14,2),employer_tax DECIMAL(14,2),social_security DECIMAL(14,2),benefits DECIMAL(14,2),visa_cost DECIMAL(14,2),recruitment_cost DECIMAL(14,2),relocation_cost DECIMAL(14,2),total_annual DECIMAL(14,2),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS ml_predictions(id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id BIGINT,model_name VARCHAR(80),prediction DOUBLE,confidence DOUBLE,features_json TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS compliance_assessments(id BIGINT AUTO_INCREMENT PRIMARY KEY,scenario_id BIGINT,country_id BIGINT,category VARCHAR(50),score DOUBLE,notes TEXT);
CREATE TABLE IF NOT EXISTS saved_reports(id BIGINT AUTO_INCREMENT PRIMARY KEY,user_id BIGINT,title VARCHAR(200),report_json LONGTEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX idx_country_code ON countries(code); CREATE INDEX idx_scenario_user ON hiring_scenarios(user_id);

-- GlobalHire legal-document catalogue
-- Run after selecting globalhire_db. The records are official-source references,
-- not downloaded/consolidated legal texts. Verify current text and applicability.
CREATE TABLE IF NOT EXISTS legal_documents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  country_code VARCHAR(3) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  document_title VARCHAR(500) NOT NULL,
  jurisdiction VARCHAR(180),
  issuing_authority VARCHAR(255),
  official_url VARCHAR(1500),
  source_portal VARCHAR(1500),
  document_status VARCHAR(40) DEFAULT 'SOURCE_TO_VERIFY',
  effective_date VARCHAR(40),
  summary TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_legal_country_code (country_code),
  INDEX idx_legal_category (category)
);
