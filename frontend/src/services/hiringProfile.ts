export type HiringProfile = {
  companyCountry: string;
  hiringCountry: string;
  comparisonCountry?: string;
  annualSalary: number;
  employees: number;
  jobRole: string;
  experience: number;
  employmentType: string;
  workMode: string;
  benefits: number;
  visaRequired: boolean;
  sponsorship: boolean;
  submittedAt: string;
};

const PROFILE_KEY = 'globaltalentlens_hiring_profile';
const PENDING_KEY = 'globaltalentlens_pending_hiring_inputs';

export const loadHiringProfile = (): HiringProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveHiringProfile = (profile: HiringProfile) => {
  const completeProfile: HiringProfile = {
    ...profile,
    submittedAt: profile.submittedAt || new Date().toISOString()
  };

  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(completeProfile)
  );

  localStorage.removeItem(PENDING_KEY);

  return completeProfile;
};

export const loadPendingHiringInputs = (): Partial<HiringProfile> | null => {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const savePendingHiringInputs = (
  profile: Partial<HiringProfile>
) => {
  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify(profile)
  );
};

export const clearPendingHiringInputs = () => {
  localStorage.removeItem(PENDING_KEY);
};

export const clearHiringProfile = () => {
  localStorage.removeItem(PROFILE_KEY);
};

export const hasSubmittedHiringProfile = (): boolean => {
  return loadHiringProfile() !== null;
};

export const profileCurrency = (
  countries: any[],
  countryName: string
) => {
  const country = countries.find(
    (x) => x.name === countryName
  );

  return country?.currencySymbol ||
    country?.currency ||
    '$';
};