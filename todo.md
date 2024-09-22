## Poprawki frontend
- [ ] w trakcie gry - usunac z navbara profil
- [ ] strona główna - jakeis grafiki
- [ ] niezalogowany nie widzi historie gier i statystyk
- [X] po wejdziu w np stworz gre, sidebar ma zostac bez zmian - ten element nie znika
- [ ] przy małych ekranach sidebar z ikonkami przechodzi na dół
- [x] ujednolicic przyciski - te same paddingi, cienie itp
- [x] ujednolicic tytuły stron - rozmiary, w sensie ten box np z POCZEKALNIA, Logowanie
- [x] w grze jak ktos sie wyloguje to go wywala z gry
- [x] logowanie i rejestracja za duzy margin top błędu przy inpucie
- [x] header `z-index` na 1000, ogarnac sidebar tak zeby strona sie nie scrollowala, na header dac `position: relative`
- [x] logo font-size zmniejszyc
- [ ] globalny scss - https://github.com/atakowiec/bricks-battle-game/blob/master/bricks-battle-app/src/style/globals.module.scss
- [x] zablokować zalogowanie się na konto na które ktoś jest juz zalogowany - socket połączony - /auth/verify
- [ ] w poczekalni można pedałować po całej apce, sidebar - stwórz/dolacz zmienia się na zielony przycisk "wroc do gry", /create-game itp przenosi do gry
- [X] naprawic czas w wyborze kategorii
- [ ] dodac komponenty placeholdery do brakujacych stron - ustawienia, staty itp
- [ ] mocno przetestowac responsywnosc i naprawic 

## Ficzery
- [x] nie mozna zmieniac wybranej kategorii
- [x] jak gra sie zaczela to nie mozna zmieniac routow, na navbarze byc moze wywalamy ikonki - zalezy czy powiadomienia beda potrzebne
- [ ] dodajemy losowe ikonki dla niezalogowanych osob
- [ ] dodajemy podglad tego kto jaka kategorie wybral - figma
- [ ] po 10 minutach bezczynnosci w lobby - gra usunieta
- [ ] limit czlonkow w grze
- [ ] kola ratunkowe sa na cala gre, na cala serie kategori
- [x] cała gra - kategorie - pytania itp pod /game z ktorego nie da sie wyjsc
- [ ] w przyszlosci - powiadomienia - zaproszenia itp


## Przebieg gry 
- wybor kategorii - dlugosc i liczba w settingsach
- widok z wybrana kategoria i "Pytanie #1" - dłuższy - ok 6s.
- pytanie - dlusgosc w setingsach
  - nie widac poprawnej odpowiedzi 
  - zanim nie pojawi sie poprawna odpowiedz to nie widac kto co wybral 
  - jak konczy sie czas pojawia sie poprawna odpowiedz i kto co wybral i to zostaje na kilka sekund - 5
- widok wybranek kategorii - 2 i kolejne razy z tym widokiem krotsze - 3s
- jak koncza sie pytania w kategorii - tablica wynikow - 10s
- po tablicy wynikow - wybor kategorii - po n kategoriach - tablica wynikow ktora zostaje na stałe, gracze moga "Opuść gre" i "Zagraj ponownie", 10s cooldownu na rozpoczecie kolejnej gry, admin rozpoczyna kolejna gre i kazdy kto jest (nawet w tablicy wynikow) w nia gra


## jakies pomysly
- jak ktos nie wykorzysta supermocy to dostaje +100 pkt
- liczba zdobytych pucharkow na profilu
- w "zapros znajomych" w grze wyswietlenie kto jest "online" lub "w grze" aka "zajęty"
