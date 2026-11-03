from pathlib import Path
import numpy as np, pandas as pd, joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score,precision_score,recall_score,f1_score,mean_absolute_error,mean_squared_error,r2_score,roc_auc_score,confusion_matrix
import json
R=Path(__file__).parent; (R/'models').mkdir(exist_ok=True); (R/'data').mkdir(exist_ok=True)
rng=np.random.default_rng(42); n=2500
countries=['India','Germany','Australia','Poland','Singapore','Canada','United Kingdom','United States']; roles=['Software Engineer','Data Scientist','Product Manager','UX Designer']
df=pd.DataFrame({'experience':rng.integers(0,12,n),'salary_ratio':rng.normal(1,0.18,n).clip(.5,1.8),'talent':rng.integers(45,96,n),'benefits':rng.integers(2,20,n),'hiring_days':rng.integers(10,70,n),'company_size':rng.integers(10,5000,n),'country':rng.choice(countries,n),'role':rng.choice(roles,n),'remote':rng.integers(0,2,n),'volume':rng.integers(1,30,n),'hours':rng.normal(40,4,n).clip(30,55),'history':rng.integers(0,10,n),'visa':rng.integers(0,2,n),'sponsorship':rng.integers(0,2,n),'salary':rng.integers(30000,160000,n)})
df['accept']=((.42+.22*(df.salary_ratio-1)+.003*df.talent+.012*df.benefits-.003*df.hiring_days-.05*df.visa+.03*df.remote+rng.normal(0,.12,n))>.58).astype(int)
df['retention']=((.45+.20*df.salary_ratio+.004*df.benefits-.015*(df.hours-40)+.01*df.history+.002*df.talent+rng.normal(0,.12,n))>.73).astype(int)
df['compliance']=((df.visa*.3+df.sponsorship*.25+(df.hours>48)*.3+(df.salary<30000)*.25+rng.normal(0,.08,n))>.42).astype(int)
features=['experience','salary_ratio','talent','benefits','hiring_days','company_size','country','role','remote','visa']
cat=['country','role']; num=[x for x in features if x not in cat]
pre=ColumnTransformer([('cat',OneHotEncoder(handle_unknown='ignore'),cat),('num',StandardScaler(),num)])
metrics={}
def clf(name,target):
    X=df[features]; y=df[target]; Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=.2,random_state=42,stratify=y)
    m=Pipeline([('pre',pre),('model',RandomForestClassifier(n_estimators=180,max_depth=10,random_state=42))]);m.fit(Xtr,ytr); p=m.predict(Xte); pr=m.predict_proba(Xte)[:,1]
    metrics[name]={'accuracy':accuracy_score(yte,p),'precision':precision_score(yte,p),'recall':recall_score(yte,p),'f1':f1_score(yte,p),'roc_auc':roc_auc_score(yte,pr),'confusion_matrix':confusion_matrix(yte,p).tolist()}
    joblib.dump(m,R/'models'/f'{name}.joblib')
clf('offer_acceptance','accept'); clf('retention','retention'); clf('compliance','compliance')
X=df[['experience','salary','talent','volume','hiring_days']]; y=df.salary*(1.1+rng.normal(0,.03,n))+df.volume*500
Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=.2,random_state=42); reg=RandomForestRegressor(n_estimators=180,max_depth=12,random_state=42);reg.fit(Xtr,ytr);pred=reg.predict(Xte);metrics['hiring_cost']={'mae':mean_absolute_error(yte,pred),'mse':mean_squared_error(yte,pred),'rmse':mean_squared_error(yte,pred)**.5,'r2':r2_score(yte,pred)};joblib.dump(reg,R/'models/hiring_cost.joblib')
y2=35-0.12*df.talent+0.8*df.volume+0.5*df.experience+rng.normal(0,3,n); y2=np.maximum(y2,5);X=df[['experience','talent','volume','hiring_days']];Xtr,Xte,ytr,yte=train_test_split(X,y2,test_size=.2,random_state=42);reg2=RandomForestRegressor(n_estimators=180,max_depth=12,random_state=42);reg2.fit(Xtr,ytr);pred=reg2.predict(Xte);metrics['time_to_hire']={'mae':mean_absolute_error(yte,pred),'mse':mean_squared_error(yte,pred),'rmse':mean_squared_error(yte,pred)**.5,'r2':r2_score(yte,pred)};joblib.dump(reg2,R/'models/time_to_hire.joblib')
df.to_csv(R/'data/synthetic_training_data.csv',index=False);json.dump(metrics,open(R/'models/metrics.json','w'),indent=2);print(json.dumps(metrics,indent=2))
