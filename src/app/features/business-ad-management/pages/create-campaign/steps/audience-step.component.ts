import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef, HostListener, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Country, State, City } from 'country-state-city';

interface GeoState {
  name: string;
  isoCode: string;
  countryCode: string;
}

@Component({
  selector: 'app-cc-audience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './audience-step.component.html',
  styleUrl: './audience-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudienceStepComponent {
  @Input({ required: true }) form!: FormGroup;

  // Age slider local state
  readonly AGE_MIN = 13;
  readonly AGE_MAX = 65;
  ageMinVal = 13;
  ageMaxVal = 65;

  // Location dropdown state
  showCountryDropdown = false;
  showStateDropdown   = false;
  showCityDropdown    = false;
  countryQuery        = '';
  stateQuery          = '';
  cityQuery           = '';

  // Pin code multi-entry state
  pinCodes:          Array<{ code: string; iso: string; countryName: string }> = [];
  pinCodeInput       = '';
  pinCodeInputError  = '';
  pinCodeValid       = false;
  pinCodeMatchIso    = '';
  pinCodeChecking    = false;

  private readonly apiHttp: HttpClient;
  private pinCheckTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly postalPatterns = new Map<string, { pattern: RegExp; hint: string }>([
    ['US', { pattern: /^\d{5}(-\d{4})?$/,                   hint: '5-digit code, e.g. 90210' }],
    ['IN', { pattern: /^\d{6}$/,                             hint: '6-digit code, e.g. 110001' }],
    ['GB', { pattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, hint: 'e.g. SW1A 2AA' }],
    ['CA', { pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,         hint: 'e.g. A1A 1A1' }],
    ['AU', { pattern: /^\d{4}$/,                             hint: '4-digit code, e.g. 2000' }],
    ['DE', { pattern: /^\d{5}$/,                             hint: '5-digit code, e.g. 10115' }],
    ['FR', { pattern: /^\d{5}$/,                             hint: '5-digit code, e.g. 75001' }],
    ['BR', { pattern: /^\d{5}-?\d{3}$/,                     hint: 'e.g. 01310-100' }],
    ['NG', { pattern: /^\d{6}$/,                             hint: '6-digit code' }],
    ['KE', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['GH', { pattern: /^[A-Z]{2}\d{3,4}(-\d{4})?$/i,       hint: 'e.g. GA-184-5456' }],
    ['ZA', { pattern: /^\d{4}$/,                             hint: '4-digit code, e.g. 8001' }],
    ['SG', { pattern: /^\d{6}$/,                             hint: '6-digit code, e.g. 238823' }],
    ['AE', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['SA', { pattern: /^\d{5}(-\d{4})?$/,                   hint: '5-digit code' }],
    ['PK', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['BD', { pattern: /^\d{4}$/,                             hint: '4-digit code' }],
    ['ID', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['PH', { pattern: /^\d{4}$/,                             hint: '4-digit code' }],
    ['MX', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['JP', { pattern: /^\d{3}-?\d{4}$/,                     hint: 'e.g. 100-0001' }],
    ['CN', { pattern: /^\d{6}$/,                             hint: '6-digit code' }],
    ['RU', { pattern: /^\d{6}$/,                             hint: '6-digit code' }],
    ['IT', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['ES', { pattern: /^\d{5}$/,                             hint: '5-digit code' }],
    ['NL', { pattern: /^\d{4} ?[A-Z]{2}$/i,                 hint: 'e.g. 1234 AB' }],
  ]);

  // State-level prefix data: prefixLen = how many leading digits to extract;
  // stateRanges = valid [min, max] ranges for that prefix value.
  // countryValid = extra guard applied even when no state is selected.
  private readonly statePrefixData: {
    [iso: string]: {
      prefixLen: number;
      countryValid?: (clean: string) => boolean;
      stateRanges: { [stateName: string]: [number, number][] };
    };
  } = {
    // India — first 2 digits identify postal zone / state
    'IN': {
      prefixLen: 2,
      countryValid: (c) => { const d = +c[0]; return d >= 1 && d <= 8; }, // zones 0 & 9 unused
      stateRanges: {
        'Delhi':                [[11, 11]],
        'Haryana':              [[12, 13]],
        'Punjab':               [[14, 16]],
        'Himachal Pradesh':     [[17, 17]],
        'Jammu and Kashmir':    [[18, 19]],
        'Ladakh':               [[19, 19]],
        'Uttar Pradesh':        [[20, 28]],
        'Uttarakhand':          [[24, 25]],
        'Rajasthan':            [[30, 34]],
        'Gujarat':              [[36, 39]],
        'Goa':                  [[40, 40]],
        'Maharashtra':          [[40, 44]],
        'Madhya Pradesh':       [[45, 48]],
        'Chhattisgarh':         [[49, 49]],
        'Telangana':            [[50, 50]],
        'Andhra Pradesh':       [[50, 53]],
        'Karnataka':            [[56, 61]],
        'Tamil Nadu':           [[60, 60], [62, 66]],
        'Puducherry':           [[60, 60]],
        'Kerala':               [[67, 69]],
        'West Bengal':          [[70, 74]],
        'Sikkim':               [[73, 73]],
        'Odisha':               [[75, 77]],
        'Assam':                [[78, 78]],
        'Arunachal Pradesh':    [[79, 79]],
        'Manipur':              [[79, 79]],
        'Meghalaya':            [[79, 79]],
        'Mizoram':              [[79, 79]],
        'Nagaland':             [[79, 79]],
        'Tripura':              [[79, 79]],
        'Bihar':                [[80, 85]],
        'Jharkhand':            [[82, 85]],
      },
    },
    // United States — first 3 digits map to state
    'US': {
      prefixLen: 3,
      stateRanges: {
        'Alabama':              [[350, 369]],
        'Alaska':               [[995, 999]],
        'Arizona':              [[850, 865]],
        'Arkansas':             [[716, 729]],
        'California':           [[900, 961]],
        'Colorado':             [[800, 816]],
        'Connecticut':          [[60,  69]],
        'Delaware':             [[197, 199]],
        'District of Columbia': [[200, 205]],
        'Florida':              [[320, 349]],
        'Georgia':              [[300, 319]],
        'Hawaii':               [[967, 968]],
        'Idaho':                [[832, 838]],
        'Illinois':             [[600, 629]],
        'Indiana':              [[460, 479]],
        'Iowa':                 [[500, 528]],
        'Kansas':               [[660, 679]],
        'Kentucky':             [[400, 427]],
        'Louisiana':            [[700, 714]],
        'Maine':                [[39,  49]],
        'Maryland':             [[206, 219]],
        'Massachusetts':        [[10,  27]],
        'Michigan':             [[480, 499]],
        'Minnesota':            [[550, 567]],
        'Mississippi':          [[386, 397]],
        'Missouri':             [[630, 658]],
        'Montana':              [[590, 599]],
        'Nebraska':             [[680, 693]],
        'Nevada':               [[889, 898]],
        'New Hampshire':        [[30,  38]],
        'New Jersey':           [[70,  89]],
        'New Mexico':           [[870, 884]],
        'New York':             [[100, 149]],
        'North Carolina':       [[270, 289]],
        'North Dakota':         [[580, 588]],
        'Ohio':                 [[430, 459]],
        'Oklahoma':             [[730, 749]],
        'Oregon':               [[970, 979]],
        'Pennsylvania':         [[150, 196]],
        'Rhode Island':         [[28,  29]],
        'South Carolina':       [[290, 299]],
        'South Dakota':         [[570, 577]],
        'Tennessee':            [[370, 385]],
        'Texas':                [[733, 733], [750, 799]],
        'Utah':                 [[840, 847]],
        'Vermont':              [[50,  59]],
        'Virginia':             [[200, 246]],
        'Washington':           [[980, 994]],
        'West Virginia':        [[247, 268]],
        'Wisconsin':            [[530, 549]],
        'Wyoming':              [[820, 831]],
      },
    },
  };

  // Countries where Zippopotam.us provides real postal-code lookup.
  // India (IN) is excluded here — it uses the India Post API instead.
  private readonly zippopotamCountries = new Set([
    'US', 'CA', 'GB', 'AU', 'DE', 'AT', 'BE', 'BR', 'BG', 'CH',
    'CZ', 'DK', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IS', 'IT',
    'JP', 'LT', 'LU', 'LV', 'MX', 'NL', 'NO', 'NZ', 'PH', 'PL',
    'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SG', 'TH', 'TR',
    'UA', 'ZA', 'BD', 'ID', 'PK',
  ]);

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    handler: HttpBackend,
  ) {
    // Bypass auth/error interceptors for external postal-code APIs
    this.apiHttp = new HttpClient(handler);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showCountryDropdown = false;
      this.showStateDropdown   = false;
      this.showCityDropdown    = false;
      this.cdr.markForCheck();
    }
  }

  // ── Real geo data ────────────────────────────────────

  private readonly allCountriesData = Country.getAllCountries()
    .map(c => ({ name: c.name, isoCode: c.isoCode }))
    .sort((a, b) => a.name.localeCompare(b.name));

  private readonly countryByName = new Map(
    this.allCountriesData.map(c => [c.name, c])
  );

  // ── Form value accessors ─────────────────────────────

  get gender(): string              { return this.form.get('gender')?.value    ?? 'all'; }
  get selectedCountries(): string[] { return this.form.get('countries')?.value ?? []; }
  get selectedStates(): string[]    { return this.form.get('states')?.value    ?? []; }
  get selectedCities(): string[]    { return this.form.get('cities')?.value    ?? []; }

  // ── Age slider ───────────────────────────────────────

  get ageTrackLeft(): string {
    return ((this.ageMinVal - this.AGE_MIN) / (this.AGE_MAX - this.AGE_MIN) * 100) + '%';
  }

  get ageTrackWidth(): string {
    return ((this.ageMaxVal - this.ageMinVal) / (this.AGE_MAX - this.AGE_MIN) * 100) + '%';
  }

  // Centers a tooltip over the thumb accounting for thumb radius (10px)
  private thumbLeft(val: number): string {
    const pct = (val - this.AGE_MIN) / (this.AGE_MAX - this.AGE_MIN);
    return `calc(${pct * 100}% + ${10 - pct * 20}px)`;
  }

  get ageMinThumbLeft(): string { return this.thumbLeft(this.ageMinVal); }
  get ageMaxThumbLeft(): string { return this.thumbLeft(this.ageMaxVal); }

  get selectedAgeLabel(): string {
    const min = this.ageMinVal;
    const max = this.ageMaxVal;
    if (min === this.AGE_MIN && max === this.AGE_MAX) return 'All ages';
    if (max === this.AGE_MAX) return `${min}+`;
    return `${min} – ${max}`;
  }

  onAgeMinChange(event: Event): void {
    const val = +(event.target as HTMLInputElement).value;
    this.ageMinVal = Math.min(val, this.ageMaxVal - 1);
    (event.target as HTMLInputElement).value = String(this.ageMinVal);
    this.form.get('ageMin')?.setValue(this.ageMinVal);
    this.cdr.markForCheck();
  }

  onAgeMaxChange(event: Event): void {
    const val = +(event.target as HTMLInputElement).value;
    this.ageMaxVal = Math.max(val, this.ageMinVal + 1);
    (event.target as HTMLInputElement).value = String(this.ageMaxVal);
    this.form.get('ageMax')?.setValue(this.ageMaxVal);
    this.cdr.markForCheck();
  }

  // ── Derived geo state ────────────────────────────────

  private getStateObjectsForCountry(countryName: string): GeoState[] {
    const country = this.countryByName.get(countryName);
    if (!country) return [];
    return State.getStatesOfCountry(country.isoCode)
      .map(s => ({ name: s.name, isoCode: s.isoCode, countryCode: country.isoCode }));
  }

  get availableStateObjects(): GeoState[] {
    return this.selectedCountries.flatMap(c => this.getStateObjectsForCountry(c));
  }

  get availableStates(): string[] {
    return this.availableStateObjects.map(s => s.name);
  }

  get availableCities(): string[] {
    if (this.selectedStates.length === 0) return [];
    const stateObjs = this.availableStateObjects;
    return this.selectedStates.flatMap(stateName => {
      const stateObj = stateObjs.find(s => s.name === stateName);
      if (!stateObj) return [];
      return City.getCitiesOfState(stateObj.countryCode, stateObj.isoCode)
        .map(c => c.name);
    });
  }

  get filteredCountries(): string[] {
    const q = this.countryQuery.toLowerCase();
    return this.allCountriesData
      .filter(c => !this.selectedCountries.includes(c.name) && (!q || c.name.toLowerCase().includes(q)))
      .map(c => c.name);
  }

  get filteredStates(): string[] {
    const q = this.stateQuery.toLowerCase();
    return this.availableStates.filter(s =>
      !this.selectedStates.includes(s) && (!q || s.toLowerCase().includes(q))
    );
  }

  get filteredCities(): string[] {
    const q = this.cityQuery.toLowerCase();
    return this.availableCities.filter(c =>
      !this.selectedCities.includes(c) && (!q || c.toLowerCase().includes(q))
    );
  }

  get hasTargeting(): boolean {
    return this.selectedCountries.length > 0 ||
           this.selectedStates.length > 0 ||
           this.selectedCities.length > 0;
  }

  get stateSummaryLabel(): string {
    const n = this.selectedStates.length;
    return `${n} state${n > 1 ? 's' : ''}: ${this.selectedStates.join(', ')}`;
  }

  get citySummaryLabel(): string {
    const n = this.selectedCities.length;
    return `${n} cit${n > 1 ? 'ies' : 'y'}: ${this.selectedCities.join(', ')}`;
  }

  get reachRange(): { low: string; high: string } {
    const countries = this.selectedCountries;
    const states    = this.selectedStates;
    const cities    = this.selectedCities;

    let base = countries.length ? countries.length * 50 : 800;
    if (states.length)  base *= Math.min(states.length  * 0.15, 1);
    if (cities.length)  base *= Math.min(cities.length  * 0.05, 0.5);

    const isFullAge = this.ageMinVal === this.AGE_MIN && this.ageMaxVal === this.AGE_MAX;
    if (!isFullAge) {
      const ageFactor = (this.ageMaxVal - this.ageMinVal) / (this.AGE_MAX - this.AGE_MIN);
      base *= Math.max(ageFactor, 0.05);
    }

    if (this.gender !== 'all') base *= 0.52;

    return {
      low:  this.fmtReach(base * 0.775),
      high: this.fmtReach(base * 1.225),
    };
  }

  get reachDescription(): string {
    const isFullAge = this.ageMinVal === this.AGE_MIN && this.ageMaxVal === this.AGE_MAX;
    const ageDesc = isFullAge ? 'all ages' : `ages ${this.selectedAgeLabel}`;
    const locDesc = this.selectedCountries.length
      ? `${this.selectedCountries.join(', ')} location targeting`
      : 'global targeting';
    return `Based on ${ageDesc}, and ${locDesc}. Actual reach depends on budget and competition.`;
  }

  private fmtReach(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'B';
    if (n >= 1)    return n.toFixed(1) + 'M';
    return (n * 1000).toFixed(0) + 'K';
  }

  // ── Actions ──────────────────────────────────────────

  setGender(id: string): void {
    this.form.get('gender')?.setValue(id);
  }

  openCountryDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showCountryDropdown = !this.showCountryDropdown;
    this.showStateDropdown   = false;
    this.showCityDropdown    = false;
  }

  openStateDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.availableStates.length) return;
    this.showStateDropdown   = !this.showStateDropdown;
    this.showCountryDropdown = false;
    this.showCityDropdown    = false;
  }

  openCityDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.availableCities.length) return;
    this.showCityDropdown    = !this.showCityDropdown;
    this.showCountryDropdown = false;
    this.showStateDropdown   = false;
  }

  addCountry(name: string): void {
    this.form.get('countries')?.setValue([...this.selectedCountries, name]);
    this.form.get('states')?.setValue([]);
    this.form.get('cities')?.setValue([]);
    this.countryQuery        = '';
    this.showCountryDropdown = false;
  }

  removeCountry(country: string): void {
    const next = this.selectedCountries.filter(c => c !== country);
    this.form.get('countries')?.setValue(next);
    const nextStateNames = next.flatMap(c => this.getStateObjectsForCountry(c).map(s => s.name));
    this.form.get('states')?.setValue(this.selectedStates.filter(s => nextStateNames.includes(s)));
    this.form.get('cities')?.setValue([]);
  }

  clearCountries(): void {
    this.form.get('countries')?.setValue([]);
    this.form.get('states')?.setValue([]);
    this.form.get('cities')?.setValue([]);
  }

  addState(state: string): void {
    this.form.get('states')?.setValue([...this.selectedStates, state]);
    this.stateQuery        = '';
    this.showStateDropdown = false;
  }

  removeState(state: string): void {
    this.form.get('states')?.setValue(this.selectedStates.filter(s => s !== state));
    this.form.get('cities')?.setValue([]);
  }

  clearStates(): void {
    this.form.get('states')?.setValue([]);
    this.form.get('cities')?.setValue([]);
  }

  addCity(city: string): void {
    this.form.get('cities')?.setValue([...this.selectedCities, city]);
    this.cityQuery        = '';
    this.showCityDropdown = false;
  }

  removeCity(city: string): void {
    this.form.get('cities')?.setValue(this.selectedCities.filter(c => c !== city));
  }

  clearCities(): void {
    this.form.get('cities')?.setValue([]);
  }

  onCountrySearch(event: Event): void {
    this.countryQuery = (event.target as HTMLInputElement).value;
  }

  // ── Pin / Postal code (multi-entry) ──────────────────

  get pinCodePlaceholder(): string {
    const countries = this.selectedCountries;
    if (!countries.length) return 'Enter postal / pin code...';
    if (countries.length === 1) {
      const iso = this.countryByName.get(countries[0])?.isoCode ?? '';
      return this.postalPatterns.get(iso)?.hint ?? 'Enter postal code...';
    }
    const hints = countries.slice(0, 2)
      .map(n => this.postalPatterns.get(this.countryByName.get(n)?.isoCode ?? '')?.hint.split(',')[0])
      .filter(Boolean);
    return hints.length ? `e.g. ${hints.join(' or ')}` : 'Enter postal code...';
  }

  private checkStatePrefixValid(code: string, countryIso: string, stateName: string): boolean {
    const cData = this.statePrefixData[countryIso];
    if (!cData) return true;
    const ranges = cData.stateRanges[stateName];
    if (!ranges) return true; // state not in our data → allow
    const clean  = code.replace(/[\s\-]/g, '');
    const prefix = parseInt(clean.substring(0, cData.prefixLen), 10);
    if (isNaN(prefix)) return false;
    return ranges.some(([min, max]) => prefix >= min && prefix <= max);
  }

  // Format-only match (no state/country-basic check) — used to distinguish
  // "format wrong" from "format ok but wrong state" in error messages.
  private matchFormatOnly(value: string): { iso: string; countryName: string } | null {
    const countries = this.selectedCountries;
    if (!countries.length) {
      return /^[A-Z0-9\s\-]{3,10}$/i.test(value) ? { iso: '', countryName: '' } : null;
    }
    for (const name of countries) {
      const iso  = this.countryByName.get(name)?.isoCode ?? '';
      const info = this.postalPatterns.get(iso);
      const ok   = info ? info.pattern.test(value) : /^[A-Z0-9\s\-]{3,10}$/i.test(value);
      if (ok) return { iso, countryName: name };
    }
    return null;
  }

  private matchCountryForCode(value: string): { iso: string; countryName: string } | null {
    const countries = this.selectedCountries;
    if (!countries.length) {
      return /^[A-Z0-9\s\-]{3,10}$/i.test(value) ? { iso: '', countryName: '' } : null;
    }
    for (const name of countries) {
      const iso    = this.countryByName.get(name)?.isoCode ?? '';
      const info   = this.postalPatterns.get(iso);
      const fmtOk  = info ? info.pattern.test(value) : /^[A-Z0-9\s\-]{3,10}$/i.test(value);
      if (!fmtOk) continue;

      // Country-level sanity check (e.g. India zones 1-8 only; rejects 000000, 999999)
      const cData = this.statePrefixData[iso];
      if (cData?.countryValid && !cData.countryValid(value.replace(/[\s\-]/g, ''))) continue;

      // State-level prefix check (only when states are selected for this country)
      const statesForCountry = this.availableStateObjects
        .filter(so => so.countryCode === iso && this.selectedStates.includes(so.name));
      if (statesForCountry.length > 0) {
        const stateOk = statesForCountry.some(so =>
          this.checkStatePrefixValid(value, iso, so.name)
        );
        if (!stateOk) continue;
      }

      return { iso, countryName: name };
    }
    return null;
  }

  onPinCodeTyping(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toUpperCase();
    (event.target as HTMLInputElement).value = value;
    this.pinCodeInput = value;

    // Cancel any in-flight API check from a previous keystroke
    if (this.pinCheckTimer) { clearTimeout(this.pinCheckTimer); this.pinCheckTimer = null; }
    this.pinCodeChecking = false;

    if (!value) {
      this.pinCodeValid = false; this.pinCodeMatchIso = ''; this.pinCodeInputError = '';
      this.cdr.markForCheck(); return;
    }

    const match = this.matchCountryForCode(value);
    if (match) {
      if (match.iso === 'IN') {
        // India Post API — most authoritative for Indian PIN codes
        this.pinCodeValid = false;
        this.pinCodeMatchIso = '';
        this.pinCodeInputError = '';
        this.pinCodeChecking = true;
        this.pinCheckTimer = setTimeout(() => this.validateIndiaPinCode(value, match), 600);
      } else if (this.zippopotamCountries.has(match.iso)) {
        // Zippopotam API — covers US, GB, AU, DE, FR, CA, BR, JP, SG, and 30+ more
        this.pinCodeValid = false;
        this.pinCodeMatchIso = '';
        this.pinCodeInputError = '';
        this.pinCodeChecking = true;
        this.pinCheckTimer = setTimeout(() => this.validateWithZippopotam(value, match), 600);
      } else {
        // Remaining countries: format + prefix validation only
        this.pinCodeValid      = true;
        this.pinCodeMatchIso   = match.iso;
        this.pinCodeInputError = '';
      }
    } else {
      this.pinCodeValid    = false;
      this.pinCodeMatchIso = '';
      if (value.length >= 3) {
        const fmtMatch = this.matchFormatOnly(value);
        if (fmtMatch && fmtMatch.iso) {
          const statesForCountry = this.availableStateObjects
            .filter(so => so.countryCode === fmtMatch.iso && this.selectedStates.includes(so.name));
          this.pinCodeInputError = statesForCountry.length
            ? `Not a valid code for ${statesForCountry.map(s => s.name).join(', ')} in ${fmtMatch.countryName}`
            : `Not a valid code for ${fmtMatch.countryName}`;
        } else {
          const countries = this.selectedCountries;
          if (countries.length === 1) {
            const iso  = this.countryByName.get(countries[0])?.isoCode ?? '';
            const info = this.postalPatterns.get(iso);
            this.pinCodeInputError = info
              ? `Invalid for ${countries[0]}. Expected: ${info.hint}`
              : 'Invalid postal code format';
          } else if (countries.length > 1) {
            this.pinCodeInputError = "Doesn't match any selected country's format";
          } else {
            this.pinCodeInputError = 'Enter 3–10 alphanumeric characters';
          }
        }
      } else {
        this.pinCodeInputError = '';
      }
    }
    this.cdr.markForCheck();
  }

  private validateIndiaPinCode(
    value: string,
    prefixMatch: { iso: string; countryName: string },
  ): void {
    if (this.pinCodeInput !== value) return;

    type PinOffice   = { Name: string; District: string; Division: string; State: string };
    type PinResponse = Array<{ Status: string; PostOffice: PinOffice[] | null }>;

    this.apiHttp
      .get<PinResponse>(`https://api.postalpincode.in/pincode/${value}`)
      .subscribe({
        next: (res) => {
          if (this.pinCodeInput !== value) return;
          this.pinCodeChecking = false;

          const ok      = res?.[0]?.Status === 'Success';
          const offices = res?.[0]?.PostOffice;

          if (!ok || !offices?.length) {
            this.pinCodeValid      = false;
            this.pinCodeInputError = `PIN ${value} does not exist`;
            this.cdr.markForCheck();
            return;
          }

          // ── State check ──────────────────────────────
          const apiState         = offices[0].State ?? '';
          const statesForCountry = this.availableStateObjects
            .filter(so => so.countryCode === 'IN' && this.selectedStates.includes(so.name));

          if (statesForCountry.length > 0) {
            const matchedState = statesForCountry.find(so => {
              const a = so.name.toLowerCase(), b = apiState.toLowerCase();
              return a === b || b.includes(a) || a.includes(b);
            });

            if (!matchedState) {
              this.pinCodeValid      = false;
              this.pinCodeInputError =
                `PIN ${value} is in ${apiState}, not ${statesForCountry.map(s => s.name).join(' / ')}`;
              this.cdr.markForCheck();
              return;
            }

            // ── City check ────────────────────────────
            // Only compare cities that actually belong to the matched state
            const citiesOfMatchedState = City.getCitiesOfState('IN', matchedState.isoCode)
              .map(c => c.name);
            const selectedCitiesInState = this.selectedCities
              .filter(c => citiesOfMatchedState.includes(c));

            if (selectedCitiesInState.length > 0) {
              const cityMatches = selectedCitiesInState.some(city => {
                const cl = city.toLowerCase();
                return offices.some(o => {
                  const dl = (o.District ?? '').toLowerCase();
                  const vl = (o.Division ?? '').toLowerCase();
                  return dl.includes(cl) || cl.includes(dl) ||
                         vl.includes(cl) || cl.includes(vl);
                });
              });

              if (!cityMatches) {
                const location =
                  offices[0]?.District || offices[0]?.Division || offices[0]?.Name;
                this.pinCodeValid      = false;
                this.pinCodeInputError =
                  `PIN ${value} is in ${location}, not in ${selectedCitiesInState.join(' / ')}`;
                this.cdr.markForCheck();
                return;
              }
            }
          }

          this.pinCodeValid      = true;
          this.pinCodeMatchIso   = prefixMatch.iso;
          this.pinCodeInputError = '';
          this.cdr.markForCheck();
        },
        error: () => {
          if (this.pinCodeInput !== value) return;
          // Network failure — fall back to prefix-based result (already passed)
          this.pinCodeChecking   = false;
          this.pinCodeValid      = true;
          this.pinCodeMatchIso   = prefixMatch.iso;
          this.pinCodeInputError = '';
          this.cdr.markForCheck();
        },
      });
  }

  private validateWithZippopotam(
    value: string,
    prefixMatch: { iso: string; countryName: string },
  ): void {
    if (this.pinCodeInput !== value) return;

    type ZipPlace    = { 'place name': string; state: string; 'state abbreviation': string };
    type ZipResponse = { 'post code': string; places: ZipPlace[] };

    const iso       = prefixMatch.iso;
    const isoLower  = iso.toLowerCase();
    // US ZIP+4 (99553-1234) → use only the 5-digit base; all others: strip spaces/dashes
    const code      = iso === 'US'
      ? value.replace(/[\s\-]/g, '').substring(0, 5)
      : value.replace(/[\s\-]/g, '');
    const codeLabel = iso === 'US' ? 'ZIP' : 'Postal code';

    this.apiHttp
      .get<ZipResponse>(`https://api.zippopotam.us/${isoLower}/${code}`)
      .subscribe({
        next: (res) => {
          if (this.pinCodeInput !== value) return;
          this.pinCodeChecking = false;

          const places = res?.places;
          if (!places?.length) {
            this.pinCodeValid      = false;
            this.pinCodeInputError = `${codeLabel} ${value} does not exist`;
            this.cdr.markForCheck();
            return;
          }

          // ── State check ──────────────────────────────
          const apiState         = places[0].state ?? '';
          const statesForCountry = this.availableStateObjects
            .filter(so => so.countryCode === iso && this.selectedStates.includes(so.name));

          if (statesForCountry.length > 0) {
            const matchedState = statesForCountry.find(so => {
              const a = so.name.toLowerCase(), b = apiState.toLowerCase();
              return a === b || b.includes(a) || a.includes(b);
            });

            if (!matchedState) {
              this.pinCodeValid      = false;
              this.pinCodeInputError =
                `${codeLabel} ${value} is in ${apiState}, not ${statesForCountry.map(s => s.name).join(' / ')}`;
              this.cdr.markForCheck();
              return;
            }

            // ── City check ────────────────────────────
            const citiesOfMatchedState = City.getCitiesOfState(iso, matchedState.isoCode)
              .map(c => c.name);
            const selectedCitiesInState = this.selectedCities
              .filter(c => citiesOfMatchedState.includes(c));

            if (selectedCitiesInState.length > 0) {
              const cityMatches = selectedCitiesInState.some(city => {
                const cl = city.toLowerCase();
                return places.some(p => {
                  const pl = (p['place name'] ?? '').toLowerCase();
                  return pl === cl || pl.includes(cl) || cl.includes(pl);
                });
              });

              if (!cityMatches) {
                const locationName = places[0]?.['place name'];
                this.pinCodeValid      = false;
                this.pinCodeInputError =
                  `${codeLabel} ${value} is in ${locationName}, not in ${selectedCitiesInState.join(' / ')}`;
                this.cdr.markForCheck();
                return;
              }
            }
          }

          this.pinCodeValid      = true;
          this.pinCodeMatchIso   = iso;
          this.pinCodeInputError = '';
          this.cdr.markForCheck();
        },
        error: (err) => {
          if (this.pinCodeInput !== value) return;
          this.pinCodeChecking = false;
          if (err?.status === 404) {
            this.pinCodeValid      = false;
            this.pinCodeInputError = `${codeLabel} ${value} does not exist`;
          } else {
            // Network failure — fall back to prefix-based result (already passed)
            this.pinCodeValid      = true;
            this.pinCodeMatchIso   = iso;
            this.pinCodeInputError = '';
          }
          this.cdr.markForCheck();
        },
      });
  }

  addPinCode(): void {
    const value = this.pinCodeInput.trim().toUpperCase();
    if (!value || !this.pinCodeValid) return;
    if (this.pinCodes.some(p => p.code === value)) {
      this.pinCodeInputError = 'Already added';
      this.cdr.markForCheck(); return;
    }
    const match = this.matchCountryForCode(value)!;
    this.pinCodes = [...this.pinCodes, { code: value, iso: match.iso, countryName: match.countryName }];
    this.form.get('pinCodes')?.setValue(this.pinCodes.map(p => p.code));
    this.pinCodeInput = ''; this.pinCodeValid = false;
    this.pinCodeMatchIso = ''; this.pinCodeInputError = '';
    this.cdr.markForCheck();
  }

  removePinCode(code: string): void {
    this.pinCodes = this.pinCodes.filter(p => p.code !== code);
    this.form.get('pinCodes')?.setValue(this.pinCodes.map(p => p.code));
  }

  clearPinCodes(): void {
    this.pinCodes = [];
    this.form.get('pinCodes')?.setValue([]);
  }

  onPinCodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.addPinCode(); }
  }

  onStateSearch(event: Event): void {
    this.stateQuery = (event.target as HTMLInputElement).value;
  }

  onCitySearch(event: Event): void {
    this.cityQuery = (event.target as HTMLInputElement).value;
  }

  stopProp(event: MouseEvent): void { event.stopPropagation(); }
}
