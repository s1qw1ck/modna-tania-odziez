// Wspólne dane dla wszystkich wariantów strony.
// Ceny i godziny spisane z banera w sklepie (Przemyśl) i z Facebooka.
const SKLEPY = {
  przemysl: {
    id: "przemysl",
    miasto: "Przemyśl",
    ulica: "ul. Mickiewicza 28",
    kod: "37-700 Przemyśl",
    obok: "obok Max Elektro i Biedronki",
    mapa: "Mickiewicza 28, 37-700 Przemyśl",
    facebook: "https://www.facebook.com/people/Modna-Tania-Odzie%C5%BC-ze-Skandynawii/61560146189325/",
    instagram: "https://www.instagram.com/taniaodziez_skandynawia/",
    instagramNazwa: "@taniaodziez_skandynawia",
    godziny: [
      ["Poniedziałek", "8:00 – 17:00"],
      ["Wtorek", "8:00 – 15:00"],
      ["Środa", "8:00 – 17:00"],
      ["Czwartek", "8:00 – 17:00"],
      ["Piątek", "8:00 – 17:00"],
      ["Sobota", "8:00 – 14:00"],
      ["Niedziela", "nieczynne"],
    ],
    otwarcie: null,
  },
  rzeszow: {
    id: "rzeszow",
    miasto: "Rzeszów",
    ulica: "ul. Targowa 5",
    kod: "Rzeszów",
    obok: "",
    mapa: "Targowa 5, Rzeszów",
    facebook: "https://www.facebook.com/people/Modna-Tania-Odzie%C5%BC-ze-Skandynawii-Rzesz%C3%B3w/61595167560419/",
    // Instagram Rzeszowa jeszcze nieznany – wpisać, gdy właściciel poda
    instagram: "",
    instagramNazwa: "",
    // Godziny jeszcze nieznane, na razie jak w Przemyślu
    godziny: [
      ["Poniedziałek", "8:00 – 17:00"],
      ["Wtorek", "8:00 – 15:00"],
      ["Środa", "8:00 – 17:00"],
      ["Czwartek", "8:00 – 17:00"],
      ["Piątek", "8:00 – 17:00"],
      ["Sobota", "8:00 – 14:00"],
      ["Niedziela", "nieczynne"],
    ],
    otwarcie: "2026-11-04T08:00:00",
  },
};

const INSTAGRAM = "https://www.instagram.com/taniaodziez_skandynawia/";

// Cykl tygodnia, indeks = Date.getDay() (0 = niedziela)
const TYDZIEN = [
  { dzien: "Niedziela", krotko: "Nd", haslo: "Nieczynne", opis: "Odpoczywamy – do zobaczenia w poniedziałek!" },
  { dzien: "Poniedziałek", krotko: "Pn", haslo: "−50%", opis: "Wszystko o połowę taniej" },
  { dzien: "Wtorek", krotko: "Wt", haslo: "5 zł / 3 zł", opis: "Dorośli 5 zł/szt, dzieci 3 zł/szt" },
  { dzien: "Środa", krotko: "Śr", haslo: "NOWY TOWAR", opis: "Całkowita wymiana towaru – najlepszy wybór!" },
  { dzien: "Czwartek", krotko: "Cz", haslo: "Nowy towar", opis: "Świeża dostawa ze Skandynawii" },
  { dzien: "Piątek", krotko: "Pt", haslo: "Nowy towar", opis: "Ostatni dzień cen regularnych" },
  { dzien: "Sobota", krotko: "So", haslo: "−30%", opis: "Wszystko 30% taniej" },
];

// [produkt, cena śr–pt, cena wtorek]
const CENNIK = [
  ["Bluzka, spodnie, sweter, spodenki, podkoszulka męska, koszula, żakiet, spódnica", "20 zł", "5 zł"],
  ["Sukienka", "25 zł", "5 zł"],
  ["Kurtka", "40 zł", "10 zł"],
  ["Kurtka dziecięca", "20 zł", "5 zł"],
  ["Odzież dziecięca", "8 zł", "3 zł"],
  ["Buty", "10 zł", "5 zł"],
  ["Biustonosze, majtki", "6 zł", "3 zł"],
  ["Czapki, szaliki, apaszki, rękawiczki", "6 zł", "3 zł"],
  ["Paski", "5 zł", "3 zł"],
  ["Stroje kąpielowe", "10 zł", "3 zł"],
  ["Pościel, ręczniki, firanki, zasłony", "19 zł/kg", "3 zł"],
  ["Obrusy", "30 zł/kg", "3 zł"],
  ["Włóczka, rajstopy, skarpety, karnawał, śliniaki", "35 zł/kg", "3 zł"],
];

const ZASADY = [
  "Prosimy o przemyślane zakupy – po odejściu od kasy reklamacji i zwrotów nie przyjmujemy.",
  "Sklep nie ponosi odpowiedzialności za rzeczy pozostawione przez klientów.",
];

function dzisIndeks() { return new Date().getDay(); }

function mapaSrc(sklep) {
  return "https://maps.google.com/maps?q=" + encodeURIComponent(sklep.mapa) + "&z=16&output=embed";
}

function trasaHref(sklep) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(sklep.mapa);
}

// Czy sklep jest teraz otwarty? Zwraca tekst statusu.
function statusSklepu(sklep, teraz = new Date()) {
  if (sklep.otwarcie && teraz < new Date(sklep.otwarcie)) return { otwarte: false, tekst: "Otwarcie już wkrótce" };
  const g = sklep.godziny[(teraz.getDay() + 6) % 7][1];
  if (g === "nieczynne") return { otwarte: false, tekst: "Dziś nieczynne" };
  const [od, doo] = g.split("–").map(s => s.trim().split(":").map(Number));
  const min = teraz.getHours() * 60 + teraz.getMinutes();
  const a = od[0] * 60 + od[1], b = doo[0] * 60 + doo[1];
  if (min < a) return { otwarte: false, tekst: "Otwieramy dziś o " + g.split("–")[0].trim() };
  if (min >= b) return { otwarte: false, tekst: "Na dziś zamknięte" };
  return { otwarte: true, tekst: "Otwarte do " + g.split("–")[1].trim() };
}

function odliczanie(cel, teraz = new Date()) {
  let s = Math.max(0, Math.floor((new Date(cel) - teraz) / 1000));
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  return { d, h, m: Math.floor(s / 60), s: s % 60 };
}

const FLAGI = `<span class="flagi" aria-hidden="true">
<svg viewBox="0 0 16 10"><rect width="16" height="10" fill="#006AA7"/><rect x="5" width="2" height="10" fill="#FECC00"/><rect y="4" width="16" height="2" fill="#FECC00"/></svg>
<svg viewBox="0 0 22 16"><rect width="22" height="16" fill="#BA0C2F"/><rect x="6" width="4" height="16" fill="#fff"/><rect y="6" width="22" height="4" fill="#fff"/><rect x="7" width="2" height="16" fill="#00205B"/><rect y="7" width="22" height="2" fill="#00205B"/></svg>
<svg viewBox="0 0 37 28"><rect width="37" height="28" fill="#C8102E"/><rect x="12" width="4" height="28" fill="#fff"/><rect y="12" width="37" height="4" fill="#fff"/></svg>
</span>`;
