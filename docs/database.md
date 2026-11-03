# ER diagram description
users 1---N hiring_scenarios; hiring_scenarios N---N countries through hiring_scenario_countries; countries 1---1 country_scores; countries 1---N country_employment/country_tax/country_benefits/country_legal; hiring_scenarios 1---N cost_calculations and compliance_assessments; users 1---N ml_predictions and saved_reports. job_roles is a reusable lookup table.
