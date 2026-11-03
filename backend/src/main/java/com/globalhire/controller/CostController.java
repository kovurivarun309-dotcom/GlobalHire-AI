package com.globalhire.controller;
import com.globalhire.dto.CostRequest;import com.globalhire.entity.Country;import com.globalhire.repository.CountryRepository;import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/cost")public class CostController{
 final CountryRepository repo;public CostController(CountryRepository r){repo=r;}
 @PostMapping("/calculate")public Map<String,Object> calc(@RequestBody CostRequest x){
  Country c=repo.findByNameIgnoreCase(x.hiringCountry()).orElseThrow();
  double base=x.annualSalary(),tax=base*c.getEmployerTax()/100,ss=base*c.getSocialSecurity()/100,benefits=base*x.benefits()/100;
  double visa=x.visaRequired()?x.visaCost():0,total=base+tax+ss+benefits+visa+x.recruitmentCost()+x.relocationCost();
  Map<String,Object> o=new LinkedHashMap<>();o.put("baseSalary",base);o.put("employerTax",tax);o.put("socialSecurity",ss);o.put("benefits",benefits);o.put("visaCost",visa);o.put("recruitmentCost",x.recruitmentCost());o.put("relocationCost",x.relocationCost());o.put("totalAnnual",total);o.put("monthlyCost",total/12);o.put("costPerEmployee",total/x.employees());o.put("totalForAllEmployees",total*x.employees());return o;
 }
}