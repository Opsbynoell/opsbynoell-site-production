#!/usr/bin/env python3
import csv

# Enrichment keyed by exact business_name from the source CSV.
# Values: (website, email, owner_name, booking_tech, notes)
# Emails are reported only where a search-result snippet showed the business's
# own published address; data-broker/masked/constructed addresses were excluded.
# WebFetch/page fetching was blocked in this environment (HTTP 403 for all hosts),
# so all data is from WebSearch results, not direct page reads.
E = {
    # --- Irvine dental ---
    "Irvine Smile Dentistry": ("https://irvinesmiledentistry.com", "info@irvinesmiledentistry.com", "", "contact form", "Email from search snippet, not page-confirmed (WebFetch blocked)"),
    "Irvine Modern Dentistry": ("https://www.irvinemoderndentistry.com", "none found", "Dr. Jerome Tsang", "contact form", "No email surfaced; WebFetch blocked"),
    "Irvine Dentistry": ("https://irvinedentistry.com", "none found", "", "contact form", "Live chat + contact form; no email found; WebFetch blocked"),
    "Irvine Dental Center": ("https://irvine-dental.com", "none found", "Dr. Wu", "contact form", "No literal email found; WebFetch blocked"),
    "Parkview Dental Group": ("https://parkviewdentalgroup.com", "parkviewdentalgroup@gmail.com", "Dr. Jonathan Cho", "contact form", "Email from search snippet, not page-confirmed"),
    "Serene Dental Center": ("https://www.serenedentalcenter.com", "office@serenedentalcenter.com", "Dr. Ali Mansouri; Dr. Shery Mansouri", "contact form", "Email from search snippet, not page-confirmed"),
    "Dentists of Irvine Dental Group": ("https://www.dentistsofirvine.com", "none found", "", "contact form", "Request-appointment + form; no email found; WebFetch blocked"),
    "Blue Brush Dental": ("https://www.bluebrushdental.com", "none found", "Dr. Sean Chang", "LocalMed", "LocalMed booking confirmed via listing; only garbled email string seen (excluded)"),
    "Sand Canyon Dental": ("https://www.sandcanyondentistry.com", "info@sandcanyondentistry.com", "Dr. Najaran; Dr. Samonte-Mora", "contact form", "Email from search snippet, not page-confirmed"),
    "Elite Dental Irvine": ("https://www.elitedentalirvine.com", "form only", "Dr. Yuting Alice Yang", "contact form", "Site shows obfuscated email placeholder only; WebFetch blocked"),

    # --- Anaheim dental ---
    "Anaheim Dentist - Open 7 Days": ("https://adentist4me.com", "help@adentist4me.com", "Behnaz Nonahal, DDS", "none found", "Email/owner from search snippets, not page-confirmed"),
    "Dentist of Anaheim": ("https://anaheimdentist.com", "none found", "Dr. Hamid Barkhordar", "none found", "Owner from snippet; no published email surfaced"),
    "7 Day Dental (N Euclid)": ("https://www.7daydental.com", "euclid@7daydental.com", "", "none found", "Location email from snippet (637 N Euclid St), not page-confirmed"),
    "Anaheim Dental Group": ("https://www.anaheimdentalgroup.com", "none found", "Dr. Steven Son, DDS", "none found", "Owner from snippet; info@ candidate was AI-inferred (excluded)"),
    "MY Dental Center": ("https://www.mydentalctr.com", "none found", "Dr. Maria (Mi Young) Chung; Dr. David Yi; Dr. Ella Han", "none found", "Email candidate masked in snippet; owners from snippet"),
    "Dental Wellness of Anaheim": ("https://dentalwellnessca.com", "none found", "", "none found", "Part of Dental Wellness & Implant Center group; no email surfaced"),
    "7 Day Dental (W Lincoln)": ("https://www.7daydental.com", "lincoln@7daydental.com", "", "none found", "Location email from snippet (2265 W Lincoln Ave), not page-confirmed"),
    "SMILEE DENTAL (pediatric)": ("https://www.smileedental.net", "none found", "", "none found", "Santa Ana-based site; Anaheim office 1686 W Katella; no email surfaced"),
    "Jungle Dental (pediatric)": ("https://jungledentalkids.com", "none found", "Dr. Selvana Sorour", "none found", "Owner from snippet; no email surfaced"),
    "Anaheim Dental & Orthodontics": ("https://www.anaheimdentalortho.com", "none found", "Dr. Omid Mehdipour, DDS", "none found", "Owner from snippet; only RocketReach 'likely format' email (excluded)"),

    # --- Huntington Beach dental ---
    "Huntington Beach Dental Center": ("https://www.huntingtonbeachdentalcenter.com", "none found", "", "", "Locally owned 30+ yrs; owner/booking not in snippets"),
    "Dentists of Huntington Beach": ("https://www.dentistsofhuntingtonbeach.com", "none found", "", "", "Pacific Dental Services / Smile Generation DSO-affiliated office"),
    "Harbor Smiles Dental Care": ("https://www.hbsdentalstudio.com", "none found", "Dr. Manali S. Patel", "", "Older Weebly site also exists; no email in snippets"),
    "Beach City Dental": ("https://beachcitydental.com", "none found", "Dr. Andrew G. Mortensen", "", "Own 'Book Appointment' page; platform not identified in snippets"),
    "Allure Family Dental & Specialty": ("https://allurefamilydentalgroup.com", "none found", "Dr. Miele; Dr. Savedra", "", "alluredentalspecialist.com also resolves here; no email in snippets"),
    "Smiles Cafe Dentistry": ("https://www.smilescafedentistry.com", "none found", "Dr. Tahir Khan; Dr. Lily Yao", "", "No email in snippets"),
    "HB Smile Dental": ("https://www.hbsmiledental.com", "none found", "", "", "Distinct from smilehbdental.com and hbsmilecare.com; owner not in snippets"),
    "Huntington Beach Modern Dentistry": ("https://www.huntingtonbeachmoderndentistry.com", "none found", "", "", "Pacific Dental Services / Smile Generation DSO-affiliated office"),
    "Seaside Dental Care": ("https://seasidedentalcare.com", "none found", "Dr. Majid Kashani", "", "Owner not fully confirmed in snippets; no email"),
    "Huntington Smile Care": ("https://www.hbsmilecare.com", "none found", "Dr. Nathan Dinh", "", "Default-template Wix build; no email in snippets"),

    # --- Mission Viejo dental ---
    "New Generation Dentistry": ("https://newgenerationdentistry.com", "info@newgenerationdentistry.com", "Dr. Sara Khoshbin; Dr. Ahmad (Sasha) Aghakhan Moheb", "", "Email from search snippet, not page-confirmed; WebFetch blocked"),
    "Mission Dental Group": ("https://www.mvdentalgroup.com", "none found", "", "", "Smile Generation / Smile Brands office; no email found"),
    "Mission Viejo Dental Associates": ("https://www.mvdentalassociates.com", "none found", "Dr. Robert Stalcup", "", "Conflicting emails in search (unverified); Smile Brands-affiliated"),
    "Hada Family Dental": ("https://www.mymissionviejodentist.com", "none found", "Dr. Richard Hada", "", "Search-suggested email looked fabricated (excluded)"),
    "Saddleback Dental Associates": ("https://mymissionviejodental.com", "none found", "Dr. Alex (Alexander) Marose", "", "Only masked ZoomInfo email existed (excluded)"),
    "Mission Viejo Dental Specialists": ("https://dentistmissionviejooc.com", "none found", "Dr. Karen Lin; Dr. Nina Sharma; Dr. Norma Lantzsch", "", "Single-source unverified email seen (excluded); affiliated w/ 7 Day Dental"),
    "Los Alisos Dentistry": ("https://www.losalisosdentistry.com", "none found", "Dr. Avani Sarvaiya", "", "No email surfaced in search"),
    "Vartanian Dental Group": ("https://www.vartaniandentalgroup.com", "none found", "Dr. James Vartanian", "", "No email surfaced in search"),
    "OC Smile Dental & Orthodontics": ("https://ocsmile.com", "none found", "", "", "Multi-location (Mission Viejo + Fullerton); no email surfaced"),
    "Smile Dental Boutique": ("https://www.smiledentalboutiquemv.com", "none found", "Dr. Pegah Naji", "", "Only masked ZoomInfo email existed (excluded)"),

    # --- Lake Forest dental ---
    "Lake Forest Dental Health Care": ("https://lakeforestdentalhealthcare.com", "none found", "", "", "Booking tech not identified in search results"),
    "Lake Forest Dental Center": ("https://lakeforestdentalcenter.com", "none found", "Dr. Farshin Farokhian, DDS", "", "Operating since 1983; owner from snippet"),
    "Smiles West Dental & Orthodontics": ("https://smileswest.com/lake-forest", "none found", "", "", "Multi-location Smiles West group; no email/owner in snippets"),
    "Dental Wellness of Lake Forest": ("https://dentalwellnessca.com", "none found", "Dr. Maryam Waheed, DDS", "", "Domain shared with Dental Wellness & Implant Center"),
    "Smile on You Dentistry": ("https://smileonyoudentistry.com", "none found", "Dr. Sooji H. Lee, DDS", "", "Multi-location; Dr. Lee & Dr. Ritchie Park for Lake Forest"),
    "Lake Forest Dental Group and Orthodontics": ("https://lakeforestdentalgroup.com", "none found", "Dr. Elham McMurray, DDS", "", "Smile Generation-affiliated office; owner from snippet"),
    "Smile Works Dentistry & Orthodontics": ("https://smileworksoc.com", "none found", "", "", "Formerly Chapman Family Dentistry; current owner not named in snippets"),
    "Forest Family Dentistry": ("https://forestfamilydental.com", "none found", "Dr. Shervin Ahmadnia, DDS", "", "Practice opened 1990; owner from snippet"),
    "Baker Ranch Dental Spa & Implant Center": ("https://bakerranchdentistry.com", "none found", "Dr. Ramin Khoshsar, DDS", "", "info@ surfaced only via RocketReach (excluded); owner from snippet"),
    "LF Dental": ("https://lfdentaloffice.com", "none found", "Dr. Leo Man, DDS", "", "Identity ambiguous: a separate 'LF Dental' ties to Jino Park / lfdentalgroup.com"),

    # --- Newport Beach med spa ---
    "Newport Beach MedSpa": ("https://www.newportbeachmedspa.com", "none found", "", "", "Only data-broker emails found (excluded); 100 W Coast Hwy Ste 102"),
    "NakedMD Med Spa": ("https://www.nakedmd.com", "concierge@nakedmd.com", "", "Shopify", "Multi-location chain; email from official contact page snippet"),
    "Beauty Boost Med Spa": ("https://beautyboostmedspa.com", "info@beautyboostmedspa.com", "Dr. Steve Yoelin", "Vagaro", "Vagaro booking confirmed via listing; founded 2018"),
    "BioRevive Med & Wellness Spa": ("https://biorevivespa.com", "info@biorevivespa.com", "", "Shopify", "Email tied to official site/Facebook"),
    "South Coast MedSpa": ("https://www.southcoastmedspa.com", "none found", "", "", "LA-based chain w/ Newport location; info@ only via broker (excluded)"),
    "MeSO Medspa": ("https://www.mesospa.com", "none found", "", "LeadConnector/GoHighLevel", "GoHighLevel detected (contact page via app.gohighlevel.com); no email confirmed"),
    "BioSpa": ("https://www.mybiospa.com", "contact@mybiospa.com", "Dr. Horowitz; Dr. Nichter", "", "Board-certified plastic surgeons; email from official contact page"),
    "LunaGlow MedSpa": ("https://lunaglowmedspa.com", "none found", "", "Fresha / WellnessLiving", "Booking listings on Fresha and WellnessLiving; no qualifying email"),
    "Akari Medspa": ("https://akarimedspa.com", "none found", "", "Jane App", "Booking via akarimedspa.janeapp.com; no qualifying email"),
    "Beyond Beauty Medical Spa": ("https://bbspamed.com", "info@bbspamed.com", "Asil Dakak", "", "Founder is board-certified NP; email from official contact page"),

    # --- Irvine med spa ---
    "Deluxe Med Spa & Wellness": ("https://www.deluxemedspa.com", "none found", "", "", "Multi-location LA/OC chain; form/phone only, no published email"),
    "Masters Medspa": ("https://masters-medspa.com", "manager@masters-medspa.com", "Dr. Chantal Lunderville (Medical Director)", "Jane App", "Email from contact page; booking via mastersmedspa.janeapp.com"),
    "LA Queen Med Spa": ("https://laqueenmedspa.com", "laqueenmarketing@gmail.com", "", "", "Gmail published as business contact"),
    "Amoderm Cosmetic and Wellness": ("https://www.amoderm.com", "info@amoderm.com", "Dr. Elham Jafarimojarrad, MD", "", "info@ published on contact page"),
    "Supreme Beauty Life Spa": ("https://www.supremebeautylife.com", "none found", "", "Fresha", "admin@ only via Yahoo listing (excluded); books via Fresha"),
    "Lux Medical OC": ("https://www.luxmedicaloc.com", "info@luxmedicaloc.com", "", "Fresha", "info@ listed as business contact; also bookable via Fresha; est. 2021"),
    "Concierge Aesthetics": ("https://www.conciergeaesthetics.com", "none found", "Stacy Vencill, PA-C (Founder)", "", "Only media@ (media inquiries) surfaced; no general contact email"),
    "Avant Medspa": ("https://avant-medspa.com", "janice@avant-medspa.com", "", "WellnessLiving", "Email from contact page; listed on WellnessLiving"),

    # --- Tustin / Costa Mesa med spa ---
    "Dream Med Spa": ("https://dreammedspaoc.com", "dreammedspaoc@gmail.com", "Carrie (co-owner, FNP)", "Fresha", "Gmail published as contact; owner last name not in snippets"),
    "Beautiful Med Spa": ("none found", "none found", "", "none found", "No dedicated official site found (Yelp/Facebook/Birdeye only)"),
    "MySkin Medical Spa": ("https://myskinmedicalspa.com", "contactus@myskinmedicalspa.com", "", "WellnessLiving", "Email on official contact page"),
    "Celle Medical Aesthetics & Wellness": ("https://cellemedspa.com", "none found", "", "", "Site uses contact form; no published email/owner in snippets"),
    "GLO Bar MedSpa": ("https://globarmedspa.com", "hello@globarmedspa.com", "", "", "Email published as contact; women-founded, owner not named in snippets"),
    "Park Medspa": ("https://parkmedspa.com", "none found", "", "", "Multi-location CA brand inside Mane-Tained Salon; NJ 'Park MedSpa' unrelated"),
    "Iconique Medical Aesthetics": ("https://iconiquemedspa.com", "info@iconiquemedspa.com", "", "", "Email published as contact; multiple related domains"),
    "OmniaPiel Facial Aesthetics": ("https://omniapiel.com", "info@omniapiel.com", "", "Fresha", "Email published; Shopify site; Fresha booking listing"),
    "Gold Coast Aesthetics": ("https://goldcoastaesthetics.com", "info@goldcoastaesthetics.com", "Karina Seuser (FNP)", "Fresha", "Email and FNP owner in snippets; Fresha booking listing"),
    "Skin Perfect Medical Aesthetics": ("https://skinperfectmedical.com", "none found", "Erin Borini", "", "Multi-location; email snippets truncated/inferred (excluded); CM lead provider Erin Borini"),
    "LYVE Medspa": ("https://lyvemedspa.com", "none found", "", "", "Two domains (lyvemedspa.com, lyvewellness.com); no published email/owner"),

    # --- Laguna Niguel massage ---
    "Squeeze Massage": ("https://www.squeezemassage.com", "none found", "", "Squeeze app (proprietary)", "National franchise (Drybar founders); Laguna Niguel location page; no location email"),
    "Balance Massage & Facial": ("https://mybalancemassage.com", "none found", "", "", "Has contact-us page; contact form only, no published email"),
    "The NOW Massage": ("https://www.thenowmassage.com", "lagunaniguel@thenowmassage.com", "", "Proprietary/app booking", "National franchise; Laguna Niguel boutique page; location email from snippet"),
    "Royal Thai Massage and Healing Center": ("https://royalthaimassagehealing.com", "royalthaimassage.ln@gmail.com", "", "Square", "Email from snippet; also lists on Fresha"),
    "Heavenly Thai Massage": ("https://www.heavenly-thaimassage.com", "none found", "", "Setmore", "Also Square; no published email in snippets"),
    "On Point Massage": ("https://www.onpointmassagespa.com", "none found", "", "Fresha", "On Point Massage Therapy Inc; no published email in snippets"),
    "Relax Body & Mind Spa": ("https://relaxbodymindspalagunaniguel.com", "none found", "", "Fresha", "Also booked via Fresha; no published email in snippets"),
    "Sun Rise World Therapies": ("https://sunriseworldtherapies.com", "none found", "Dr. Fadia Aboraid", "MassageBook", "LLC; also on ClassPass; owner from snippet; no email"),
    "OC Therapeutic Massage Inc": ("https://www.octherapeuticmassage.com", "dj@octherapeuticmassage.com", "DJ (founder, first name only)", "Square", "Also MassageBook; Wix site; email & founder first name from snippets"),

    # --- Tustin salons ---
    "Tustin Hair Salon": ("https://www.tustin-hairsalon.com", "none found", "", "", "Unverified gmail (tustinhairsalon2022@gmail.com) appeared only in an AI summary, not a literal snippet (excluded); booking by phone"),
    "The Young American Salon - Old Town": ("https://www.theyoungamerican.com/california/old-town", "none found", "", "WellnessLiving", "150 E Main St; shares site/phone with Southern; only data-broker emails (excluded)"),
    "The Young American Salon - Southern": ("https://www.theyoungamerican.com/california/southern-local", "none found", "", "WellnessLiving", "720 W First St; same salon/site as Old Town; no verified published email"),
    "Bloom Hair Studio": ("https://taddeohair.glossgenius.com", "none found", "", "GlossGenius", "No independent domain; GlossGenius page is main web presence; IG @bloomhairstudio_oc"),
    "Haute & Knotty Salon": ("https://hautenknotty.com", "hautenknotty@gmail.com", "", "Vagaro", "Email from contact-us page snippet; booking via Vagaro"),
    "Salon Ara": ("none found", "none found", "Kathy An (likely owner)", "Fresha", "No own website (Fresha/directories only); Kathy An is registered agent of Salon Ara Kay, Inc"),
    "LIMITLESS SALON SUITES": ("https://limitlesssalonsuites.com", "none found", "", "Booksy", "Barber private-suite concept, 13132 Newport Ave; booking via Booksy"),
    "Best Hair Care": ("none found", "none found", "", "Fresha", "No official own site (Fresha listing + directory only)"),
}

