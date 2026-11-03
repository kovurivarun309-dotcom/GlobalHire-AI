from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import joblib, json, numpy as np, pandas as pd
app=FastAPI(title='GlobalHire AI ML Service',version='1.0')
R=Path(__file__).resolve().parents[1]; models={n:joblib.load(R/f'models/{n}.joblib') for n in ['offer_acceptance','retention','compliance','hiring_cost','time_to_hire']}; metrics=json.load(open(R/'models/metrics.json'))
class AnyInput(BaseModel):
    experience:float=3; salary:float=60000; marketSalary:float=55000; country:str='Germany'; jobRole:str='Software Engineer'; workMode:str='REMOTE'; benefits:float=10; hiringTime:float=28; companySize:float=500; candidateLocation:str='India'; salaryCompetitiveness:float=1.05; workingHours:float=40; employeeHistory:float=3; talentAvailability:float=78; hiringVolume:float=5; employees:float=1; employmentType:str='FULL_TIME'; volume:float=5; salary_ratio:float=1.05; visaRequired:bool=False; sponsorship:bool=False; contractType:str='PERMANENT'
def frame(x):
    return pd.DataFrame([{'experience':x.experience,'salary_ratio':x.salary/max(x.marketSalary,1),'talent':x.talentAvailability,'benefits':x.benefits,'hiring_days':x.hiringTime,'company_size':x.companySize,'country':x.country,'role':x.jobRole,'remote':1 if x.workMode.upper()=='REMOTE' else 0,'visa':int(x.visaRequired),'volume':x.hiringVolume}])
@app.get('/health')
def health(): return {'status':'ok','models':list(models)}
@app.get('/metrics')
def get_metrics(): return metrics
@app.post('/api/ml/offer-acceptance')
def offer(x:AnyInput):
    p=models['offer_acceptance'].predict_proba(frame(x))[0,1]; return {'prediction':p,'probability':p,'confidence':abs(p-.5)*2,'importantFactors':['Competitive salary','Talent availability','Benefits','Hiring time','Visa requirement'],'metrics':metrics['offer_acceptance']}
@app.post('/api/ml/retention')
def retention(x:AnyInput):
    p=models['retention'].predict_proba(frame(x))[0,1]; return {'prediction':p,'probability':p,'confidence':abs(p-.5)*2,'importantFactors':['Salary competitiveness','Benefits','Working hours','Employee history'],'metrics':metrics['retention']}
@app.post('/api/ml/compliance')
def compliance(x:AnyInput):
    p=models['compliance'].predict_proba(frame(x))[0,1]; cat='HIGHER COMPLIANCE ATTENTION' if p>.66 else ('MEDIUM RISK' if p>.33 else 'LOW RISK'); return {'prediction':cat,'probability':p,'confidence':abs(p-.5)*2,'importantFactors':['Visa/work permit','Sponsorship','Working hours','Contract type'],'metrics':metrics['compliance']}
@app.post('/api/ml/hiring-cost')
def cost(x:AnyInput):
    f=pd.DataFrame([{'experience':x.experience,'salary':x.salary,'talent':x.talentAvailability,'volume':x.employees,'hiring_days':x.hiringTime}]); p=float(models['hiring_cost'].predict(f)[0]); return {'prediction':p,'confidence':.72,'importantFactors':['Salary','Employer-side burden','Talent market','Hiring volume'],'metrics':metrics['hiring_cost']}
@app.post('/api/ml/time-to-hire')
def time(x:AnyInput):
    f=pd.DataFrame([{'experience':x.experience,'talent':x.talentAvailability,'volume':x.hiringVolume,'hiring_days':x.hiringTime}]); p=float(models['time_to_hire'].predict(f)[0]); return {'prediction':p,'confidence':.70,'importantFactors':['Talent availability','Hiring volume','Experience'],'metrics':metrics['time_to_hire']}
