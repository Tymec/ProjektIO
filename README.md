# ProjektIO

## Skład zespołu

- Konrad Sitek
- Tymoteusz Grabowski
- Mikołaj Grycz

<br />

## Opis projektu

Strona internetow oferuje sprzedaż obrazów wygenerowanych przez AI oraz dodatkowe możliwości, takie
jak rozmowa z wirtualnym asystentem, personalizacja konta i możliwość subskrypcji newslettera.

<br />

## Użyte technologie

### Backend

- **[Django](https://www.djangoproject.com/)** - Framework do tworzenia aplikacji webowych.
- **[Pytest](https://docs.pytest.org/en/7.3.x/)** - Framework do unit testów.
- **[CockroachDB Cloud](https://cockroachlabs.cloud/)** - Serverless baza danych PostgreSQL.
- **[Amazon S3](https://aws.amazon.com/s3/)** - Cloud storage do przechowywania plików statycznych (CSS, JS, ...) i media (zdjęcia produktów, ...)
- **[Isort, Black & flake8](http://www.sefidian.com/2021/08/03/how-to-use-black-flake8-and-isort-to-format-python-codes/)** - Formatowanie kodu i sprawdzanie spójności stylu.
- **[Stripe](https://stripe.com/)** - Obsługa płatności.
- **[OpenAI](https://platform.openai.com/)** - Implementacja chatbota i generowania zdjęć.

### Frontend

- **[React](https://reactjs.org/)** - Biblioteka JavaScript do budowy interfejsów użytkownika.
- **[Vitest](https://vitest.dev/)** - Framework do unit testów
- **[ESLint & Prettier](https://github.com/prettier/eslint-config-prettier)** - Formatowanie kodu i sprawdzanie spójności stylu.
- **[Bootswatch](https://bootswatch.com/)** - Darmowe szablony dla Bootstrap.

### Inne

- **[GitHub Actions](https://github.com/features/actions)** - CI, automatyczne formatowanie kodu, testowanie i generowanie dokumentacji.
- **[Doppler](https://www.doppler.com/)** - Przechowywanie sekretów.
- **[Postman](https://www.postman.com/)** - Testowanie API.

<br />

## Funkcjonalności

### Wirtualny asystent

Strona zapewnia funkcję rozmowy z wirtualnym
asystentem, który może odpowiedzieć na pytania, udzielić wskazówek i
pomóc w wykorzystaniu promptów. Asystent może również dostarczyć
informacji na temat procesu samogenerowania obrazów i udzielić porad
artystycznych. Asystent integruje OpenAI API, może rozumieć kontekst
rozmowy i dostarczać odpowiedzi zgodnie z wcześniejszymi interakcjami. To
sprawia, że rozmowa z asystentem jest bardziej naturalna i płynna. Na
podstawie wcześniejszych interakcji, informacji z konta użytkownika i innych
danych, asystent może personalizować odpowiedzi, dostarczając treści, które
są bardziej odpowiednie i interesujące dla konkretnego użytkownika.

![image](https://github.com/Tymec/ProjektIO/assets/69002597/4d68b8f3-0865-4008-9bec-3e74910e24b1)

<br />

### Konta użytkowników

Użytkownicy mogą zakładać konta i zarządzać swoimi zamówieniami. Dodatkowo, mamy konta administratorskie do zarządzania sklepem.

### Konto zwykłe

Użytkownicy mają możliwość założenia konta na stronie, co
pozwala na personalizację doświadczenia użytkowania. Założenie konta
umożliwia, dostęp do historii zakupów, zarządzanie preferencjami. Dane
potrzebne do założenia konta to: imię, nazwisko, email, hasło. Jeżeli istnieje
już konto z tym samym emailem, to rejestracja nie jest możliwa (sprawdzanie
w bazie danych czy istnieje konto z emailem).

![image](https://github.com/Tymec/ProjektIO/assets/69002597/1d4fd39a-599f-4e3d-8caf-386be3401ab3)
![image](https://github.com/Tymec/ProjektIO/assets/69002597/74a11968-0b84-4376-89cf-57157cab791d)
![image](https://github.com/Tymec/ProjektIO/assets/69002597/c81264a5-97ca-45d8-974d-d8b9d7e3eb33)

<br />

### Konto administratorskie

Dodatkowo istnieją konta administratorskie, które
umożliwiają obsługę zamówień, zarządzanie opiniami i ocenami klientów
newsletterem oraz generowaniem nowych obrazków. Dane potrzebne do
założenia konta to: imię, nazwisko, email, hasło.

![image](https://github.com/Tymec/ProjektIO/assets/69002597/f838907b-d9c6-47bc-84c4-48bcfadf3cce)
![image](https://github.com/Tymec/ProjektIO/assets/69002597/82cbb8d6-5574-4e40-bb9d-e35fe050b2b2)

<br />

### Autogenerowanie obrazków z promptami

Strona oferuje funkcję autogenerowania nowych na backendzie. Administrator
może wprowadzić prompt, a następnie zobaczyć samogenerowany obraz z
wykorzystaniem algorytmu DALL·E 2. Istnieje możliwość dostosowania
parametrów generowania, takich jak styl, kolorystyka, kompozycja a
następnie udostępnienie obrazka na stronie.


![image](https://github.com/Tymec/ProjektIO/assets/69002597/f38701a0-228c-47ea-b02e-32eb17a90aa0)

![image](https://github.com/Tymec/ProjektIO/assets/69002597/e5dd1472-3317-405e-8749-3d414f1c1e26)


### Newsletter

Strona umożliwia subskrypcję newslettera, który regularnie dostarcza
informacje o nowych promptach, aktualnościach, inspiracjach artystycznych i
innych ciekawych treściach. Użytkownicy mogą zdecydować, czy chcą
otrzymywać takie powiadomienia i dostosować preferencje dotyczące
newslettera w swoim koncie. Zarządzanie newsletterem odbywa się na
backendzie poprzez konto administratorskie.

![image](https://github.com/Tymec/ProjektIO/assets/69002597/4437e27b-d13c-438e-bc74-d35736434de0)
![image](https://github.com/Tymec/ProjektIO/assets/69002597/6056032a-f8be-40a4-94d4-0812f05aedb7)

<br />

### Płatności

Strona internetowa korzysta z usługi płatności dostarczanej przez Stripe,
która zapewnia wygodne i bezpieczne rozwiązania płatnicze dla
użytkowników. Stripe umożliwia użytkownikom dokonywanie płatności za
prompty i inne usługi przy użyciu kart kredytowych i debetowych. Stripe
zapewnia wysoki poziom bezpieczeństwa transakcji. Wszystkie dane
płatności są przetwarzane w sposób zaszyfrowany, co minimalizuje ryzyko
kradzieży informacji finansowych.

![image](https://github.com/Tymec/ProjektIO/assets/69002597/85119b06-c270-4db2-8952-154d9bfad380)

### Wyszukiwanie produktów

Strona zapewnia funkcję wyszukiwania, która umożliwia użytkownikom
wpisanie słów kluczowych, aby znaleźć produkty o danym stylu

![image](https://github.com/Tymec/ProjektIO/assets/69002597/78f5ab67-f1ae-469f-9bf0-79ac8ad98820)

<br />

### Sortowanie produktów na stronie

Strona internetowa zapewnia użytkownikom możliwość sortowania produktów
według różnych parametrów, takich jak cena, ocena, nazwa, liczba recenzji i
stan na magazynie. Dzięki tym opcjom użytkownicy mają możliwość
dostosowania widoku produktów według swoich preferencji oraz szansę na
szybsze odnalezienie interesującego produktu.

![image](https://github.com/Tymec/ProjektIO/assets/69002597/708d169a-a6ef-4477-8b46-dd99a5548e3c)

<br />

### Koszyk

Po dodaniu produktów do koszyka, użytkownicy mogą wyświetlić podgląd
swojego koszyka. Podgląd koszyka zawiera informacje o produktach, takie jak
nazwa, obrazek, cena jednostkowa, ilość zamówionych sztuk i łączna cena za
każdy produkt. Dodatkowo, zawiera również łączną wartość koszyka, która
jest sumą cen wszystkich produktów. Podgląd koszyka umożliwia
użytkownikom zarządzanie jego zawartością. Mogą dodawać, usuwać lub
aktualizować ilość produktów w koszyku. Dodatkowo, istnieje opcja powrotu
do zakupów lub przejścia do płatności. Na stronie internetowej domyślną
walutą jest dolar amerykański (USD).

![image](https://github.com/Tymec/ProjektIO/assets/69002597/d56c00fe-04a3-4318-a453-38f09cfc9cd7)

<br />

## Baza danych

System bazodanowy używany przez stronę internetową przechowuje istotne
dane, takie jak konta użytkowników, hasła, prompty i obrazki.

![image](https://github.com/Tymec/ProjektIO/assets/69002597/3c90841f-fae5-4fcb-ae01-43dd3afe6ee8)

<br />

### Diagram klas

![image](backend/docs/uml.png)

<br />

### Diagram przypadków użycia

![image](https://github.com/Tymec/ProjektIO/assets/69002597/e590b9d4-8537-4dcb-b646-33a677366f89)

<br />

## Testy

![image](https://github.com/Tymec/ProjektIO/assets/69002597/fdda7ba1-5883-4448-ae48-6cd220908a98)
![image](assets/backend_tests.png)

<br />

## Instalacja

### Frontend

- `make frontend install`
- `make frontend dev`

### Backend

- `make backend install`
- `make backend dev`