SRC = "OC-Prospect-List-June-2026.csv"
OUT = "OC-Prospect-List-Enriched.csv"

with open(SRC, newline="") as f:
    rows = list(csv.reader(f))

header = rows[0]
new_header = header + ["website", "email", "owner_name", "booking_tech", "notes"]

out_rows = [new_header]
missing = []
for r in rows[1:]:
    if not r or not r[0].strip():
        continue  # skip blank trailing line
    name = r[0]
    if name in E:
        w, em, own, book, note = E[name]
    else:
        w, em, own, book, note = ("", "", "", "", "")
        missing.append(name)
    out_rows.append(r + [w, em, own, book, note])

with open(OUT, "w", newline="") as f:
    csv.writer(f).writerows(out_rows)

print(f"Wrote {len(out_rows)-1} data rows to {OUT}")
if missing:
    print("MISSING enrichment for:", missing)

# Quick stats
data = out_rows[1:]
def emv(row):
    return row[len(header)+1].strip()
def bookv(row):
    return row[len(header)+3].strip()
real_email = [r for r in data if emv(r) not in ("none found", "form only", "")]
form_only = [r for r in data if emv(r) == "form only"]
none_found = [r for r in data if emv(r) == "none found"]
print(f"Rows: {len(data)}")
print(f"Real email: {len(real_email)} ({100*len(real_email)/len(data):.0f}%)")
print(f"form only: {len(form_only)}")
print(f"none found: {len(none_found)}")
