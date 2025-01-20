# Econify
Webtech project


https://econify.netlify.app/login


Template general

[Obiectiv general]
Realizarea unei aplicații pe una dintre temele specificate, cu back-end RESTful care accesează date stocate într-o bază relațională pe baza unui API de persistenţă și date expuse de un serviciu extern și frontend SPA realizat cu un framework bazat pe componente.

[Limitări tehnologice]
Front-end-ul trebuie realizat cu ajutorul unui framework bazat pe componente (React.js, care este acoperit în curs, sau Angular 2+, Vue.js)
Back-end-ul trebuie să aibă o interfață REST și să fie realizat în node.js
Stocarea se va face peste o bază relațională și accesul la baza se va face prin intermediul unui ORM
Codul trebuie versionat într-un repository git, cu commit incrementale cu descrieri clare
Aplicația trebuie să fie deployed pe un server (puteți utiliza unul dintre serviciile care au un tier free pentru studenți e.g. Azure, AWS etc.)

[Stil și calitatea codului]
Aplicație reală, coerentă din punct de vedere al logicii de business
Codul trebuie să fie bine organizat, numele variabilelor trebuie să fie sugestive (și trebuie să se utilizeze un standard de numire oricare ar fi el e.g. camel case), codul trebuie să fie indentat pentru a fi ușor citibil
Codul trebuie documentat cu comentarii la fiecare clasa, funcție etc.
Aplicațiile care nu funcționeaza nu primesc punctaj. Se poate însă demonstra doar funcționarea back-end-ului sau a front-end-ului
Opțional: test coverage


[Livrabile parțiale] - 3 etape (livrare se face introducând un link la un repository într-un google form; cadrul didactic coordonator va fi invitat ca un contribuitor la repository) - nelivrarea la o etapă intermediară reduce punctajul maxim cu 10% (i.e. dacă punctajul maxim este de 5 puncte din nota finală livrarea direct la final implică un punctaj maxim de 4 puncte)
Specificații detaliate, planul de proiect, prezența unui proiect în git - 21.11.2021
Serviciu RESTful funcțional în repository + instrucţiuni de rulare -  05.12.2021
Aplicața completă - se livrează în ultimul seminariu (demo) - ultimul seminariu

<hr>


Aplicație web acordarea anonimă de note

Obiectiv
Realizarea unei aplicații web care să permită acordarea de punctaje anonime de catre un juriu anonim de studenti proiectului altor studenti.
Descriere
Aplicația trebuie să permită acordarea unui punctaj unui proiect de către un juriu anonim de colegi.

Platforma este bazată pe o aplicație web cu arhitectură de tip Single Page Application accesibilă în browser de pe desktop, dispozitive mobile sau tablete (considerând preferințele utilizatorului).
Funcționalități (minime)

Ca student membru în echipa unui proiect (MP) pot să îmi adaug un proiect și să definesc o serie de livrabile partiale ale proiectului. La înscriere devin automat și parte din grupul de posibili evaluatori
Ca MP pentru un livrabil partial pot adăuga un video demonstrativ pentru proiect sau un link la un server unde poate fi accesat proiectul
La data unui livrabil parțial, ca student care nu este MP pot fi selectat aleatoriu să fac parte din juriul unui proiect. Pot acorda o notă proiectului doar dacă am fost selectat în juriul pentru el. 
Nota la un proiect este anonimă, iar nota totală se calculează omițând cea mai mare și cea mai mică notă. Notele sunt de la 1-10 cu până la 2 cifre fracționare.
Ca profesor, pot vedea evaluarea pentru fiecare proiect, fără a vedea însă identitatea membrilor juriului.
Aplicația are și un sistem de permisiuni. Doar un membru al juriului poate să adauge/modifice note și doar notele lui pe o perioadă limitată de timp


Exemple
???

![image](https://github.com/user-attachments/assets/6bedbf4b-5ee6-496e-95ca-7bf3182f5ddf)
![image](https://github.com/user-attachments/assets/f2399762-6642-4cdf-b0b0-95b73db57907)
![image](https://github.com/user-attachments/assets/4e476649-a245-419c-a18b-2e13a84c91a2)
![image](https://github.com/user-attachments/assets/fc018da8-29ab-4843-ad01-40017994791f)
Here's a justification for the choice of the purple color theme for the Econify application, based on the color wheel provided and practical examples:

---

### **Justification for Using Purple in Econify**

#### **1. Differentiation from ASE.ro**
ASE.ro (Academia de Studii Economice) already employs a blue-themed color palette, which is often associated with institutional and academic platforms. To ensure Econify offers a fresh and distinct experience, avoiding blue helps create a psychological separation from existing university systems. Students are less likely to feel they're using a standard university tool and more likely to view Econify as an innovative and engaging platform.

By using purple, Econify emphasizes:
- **Creativity and Innovation**: Purple is often linked with creativity, inspiration, and originality—qualities Econify embodies by introducing a novel anonymous grading system.
- **Sophistication and Modernity**: Purple hues are widely regarded as sophisticated and modern, aligning with Econify's cutting-edge technology stack (React.js, Node.js, REST API, etc.).

#### **2. Psychological Impact of Purple**
Purple evokes a sense of trustworthiness, independence, and forward-thinking. These align well with Econify’s purpose of fostering fair and anonymous peer evaluations, emphasizing equality and transparency.

The softer tones of purple (as seen in the UI) maintain a welcoming and non-intimidating environment while being visually appealing.

---

#### **3. Examples of Applications Using Purple**

1. **Twitch**: The live-streaming platform uses purple to reflect creativity and engagement. Its target audience—students and young professionals—finds it vibrant and exciting, much like Econify’s target demographic.
   
2. **Discord**: Another popular app among students, Discord employs a purple theme to signify community and collaboration. Econify mirrors this sense of community, as students collaborate and evaluate each other’s projects.

3. **Yahoo!**: The platform’s purple branding has long signified a blend of sophistication and innovation, aligning well with Econify’s modern approach.

---

#### **4. Alignment with the Color Wheel**
The analogous color scheme chosen on the color wheel provides harmonious tones, ranging from light lavender (#D8DBF2) to vibrant purple (#9B34F5). This creates a visually cohesive UI:
- **Primary Action Buttons**: Vibrant purple (#9B34F5) commands attention without overwhelming the user.
- **Background and Cards**: Subtle shades like lavender ensure readability and comfort during extended use.

---

By intentionally choosing purple, Econify sets itself apart as an innovative, student-friendly, and modern platform while maintaining an accessible and professional aesthetic. This strategic decision ensures users see it as more than just another university app—it’s a tool they trust and enjoy using.


