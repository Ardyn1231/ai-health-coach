# Steg-för-steg guide: AWS Server & Videoinspelning

Denna guide hjälper dig att sätta upp applikationen på en AWS EC2-server igen och spela in en video till din lärare på Jensen Education som visar alla uppgraderingar.

---

## DEL 1: Starta upp AWS EC2-servern igen (ca 5-10 min)

Eftersom du stängde ner den gamla servern skapar vi snabbt en ny ren instans.

### Steg 1: Skapa EC2-instansen i AWS Console
1. Logga in på **AWS Management Console** och sök efter **EC2**.
2. Klicka på den orangea knappen **"Launch instance"**.
3. Fyll i följande inställningar:
   - **Name**: `PulseCoach-Server`
   - **Application and OS Images**: Välj **Ubuntu** (Ubuntu Server 24.04 LTS eller 22.04 LTS, Free Tier eligible).
   - **Instance type**: `t2.micro` eller `t3.micro` (Free Tier eligible).
   - **Key pair**: Välj din befintliga `.pem`-nyckel eller skapa en ny (om du använder EC2 Instance Connect i webbläsaren behöver du inte ens ladda ner nyckeln).
   - **Network settings / Brandvägg**:
     - ✅ Bocka i **"Allow SSH traffic from anywhere"** (port 22).
     - ✅ Bocka i **"Allow HTTP traffic from the internet"** (port 80) — *Viktigt för att kunna surfa in på sidan!*
4. Klicka på **"Launch instance"** längst ner till höger.

---

### Steg 2: Anslut till servern
Det enklaste sättet är **EC2 Instance Connect** direkt i webbläsaren:
1. Gå till **Instances** i EC2-menyn.
2. Markera din nya instans och klicka på **Connect** högst upp.
3. Välj fliken **EC2 Instance Connect** och klicka på den orangea knappen **Connect**.
4. En svart terminal öppnas direkt i din webbläsare.

---

### Steg 3: Klona och starta PulseCoach AI
Klistra in och kör dessa kommandon ett i taget (eller allt på en gång):

```bash
# 1. Uppdatera paket och installera nödvändiga verktyg
sudo apt update && sudo apt install -y python3-pip python3-venv git

# 2. Klona ner ditt uppdaterade GitHub-repo
git clone https://github.com/Ardyn1231/ai-health-coach.git

# 3. Gå in i mappen
cd ai-health-coach

# 4. Skapa en virtuell Python-miljö och installera beroenden
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 5. Starta appen som en bakgrundstjänst på port 80 via Gunicorn
sudo ./venv/bin/gunicorn -w 3 -b 0.0.0.0:80 app:app --daemon
```

---

### Steg 4: Testa att sidan är live!
1. Gå tillbaka till AWS EC2-konsolen och kopiera **Public IPv4 address** (t.ex. `13.51.x.x`).
2. Öppna en ny flik i webbläsaren och klistra in IP-adressen (använd vanlig `http://`, inte `https://`):
   ```text
   http://DIN-PUBLIKA-IP
   ```
3. Nu ser du din uppgraderade applikation rulla live på Linux/AWS!

---

## DEL 2: Videoinspelning (Manus & Visningsguide)

**Längd**: Cirka 2 till 3 minuter.  
**Verktyg för inspelning**:
- **Windows Game Bar**: Tryck `Windows-tangenten + Alt + R` för att starta/stoppa inspelning direkt i Windows (eller tryck `Win + G`).
- Eller **Clipchamp** / **OBS Studio** om du har det installerat.

---

### Video-manus (Vad du kan säga och visa)

#### 0:00 – 0:30: Introduktion & Sammanhang
* **Vad du visar på skärmen**: Visa startsidan på din webbläsare där appen är öppen, eller visa AWS-konsolen med din instans igång.
* **Vad du säger**:
  > *"Hej! Jag heter Omar och går sista månaden på Drifttekniker-utbildningen hos Jensen Education. I den här videon ska jag visa kompletteringen och uppgraderingen av min AI Health & Coaching-applikation, PulseCoach AI.*
  > 
  > *Efter den förra inlämningen har jag vidareutvecklat applikationen utifrån feedbacken: jag har fixat navigeringsbuggen i flikarna, lagt till visuella övningsinstruktioner, byggt en Windows .exe-fil så att programmet kan köras lokalt utan krångel, samt satt upp den live igen på en Ubuntu-server i AWS."*

