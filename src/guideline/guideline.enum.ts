export enum GuidelineTypesEnum {
    TERMS_CONDITIONS = 'termsAndConditions',
    FAQ = 'faq',
    E_WAIVER = 'eWaiver',
    HUNT_E_WAIVER = 'huntEWaiver'
  }
  
  export const GuidelineTypesEnumNames = Object.values(GuidelineTypesEnum)
      .filter((i) => typeof i === 'string')
      .map((e) => e as string);
  