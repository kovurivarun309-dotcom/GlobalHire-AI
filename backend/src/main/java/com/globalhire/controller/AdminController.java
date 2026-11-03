package com.globalhire.controller;
import com.globalhire.entity.Country;import com.globalhire.repository.CountryRepository;import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/admin") public class AdminController{
 final CountryRepository r;public AdminController(CountryRepository x){r=x;}
 @PostMapping("/countries") public Country create(@RequestBody Country c){c.setId(null);if(c.getDataStatus()==null)c.setDataStatus("DEMO");return r.save(c);}
 @PutMapping("/countries/{id}") public Country update(@PathVariable Long id,@RequestBody Country c){c.setId(id);return r.save(c);}
 @DeleteMapping("/countries/{id}") public Map<String,String> delete(@PathVariable Long id){r.deleteById(id);return Map.of("message","Country deleted");}
}