---

#### 0:30 – 1:15: Serverdrift & Buggfix (Flikarna)
* **Vad du visar på skärmen**: 
  - Peka på URL-fältet i webbläsaren så att läraren ser din AWS publika IP-adress.
  - Klicka på knappen **"Generate My AI Coaching Plan"** så att schemat laddas.
  - Klicka mellan flikarna: **7-Day Workout Protocol**, **Meal Strategy** och **Recovery & Habits**.
* **Vad du säger**:
  > *"Som ni ser här i adressfältet körs appen just nu på en AWS EC2 Ubuntu-server i bakgrunden via Gunicorn på port 80.*
  > 
  > *Det första problemet vi hade tidigare var att flikarna för träningsschema, kost och livsstil inte reagerade när man klickade på dem. Det berodde på ett ID-fel i JavaScript-kopplingen. Jag har nu åtgärdat detta och strukturerat om koden så att man smidigt kan växla mellan 7-dagarsträningen, måltidsstrategin och återhämtningsvanorna."*

---

#### 1:15 – 2:00: Nya funktioner – Form Guide, BMI & Vätskelogg
* **Vad du visar på skärmen**:
  - Gå till träningsfliken och klicka på den gröna knappen **"Form Guide"** vid någon av övningarna (t.ex. Bench Press eller Squat).
  - Visa den öppnade rutan med illustrationen, steg-för-steg instruktionerna, muskelgrupperna och vanliga misstag att undvika. Stäng sedan rutan.
  - Visa den nya **BMI-mätaren** högst upp med färgskalan och peka på nålen.
  - Klicka på några av **vattenglasen** i den interaktiva vätskeloggen och klicka sedan på **"Save Regimen"**.
* **Vad du säger**:
  > *"En annan viktig komplettering var att lägga till instruktioner för övningarna. Jag skapade en funktion som heter 'Form Guide'. När användaren klickar på den vid en övning öppnas en teknikguide med en schematisk illustration, steg-för-steg instruktioner för rätt teknik, samt vanliga misstag att se upp för så man inte skadar sig.*
  > 
  > *Jag har även lagt till en visuell BMI-mätare med tydliga färgzoner så att användaren direkt ser var de ligger, samt en interaktiv vätskelogg där man kan bocka av dagens vattenglas, vilket sparas i webbläsarens minne."*

---

#### 2:00 – 2:40: Den fristående Windows-appen (.exe)
* **Vad du visar på skärmen**:
  - Minimera webbläsaren och öppna Utforskaren på din dator i mappen `dist`.
  - Visa filen **`PulseCoach.exe`**.
  - Dubbelklicka på `PulseCoach.exe`. Visa att den automatiskt öppnar webbläsaren på `http://localhost:<port>` utan att man behöver röra terminalen eller ha Python installerat!
* **Vad du säger**:
  > *"För att göra det så enkelt som möjligt för vanliga användare som inte kan eller vill använda terminalen och Python, har jag också kompilerat och paketerat hela applikationen till en fristående Windows .exe-fil: PulseCoach.exe.*
  > 
  > *När man dubbelklickar på den letar den automatiskt upp en ledig port i datorn, drar igång servern i bakgrunden och öppnar webbläsaren direkt. Det gör systemet väldigt portabelt och användarvänligt."*

---

#### 2:40 – 3:00: Avslutning
* **Vad du visar på skärmen**: Visa ditt GitHub-repo ([https://github.com/Ardyn1231/ai-health-coach](https://github.com/Ardyn1231/ai-health-coach)) där den senaste commiten syns.
* **Vad du säger**:
  > *"All källkod, ändringar och dokumentation finns nu versionshanterade och pushade till mitt GitHub-repo. Det här var alla uppgraderingar för den här kompletteringen. Tack så mycket för mig!"*

---

## DEL 3: Vad du skickar till läraren

När du är klar skickar du följande:
1. **Länk till AWS-servern**: `http://DIN-PUBLIKA-IP`
2. **Länk till GitHub-repot**: `https://github.com/Ardyn1231/ai-health-coach`
3. **Länk till videon**: Ladda upp din inspelade video på Google Drive, YouTube (som olistad), eller bifoga den i inlämningen.
