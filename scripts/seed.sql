PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;
DELETE FROM users;
INSERT OR REPLACE INTO users (id, username, email, name, password_hash, role, must_change_pw, active, created_at) VALUES (1, 'admin', NULL, 'Administrador', '$2b$10$y4KQevzgJy9srBKAMMLRA.a5Fizswtuf9aKvUxnS1GSRdJBRRBAma', 'admin', 0, 1, 1792230137);
INSERT OR REPLACE INTO users (id, username, email, name, password_hash, role, must_change_pw, active, created_at) VALUES (2, 'angelo', 'angelmagallanes80@gmail.com', 'Angel Magallanes', '$2b$10$eC07WBd/qpiFkp8aAdBtJezPPBqBHlZiQh3QULRsAabnipAFqKqKK', 'admin', 0, 1, 1792248158);
DELETE FROM songs;
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (1, 1, 'Toda Lengua Y Toda Nación', 'Marcos Brunet', 'C', NULL, '

              [C9]
Hasta que Él venga sonará
        [Am7]                    [G]
La melodía del clamor de tu iglesia
           [G4]  [G]
Jesús, regre__sa

              [C7M]
Hasta que Él venga subirá
         [Am7]
La adoración de los que anhelan
       [G]
Tu belleza
           [G4]  [G]
Jesús, regre__sa

[Pre-Estribillo]

   [Em7]
Y mientras te esperamos
     [D/F#]        [G/B]  [C7M]
El fuego no se apaga_rá

El fuego no se apagará

[Em7]
Ábranse las puertas
    [D/F#]          [G/B]   [C7M]
El Rey de gloria viene ya
   [D]
Y todo ojo lo verá

[Estribillo]

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre, Alabe tu nombre

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre

[Puente] [Em7]  [D/F#]  [G]
        [G/B]  [C9]

[Primera Parte]


Hasta que Él venga sonará
        [Am7]        [D/F#]        [G]
La melodía del clamor de tu iglesia
           [G4]  [G]
Jesús, regre__sa

              [C7M]
Hasta que Él venga subirá
         [Am7]
La adoración de los que anhelan
       [G]
Tu belleza
           [G4]  [G]
Jesús, regre__sa

[Pre-Estribillo]

   [Em7]
Y mientras te esperamos
     [D/F#]        [G/B]  [C7M]
El fuego no se apaga_rá

El fuego no se apagará

[Em7]
Ábranse las puertas
    [D/F#]          [G/B]   [C7M]
El Rey de gloria viene ya
   [D]
Y todo ojo lo verá

[Estribillo]

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre, Alabe tu nombre

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre

[Interlúdio 1] [G]  [D/F#]  [G]
               [G/B]  [C9]  [G/B]  [G]  [D/F#]
               [Em7]  [D/F#]  [G]
               [G/B]  [C9]  [G/B]  [G]  [D/F#]
               [Em7]  [D/F#]  [G]
               [G/B]  [C9]  [G/B]  [G]  [D/F#]
               [Em7]  [D/F#]  [G]
               [G/B]  [C9]  [G/B]  [G]  [D/F#]

[Segunda Parte]

 [Em7]  [D/F#]  [G]    [G/B]
Santo y    digno es
[C9]   [G/B]   [G]  [D/F#]
El  Cor___de_ro
  [Em7]  [D/F#]   [G]
Que   mu____rió
   [G/B]  [C9]  [G/B]  [G]  [D/F#]
Y re___su__ci___tó

 [Em7]  [D/F#]  [G]    [G/B]
Santo y    digno es
[C9]   [G/B]   [G]  [D/F#]
El  Cor___de_ro
  [Em7]  [D/F#]   [G]
Que   mu____rió
   [G/B]  [C9]  [G/B]  [G]  [D/F#]
Y re___su__ci___tó

 [Em7]  [D/F#]  [G]    [G/B]
Santo y    digno es
[C9]   [G/B]   [G]  [D/F#]
El  Cor___de_ro
  [Em7]  [D/F#]   [G]
Que   mu____rió
   [G/B]  [C9]  [G/B]  [G]  [D/F#]
Y re___su__ci___tó

 [Em7]  [D/F#]  [G]    [G/B]
Santo y    digno es
[C9]   [G/B]   [G]  [D/F#]
El  Cor___de_ro
  [Em7]  [D/F#]   [G]
Que   mu____rió
   [G/B]  [C9]  [G/B]  [G]  [D/F#]
Y re___su__ci___tó

[Estribillo]

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre, Alabe tu nombre

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre, Alabe tu nombre

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  De generación a generación

Alabe tu nombre, Alabe tu nombre

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  Toda lengua y toda nación

Alabe tu nombre, Alabe tu nombre

[C9]
   Toda lengua y toda nación
[Am7]                [D/F#]
    Toda lengua y toda nación
[G]
  De generación a generación

Alabe tu nombre, Alabe tu nombre

[Segunda Parte]

 [Em7]  [D/F#]  [G]    [G/B]
Santo y    digno es
[C9]   [G/B]   [G]  [D/F#]
El  Cor___de_ro
  [Em7]  [D/F#]   [G]
Que   mu____rió
   [G/B]  [C9]  [G/B]  [G]  [D/F#]
Y re___su__ci___tó

[Final] [Em7]  [D/F#]  [G]
        [G/B]  [C9]  [G/B]  [G]  [D/F#]
        [Em7]  [D/F#]  [G]
        [G/B]  [C9]  [G/B]  [G]  [D/F#]
        [Em7]  [D/F#]  [G]
        [G/B]  [C9]  [G/B]  [G]  [D/F#]
        [Em7]  [D/F#]  [G]
        [G/B]  [C9]  [G/B]  [G]  [D/F#]  [G]', NULL, 1792235227, 1792240004, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (2, 1, 'Eu Sou Quem Dizes Que Eu Sou', 'Hillsong Worship', 'E', NULL, '[Intro] [E]

[Primera Parte]

[E]                                        [C#m7]  [B4]    [E]
  Quem sou eu pra que o grande Rei me rece____ba  assim?
[E]                                    [C#m7]  [B4]  [A9]
  Me perdi e Ele me encontrou, seu amor   por mim
      [C#m7]  [B4]  [A9]
Seu amor   por mim

[Estribillo]

           [E]                 [B4]
Quem Deus libertar, livre enfim será
        [C#m7]  [B4]  [A9]       [E]
Sou filho    de  Deus, sim eu sou

[Segunda Parte]

[E]                             [C#m7]  [B4]  [E]
  Sua graça me resgatou me puri____fi__cou
[E]
  Quando eu era um pecador
    [C#m7]  [B4]  [A9]           [C#m7]  [B4]  [A9]
 Morreu  por  mim, sim morreu   por mim

[Estribillo]

           [E]                 [B4]
Quem Deus libertar, livre enfim será
        [C#m7]  [B4]  [A9]       [E]
Sou filho    de  Deus, sim eu sou
        [E]                  [B4]
Em Tua casa oh Pai, há um lugar pra mim
     [C#m7]  [B4]  [A9]       [E]
Sou filho de  Deus, sim eu sou

[Puente]

      [C#m7]    [B/D#]      [E]                     [A9]
Escolhido perdoado, eu sou quem dizes que eu sou
       [C#m7]       [B/D#]       [E]                     [A9]
Tu És por mim até o fim, eu sou quem dizes que eu sou
      [C#m7]    [B/D#]      [E]                     [A9]
Escolhido perdoado, eu sou quem dizes que eu sou
       [C#m7]       [B/D#]       [E]                     [A9]
Tu És por mim até o fim, eu sou quem dizes que eu sou
    [C#m7]       [B/D#]       [A9]
Eu sou quem dizes que eu sou

[Estribillo]

           [E]                 [B4]
Quem Deus libertar, livre enfim será
        [C#m7]  [B4]  [A9]       [E]
Sou filho    de  Deus, sim eu sou
        [E]                  [B4]
Em Tua casa oh Pai, há um lugar pra mim
     [C#m7]  [B4]  [A9]       [E]
Sou filho de  Deus, sim eu sou
        [E]                  [B4]
Em Tua casa oh Pai, há um lugar pra mim
     [C#m7]  [B4]  [A9]       [E]
Sou filho de  Deus, sim eu sou

( [C#m7]  [B/D#]  [E]  [A9] )

[Puente]

      [C#m7]    [B/D#]      [E]                     [A9]
Escolhido perdoado, eu sou quem dizes que eu sou
       [C#m7]       [B/D#]       [E]                     [A9]
Tu És por mim até o fim, eu sou quem dizes que eu sou
      [C#m7]    [B/D#]      [E]                     [A9]
Escolhido perdoado, eu sou quem dizes que eu sou
       [C#m7]       [B/D#]       [E]                     [A9]
Tu És por mim até o fim, eu sou quem dizes que eu sou

      [C#m7]    [B/D#]      [E]                     [A9]
Escolhido perdoado, eu sou quem dizes que eu sou
       [C#m7]       [B/D#]       [E]                     [A9]
Tu És por mim até o fim, eu sou quem dizes que eu sou
      [C#m7]    [B/D#]      [E]                     [A9]
Escolhido perdoado, eu sou quem dizes que eu sou
       [C#m7]       [B/D#]       [E]                     [A9]
Tu És por mim até o fim, eu sou quem dizes que eu sou

       [C#m7]       [B/D#]       [A9]
Oh eu sou quem dizes que eu sou
         [C#m7]       [B/D#]       [A9]
Sim, eu sou quem dizes que eu sou

[Estribillo]

           [E]                 [B4]
Quem Deus libertar, livre enfim será
        [C#m7]  [B4]  [A9]       [E]
Sou filho    de  Deus, sim eu sou
        [E]                  [B4]
Em Tua casa oh Pai, há um lugar pra mim
     [C#m7]  [B4]  [A9]       [E]
Sou filho de  Deus, sim eu sou', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/eu-sou-quem-dizes-que-eu-sou/)', 1792242266, 1792242266, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (3, 1, 'No Hay Otro Nombre', 'Hillsong Worship', 'G', NULL, '[Intro] [G]  [D/F#]  [G]  [Am]  [G]  [D/F#]  [Em]

[Primera Parte]

[D/F#]  [G]
 Él  es
[D/F#]   [G]  [Am]  [G]  [D/F#] [Em]
 Quien reina con  poder
[D/F#] [G]
 Creador
[D/F#]   [G] [Am]  [G]  [D/F#]  [Em]
  Su fama  eterna   es
[G/B]  [C]
 Su voz
[G/B] [C] [D]  [C]  [G/B]  [Em]
 Un eco sin final
  [G]       [C]
Todos proclamarán
[G/B]   [C]  [D]  [C] [G/B] [Em]   [C]
 No hay nadie como  Él

[Segunda Parte]

[D/F#]  [G]
 Su luz
[D/F#] [G]  [Am] [G]  [D/F#]    [Em]
 Radiante más que el sol
[D/F#] [G]
 Su amor
[D/F#]  [G]  [Am]  [G] [D/F#] [Em]
 Y gracia de-rra-mó
[G/B]  [C]
  En Él
[G/B] [C]  [D]  [C] [G/B]  [Em]
 Encuentro sani-dad
   [G]       [C]
Por siempre reinará
[G/B]   [C]  [D]  [C] [G/B] [Em]   [C]
 No hay nadie como  Él

[Estribillo]

       [G]
Ven a adorar al que resucitó
           [Em]
La luz del mundo, Que nos rescató
             [Bm]
No hay otro nombre igual
                     [C]
No hay otro nombre igual
        [Em]          [C]
Cristo nuestro Dios  oh oh oh

       [G]
El vencedor que a la diestra está
      [Em]
Ante su trono montes caerán
             [Bm]
No hay otro nombre igual
             [C]
No hay otro nombre igual
           [Em]          [C]
Cristo nuestro Dios  oh oh oh

[Tercera Parte]

[D/F#]  [G]
 En  Él
[D/F#]  [G]   [Am] [G] [D/F#] [Em]
  Está la Salvación
[D/F#]  [G]
 La cruz
[D/F#] [G]   [Am]  [G] [D/F#] [Em]
 Nos muestra su  a-mor
[G/B]  [C]
 Venció
          [Em]
La muerte con poder
   [G]       [C]
El Rey de reyes es
          [Em]   [C]
No hay nadie como Él  éllll

[Estribillo]

       [G]
Ven a adorar al que resucitó
        [Em]
La luz del mundo, Que nos rescató
             [Bm]
No hay otro nombre igual
             [C]
No hay otro nombre igual
        [Em]          [C]
Cristo nuestro Dios  oh oh oh

       [G]
El vencedor que a la diestra está
      [Em]
Ante su trono montes caerán
             [Bm]
No hay otro nombre igual
             [C]
No hay otro nombre igual
        [Em]          [C]
Cristo nuestro Dios  oh oh oh

[Puente]

  [G]
Con tu poder, Se rompen cadenas
[Em]
Cantarán, El cielo y la tierra
[C]
Santo eres Jesús
            [Em]          [C]
Santo es tu nombre Cristo, Cristo, Cristo

[Estribillo]

       [G]
Ven a adorar al que resucitó
        [Em]
La luz del mundo, Que nos rescató
             [Bm]
No hay otro nombre igual
             [C]
No hay otro nombre igual
        [Em]          [C]
Cristo nuestro Dios  oh oh oh

       [G]
El vencedor que a la diestra está
      [Em]
Ante su trono montes caerán
             [Bm]
No hay otro nombre igual
             [C]
No hay otro nombre igual
        [Em]          [C]
Cristo nuestro Dios  oh oh oh

             [Em]
No hay otro nombre igual
             [C]      [G]
No hay otro nombre igual, JEEESÚSS

[Final] [G]  [Em]  [C]  [Em]  [C]  [G]', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/no-hay-otro-nombre/)', 1792242267, 1792242267, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (4, 1, 'What A Beautiful Name', 'Hillsong Worship', 'D', NULL, '[D9]           [D9/F#]
You were the word at the beginning
          [G9]          [Bm]      [A4] [A]
One with God the Lord most high
[Bm]    [C#m5+]                   [D9]
Your hidden glory in creation
       [G9]            [Bm]      [A4] [A]
Now revealed in You Our Christ

                         [D9]                            [A]
What a beautiful name  it is, what a beautiful name  it is
              [Bm]     [A9]         [G9]
The name  of Jesus Christ my king
                          [D6(9)/F#]                    [A9]
What a beautiful name  it is, nothing compares to this
                         [Bm]        [A9]        [G9]
What a beautiful name  it is, the name  of Jesus

 [D9]           [D9/F#]
You didn''t want heaven without us
          [G9]          [Bm]      [A4] [A]
So Jesus You brought heaven down
[Bm]                      [A]      [D9]
My sin was great, Your love was greater
           [G9]     [Bm]     [A4] [A]
What could seperate us now

                         [D9]                            [A]
What a wonderful name  it is, what a wonderful name  it is
              [Bm]     [A9]         [G9]
The name  of Jesus Christ my king
                          [D6(9)/F#]                    [A9]
What a wonderful name  it is, nothing compares to this
                         [Bm]        [A9]        [G9]
What a wonderful name  it is, the name  of Jesus

                        [Bm]         [A9]        [G9]
What a wonderful name  it is, the name  of Jesus

( [G9]  [A9]  [Bm5+]  [A] ) )
( [G9/D]  [A9/E]  [D6(9)/B]  [A6(9)/F#] )

                     [G9]                        [A9]
Death could not hold You, the veil tore before You
                 [Bm5+]                [A]
You silenced the boast of sin and grave

                  [G9/D]                          [A9/E]
The heavens are roaring, the praise of Your glory
              [D6(9)/B]    [A6(9)/F#]
For You are raised to life again

              [G9]                  [A9]
You have no rival, You have no equal
           [Bm5+]       [A]
Now and forever God you reign

                [G9/D]                    [A9/E]
Yours is the kingdom, Yours is the glory
             [D6(9)/B]          [A4] [A9]
Yours is the name  above all names

                         [D9]                            [A]
What a powerful name  it is, what a powerful name  it is
              [Bm]     [A9]         [G9]
The name  of Jesus Christ my king
                          [D6(9)/F#]                    [A9]
What a powerful name  it is, nothing can stand against
                         [Bm]        [A9]        [G9]
What a powerful name  it is, the name  of Jesus

                        [Bm]         [A9]        [G9]
What a powerful name  it is, the name  of Jesus

              [G9]                  [A9]
You have no rival, You have no equal
           [Bm5+]       [A]
Now and forever God you reign

                [G9/D]                    [A9/E]
Yours is the kingdom, Yours is the glory
             [D6(9)/B]          [A4] [A9]
Yours is the name  above all names

                         [D9]                            [A]
What a powerful name  it is, what a powerful name  it is
              [Bm]     [A9]         [G9]
The name  of Jesus Christ my king
                          [D6(9)/F#]                    [A9]
What a powerful name  it is, nothing can stand against
                         [Bm]        [A9]        [G9]
What a powerful name  it is, the name  of Jesus

                        [Bm]         [A9]        [G9]
What a powerful name  it is, the name  of Jesus
                        [Bm]         [A9]        [G9]
What a powerful name  it is, the name  of Jesus', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/what-a-beautiful-name/)', 1792242267, 1792242267, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (5, 1, 'Touch Of Heaven', 'Hillsong Worship', 'D', NULL, '[Intro] [D2]  [F#m7]  [A]  [E4]

[D2]                        [F#m7]
How I live for the moments
                                [A5]
Where I''m still in Your presence
                      [E4]
All the noise dies down
              [A/C] [D2]
Lord speak to me now
                         [F#m7]
You have all my attention
                        [A5]
I will linger and listen
                    [E4]
I can''t miss a thing

        [A/C#]         [D]
Lord I know my heart wants more of
        [F#m]
You My heart wants something new
   [A]             [E]
So I surrender all

  [A/C#]   [D]                           [E]
All I want is to live within Your love
                     [F#m]
Be undone by who You are
                 [A/C#]
My desire is to know You deeper
[D]                    [E]
Lord I will open up again
                         [F#m]
Throw my fears into the wind
                      [A/C#]
I am desperate for a touch of heaven
[D]  [E]  [F#m]  [A/C#]
Oooh

[D]                            [F#m]
You''re the fire in the morning
                             [A]
You''re the cool in the evening
                    [E]
The breath in my soul
                   [D]
The life in my bones
                    [F#m]
There is no hesitation
                        [A]
In Your love and affection
                       [E]
It''s the sweetest of all

               [D]
Lord I know my heart wants more of
        [F#m]
You My heart wants something new
   [A]             [E]
So I surrender all

  [A/C#]   [D]                           [E]
All I want is to live within Your love
                      [F#m]
Be undone by who You are
                  [A/C#]
My desire is to know You deeper
     [D]                [E]
Lord I will open up again
                         [F#m]
Throw my fears into the wind
                     [A/C#]
I am desperate for a touch of heaven
[D]  [E]  [F#m]  [A/C#]
Oooh

              [D]           [E]
I open up my heart to You
              [F#m]             [A/C#]
I open up my heart to You now
                 [D]      [E]
So do what only You can
                [F#m]          [A/C#]
Jesus have Your way in me now

( [D]  [E]  [F#m]  [A/C#] )

        [D]                           [E]
All I want is to live within Your love
                     [F#m]
Be undone by who You are
                 [A/C#]
My desire is to know You deeper
  [D]                   [E]
Lord I will open up again
                         [F#m]
Throw my fears into the wind
                       [A/C#]
I am desperate for a touch of heaven

[Final] [D]  [E]  [F#m]  [A/C#]', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/touch-of-heaven/)', 1792242268, 1792242268, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (6, 1, 'Vasijas Rotas', 'Hillsong Worship', 'Em', NULL, '[Intro] [Em]  [G]

[Primera Parte]

[Em]         [C]             [Em]
Mi alma estaba  rota y herida
          [C]           [Em]
Pero tu gracia la restauró
         [C]             [G]
Manos vacías que tu llenaste
              [D]
Soy libre en ti
             [Em]    [D]
Soy libre en ti

[Pre-Estribillo]

    [G]           [D]
Sublime gracia del Señor
         [Em]          [C]
Que a un pecador salvó uoh oh oh oh
      [G]            [D]
Fui ciego más hoy veo yo
   [Em]               [C]
Perdido y Él me halló

[Estribillo]

             [G]              [D]
Ahora puedo ver ehhhhh ehh  er
                 [Em]        [C]
Oh puedo ver sus ojos de amor
             [G]              [D]
Quebrantado fue ehhhhh ehh  eh
             [Em]       [C]
Para darnos su salvación

( [Em]  [G]  [Em]  [G] )

[Segunda Parte]

          [Em]                [G]
Tu no me juzgas por mis fracasos
         [Em]             [G]
Tú me aceptas tal como soy
        [Em]           [G]
Toma mi vida como vasija
       [D]                [Em]     [D]
Para mostrar tu gloria en mi  uohhh

[Pre-Estribillo]

    [C]           [D]
Sublime gracia del Señor
         [Em]          [C]
Que a un pecador salvó uoh oh oh oh
      [G]            [D]
Fui ciego más hoy veo yo
   [Em]               [C]
Perdido y Él me halló

[Estribillo]

             [G]              [D]
Ahora puedo ver ehhhhh ehh  er
                 [Em]        [C]
Oh puedo ver sus ojos de amor
             [G]              [D]
Quebrantado fue ehhhhh ehh  eh
             [Em]       [C]
Para darnos su salvación

( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )

[Pre-Estribillo]

    [G]           [D]
Sublime gracia del Señor
         [Em]          [C]
Que a un pecador salvó uoh oh oh oh
      [G]            [D]
Fui ciego más hoy veo yo
   [Em]               [C]
Perdido y Él me halló

    [G]           [D]
Sublime gracia del Señor
         [Em]          [C]
Que a un pecador salvó uoh oh oh oh
      [G]            [D]
Fui ciego más hoy veo yo
   [Em]               [C]
Perdido y Él me halló

[Estribillo]

             [G]              [D]
Ahora puedo ver ehhhhh ehh  er
                 [Em]        [C]
Oh puedo ver sus ojos de amor
             [G]              [D]
Quebrantado fue ehhhhh ehh  eh
             [Em]       [C]
Para darnos su salvación

( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )
( [G]  [D]  [Em]  [C] )

[Pre-Estribillo]

    [G]           [D]
Sublime gracia del Señor
         [Em]          [C]
Que a un pecador salvó uoh oh oh oh
      [G]            [D]
Fui ciego más hoy veo yo
   [Em]               [C]
Perdido y Él me halló

    [G]           [D]
Sublime gracia del Señor
         [Em]          [C]
Que a un pecador salvó uoh oh oh oh
      [G]            [D]
Fui ciego más hoy veo yo
   [Em]               [C]
Perdido y Él me halló

[Estribillo]

             [G]              [D]
Ahora puedo ver ehhhhh ehh  er
                 [Em]        [C]
Oh puedo ver sus ojos de amor
             [G]              [D]
Quebrantado fue ehhhhh ehh  eh
             [Em]       [C]
Para darnos su salvación', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/vasijas-rotas/)', 1792242268, 1792242268, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (7, 1, 'A Ti Me Rindo', 'Hillsong Worship', 'Am', NULL, '[Primera Parte]

[Am]
Ante ti postrado
   [C]
Estoy aquí
             [G]
Te rindo mi ser
             [F]
Te rindo mi ser

 [Am]
Con tu amor
       [C]
Atráeme señor
             [G]
Vengo a tus pies
             [F]
Vengo a tus pies
         [Am]
A ti me rindo

( [C]  [G]  [F] )

[Segunda Parte]

  [Am]
Lléname, de
         [C]
Gracia inúndame
          [G]
Sacia mi sed
          [F]
Sacia mi sed

 [Am]
Mi corazón levanta
[C]
Un clamor
         [G]
Háblame Dios
         [F]
Háblame Dios

[Am]
A ti me rindo
         [C]
A ti me rindo
           [Dm]
Te quiero conocer
           [F]
Más de ti conocer

[Am]
A ti me rindo
         [C]
A ti me rindo
           [Dm]
Te quiero conocer
           [F]
Más de ti conocer

( [C]  [G]  [Dm]  [Am]  [G] )

[Estribillo]

         [F]      [C]
Con tu aliento Dios
      [G]
Sopla en mi interior
          [Dm]
Cumple señor tu
      [Am]     [G]
Voluntad en mí
         [F]     [C]
Con tu gran poder
      [G]
Muévete en mi ser
          [Dm]
Cumple señor tu
      [Am]     [G]
Voluntad en mí

         [F]      [C]
Con tu aliento Dios
      [G]
Sopla en mi interior
          [Dm]
Cumple señor tu
      [Am]     [G]
Voluntad en mí
         [F]     [C]
Con tu gran poder
      [G]
Muévete en mi ser
          [Dm]
Cumple señor tu
      [Am]     [G]
Voluntad en mí

[Solo] [F]  [C]  [G]  [Dm]  [Am]  [G]

         [F]      [C]
Con tu aliento Dios
      [G]
Sopla en mi interior
          [Dm]
Cumple señor tu
      [Am]     [G]
Voluntad en mí
         [F]     [C]
Con tu gran poder
      [G]
Muévete en mi ser
          [Dm]
Cumple señor tu
      [Am]     [G]
Voluntad en mí

         [Am]
A ti me rindo
         [C]
A ti me rindo
           [Dm]
Te quiero conocer
           [F]
Más de ti conocer

         [Am]
A ti me rindo
         [C]
A ti me rindo
           [Dm]
Te quiero conocer
           [F]
Más de ti conocer

( [Am] )', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/a-ti-me-rindo/)', 1792242269, 1792242269, 'Am');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (8, 1, 'Entre Las Llamas', 'Hillsong Worship', 'Am', NULL, '[Intro] [Am]  [F6]  [C]

[Primera Parte]

[Am]                [F6]            [C]
Gracia hay cuando paso por el fuego
[Am]           [F6]           [C]
Abres camino donde no lo hay
[Am]                     [F6]
Al recordar lo que has hecho en mí
          [C]               [Em7]
Lo que un día fui, lo que recorrí
[Am]          [F6]              [C]
Sé que a mi lado siempre estás

[Estribillo 1]

                       [Am]           [F]            [C]
Hubo uno más entre las llamas que estuvo junto a mí
                       [Am]        [F]              [C]
Hubo uno más sobre las aguas que pudo el mar abrir
                             [Am]       [F]            [C]
Que en mi interior no queden dudas de cómo libre fui
                              [Am]         [F]            [C]
Hay una cruz que muestra el precio que Jesús pagó por mí
                     [Am]   [F6]   [C]
Hay uno más entre las llamas

[Segunda Parte]

[Am]              [F6]          [C]
En las aguas hundiste mi pasado
[Am]                [F6]               [C]
Ahora sé que un esclavo al pecado no soy
[Am]                [F6]           [C]              [Em7]
Al tropezar en mi caminar me levantaré, yo persistiré
[Am]               [F6]             [C]
Miro al frente y no volveré nunca atrás
[Am]             [F6]              [C]
Yo sé que a mi lado siempre estás

[Estribillo 2]

                      [Am]           [F]              [C]
Hay uno más entre las llamas que está hoy junto a mí
                      [Am]        [F]               [C]
Hay uno más sobre las aguas que puede el mar abrir
                         [Am]       [F]            [C]
En mi interior no quedan dudas de cómo libre fui
                        [Am]    [F]            [C]
El mismo que venció la tumba ahora vive en mí
                          [Am]      [F]   [C]
  Hay uno más entre las llamas, oh, oh
                          [Am]      [F]   [C]
  Hay uno más entre las llamas, oh, oh

[Puente]

            [Am]          [F]             [C]           [G]
Tu luz vencerá, las tinieblas a tus pies se rendirán
          [Am]             [F]         [C/E]       [G]
Rugirá tu voz desde el cielo y los muros caerán
           [Am]         [F]          [C/E]         [G]
Traes libertad, las cadenas ante ti se romperán
           [Dm]                [F]   [G]
Nada nos separa, nada nos separa

( [Am]  [F6]  [C] )

[Tercera Parte]

[Am]               [F6]              [C]
No hay nombre igual al nombre de Cristo
[Am]                 [F6]                [C]
El que fue, el que es y por siempre será
[Am]                [F6]                [C]               [Em7]
Aunque no sepa lo que vendrá sé que tu verdad nunca fallará
[Am]               [F6]              [C]
 Yo sé que a mi lado siempre estás
[Am]               [F6]              [C]
 Yo sé que a mi lado siempre estás

[Refrão 3]

                        [Am]         [F]                  [C]
Habrá uno más entre las llamas que va a estar junto a mí
                        [Am]        [F]               [C]
Habrá uno más sobre las aguas que puede el mar abrir
                             [Am]       [F]         [C]
Que en mi interior no queden dudas de tu fidelidad
                     [Am]               [F]             [C]
Me alegraré en las batallas porque conmigo ahí estarás
                     [Am]               [F]             [C]
Me alegraré en las batallas porque conmigo ahí estarás
                     [Am]               [F]             [C]
Me alegraré en las batallas porque conmigo ahí estarás', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/entre-las-llamas/)', 1792242270, 1792242270, 'Am');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (9, 1, 'Who You Say I Am', 'Hillsong Worship', 'D', NULL, '[Intro]

[D]
  Who am I that the highest King
       [Bm]  [A]    [D]
Would wel-come me
[D]
  I was lost but He brought me in
         [Bm]   [A]   [G]
Oh, His love for me
         [Bm]   [A]   [G]
Oh, His love for me

         [D]
Who the Son sets free
        [A]
Oh is free indeed
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am

[D]
  Free at last He has ransomed me
      [Bm]   [A]    [D]
His grace runs deep
[D]
  While I was a slave to sin
       [Bm]   [A]   [G]
Jesus died for me
        [Bm]   [A]   [G]
Yes He died for me

         [D]
Who the Son sets free
        [A]
Oh is free indeed
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am
       [D]
In my Father''s house
            [A]
There''s a place for me
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am

       [Bm]            [A/C#]
I am chosen  Not forsaken
  [D]                [G]
I am who You say I am
        [Bm]            [A/C#]
You are for me  Not against me
  [D]                [G]
I am who You say I am
       [Bm]            [A/C#]
I am chosen  Not forsaken
  [D]                [G]
I am who You say I am
        [Bm]            [A/C#]
You are for me  Not against me
  [D]                [G]
I am who You say I am
  [Bm]          [A/C#]  [G]
I am who You say  I am

         [D]
Who the Son sets free
        [A]
Oh is free indeed
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am
       [D]
In my Father''s house
            [A]
There''s a place for me
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am

       [D]
In my Father''s house
            [A]
There''s a place for me
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am

( [Bm]  [A/C#]  [D]  [G] )
( [Bm]  [A]  [D]  [G] )

       [Bm]            [A/C#]
I am chosen  Not forsaken
  [D]                [G]
I am who You say I am
        [Bm]            [A]
You are for me  Not against me
  [D]                [G]
I am who You say I am
       [Bm]            [A/C#]
I am chosen  Not forsaken
  [D]                [G]
I am who You say I am
        [Bm]            [A]
You are for me  Not against me
  [D]                [G]
I am who You say I am

      [Bm]          [A/C#]  [G]
Oh, I am who You say  I am
       [Bm]          [A/C#]  [G]
Yes, I am who You Say  I Am

         [D]
Who the Son sets free
        [A]
Oh is free indeed
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am
       [D]
In my Father''s house
            [A]
There''s a place for me
        [Bm]  [A]   [G]
I''m a child of God
     [D]
Yes I am', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/who-you-say-i-am/)', 1792242270, 1792242270, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (10, 1, 'Broken Vessels', 'Hillsong Worship', 'Em', NULL, '[Intro] [Em]  [G]  [Em]  [G]

[Primera Parte]

          [Em]
All these pieces
           [G]
Broken and scattered
         [Em]
In mercy gathered
          [G]
Mended and whole
      [Em]
Empty handed
           [G]
But not forsaken
             [D]
I''ve been set free
            [Em]     [D]
I''ve been set free

[Pre-Estribillo]

 [C]
Amazing grace
    [D]
How sweet the sound
     [Em]                    [C]
That saved a wretch like me
  [C]
I once was lost
    [D]
But now I am found
    [Em]                 [C]
Was blind but now I see

[Estribillo]

                 [G]    [D]
Oh I can see You  now
                 [Em]             [C]
Oh I can see the love in Your eyes
                [G]   [D]
Laying Yourself down
               [Em]         [C]
Raising up the broken to life

( [Em]  [G]  [Em]  [G] )

[Segunda Parte]

             [Em]
You take our failure
             [G]
You take our weakness
             [Em]
You set Your treasure
          [G]
In jars of clay
             [Em]
So take this heart, Lord
             [G]
I''ll be Your vessel
            [D]
The world to see
           [Em]   [D]
Your life in me

[Pre-Estribillo]

( [G]  [D]  [Em]  [C] )

[Pré-Chorus]

 [C]
Amazing grace
    [D]
How sweet the sound
     [Em]                    [C]
That saved a wretch like me  oh
  [C]
I once was lost
    [D]
But now I am found
    [Em]                 [C]
Was blind but now I see

[Estribillo]

                 [G]    [D]
Oh I can see You  now
                 [Em]             [C]
Oh I can see the love in Your eyes
                [G]   [D]
Laying Yourself down
               [Em]         [C]
Raising up the broken to life

( [G]  [D]  [Em]  [C] )

 [G]
Amazing grace
    [D]
How sweet the sound
     [Em]                    [C]
That saved a wretch like me
  [G]
I once was lost
    [D]
But now I am found
    [Em]                 [C]
Was blind but now I see

[Estribillo]

                 [G]    [D]
Oh I can see You  now
                 [Em]             [C]
Oh I can see the love in Your eyes
                [G]   [D]
Laying Yourself down
               [Em]         [C]  ( [G] )
Raising up the broken to life', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/broken-vessels/)', 1792242271, 1792242271, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (11, 1, 'O Holy Night', 'Hillsong Worship', 'G', NULL, '[Intro] [G9]  [D9]  [Em7]  [C9]

[G9]     [D9]          [C9]                [Em7]
O holy night, the stars are brightly shining
          [G9]           [D9]            [G9]
It is the night of our dear savior''s birth
[G9]           [D9]       [C9]            [Em7]
Long lay the world in sin and error pining
         [Bm7]                           [Em7]
''Til he appeared and the soul felt its worth

   [D9]                [C9]            [G9]
A thrill of hope the weary world rejoices
     [D9]             [C9]               [G9]
For yonder breaks a new and glorious morn

[Em7]           [Bm7]     [Am7]            [Em7]
Fall on your knees, o hear the angel voices
  [G9]  [D9]   [Em7]  [C7M]  [G9]   [D9]                [G9]
O night divine, o   night  when Christ was born

( [G9]  [D9]  [Em7]  [C9] )

[G9]       [D9]           [C9]        [Em7]
Truly he taught us to love one another
           [G9]           [D9]        [G9]
His law is love and his gospel is peace
[G9]              [D9]              [C9]          [Em7]
Chains he shall break, for the slave is our brother
           [Bm7]                       [Em7]
And in his name all oppression shall cease

      [D9]               [C9]              [G9]
Sweet hymns of joy in grateful chorus raise we
    [D9]            [C9]              [G9]
Let all within us praise his holy name

[Em7]           [Bm7]     [Am7]               [Em7]
Christ is the lord, o praise his name forever
    [G9]  [D9]     [Em7]  [C7M]    [G9]  [D9]              [G9]
His power and gloory evermore,  evermore proclaim
    [D9]  [D/C]    [Em7]  [C7M]  [G9]      [D9]              [G9]
His power and gloooory evermore,  evermore proclaim

[Solo] [G9]  [D9]  [Em7]  [C9]

[Em7]           [Bm7]     [Am7]            [Em7]
Fall on your knees, o hear the angel voices
  [G9]  [D9]   [Em7]  [C7M]     [G9]   [D9]                [G9]
O night divi..iine, o night, when christ was born
  [D9]  [D/C]  [Em7]  [C7M]     [G9]   [D9]          [G9]
O night divi..iine, o night, o night divine', 'Importada de CifraClub (https://www.cifraclub.com/hillsong-worship/o-holy-night/)', 1792242271, 1792242271, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (12, 1, 'No Hay Lugar Mas Grande', 'Miel San Marcos', 'G', NULL, '[Intro] [G]  [C/E]  [G/D]  [C]
        [G]  [C/E]  [G/D]  [C]

[Punteo - Intro]

Parte 1 de 2
   [G]                       [C/E]
E|---------------------------------------------------| 
B|-------3-----------3-----------1-----------1-------| 
G|-------0-----------0-----------0-----------0-------| 
D|----0-----0-----0-----0-----2-----2-----2-----2----| 
A|---------------------------------------------------| 
E|-3-----------3-----------0-----------0-------------| 

Parte 2 de 2
    [G/D]                     [C]
E|---------------------------------------------------| 
B|--------3-----------3-----------1-----------1------| 
G|--------0-----------0-----------0-----------0------| 
D|-----0-----0-----0-----0-----2-----2-----2-----2---| 
A|-/5-----------5-----------3-----------3------------| 
E|---------------------------------------------------| 

[Solo - Intro]

Parte 1 de 2
   [G]                 [C/E]
E|---------10---10-----------10---10-----------------| 
B|-8-8-8-8----8----8-8-8-8-8----8----8---------------| 
G|---------------------------------------------------| 
D|---------------------------------------------------| 
A|---------------------------------------------------| 
E|---------------------------------------------------| 

Parte 2 de 2
   [G/D]               [C]
E|---------10---10---8-------8--7--------------------| 
B|-8-8-8-8----8----8---8-8-8--8---8-8----------------| 
G|---------------------------------------------------| 
D|---------------------------------------------------| 
A|---------------------------------------------------| 
E|---------------------------------------------------| 

[Primera Parte]

        [G]               [D/F#]
A tus pies arde mi corazón
        [Em7]                [C9]
A tus pies entrego lo que soy
         [G]               [D/F#]
Es el lugar de mi seguridad
       [Em7]                [C9]
Donde nadie me puede señalar

[Pre-Estribillo]

         [C9]                          [D]
Me perdonaste, me acercaste a tu presencia
         [Em7]                       [D/F#]
Me levantaste, hoy me postro a adorarte

[Estribillo]

                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies
                 [C9]          [D]
No hay lugar más alto, más grande
                  [Em7]                   [D11]
Que estar a tus pies, que estar a tus pies

[Primera Parte]

        [G]               [D/F#]
A tus pies arde mi corazón
        [Em7]                [C9]
A tus pies entrego lo que soy
         [G]               [D/F#]
Es el lugar de mi seguridad
       [Em7]                [C9]
Donde nadie me puede señalar

[Pre-Estribillo]

         [C9]                          [D]
Me perdonaste, me acercaste a tu presencia
         [Em7]                       [D/F#]
Me levantaste, hoy me postro a adorarte

[Estribillo]

          [G/B]    [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies
                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies

                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies
                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies

[Puente]

     [C]           [D11]     [G]   [D/F#]    [Em7]
Y aquí permaneceré, postrado a tus pies
     [C]           [D11]               [Em7]
Y aquí permaneceré a los pies de Cristo
     [C]           [D11]     [G]   [D/F#]    [Em7]
Y aquí permaneceré, postrado a tus pies
     [C]           [D11]               [Em7]
Y aquí permaneceré a los pies de Cristo

[Estribillo]

          [G/B]    [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies
                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G7M/B]
Que estar a tus pies, que estar a tus pies

( [C9]  [D11]  [Em7]  [G7M/B] )
( [C9]  [D11]  [Em7]  [G7M/B] )

[Estribillo]

                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]  [G/B]
Que estar a tus pies
                 [C9]          [D11]
No hay lugar más alto, más grande
                  [Em7]                   [G]  [C9]
Que estar a tus pies, que estar a tus pies', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/no-hay-lugar-mas-grande/)', 1792242272, 1792242272, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (13, 1, 'Grande Y Fuerte', 'Miel San Marcos', 'Am', NULL, '[Intro] [Am]  [F7M]  [Em7]
        [Am]  [F7M]  [Em7]
        [Am]  [F7M]  [Em7]
        [Am]  [F7M]  [Em7]

[Primera Parte]

[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios
[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios
[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios
[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios

[Estribillo]

    [Dm7]          [G]       [Dm7]        [Am]
Vestido en majestad coronado con poder
       [F]       [G]        [Am]  [G/B]  [A7/C#]
Digno de toda la adoracion

    [Dm7]          [G]       [Dm7]        [Am]
Vestido en majestad coronado con poder
       [F]             [G]
Toda gloria y honra sea para Ti

[Interludio] [Am]  [F7M]  [Em7]
             [Am]  [F7M]  [Em7]

[Primera Parte]

[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios
[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios
[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios
[Am]            [F7M]       [Em7]     [Am]   [F7M]  [Em7]
   Grande y fuerte es nuestro Dios

[Estribillo]

    [Dm7]          [G]       [Dm7]        [Am]
Vestido en majestad coronado con poder
       [F]       [G]        [Am]  [G/B]  [A7/C#]
Digno de toda la adoracion

    [Dm7]          [G]       [Dm7]        [Am]
Vestido en majestad coronado con poder
       [F]             [G]
Toda gloria y honra sea para Ti

[Interludio] [Am]  [F7M]  [Em7]
             [Am]  [F7M]  [Em7]

[Segunda Parte]

  [Am]   [F7M]  [Em7]
Grande
  [Am]   [F7M]  [Em7]
Fuerte
             [Am]  [F7M]  [Em7]
Es nuestro Dios

  [Am]   [F7M]  [Em7]
Grande
  [Am]   [F7M]  [Em7]
Fuerte
             [Am]  [F7M]  [Em7]
Es nuestro Dios

  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios
  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios
  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios

Grande y fuerte es nuestro Dios

[Puente] [Am]  [G/B]  [C]  [A7/C#]

[Estribillo]

    [Dm7]          [G]       [Dm7]        [Am]
Vestido en majestad coronado con poder
       [F]       [G]        [Am]  [G/B]  [A7/C#]
Digno de toda la adoracion

    [Dm7]          [G]       [Dm7]        [Am]
Vestido en majestad coronado con poder
       [F]             [G]
Toda gloria y honra sea para Ti

[Interludio] [Am]  [F7M]  [Em7]
             [Am]  [F7M]  [Em7]

[Final]

  [Am]   [F7M]  [Em7]
Grande
  [Am]   [F7M]  [Em7]
Fuerte
             [Am]  [F7M]  [Em7]
Es nuestro Dios

  [Am]   [F7M]  [Em7]
Grande
  [Am]   [F7M]  [Em7]
Fuerte
             [Am]  [F7M]  [Em7]
Es nuestro Dios

  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios
  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios
  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios
  [Am]       [G/B]       [F7M]     [Em7]
Grande y fuerte es nuestro Dios', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/grande-y-fuerte/)', 1792242273, 1792242273, 'Am');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (14, 1, 'Los Muros Caerán', 'Miel San Marcos', 'Cm', NULL, '[Intro] [Cm]  [Ab]  [Bb]
        [Cm]  [Ab]  [Bb]
        [Cm]  [Ab]  [Bb]

[Tab - Intro]

(Piano)

E|-3---------------3-----6-----6-8----------|      
B|-----6---4---6-------4---4----------------|      
G|---5---5---5---5---5-------5--------------|      
D|------------------------------------------|(12x) 
A|------------------------------------------|      
E|------------------------------------------|      

(Guitarra)

E|------------------------------------------|      
B|------------------------------------------|      
G|-5-X-X-5-X-X-3-5-X-X-3--------------------|      
D|------------------------------------------|(10x) 
A|------------------------------------------|      
E|------------------------------------------|      

(Metais)

Parte 1 de 2
E|------------------8-----------------------|     
B|-8-------------11-----8-------------------|     
G|-----10-8-10-------------10---------------|     
D|------------------------------------------|(3x) 
A|------------------------------------------|     
E|------------------------------------------|     

Parte 2 de 2
E|-------------------------------8----------| 
B|-8-------------------8--11--8-------------| 
G|-----10-8-10-8----8-----------------------| 
D|---------------10-------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

[Primera Parte]

     [Cm]
Cuando le canto
     [Bb]
La tierra se estremece
     [Ab]   [Bb]     [Cm]
Los muros    caerán


Cuando le adoro
    [Bb]
Se rompen las cadenas
     [Ab]   [Bb]     [Cm]
Los muros    caerán

[Estribillo]

     [Cm]
Los muros caerán
     [Ab]
Los muros caerán
             [Bb]     [Gm]
Al sonar mi cantico
    [Cm]
Caerán


Los muros caerán
     [Ab]
Los muros caerán
               [Bb]    [Gm]
Con gritos de júbilo

[Interlúdio 1] [Cm]  [Ab]  [Bb]  [Cm]

[Tab - Interlúdio 1]

Parte 1 de 2
E|------------------8-----------------------|     
B|-8-------------11-----8-------------------|     
G|-----10-8-10-------------10---------------|     
D|------------------------------------------|(3x) 
A|------------------------------------------|     
E|------------------------------------------|     

Parte 2 de 2
E|-------------------------------8----------| 
B|-8-------------------8--11--8-------------| 
G|-----10-8-10-8----8-----------------------| 
D|---------------10-------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

[Segunda Parte]

 [Cm]
Cuando yo danzo
   [Bb]
Aumenta  Dios mis fuerzas
     [Ab]   [Bb]     [Cm]
Los muros    caerán
     [Cm]
Cuando yo grito
    [Bb]
Mis enemigos huyen
     [Ab]   [Bb]     [Cm]
Los muros    caerán

[Estribillo]

     [Cm]
Los muros caerán
     [Ab]
Los muros caerán
             [Bb]     [Gm]
Al sonar mi cantico
    [Cm]
Caerán


Los muros caerán
     [Ab]
Los muros caerán
               [Bb]    [Gm]
Con gritos de júbilo
    [Cm]
Caerán

[Interlúdio 2] [Cm]

[Tercera Parte]

          [Cm]   [Bb]           [Cm]   [Bb]
Caen los muros,   caen los muros
          [Cm]   [Bb]           [Cm]   [Bb]
Caen los muros,   caen los muros
          [Cm]   [Bb]           [Cm]   [Bb]
Caen los muros,   caen los muros
          [Cm]   [Bb]           [Cm]   [Bb]
Caen los muros,   caen los muros

[Fm]          [Gm]
   Saltando,   saltando
[Cm]            [Bb]
   Los muros caerán
[Fm]          [Gm]
   Gritando,   gritando
[Cm]            [Bb]
   Los muros caerán

[Fm]          [Gm]
   Saltando,   saltando
[Cm]            [Bb]
   Los muros caerán
[Fm]          [Gm]
   Gritando,   gritando
[Cm]            [Bb]
   Los muros caerán

[Estribillo]

     [Cm]
Los muros caerán
     [Ab]
Los muros caerán
             [Bb]     [Gm]
Al sonar mi cantico
    [Cm]
Caerán


Los muros caerán
     [Ab]
Los muros caerán
               [Bb]    [Gm]
Con gritos de júbilo
    [Cm]
Caerán

[Final] [Cm]  [Bb]  [Ab]  [Cm]

[Tab - Final]

Parte 1 de 2
E|------------------8-----------------------|     
B|-8-------------11-----8-------------------|     
G|-----10-8-10-------------10---------------|     
D|------------------------------------------|(3x) 
A|------------------------------------------|     
E|------------------------------------------|     

Parte 2 de 2
E|-------------------------------8----------| 
B|-8-------------------8--11--8-------------| 
G|-----10-8-10-8----8-----------------------| 
D|---------------10-------------------------| 
A|------------------------------------------| 
E|------------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/los-muros-caeran/)', 1792242273, 1792242273, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (15, 1, 'Bienvenido Espíritu Santo (Part. Marco Barrientos)', 'Miel San Marcos', 'C', NULL, '[Intro] [C]  [F]  [Am]  [C]  [F]

[Tab - Intro]

Parte 1 de 3
   [C]
E|-8--12--10--12--10--8---------12--10------| 
B|-----------------------10--8--------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 2 de 3
   [F]
E|-----12--10--12--10--8----------12--10----| 
B|------------------------10----------------| 
G|-10-------------------------10------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 3 de 3
   [Am]                         [C]
E|-----12--10--12--10--8---------12--10-----| 
B|-10---------------------10--8-------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 2 de 3
   [F]
E|-----12--10--12--10--8----------12--10----| 
B|------------------------10----------------| 
G|-10-------------------------10------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

[Primera Parte]

          [C]                 [F]
Espíritu Santo bienvenido a este lugar
      [G]                 [F]       [C]
Jesucristo bienvenido a este lugar
             [C/E]       [F]
Padre omnipotente de gracia y amor
       [G]             [C]  [F]
Bienvenido a este lugar

          [C]           [C/E]   [F]
Espíritu Santo bienvenido a este lugar
      [G]                 [F]       [C]
Jesucristo bienvenido a este lugar
             [C/E]       [F]
Padre omnipotente de gracia y amor
       [G]             [C]
Bienvenido a este lugar

[Estribillo]

       [C]
Bienvenido espíritu de Dios
        [Am]
Damos Gloria solo a ti Señor
       [G]
Bienvenido espíritu de Dios
        [Dm]              [G]
Hoy rendimos coronas a tus pies

       [C]
Bienvenido espíritu de Dios
        [Am]
Damos Gloria solo a ti Señor
       [G]
Bienvenido espíritu de Dios
        [Dm]              [G]
Hoy rendimos coronas a tus pies

[Solo] [C/E]  [F]  [G]  [Am]
       [C/E]  [F]  [G]  [Am]  [G]

[Tab - Solo]

(Guitarra 1)

Parte 1 de 2
  [C/E]  [F]
E|------------------------------------------| 
B|------------------------------------------| 
G|-------------------9----------9-----------| 
D|-----------10--12-----10--12-----12--10---| 
A|-------10---------------------------------| 
E|------------------------------------------| 

Parte 2 de 2
  [G]   [Am]
E|------------------------------------------| 
B|------------------------------------------| 
G|--------------9--12--12--9------9---------| 
D|------10--12----------------12-----12--10-| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 1 de 2
  [C/E]  [F]
E|------------------------------------------| 
B|------------------------------------------| 
G|------------------9----------9------------| 
D|----------10--12-----10--12-----12--10----| 
A|------10----------------------------------| 
E|------------------------------------------| 

Parte 2 de 2
  [G]   [Am]           [G]
E|------------------------------------------| 
B|------------------------------------------| 
G|--------------9--12--12--9------9---------| 
D|------10--12----------------12-----12--10-| 
A|------------------------------------------| 
E|------------------------------------------| 

(Guitarra 2)

Parte 1 de 2
   [C/E]  [F]
E|-3----5-----------------------------------| 
B|------------------------------------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 2 de 2
   [G]  [Am]
E|-7--8-------------------------------------| 
B|------------------------------------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 1 de 2
   [C/E]  [F]
E|-3----5-----------------------------------| 
B|------------------------------------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 2 de 2
   [G]  [Am]  [G]
E|-7--8-------------------------------------| 
B|------------------------------------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

[Primera Parte]

          [C]                 [F]
Espíritu Santo bienvenido a este lugar
      [G]                 [F]       [C]
Jesucristo bienvenido a este lugar
             [C/E]       [F]
Padre omnipotente de gracia y amor
       [G]             [C]
Bienvenido a este lugar

[Estribillo]

       [C]
Bienvenido espíritu de Dios
        [Am]
Damos Gloria solo a ti Señor
       [G]
Bienvenido espíritu de Dios
        [Dm]              [G]
Hoy rendimos coronas a tus pies

       [F]
Bienvenido espíritu de Dios
 [Em]     [Am]           [C]
Damos Gloria solo a ti Señor
       [G]
Bienvenido espíritu de Dios
        [Dm]              [G]
Hoy rendimos coronas a tus pies

[Final] [C]  [F]  [Am]  [C]  [F]

[Tab - Final]

Parte 1 de 3
   [C]
E|-8--12--10--12--10--8---------12--10------| 
B|-----------------------10--8--------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 2 de 3
   [F]
E|-----12--10--12--10--8----------12--10----| 
B|------------------------10----------------| 
G|-10-------------------------10------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 3 de 3
   [Am]                         [C]
E|-----12--10--12--10--8---------12--10-----| 
B|-10---------------------10--8-------------| 
G|------------------------------------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------| 

Parte 2 de 3
   [F]
E|-----12--10--12--10--8----------12--10----| 
B|------------------------10----------------| 
G|-10-------------------------10------------| 
D|------------------------------------------| 
A|------------------------------------------| 
E|------------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/bienvenido-espiritu-santo/)', 1792242274, 1792242274, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (16, 1, 'Amamos tu presencia', 'Miel San Marcos', 'B', NULL, '[Intro] [B]  [C#m]  [E/G#]  [A]

[Primera Parte]

[E]                      [C#m]
Encuentro  sanidad,  encuentro  libertad
          [B]         [A]
En tu presencia
[E]                       [C#m]
Encuentro  Hoy perdón,  encuentro  salvación
          [B]       [A]
En tu presencia

 [B]         [C#m]  [E/G#]      [A]
Correremos  hacia    a ti
    [B]        [C#m]   [E/G#]  [A]
El Cielo hoy esta   aquí

[Estribillo]

 [E]          [C#m]         [B]
Amamos tu presencia  oh Dios
 [A]                      [E]
Amamos tu presencia  oh Dios
 [E]          [C#m]          [B]
Amamos tu presencia  oh Dios
 [A]         [C#m]           [F#m]
Amamos tu presencia  oh Dios', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/amamos-tu-presencia/)', 1792242274, 1792242274, 'B');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (17, 1, 'Levántate Señor', 'Miel San Marcos', 'Am', NULL, '[Am]  [G]  [F]      [C]       [G]        [Am]
      Levántate, levántate Señor
[Am]  [G]  [F]             [C]    [E]             [Am]
     Que tus enemigos huyan delante de ti
[Am]  [G]  [F]      [C]       [G]        [Am]
      Levántate, levántate Señor
[Am]  [G]  [F]             [C]    [E]             [Am]
      Que tus enemigos huyan delante de ti

[Am]  [G]  [F]                   [C]
Mas los justos se alegrarán
   [G]               [Am]
Cantarán con regocijo
[Am]  [G]  [F]                [C]
El Señor se ha levantado
 [E7]                 [Am]
A triunfado con poder', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/levantate-senor/)', 1792242275, 1792242275, 'Am');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (18, 1, 'No Hay Lugar Más Alto', 'Miel San Marcos', 'A', NULL, '[Intro] [A]  [D]

[A]                     [E/G#]
A tus pies arde mi corazón
       [F#m]                 [D]
A tus pies entrego lo que soy
       [A]             [E/G#]
Ese lugar de mi seguridad
        [F#m]               [D]
Donde nadie me puede señalar
[D]
Me perdonaste
                      [E]
Me acercaste a tu presencia
         [F#m]
Me levantaste
                 [E]
Hoy me postró adorarte

[Estribillo]

        [A/C#]     [D]
No hay lugar más alto
      [E]
Más grande
                 [F#m]
Que estar a tus pies
                 [E/G#]
Que estar a tus pies

[Puente]

[D]               [E]
Y aquí permaneceré
   [A]     [E/G#]   [F#m]
Postrado a tus pies
    [D]           [E]
Y aquí permaneceré
               [F#m]
A los pies de Cristo', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/no-hay-lugar-mas-alto/)', 1792242276, 1792242276, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (19, 1, 'Digno de Adorar', 'Miel San Marcos', 'G', NULL, '[Intro] [G2]  [A]
        [G2]  [A4]

[Primera Parte]

[G2]        [A4]
Ángeles y santos
[G2]          [A4]
Hoy se postrarán
[G2]     [G]    [A4]
Sus coronas traen
       [D]       [G2]        [A]   [D/F#]
Al cordero que venció y cantarán

[Estribillo 1]

                  [D]
Eres digno de adorar
                  [A]  [A4]  [A]
Eres digno de adorar
              [G]
Todo viene de ti
               [A4]
Y todo es para ti
[A]          [D/F#]
Tú mereces gloria
[G]           [A4]
Oh oh oh oh oh
[G2]        [G]  [A]
 Oh oh oh oh oh

[Segunda Parte]

[G2]         [A]
Ángeles y santos
 [G]            [A]
Hoy se postrarán
 [G]             [A]
Sus coronas traen
      [Em7]           [G]    [A]   [D/F#]
Al cordero que venció y cantarán

[Estribillo 2]

                  [D]
Eres digno de adorar
                  [A] - [Asus4-A]
Eres digno de adorar
     [D/F#]     [G]
Todo viene de ti
          [Bm]   [A4]
Y todo es para ti
[A]           [D/F#]
Tú mereces gloria

[Interludio] [F#m]  [Bm7]  [G]  [D/F#]
             [A/C#]  [Em7]  [G]

[Puente]

[D/F#]                    [F#m]
Día y noche se oirá nuestra adoración
[Bm7]                       [G]
Día y noche se oirá nuestra adoración
[D/F#]                    [A/C#]
Día y noche se oirá nuestra adoración
[Em7]                       [G]
Día y noche se oirá nuestra adoración
[D/F#]                    [F#m]
Día y noche se oirá nuestra adoración
[Bm7]                     [G/B]
Día y noche se oirá nuestra adoración
[A/C#]
Día y noche se oirá nuestra adoración
[Em7]                       [G]
Día y noche se oirá nuestra adoración

                             [A/C#]
Tu me rodeas con canticos de libertad
        [Bm7]                   [G]
Tu me rodeas con canticos de gozo
      [D/F#]                   [A4]       [A]
Tu me rodeas con canticos de libertad
         [Bm7]                   [A/C#]
Tu eres digno, digno, digno de adorar
        [D/F#]                 [A/C#]
Tu me rodeas con canticos de libertad
        [Bm7]                  [G/B]
Tu me rodeas con canticos de gozo
        [D/F#]                 [A4]       [A]
Tu me rodeas con canticos de libertad
         [Bm7]                       [A]
Tu eres digno, digno, digno de adorar
        [D/F#]                  [A]
Tu me rodeas con canticos de libertad
        [Bm7]                   [G]
Tu me rodeas con canticos de gozo
        [D/F#]                  [A]
Tu me rodeas con canticos de libertad
         [Bm7]                       [A]
Tu eres digno, digno, digno de adorar
        [D/F#]                  [A]
Tu me rodeas con canticos de libertad
         [Bm7]                  [G]
Tu me rodeas con canticos de gozo
        [D/F#]                 [A/C#]
Tu me rodeas con canticos de libertad
        [Bm7]                       [A/E]
Tu eres digno, digno, digno de adorar
        [D/F#]                 [A/C#]
Tu me rodeas con canticos de libertad
                                 [G]
Tu eres digno, eres digno, eres digno
                [A/C#]      [D]
Con canticos de libertad

[Interludio] [D]  [D4]  [D]
             [A]  [A4]  [A]
             [G]  [A4]  [A]  [D]
             [A4]  [A]  [D]  [G]
             [Bm]  [A/C#]  [D/F#]

[Estribillo Final]

                  [D]
Eres digno de adorar
                  [A]  [A4]  [A]
Eres digno de adorar
     [D/F#]     [G]
Todo viene de ti
          [Bm]   [A]
Y todo es para ti
           [D/F#]
Tú mereces gloria', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/digno-de-adorar/)', 1792242276, 1792242276, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (20, 1, 'Fiesta', 'Miel San Marcos', 'Cm', NULL, '[Intro] [Cm]  [Fm]  [Bb]  [G]

[Am]                            [F]
Lo que se canta en el Cielo ,  cantamos en la tierra
[G]                             [E]
Al que se adora en el Cielo,  Adoramos en la tierra
[Am]                            [F]
Lo que se canta en el Cielo ,  cantamos en la tierra
[G]                             [E]
Al que se adora en el Cielo,  Adoramos en la tierra
[F]          [Em]     [Dm]          [E]
Al Santo,  Digno, Al Cordero, Que vive para siempre

Hacemos
[Am]                       [F]
 Fiesta, Hoy hacemos una fiesta
[G]                                         [E] [F]   [E] [F]
Unidos hoy danzamos con gozo celebramos, oh uh oh uh oh
[Am]                       [F]
Fiesta, Hoy hacemos una fiesta
[G]                                       [E] [F]   [E] [F]
En la tierra cantamos juntos gritamos, oh uh oh uh oh

( [Am]  [F]  [G]  [E] )

(Repete Tudo)

    [Am]      [F]       [Am]      [F]
////Hacemos Fiesta, Hacemos Fiesta////
[Am]                                        [F]
Fiesta, Fiesta, Hacemos Fiesta, fiesta, Hacemos Fiesta, Fiesta, Fiesta, fiesta
[Am]                      [F]
 Fiesta, Hoy hacemos una fiesta
[F]                                         [E] [F]    [E] [F]
Unidos hoy danzamos con gozo celebramos, oh uh oh uh oh
[Am]                      [F]
Fiesta, Hoy hacemos una fiesta
[G]                                       [E]  [F]    [E] [F]
En la tierra cantamos juntos gritamos, oh uh oh uh oh', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/fiesta/)', 1792242277, 1792242277, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (21, 1, 'Toda la noche sin parar', 'Miel San Marcos', 'Cm', NULL, 'Intro:
     [Cm7]                         [Ebmaj7]
//Toda la noche sin parar
       [Bb]                              [Gm7]
Cantando alabanzas al Señor
       [Ab]                                   [Fm7]
Diciendo de su gloria y majestad
           [G]           [F+/G]
El es el Rey//

Coro:
     [Cm]
//Toda la noche sin parar
       [Bb]
Cantando alabanzas al Señor
       [Ab]                                   [Fm]
Diciendo de su gloria y majestad
           [G]
El es el Rey//

        [Cm]
De Israel', 'Importada de CifraClub (https://www.cifraclub.com/miel-san-marcos/toda-la-noche-sin-parar/)', 1792242277, 1792242277, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (22, 1, 'Digno (Worthy)', 'Elevation Worship', 'Cm', NULL, '[Intro] [Cm7]  [Eb]  [Ab]  [Bb]
        [Cm7]  [Eb]  [Ab]  [Bb]

[Primera Parte]

[Eb]           [Bb4]       [Bb]
   Cargaste Tú mi cruz
         [Gm]          [Ab]       [Eb]  [Bb]
Mi libertad, con Tu vida compra_ste
[Eb]          [Bb4]     [Bb]
   Y ahora Tuyo soy
         [Eb]       [Ab]        [Eb]  [Bb]
Proclamaré Tu bondad para siempre

[Estribillo 1]

             [Ab]
Digno de alabar
     [Bb]
Cristo
              [Gm]
Nombre sin igual
         [Bb/D]  [Cm]
Digno de ala__bar
             [Ab]
Digno de alabar
     [Bb]
Cristo
              [Gm]
Nombre sin igual
             [Cm]
Digno de alabar

[Solo] [Cm]  [Eb]  [Ab]  [Bb]
       [Cm]  [Eb]  [Ab]  [Bb]

[Tab - Solo]

  [Eb]        [Ab]    [Bb]    [Cm]
E|----6-----8--6--------------------------------------| 
B|-------8--------6-----------------------------------| 
G|-------------------8-/12----------------------------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

  [Eb]        [Ab]    [Bb]    [Eb]
E|----6-----8--6--------------------------------------| 
B|-------8--------6-----------------------------------| 
G|-------------------8-/12----------------------------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

[Segunda Parte]

[Eb]            [Bb4]     [Bb]
   Vergüenza huye hoy
           [Gm]           [Ab]      [Eb]   [Bb]
Rendido estoy ante tu amor innegable
[Eb]             [Bb4]     [Bb]
   Tu gracia eterna es
         [Gm]       [Ab]       [Eb]   [Bb]
Proclamaré Tu bondad para siempre

[Estribillo 2]

             [Ab]
Digno de alabar
  [Cm]  [Bb]
Cris_to
              [Gm]
Nombre sin igual
             [Cm]  [Bb]
Digno de alabar

             [Ab]
Digno de alabar
  [Cm]  [Bb]
Cris_to
              [Gm]
Nombre sin igual
             [Cm]  [Bb]
Digno de alabar

             [Ab]
Digno de alabar
  [Cm]  [Bb]
Cris_to
              [Gm]
Nombre sin igual
             [Cm]  [Bb]
Digno de alabar

             [Ab]
Digno de alabar
  [Cm]  [Bb]
Cris_to
              [Gm]
Nombre sin igual
             [Cm]  [Bb]
Digno de alabar

[Interludio] [Ab]  [Fm]  [Cm]
             [Bb4]  [Eb]

[Puente]

        [Ab]
Sé exaltado hoy en los cielos
        [Fm]
Ven y llena este lugar
      [Cm]
Eres digno de alabar
       [Bb]             [Eb]
No hay otro nombre igual

        [Ab]
Sé exaltado hoy en los cielos
        [Fm]
Ven y llena este lugar
      [Cm]
Eres digno de alabar
       [Bb]             [Eb]
No hay otro nombre igual

        [Ab]
Sé exaltado hoy en los cielos
        [Fm]
Ven y llena este lugar
      [Cm]
Eres digno de alabar
       [Bb]             [Eb]
No hay otro nombre igual

        [Ab]
Sé exaltado hoy en los cielos
        [Fm]
Ven y llena este lugar
      [Cm]
Eres digno de alabar
       [Bb]             [Eb]
No hay otro nombre igual

        [Ab]
Sé exaltado hoy en los cielos
        [Fm]
Ven y llena este lugar
      [Cm]
Eres digno de alabar
       [Bb]             [Eb]
No hay otro nombre igual

        [Ab]
Sé exaltado hoy en los cielos
        [Fm]
Ven y llena este lugar
      [Cm]
Eres digno de alabar
       [Bb]             [Eb]
No hay otro nombre igual

[Solo 2] [Fm]  [Cm]  [Eb]  [Bb]
         [Fm]  [Cm]  [Eb]  [Bb]

[Tab - Solo 2]

Parte 1 de 2
   [Fm]          [Cm]          [Eb]          [Bb]
E|-8-----6-----8-----------------6-----8--------------| 
B|----------8--------6-----8--------8--------6--------| 
G|----------------------8-----------------------8-----| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 2 de 2
   [Fm]        [Cm]          [Eb]          [Bb]
E|-----6-----8-----------------6-----8--6-------------| 
B|--------8--------6-----8--------8--------6----------| 
G|-5------------------8-----------------------8--5----| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

[Estribillo 2]

             [Ab]
Digno de alabar
  [Cm]  [Bb]
Cris_to
              [Gm]
Nombre sin igual
             [Cm]  [Bb]
Digno de alabar

             [Ab]
Digno de alabar
  [Cm]  [Bb]
Cris_to
              [Gm]
Nombre sin igual
             [Cm]  [Bb]
Digno de alabar

[Final] [Bb]  [Ab]', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/digno/)', 1792242278, 1792242278, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (23, 1, 'Como En El Cielo', 'Elevation Worship', 'D', NULL, '[Intro] [D]  [G/B]  [D]  [G/B]  [A]  [G/B]
        [D]  [G]  [D]  [G]

[Primera Parte]

                   [D]       [D7M]
 La atmósfera cambiando está
[G]                [D]
  Tu Espíritu está aquí
[G]              [D]    [D7M]
  Es evidente tu mover
[G7M(9)]                [D]    [D7M]
       Tu Espíritu está aquí

[G]                   [D]       [D7M]
  La atmósfera cambiando está
[G]                [D]
  Tu Espíritu está aquí
[G]              [D]    [D7M]
  Es evidente tu mover
[G7M(9)]                [D]    [D7M]
       Tu Espíritu está aquí

[Estribillo]

[G]
  Llena este lugar
                [Bm7(11)]
Derramando Tu amor
               [F#m/A]
Tu amor me envuelve
[G]
  He venido por Ti
                  [Bm7(11)]
A Tus brazos de amor
               [F#m/A]
Tu amor me envuelve

[Primera Parte]

[G]                   [D]       [D7M]
  La atmósfera cambiando está
[G]                [D]
  Tu Espíritu está aquí
[G]              [D]    [D7M]
  Es evidente tu mover
[G7M(9)]                [D]    [D7M]
       Tu Espíritu está aquí

[G]                   [D]       [D7M]
  La atmósfera cambiando está
[G]                [D]
  Tu Espíritu está aquí
[G]              [D]    [D7M]
  Es evidente tu mover
[G7M(9)]                [D]    [D7M]
       Tu Espíritu está aquí

[Estribillo 2]

[G]
  Llena este lugar
                [Bm7(11)]
Derramando Tu amor
               [F#m/A]
Tu amor me envuelve
[G]
  He venido por Ti
                  [Bm7(11)]
A Tus brazos de amor
               [F#m/A]
Tu amor me envuelve

[G]
  Llena este lugar
                [Bm7(11)]
Derramando Tu amor
               [F#m/A]
Tu amor me envuelve
[G]
  He venido por Ti
                  [Bm7(11)]
A Tus brazos de amor
               [F#m/A]
Tu amor me envuelve

( [G]  [A]  [Bm7/F#]  [F#m] )

              [G]  [A]  [Bm/F#]  [F#m]
Llena este lugar

[Puente]

[G]                       [A]  [Bm7/F#]
  Que tu poder, descienda hoy
           [F#m]
Venga Tu reino

[G]                         [A]  [Bm7/F#]
  Que se haga aquí, Tu voluntad
             [F#m]
Como en el cielo

[G]                       [A]  [Bm7/F#]
  Que tu poder, descienda hoy
           [F#m]
Venga Tu reino

[G]                         [A]  [Bm7/F#]
  Que se haga aquí, Tu voluntad
             [F#m]
Como en el cielo

[G]                       [A]  [Bm7/F#]
  Que tu poder, descienda hoy
           [F#m]
Venga Tu reino

[G]                         [A]  [Bm7/F#]
  Que se haga aquí, Tu voluntad
             [F#m]
Como en el cielo

[Solo]

[Tab - Solo]

Parte 1 de 9
   [G]                    [Bm7]             [A]
E|----------------------------------------------------| 
B|-7-----10-------------7------12---------------------| 
G|---4------11-9-9b11~-----4------11--9-9b11~---------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 2 de 9
   [Bm7]                     [F#m/A]
E|----------------------------------------------------| 
B|-7------10---------------7---7---7---7--------------| 
G|---4-------11-9-9b11~~~----6---6---6---6------------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 3 de 9
   [G]                    [Bm7]             [A]
E|----------------------------------------------------| 
B|-7-----10-------------7------12---------------------| 
G|---4------11-9-9b11~-----4------11--9-9b11~---------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 4 de 9
   [Bm7]                     [F#m/A]
E|----------------------------------------------------| 
B|-7------10---------------7---7---7---7--------------| 
G|---4-------11-9-9b11~~~----6---6---6---6------------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 5 de 9
   [G]                      [Bm7]               [A]
E|----------------------------------------------------| 
B|-7---7----10------------7---7-----12----------------| 
G|---4---4-----11-9-9b11----4---4------11-9-9b11~-----| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 6 de 9
   [Bm7]                   [F#m/A]
E|----------------------------------------------------| 
B|-7---7---10------------7---7---7---7----------------| 
G|---4---4----11-9-9b10~---6---6---6---6--6-----------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 7 de 9
   [G]                          [Bm7]
E|----------------------------------------------------| 
B|----------------------------------------------------| 
G|-7-------7-------10---------7-------7---------------| 
D|---4-4-4---4-4-4----11-9b11---4-4-4---4-4-4---------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 8 de 9
         [A]    [Bm7]
E|----------------------------------------------------| 
B|-12---------7-------7-------10----------------------| 
G|----11-9b11---4-4-4---4-4-4----11-9b11--------------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

Parte 9 de 9
   [F#m/A]
E|----------------------------------------------------| 
B|-7-------7-------7-------7--------------------------| 
G|---6-6-6---6-6-6---6-6-6---6-6-6/7~-----------------| 
D|----------------------------------------------------| 
A|----------------------------------------------------| 
E|----------------------------------------------------| 

[Final]

( [G]  [F#m/A]  [A]  [Bm7/F#]  [F#m11] )

[G]                  [D]   [D7M]
  Milagros pueden suceder
[G]                [D]    [D7M]
  Tu Espíritu está aquí
[G]              [D]    [D7M]
  Es evidente tu mover
[G7M(9)]                [D]    [D7M]  [A]
       Tu Espíritu está aquí

[G]                  [D]   [D7M]
  Milagros pueden suceder
[G]                [D]    [D7M]
  Tu Espíritu está aquí
[G]              [D]    [D7M]
  Es evidente tu mover
[G7M(9)]                [D]  [A]  [G]
       Tu Espíritu está  aquí', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/como-en-el-cielo/)', 1792242279, 1792242279, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (24, 1, 'Worthy', 'Elevation Worship', 'Cm', NULL, '[Intro] [Cm]  [Eb]  [Ab]  [Bb]  [Cm]  [Eb]  [Ab]   [Bb]

[Primera Parte]

[Eb]            [Bbsus]      [Bb]
  It was my cross You bore
            [Eb/G]         [Ab]     [Eb/Bb]     [Bb]
So I could live in the freedom you died  for
[Eb]         [Bbsus]       [Bb]
  And now my life is Yours
            [Eb/G]         [Ab]       [Eb/Bb]    [Bb]
And I will sing of Your goodness forevermore

[Estribillo]

                [Ab]
Worthy is your name
    [Bb]
Jesus
                  [Eb/G]
You deserve the praise
                [Cm]
Worthy is your name
                [Ab]
Worthy is your name
   [Bb]
Jesus
                  [Eb/G]
You deserve the praise
                   [Cm]
Worthy is your name

( [Cm]  [Eb]  [Ab]  [Bb]  [Cm]  [Eb]  [Ab]  [Bb] )

[Segunda Parte]

[Eb]             [Bbsus]      [Bb]
  And now my shame is gone
        [Eb/G]       [Ab]            [Eb/Bb]  [Bb]
I stand amazed in your love undeniable
[Eb]                 [Bbsus]    [Bb]
   Your grace goes on and on
[Bb]          [Eb/G]         [Ab]         [Eb/Bb]
And I will sing of Your goodness forever more

[Estribillo]

                [Ab]
Worthy is your name
    [Bb]
Jesus
                  [Eb/G]
You deserve the praise
                [Cm]
Worthy is your name
                [Ab]
Worthy is your name
   [Bb]
Jesus
                  [Eb/G]
You deserve the praise
                   [Cm]
Worthy is your name

[Estribillo]

                [Ab]
Worthy is your name
    [Bb]
Jesus
                  [Eb/G]
You deserve the praise
                [Cm]
Worthy is your name
                [Ab]
Worthy is your name
   [Bb]
Jesus
                  [Eb/G]
You deserve the praise
                   [Cm]
Worthy is your name

( [Ab]  [Fm]  [Cm]  [Bbsus]  [Eb/G]  )

[Final]

     [Ab]
Be exalted now in the heavens
         [Fm]
As your glory fills this place
    [Cm]
You alone deserve our praise
                  [Bb]       [Eb/G]
You''re the name above all names

( [Fm]  [Cm]   [Cm/Eb]  [Bb]  [Fm]  [Cm]  [Cm/Eb]  [Bb]  [Eb/G] )
( [Bb]  [Ab] )', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/worthy/)', 1792242279, 1792242279, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (25, 1, 'Leão (Lion)', 'Elevation Worship', 'Dm', NULL, '[Intro] [Dm]  [Bb7M]  [Dm]  [Bb9]

[Primera Parte]

[Dm]
Deus de Jacó
[Bb7M]
O Grande Eu sou
[Dm]
Rei dos Anjos
[Bb7M]
Filho de Deus
[C]
Voz de muitas águas
[Bb7M]
No céu é o louvor
[C]
Mais forte que um trovão
[Bb7M]
Com Tua glória vem Senhor

[Estribillo]

[Dm]              [C]
A terra ouve o rugir
[Bb]
Do Leão de Judá
[Dm]               [F]
A terra ouve o rugir
[Bb]           [Gm]
Do Leão de Judá

[Dm]              [C]
A terra ouve o rugir
[Bb]
Do Leão de Judá
[Dm]               [F]
A terra ouve o rugir
[Bb]           [Gm]
Do Leão de Judá

( [Dm]  [C]  [Bb]  [Gm] )
( [Dm]  [F]  [Bb] )

[Segunda Parte]

[Dm]
A profecia
[Bb7M]
De Sião
[Dm]
Nosso Messias
[Bb7M]
Que veio a nós
[C]
O único que é digno
[Bb7M]
De o livro abrir
[C]
Sofreu como um cordeiro
[Bb7M]
Mas o leão ressuscitou

[Estribillo]

[Dm]              [C/D]
A terra ouve o rugir
[Bb/D]
Do Leão de Judá
[Dm]              [F/A]
A terra ouve o rugir
[Bb]           [Gm]
Do Leão de Judá

[Dm]              [C/D]
A terra ouve o rugir
[Bb/D]
Do Leão de Judá
[Dm]              [F/A]
A terra ouve o rugir
[Bb]           [Gm]
Do Leão de Judá

( [Dm]  [C]  [Bb]  [Gm] )
( [Dm]  [F]  [Bb] )

( [Bb]  [C4]  [Gm4]  [F6] )
( [Bb]  [C4]  [Gm4]  [F6] )

[Puente]

         [Bb]
Prepare agora
          [C4]
O caminho do Senhor
        [Gm4]
Prepare agora
              [F6]
O caminho do Senhor

[Bb]          [C4]
Oh vale, se erga
[G4]          [F6]
Montanha, se abaixe
[Bb]          [C4]
Oh vale, se erga
[Gm4]          [F6]
Montanha, se abaixe

[Bb]          [C4]
Oh vale, se erga
[Gm4]          [F6]
Montanha, se abaixe
[Bb]          [C4]
Oh vale, se erga
[Gm4]          [F6]
Montanha, se abaixe

[Bb]          [C4]
Oh vale, se erga
[G4]          [F6]
Montanha, se abaixe
[Bb]          [C4]
Oh vale, se erga
[Gm4]          [F6]
Montanha, se abaixe
Conven

( [Bb]  [C4]  [Gm4]  [F6] )
( [Bb]  [C4]  [Gm4] )

[Estribillo]

[Dm]              [C/D]
A terra ouve o rugir
[Bb/D]
Do Leão de Judá
[Dm]              [F/A]
A terra ouve o rugir
[Bb]           [Gm]
Do Leão de Judá

[Estribillo]

[Dm]               [C]
A terra ouve o rugir
[Bb]
Do Leão de Judá
[Dm]               [F]
A terra ouve o rugir
[Bb]           [Gm]
Do Leão de Judá

[Estribillo]

[Bb]              [C4]
A terra ouve o rugir
[Gm4]         [F6]
Do Leão de Judá
[Bb]              [C4]
A terra ouve o rugir
[Gm4]        [Dm/A]
Do Leão de Judá

[Puente]

[Bb]          [C4]
Oh vale, se erga
[Gm4]           [F6]
Montanha, se abaixe

[Bb]          [C4/E]
Oh vale, se erga
[Gm4]           [F6]
Montanha, se abaixe

[Bb]           [C4]
Oh vale, se erga
[Gm4]          [F6]
Montanha, se abaixe

[Final] [Bb]  [C4/E]  [Gm4]  [F6]
        [Bb]  [C4]  [Gm4]', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/leao-lion/)', 1792242280, 1792242280, 'Dm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (26, 1, 'Jireh', 'Elevation Worship', 'Cm', NULL, '[Intro] [Cm]  [Bb4]  [Ab]  [Eb5]

[Primera Parte]

[Cm7]          [Bb4]        [Ab]     [Eb]
I’ll never be more loved than I am right now
           [Cm7]  [Bb4]
Wasn’t holding You up  so there’s nothing I
      [Ab]      [Eb]
Can do to let You down
[Bb4]      [Cm7]        [Fm7]    [Eb]
Doesn’t take a trophy to make You proud
[Cm7]          [Bb4]         [Fm7]
I’ll never be more loved than I am
   [Eb]
Right now

[Segunda Parte]

[Cm]    [Bb4]          [Ab]      [Eb]
Going through a storm but I won’t go down
        [Cm7]        [Bb4]
I hear Your voice carried in the rhythm of the
     [Ab]      [Eb]
Wind to call me out
[Bb4]       [Cm7]       [Fm7]
You would cross an ocean so I wouldn’t
[Eb]
Drown
[Cm7]       [Bb4]           [Fm7]
You’ve never been closer than You are right
[Eb]
Now

[Estribillo]

[Bb4]  [Cm7]        [Ab7M] [Eb]
Ji___reh You are enough
[Bb4]  [Cm7]        [Ab7M] [Eb]
Ji___reh You are enough
[Bb4]         [Cm7]      [Fm7]     [Eb]
I will be content in every circumstance
[Bb4]  [Cm7]        [Ab7M] [Eb]
Ji___reh You are enough

     [Bb4]
Forever enough
    [Cm7]
Always enough
[Cm7(5+)]          [Cm7]  [Ab7M]  [Eb]
        More than enough

[Tercera Parte]

[Cm]       [Bb4]      [Ab]       [Eb]
Don’t wanna forget how I feel right now
        [Cm7]      [Bb4]
On the mountaintop I can see so clear what
     [Ab]   [Eb/G]
It’s all about
[Bb]     [Cm7]        [Ab7M]    [Eb/G]
Stay by my side when the sun goes down
[Cm7]      [Bb]        [Fm7]        [Eb]
Don’t wanna forget how I feel right now

[Estribillo] 2]

[Bb]  [Cm7]       [Ab7M] [Eb/G]
Jireh You are enough
[Bb]  [Cm7]       [Ab7M] [Eb/G]
Jireh You are enough
[Bb]         [Cm7]        [Fm7]      [Eb]
I will be content in every circumstance
[Bb]  [Cm7]       [Ab] [Eb/G]
Jireh You are enough

     [Bb4]
Forever enough
    [Cm7]
Always enough
[Cm7(5+)]          [Cm7]  [Ab7M]  [Eb/G]
        More than enough

[Puente]

        [Bb4]   [Cm7]
I’m already loved
        [Ab6]  [Eb/G]
I’m already chosen
        [Bb4] [Cm7]
I know who I am
           [Ab7M]  [Eb/G]
I know what You’ve spoken
           [Bb4] [Cm7]
I’m already loved
        [Ab7M]      [Eb/G]
More than I could imagine
  [Fm7]      [Eb]
And that is enough

[Fm7]      [Eb]
That is enough

[Bb]     [Cm]
That is enough
[Ab]   [Eb/G]
That is enough
[Bb]    [Cm]
So I am enough
[Ab]    [Eb/G]
You are enough

[Estribillo] 2]

[Bb]  [Cm7]        [Ab7M] [Eb/G]
Ji_reh You are enough
[Bb]  [Cm7]        [Ab7M] [Eb/G]
Ji_reh You are enough
[Bb]         [Cm7]        [Fm7]      [Eb]
I will be content in every circumstance
[Bb]  [Cm7]        [Ab7M] [Eb/G]
Ji_reh You are enough

( [Ab]  [Eb/G]  [Ab]  [Eb/G] )

[Ab]   [Eb/G]            [Ab]      [Eb/G]
If He dresses the lilies with beauty and splendor
[Ab]   [Eb/G]
How much more will He clothe you
[Ab]     [Eb/G]
How much more will He clothe you
[Ab]     [Eb/G]    [Ab]  [Eb/G]
If He watches over every sparrow
[Ab]    [Eb/G]
How much more does He love you
[Ab]    [Eb/G]
How much more does He love you

[Ab]    [Eb/G]
How much more does he love you

        [Bb]         [Cm7]
More than you ask, think or imagine
 [Fm7]         [Eb]         [Bb]  [Cm7]
According to His power working in us
             [Ab7M]  [Eb/G]
It’s more than enough

            [Bb]  [Cm7]
It’s more than enough
            [Ab]  [Eb/G]
It’s more than enough

[Estribillo] 2]

[Bb]  [Cm7]        [Ab]  [Eb/G]
Ji_reh You are enough
[Bb]  [Cm7]        [Ab]  [Eb/G]
Ji_reh You are enough
[Bb]         [Cm7]      [Fm7]        [Eb]
I will be content in every circumstance
[Bb]  [Cm7]       [Ab]  [Eb/G]
Ji_reh You are enough', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/jireh/)', 1792242281, 1792242281, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (27, 1, 'Tumbas a Jardines (Feat. Brandon Lake)', 'Elevation Worship', 'G', NULL, '[Intro] [G]  [C/G]  [G]

[Primera Parte]

    [C/G]       [G]
El mundo busqué
      [C/G]     [G]
Y no pudo llenarme
          [Em7]              [D11]
Ningún tesoro que pueda ganar
         [C9]
Me saciará

[Segunda Parte]

              [G]
Mas llegaste tú
    [C/G]         [G]
Me diste vida nueva
          [Em7]          [D11]
Y cada deseo se cumplirá
             [C9]
Aquí en tu amor

[Estribillo]

           [G]
Oh no hay nada, nada mejor
        [Em7]
No hay nada, nada mejor
        [C]                        [G]
No hay nada, nada mejor que mi Dios

( [C/G]  [G] )

[Tercera Parte]

 [C/G]     [G]
Vengo a ti
      [C]            [G]
Sin miedo y sin reservas
       [Em7]                [D11]
Cada fracaso has visto Señor
                [C9]
Y aún tu amigo soy

[Cuarta Parte]

           [Am7]         [G]
Porque el Dios de los montes
       [Am7]         [G]
Es el Dios de los valles
          [Em7]                 [D11]
No hay lugar que me pueda alejar
                 [C9]
De tu gracia y amor

[Estribillo]

           [G]
Oh no hay nada, nada mejor
        [Em7]
No hay nada, nada mejor
        [C9]                       [G]
No hay nada, nada mejor que mi Dios


Oh no hay nada, nada mejor
        [Em7]
No hay nada, nada mejor
        [C9]                       [G]
No hay nada, nada mejor que mi Dios

( [C]  [G]  [C] )

[Ponte 1]

[G]                          [C]
  Cambias lamento en danza
[G]                       [C]
  De cenizas traes vida
[G]
  Cambias culpa por gloria
        [Em7]  [C9]      [G]
Sé que solo tú lo harás

                         [C]
Cambias lamento en danza
[G]                       [C]
  De cenizas traes vida
[G]
  Cambias culpa por gloria
        [Em7]  [C9]      [G]
Sé que solo tú lo harás

[Ponte 2]

[G]                        [C]
  De las ruinas y tumbas
[G]                       [C]
  Nacen nuevos jardines
[G]
  Resucitas los huesos

        [Em7]  [C9]      [G]
Sé que solo tú lo harás
        [Em7]  [C9]      [G]
Sé que solo tú lo harás

[Estribillo]

           [G]
Oh no hay nada, nada mejor
        [Em7]
No hay nada, nada mejor
        [C9]                       [G]
No hay nada, nada mejor que mi Dios

           [G]
Oh no hay nada, nada mejor
        [Em7]
No hay nada, nada mejor
        [C9]                       [G]
No hay nada, nada mejor que mi Dios

[Final]

                       [C]
De las ruinas y tumbas
[G]                       [C]
  Nacen nuevos jardines
[G]
  Resucitas los huesos
        [Em7]  [C9]      [G]
Sé que solo tú lo harás

                       [C]
De las ruinas y tumbas
[G]                       [C]
  Nacen nuevos jardines
[G]
  Resucitas los huesos

        [Em7]  [C9]      [G]
Sé que solo tú lo harás
        [Em7]  [C9]      [G]
Sé que solo tú lo harás
        [Em7]  [C9]      [G]
Sé que solo tú lo harás

( [C]  [G]  [C]  [G] )', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/tumbas-a-jardines/)', 1792242281, 1792242281, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (28, 1, 'Jesus Be The Name (feat. Tiffany Hudson)', 'Elevation Worship', 'Db', NULL, '[Intro] [Db]  [Ab/C]  [Gb]  [Db]  [Ab/C]  [Gb]

[Primera Parte]

[Db]         [Ab/C]     [Gb]
I could sing Your Name for all my life
[Db]       [Ab/C]     [Gb]
 And still find more to love each
[Bbm] [Ab]                     [Gb]
    Jesus be the name ever on my lips
[Bbm] [Ab]                         [Gb]
    Sweeter every time that I call on it

[Estribillo 1]

                                  [Ebm]
There''s just something ''bout Your Name
                                  [Gb]
There''s just something ''bout Your Name
                                  [Db]
There''s just something ''bout Your Name
                  [Ab]
That makes me cry Holy
                  [Ebm]                     [Gb]
There is no other name, there is no other name
                  [Db]                     [Ab]
There is no other name, Jesus You''re worthy

[Segunda Parte]

[Db]         [Ab/C]       [Ebm]       [Gb]
You have been the friend who never left
[Db] [Ab/C]     [Ebm]         [Gb]
I won''t forget your faithfulness
[Bbm] [Ab]                     [Gb]
    Jesus be the name ever on my lips
[Bbm] [Ab]                         [Gb]
    Sweeter every time that I call on it

[Estribillo 2]

                                  [Ebm]
There''s just something ''bout Your Name
                                  [Gb]
There''s just something ''bout Your Name
                                  [Db]
There''s just something ''bout Your Name
              [Bbm]  [Ab]
That makes me cry Holy
                  [Ebm]                     [Gb]
There is no other name, there is no other name
                  [Db]          [Bbm]      [Ab]
There is no other name, Jesus You''re worthy

[Estribillo 2]

                                  [Ebm]
There''s just something ''bout Your Name
                                  [Gb]
There''s just something ''bout Your Name
                                  [Db]
There''s just something ''bout Your Name
              [Bbm]  [Ab]
That makes me cry Holy
                  [Ebm]                     [Gb]
There is no other name, there is no other name
                  [Db]          [Bbm]      [Ab]
There is no other name, Jesus You''re worthy

( [Ebm]  [Gb]  [Bbm]  [Ab] )
( [Ebm]  [Gb]  [Bbm]  [Ab] )

[Puente]

            [Ebm]
Jesus Your Name is like the morning light
    [Gb]
The one the darkness can''t deny
    [Bbm]                          [Ab]
The resurrection and the life, Jesus
           [Ebm]
Jesus Your Name can save, Your name can heal
      [Gb]
Your Name can make the storm be still
    [Bbm]                           [Ab]
You never fail, You never will, Jesus
          [Ebm]
Jesus the bread of life broken for us
     [Gb]
The wounded and the worthy one
    [Bbm]                                [Ab]
The first the last and soon to come, Jesus
          [Ebm]
Jesus the King who overwhelmed the grave
    [Gb]
The Lord who will forever reign
    [Bbm]                           [Ab]
The Name above all other names, Jesus

[Refrão 3]

             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory
             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory

[Refrão 3]

             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory
             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory

[Ebm]
Oh oh oh
[Gb]
Oh oh oh
[Bbm]
Oh oh oh
[Ab]
Jesus
[Ebm]
Oh oh oh
[Gb]
Oh oh oh
[Bbm]
Oh oh oh
[Ab]
Jesus

[Refrão 3]

             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory
             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory

[Ebm]
Oh oh oh
[Gb]
Oh oh oh
[Db]
Oh oh oh
[Bbm] [Ab]
Jesus
[Ebm]
Oh oh oh
[Gb]
Oh oh oh
[Db]
Oh oh oh
[Bbm] [Ab]
Jesus

[Refrão 3]

             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory
             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory

[Refrão 3]

             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory
             [Ebm]                 [Gb]
Jesus be the Name, Jesus be the Name
             [Db]                [Bbm]    [Ab]
Jesus be the Name that gets all the glory

[Alt Refrão]

                        [Ebm]
There’s healing in Your Name
                        [Gb]
There’s healing in Your Name
                        [Db]
There’s healing in Your Name
                [Ab]
It makes me cry holy
                        [Ebm]
There’s freedom in Your Name
                        [Gb]
There’s freedom in Your Name
                        [Db]
There’s freedom in Your Name
                [Ab]
It makes me cry holy
                  [Ebm]
Salvation in Your Name
                  [Gb]
Salvation in Your Name
                  [Db]
Salvation in Your Name

                [Ab]
It makes me cry holy
             [Ebm]
Jesus be the Name
             [Gb]
Jesus be the Name
             [Db]
Jesus be the Name
              [Ab]    [Gb]
That gets all the glory', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/jesus-be-the-name-feat-tiffany-hudson/)', 1792242282, 1792242282, 'Db');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (29, 1, 'Lo Harás Otra Vez', 'Elevation Worship', 'C', NULL, '[Intro] [C]  [G9]  [C]  [G9]

[Primera Parte]

[C]
  Muros rodeando estoy
[G9]
   Pensé que caerían hoy
[C]                            [G9]
  Mas nunca me has fallado Dios
[C]
  La espera terminará
[G9]
   Sé que has vencido ya
[Am7]                        [G9]
    Nunca me has fallado Dios

[Estribillo]

[C/E]              [D9/F#]
    En Ti confiaré
            [G]
Tu promesa sigue en pie
   [C]
Tú eres fiel
[C/E]               [D9/F#]
    Confiado andaré
             [G]
En tus manos estaré
 [C]                 [G9]
Siempre has sido fiel

( [C]  [G9] )

[Segunda Parte]

[C]
  La noche acabará
[G9]
   Tú Palabra se cumplirá
[C]                     [G9]
  Mi corazón te alabará
[C]
  Cristo, Mi Salvador
[G9]
   Cúbreme con Tú amor
[Am7]                     [G9]
    Mi corazón te alabará

[Estribillo]

[C/E]              [D9/F#]
    En Ti confiaré
            [G]
Tu promesa sigue en pie
   [C]
Tú eres fiel
[C/E]               [D9/F#]
    Confiado andaré
             [G]
En tus manos estaré
[C]
Eres fiel

[C/E]              [D9/F#]
    En Ti confiaré
            [G]
Tu promesa sigue en pie
   [C]
Tú eres fiel
[C/E]               [D9/F#]
    Confiado andaré
             [G]
En tus manos estaré
 [C]                 [G9]
Siempre has sido fiel

[Instrumental] [C]  [G9]  [C]
               [D/F#]  [C/G]  [D/F#]  [C/G]
               [F#m/D]  [G/D]  [F#m/D]  [G/D]
               [D/F#]  [C/G]  [D/F#]  [C/G]
               [F#m/D]  [G/D]  [F#m/D]  [G/D]

[Puente]

[D/F#]  [C/G]            [D/F#]  [C/G]
          Yo sé que Tú
             [F#m/D]  [G/D]
Mueves montañas
            [F#m/D]  [G/D]
Yo creo en Ti
                [D/F#]  [C/G]
Sé que lo harás otra vez
            [D/F#]  [C/G]
Abriste el mar
          [F#m/D]  [G/D]
En el desier____to
            [F#m/D]  [G/D]
Yo creo en Ti
                [D/F#]  [C/G]
Sé que lo harás otra vez

           [D/F#]  [C/G]
Yo sé que Tú
             [F#m/D]  [G/D]
Mueves montañas
            [F#m/D]  [G/D]
Yo creo en Ti
                [D/F#]  [C/G]
Sé que lo harás otra vez
            [D/F#]  [C/G]
Abriste el mar
          [F#m/D]  [G/D]
En el desier____to
            [F#m/D]  [G/D]
Yo creo en Ti
                [D/F#]  [C/G]
Sé que lo harás otra vez

           [D/F#]  [C/G]
Yo sé que Tú
             [F#m/D]  [G/D]
Mueves montañas
            [F#m/D]  [G/D]
Yo creo en Ti
                [D/F#]  [C/G]
Sé que lo harás otra vez
            [D/F#]  [C/G]
Abriste el mar
          [F#m/D]  [G/D]
En el desier____to
            [F#m/D]  [G/D]
Yo creo en Ti
                [D/F#]  [C/G]  [D/F#]  [C/G]
Sé que lo harás otra vez
                [F#m/D]  [G/D]  [F#m/D]  [G/D]
Sé que lo harás otra  vez

( [D/F#]  [C/G]  [D/F#]  [C/G] )
( [F#m/D]  [G/D]  [F#m/D]  [G/D] )

[Estribillo]

[C/E]              [D9/F#]
    En Ti confiaré
            [G]
Tu promesa sigue en pie
   [C]
Tú eres fiel
[C/E]               [D9/F#]
    Confiado andaré
             [G]
En tus manos estaré
[C]
Eres fiel

[C/E]              [D9/F#]
    En Ti confiaré
            [G]
Tu promesa sigue en pie
   [C]
Tú eres fiel
[C/E]               [D9/F#]
    Confiado andaré
             [G]
En tus manos estaré
 [C]                 [G9]  [C]
Siempre has sido fiel

( [G9]  [C]  [G9]  [C]  [G9] )', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/lo-haras-otra-vez/)', 1792242282, 1792242282, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (30, 1, 'Praise (feat. Brandon Lake, Chris Brown & Chandler Moore)', 'Elevation Worship', 'E', NULL, '[Estribillo]

 [A]
Let everything That has breath

Praise the Lord, Praise the Lord

Let everything That has breath

Praise the Lord, Praise the Lord

[Primera Parte]

      [A]
I’ll praise in the valley
[D2]            [A]
Praise on the mountain
    [E/G#]
I’ll praise when I’m sure
[D2]              [A]
Praise when I’m doubting

[Segunda Parte]

      [A]
I’ll praise when outnumbered
[D2]          [A]
Praise when surrounded
[E/G#]
Cause praise is the waters
[D]          [A]
My enemies drown in

[Pre-Estribillo]

  [E]
As long as I’m breathing
[D]
I’ve got a reason to

[Estribillo 1]

 [F#m] [D]       [A]
Praise the Lord
            [E]
Oh my soul
 [F#m] [D]       [A]
Praise the Lord
            [E]
Oh my soul

[Tercera Parte]

     [A]                 [D2]
I’ll praise when I feel it
           [E]            [A]
 And I’ll praise when I don’t
    [E/G#]             [D2]
I’ll praise cause I know
                        [A]
You’re still in control

[Cuarta Parte]

      [A]
My praise is a weapon
     [D2]           [A]
It’s more than a sound
 [E/G#]
My praise is the shout
[D2]                   [A]
 That brings Jericho down

[Pre-Estribillo]

     [E]
As long as I’m breathing
 [D]
I’ve got a reason to

[Estribillo 1]

 [F#m] [D]     [A]
Praise the Lord
            [E]
Oh my soul
 [F#m] [D]     [A]
Praise the Lord
            [E]
Oh my soul

[F#m]
I won’t be quiet
      [D]
My God is alive
 [A]                  [E]
How could I keep it inside
 [F#m] [D]      [A]
Praise the Lord
       [E]
Oh my soul

( [E]  [A] )

[Puente]

     [A]
I’ll praise cause You’re sovereign
 [Bm]
Praise cause You reign
 [C#m]                        [D]
Praise cause You rose And defeated the grave

     [A]
I’ll praise cause You’re faithful
 [Bm]
Praise cause You’re true
 [C#m]                        [D]
Praise cause there’s nobody Greater than You

[Estribillo]

 [F#m] [D]      [A]
Praise the Lord
      [E]
Oh my soul
 [F#m] [D]     [A]
Praise the Lord
      [E]
Oh my soul
 [F#m] [D]     [A]
Praise the Lord
      [E]
Oh my soul
 [F#m] [D]     [A]
Praise the Lord
      [E]
Oh my soul

[Estribillo 2]

[F#m]
I won’t be quiet
      [D]
My God is alive
 [A]                  [E]
How could I keep it inside

[F#m]
I won’t be quiet
      [D]
My God is alive
 [A]                  [E]
How could I keep it inside

[F#m]
I won’t be quiet
      [D]
My God is alive
 [A]                  [E]
How could I keep it inside

[F#m]   [D]     [A]
Praise the Lord
      [E]
Oh my soul

[Final] [F#m]  [D]  [A]  [E]
        [F#m]  [D]  [A]  [E]', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/praise-feat-brandon-lake-chris-brown-chandler-moore/)', 1792242283, 1792242283, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (31, 1, 'La Bendición', 'Elevation Worship', 'B', NULL, '[Intro] [B]  [E]  [B/D#]  [F#]
        [G#m7]  [E]  [B]  [F#]

[Primera Parte]

[B]              [E]
 Dios te guarde y bendiga
[B/D#]                  [F#]
 Que extienda su amor y te muestre favor
[G#m7]         [E]         [B/D#] [F#]    [B]  [E]
 Dios te mire con agrado y te de paz
[B]              [E]
 Dios te guarde y bendiga
[B/D#]                  [F#]
 Que extienda su amor y te muestre favor
[G#m7]         [E]         [B/D#] [F#]    [B]  [E]
 Dios te mire con agrado y te de paz

[Estribillo]

[G#m7] [E]    [B]     [F#]
  Amén, amén, amén
[G#m7] [E]    [B]     [F#]
  Amén, amén, amén

( [G#m7]  [E]  [B]  [F#] )

        [G#m7]                      [E]
Que te cubra con su gracia hasta mil generaciones
        [B]                       [F#]
  Tu familia y tus hijos y los hijos de tus hijos
         [G#m7]                      [E]
  Su presencia te acompañe donde quiera que tu vayas
           [B]                    [F#]
  Que te llene, te rodee va contigo, va contigo
        [G#m7]                      [E]
  De mañana y de noche, en tu entrada y salida
          [B]                    [F#]
  En tu llanto y alegría él te ama, él te ama

        [G#m7]       [E]          [B]          [F#]
  Él te ama, él te ama, él te ama, él te ama

[Estribillo]

[G#m7] [E]    [B]     [F#]
  Amén, amén, amén
[G#m7] [E]    [B]     [F#]
  Amén, amén, amén', 'Importada de CifraClub (https://www.cifraclub.com/elevation-worship/la-bendicion/)', 1792242284, 1792242284, 'B');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (32, 1, 'Hermoso Dios', 'Felipe Santos', 'B', NULL, '[Intro] [B]  [F#/A#]  [C#m7]  [E]

[Primera Parte]

[B]                [F#/A#]
Ver tu belleza inigualable
[C#m7]
Es todo lo que quiero
[E]
Es todo lo que quiero

[Segunda Parte]

[B]                    [F#/A#]
Verte reinar con tú amada novia
[C#m7]
Es todo lo que quiero
[E]
Es todo lo que quiero

[Pre-Estribillo]

   [E]           [F#]         [E/G#]        [F#/A#]     [F#/D#]
El cielo es tu trono y la tierra el estrado     de   tus pies
     [E]         [F#]       [E/G#]          [F#/A#]  [F#/D#]
Aquí tienes tu casa y familia, te esperamos  otra vez

    [E]          [F#]         [E/G#]        [F#/A#]     [F#/D#]
El cielo es tu trono y la tierra el estrado     de   tus pies
     [E]         [F#]       [E/G#]          [F#]
Aquí tienes tu casa y familia, te esperamos otra vez//

[Estribillo]

   [B]
Hermoso Dios
   [F#/A#]
Glorioso Dios
  [C#m7]      [E]          [F#]
Maravilloso, Cristo te amo

( [B]  [F#/A#]  [C#m7]  [E] )

[Puente]

[B]                          [F#/A#]
Mientras te espero yo me enciendo más de amor por ti
[C#m7]                        [E]
Mientras te espero yo me enciendo más', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/hermoso-dios/)', 1792242285, 1792242285, 'B');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (33, 1, 'Abre El Cielo Aquí', 'Felipe Santos', 'Am', NULL, '[Intro] [Am7]  [G]  [F]  [G]

 [Primera Parte]

 [Am7]
    Para que no me pierda
  [C]
    Corriendo tras el viento
  [F]                  [G]
    Mis ojos están en ti

 [Am7]
    Eres mi recompensa
  [C]
    Mi puerto seguro
  [F]                      [G]
    Contigo yo quiero habitar (no me voy a acostumbrar)

 [Am7]
    No me voy a acostumbrar
  [C]
    A vivir sin ti aquí
  [F]          [G]
    Mi mayor amor

 [Am7]
    Y por las madrugadas
  [C]
    Hoy mi alma canta
       [F]         [G]
    Yeshua, te extraño
       [F]         [G]
    Yeshua, te extraño

 [Pre-Refrão]

  [F]          [G]                [Am7]
    Yo no daré descanso a mis ojos
                  [Em]
    Hasta que tus ojos encuentren un lugar
  [F]          [G]                [Am7]
    Yo no daré descanso a mis parpados
                 [Em]            [F]
    Hasta que yo sea ese lugar

 [Segunda Parte]

 [Am7]
    Por las madrugadas
  [C]
    Hoy mi alma canta
       [F]         [G]
    Yeshua, te extraño
       [F]         [G]
    Yeshua, te extraño

 [Pre-Refrão]

  [F]          [G]                [Am7]
    Yo no daré descanso a mis ojos
                  [Em]
    Hasta que tus ojos encuentren un lugar
  [F]          [G]                [Am7]
    Yo no daré descanso a mis parpados
                 [Em]
    Hasta que yo sea ese lugar


[Estribillo]

      [F]
    Abre el cielo aquí
           [G]
    Desciende el que ha de venir
        [Am7]
    Oh, sí! Hicieras en mí
              [Em]
    Tu santa morada lugar de placer

      [F]
    Abre el cielo aquí
           [G]
    Desciende el que ha de venir
        [Am7]
    Oh, sí! Hicieras en mí
              [Em]
    Tu santa morada lugar de placer

 [Puente]

  [F]                            [G]
    Yo quiero estar en este lugar
                         [Am7]
    Permanecer en este lugar
                          [Em]
    Hasta que yo sea tu lugar
    No necesito salir si tú estás aquí

  [F]                            [G]
    Yo quiero estar en este lugar
                         [Am7]
    Permanecer en este lugar
                          [Em]
    Hasta que yo sea tu lugar

No necesito salir si tú estás aquí

[Estribillo]

      [F]
    Abre el cielo aquí
           [G]
    Desciende el que ha de venir
        [Am7]
    Oh, sí! Hicieras en mí
              [Em]
    Tu santa morada lugar de placer

      [F]
    Abre el cielo aquí (woooho)
           [G]
    Desciende el que ha de venir
        [Am7]
    Oh, sí! Hicieras en mí
              [Em]
    Tu santa morada lugar de placer

( [F]  [G]  [Am7]  [Em] )
( [F]  [G]  [Am7]  [Em] )

 [Ponte 2]

    [F]
    Maranatha ahora ven
    [G]
    Maranatha ahora ven
    [Am7]
    Maranatha ahora ven
    [Em]
    Rasga el cielo y baja (wooho)

    [F]
    Maranatha ahora ven
    [G]
    Maranatha ahora ven
    [Am7]
    Maranatha ahora ven
    [Em]
    Rasga el cielo y baja aquí

    [F]
    Maranatha ahora ven
    [G]
    Maranatha ahora ven
    [Am7]
    Maranatha ahora ven
    [Em]
    Rasga el cielo y baja aquí

    [F]
    Maranatha ahora ven
    [G]
    Maranatha ahora ven
    [Am7]                         [Em]
    Maranatha el Espíritu y la esposa dicen ven

( [F]  [G]  [Am7]  [Em] )

 Oh oh oh oh oh oh oh oh oh oh oh

 El Espíritu y la esposa dicen ven

 El clamor del Espíritu se une

 A la canción de la esposa

 Ven señor Jesús

 Ven señor Jesús

 Ven señor Jesús', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/abre-el-cielo-aqui/)', 1792242285, 1792242285, 'Am');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (34, 1, 'Olvidarte', 'Felipe Santos', 'F', NULL, '[F]  [C]  [G]   [F]  [C]  [G]

[INTRO]


[F]               [C]                  [G]
   Ya nada te importa, ya nada es igual,
[F]               [C]                  [G]
   llevo cuatro meses sin poder cantar.
[Dm]                                        [G]
   Y es que aunque no llames yo sí quiero verte,
                                 [C]
   no he podido yo sacarte de mi mente
[Em]                    [Am]     [G]   [F]
   y aún no quiero perderte. Oh.

[F]                 [C]               [G]
   Mientras me castigo con la soledad,
[F]              [C]              [G]
   juegas a vestirte de felicidad.
[Dm]                                      [G]
   Y aunque a tus amigas no les digas nada,
                                      [C]
   tú también lo sabes, se ve en tu mirada
[Em]                [Am]     [G]   [F]
   aunque sigas callada. Oh.


[C]                             [G]
   Haré lo necesario para olvidarte,
                      [Am]
   aunque me toque cambiar
        [G]         [F]
   y no ser nunca más
                         [G]                    [C]
   lo que fui ya no me importa, igual no volverás.
                                [G]
   Haré lo necesario para no pensarte,
                      [Am]
   la vida pasa y tú igual
            [G]        [F]
   y aunque voy a llorar,
                      [G]                 [F]   [C]  [G]
   poco a poco entenderé que nunca volverás,
                                        [F]   [C]  [G]
   poco a poco entenderé que nunca volverás.


[F]                   [C]                  [G]
   Pido llorando al cielo un poco de razón,
                               [F]
   pido que vuelvas con mi corazón,
                   [C]                        [G]
   entiende si te ofendo, que no es mi intención.
[Dm]                                           [G]
   Y es que lo que duele no es que te hayas ido,
                                    [C]
   más que no tenerte me duele tu olvido,
[Em]                  [Am]      [G]               [F]
   que sepas que te quiero, es lo único que pido.


[C]                             [G]
   Haré lo necesario para olvidarte,
                      [Am]
   aunque me toque cambiar
        [G]         [F]
   y no ser nunca más
                         [G]                    [C]
   lo que fui ya no me importa, igual no volverás.
                                [G]
   Haré lo necesario para no pensarte,
                      [Am]
   la vida pasa y tú igual
            [G]        [F]
   y aunque voy a llorar,
                      [G]                 [F]   [C]  [G]
   poco a poco entenderé que nunca volverás,
                                        [F]   [C]  [G]
   poco a poco entenderé que nunca volverás...


   [F]
   Sé que es tarde y perdón por la hora,
                 [G]
   no se si escribirte o si te llamo, sé que no estas sola.
               [C]
   Te confieso que ni el ego me dejo cantarte

   ni el tiempo olvidarte
     [F]
   y no es que no te quiera, es que ni pude hablarte.

                  [F]
   Guardo en mi cabeza lo bueno, ya me olvide de lo malo
             [G]
   y aprendí que la tristeza me hace mejor ser humano,
         [Am]
   ahora soy un hombre nuevo y soy mejor
                  [F]                          [G]
   y aunque me prometa olvidarte por ti aprendí que es amor.

       [F]
   Girasoles, doce meses, mis canciones, tu mirada,
         [G]
   yo sé que también te acuerdas y no es malo eres humana.
           [Am]
   No te escribo para nada diferente a recordarte
           [C]
   que a pesar de los seis meses sin hablar y no mirarte,

         [F]
   yo te quiero y no para volver,
                          [G]
   te quiero porque parte tuya me ha enseñado

   que es amar y que es crecer,
         [Am]
   ya no siento mas y con la mano
                                [F]
   en el corazón, sé que hoy te vas

                        [G]                 [F]   [C]  [G]
   y poco a poco entenderé que nunca volverás,
                                        [F]   [C]  [G]
   poco a poco entenderé que nunca volverás,
                                        [F]   [C]  [G]
   poco a poco entenderé que nunca volverás,
                                        [F]   [C]  [G]
   poco a poco entenderé que nunca volverás.', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/olvidarte/)', 1792242286, 1792242286, 'F');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (35, 1, 'Cristo Vive Em Mim', 'Felipe Santos', 'C', NULL, '[C9]    [G]     [D/F#]
Nada vai me impedir
 [C9]    [G]     [D/F#]
Nada vai me distanciar
 [C9]    [G]     [D/F#]
Pois cristo vive em mim
 [C9]    [G]     [D/F#]
Larala lara laralaralara}2x
 [C9]    [G]     [D/F#]
es aqui meu coração
 [C9]    [G]     [D/F#]
es aqui somos só um
 [C9]    [G]     [D/F#]
porque muitos são chamados
 [C9]    [G]     [D/F#]
mais sim somos os escolhidos

refrão
 [C9]    [G]     [D/F#]
Eu Correrei, Eu Saltarei
 [C9]    [G]     [D/F#]
Eu Cantarei, Cristo vive em mim
 [C9]    [G]     [D/F#]
Larala lara laralaralara', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/cristo-vive-em-mim/)', 1792242286, 1792242286, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (36, 1, 'Última Vez', 'Felipe Santos', 'F', NULL, '[F]
Tenho tanto pra contar
              [Am7]
Confessar que, de fato, pensava em você
                     [Am/D]
Me entreguei em teus braços, até te falei
                [G4]                  [G]
"Que é teu meu abraço quando tu quiser!"

[F]
Quantas vezes quis roubar
               [Am7]
O teu tímido riso, guardá-o pra mim
                [Am/D]
É injusto com o mundo ele ser só meu
                  [G4]                   [G]
Mas queria pra mim, afinal quem não quer?

[F]
E eu fiquei do teu lado
             [Am7]
Fui amor por nós dois
           [G4]                  [G]
Mas a verdade é que não vou ficar
                    [F] [Am7] [Am/D] [G4] [G]
Essa é a última vez

[F]
Sei, te faltou explicar
              [Am7]
Eu temia que a gente terminasse assim
            [Am/D]
Mas o tempo ruiu o que nos trouxe aqui
                   [G4]                [G]
E essa história um dia ia acabar, mas

[F]
Senta e tenta me ouvir
                  [Am7]
Não é fácil esquecer, mas tudo tem um fim
               [Am/D]
Há de ter recomeço em cada "despedir"
                  [G4]                      [G]
Hão de haver reencontros, sabes bem que eu...

[F]
Estive sempre ao teu lado
                [Am7]
Fui amor por nós dois
        [G4]                    [G]
E a verdade é que não vou voltar (2x)
              [F]
Foi a última vez
             [Am7]
Nossa última vez
             [Am/D]
Nossa última vez

       [G4]                    [G]
E a verdade é que não vou voltar
              [F]
Foi a última vez', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/ltima-vez/)', 1792242287, 1792242287, 'F');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (37, 1, 'Vete', 'Felipe Santos', 'G', NULL, '[G]
Fuiste todo para mí
           [Em]
Fuiste el error que nunca comprendí
         [C]
Y sabes bien que lo he intentado todo
               [D]
Por tenerte aquí
     [G]
Perdóname si se me va la voz
          [Em]
Me cuesta mucho decirte que no
           [C]
Pero me está ganando la distancia
                     [D]
Que hay entre tú y yo

                 [C]
Y si te quieres ir
                          [G]
Creo que ya llego el momento
                [C]
De decirnos adiós
                 [G]
Sin arrepentimientos
           [Em]            [D]
Creo que así, saldrá mejor

[G]                                  [D]     [Em]
Vete, que aunque te quiero ya no quiero verte
                           [C]
No sabes cómo me dolió quererte así
   [Em]        [Am]                    [D]
Yo te creí y me dejaste aquí queriendo
         [G]
Solo vete

                             [D]      [Em]
Que aunque te quiero ya no quiero verte
                               [C]
Y aunque no me creas por fin entendí
    [Em]
Que yo sin ti
    [Am]                [D]           [G]
Con tu recuerdo igual puedo vivir

BG UE TOC  IGUAL LOS ACORDES


Fuiste mi razón de ser
Fuiste el motivo que me hizo volver
Ya no te importa lo que siento
Y no me digas que no es cierto

Y por quererte tanto dejé de pensar en mí
Viví en una mentira
Te di el silencio y hasta el tiempo
Que me pediste y ahora pienso

Que si te quieres ir
Creo que ya llego el momento
De decirnos adiós
Sin arrepentimientos
Creo que así, saldrá mejor

Vete, que aunque te quiero ya no quiero verte
No sabes cómo me dolió quererte así
Yo te creí y me dejaste aquí queriendo
Solo vete

Que aunque te quiero ya no quiero verte
Y aunque no me creas por fin entendí
Que yo sin ti
Con tu recuerdo igual puedo vivir

Vete, que aunque te quiero ya no quiero verte
No sabes cómo me dolió quererte así
Yo te creí y me dejaste aquí queriendo
Solo vete

Que aunque te quiero ya no quiero verte
Y aunque no me creas por fin entendí
Que yo sin ti
Con tu recuerdo igual puedo vivir', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/vete/)', 1792242288, 1792242288, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (38, 1, 'Y si te digo', 'Felipe Santos', 'C', NULL, 'E|E|--------------|------| 

  Intro:

  [C] - [Am] - [Dm] - [Fm] - [G]

        [C]                                        [F]
  Me dijiste que no el era el momento para comenzar
           [C]                                   [F]
  Que no creas que valga la pena si va a terminar
        [Dm]                                     [Em]
  Me dijiste que es mejor ahora que sufrir después
               [F]                                    [Gsus4] - [G]
  Y que no es lógico arriesgar un poco sin saber porque

        [C]                                    [F]
  Me miraste con los ojos llenos de inseguridad
            [C]                                   [F]
  Pero el miedo lo decía todo no tenias que hablar
        [Dm]                                         [Em]
  Me dijiste que no pierda el tiempo que no va ocurrir
        [F]                                       [Gsus4] - [G]
  pero tengo la leve intuición que acabas de mentir

  [Coro]

                 [C]                 [C/B]      [Am]
  Y si te digo que voy a cambiar todos tus planes
               [Dm7]                             [Gsus4]  - [G]
  Y si te digo que la vida no es mas que un instante
               [Em]                                 [Am]
  Y si te digo que voy a quitarle el miedo a tu mirada
                [Dm7]                      [Gsus4] - [G]
  Y despertar en ti cosas que nunca imaginabas
                  [F]
  Y si me dices que no es suficiente
        [C]           [Am]
  todo lo que yo te daba
      [Dm7]         [G]              [C]
  Te dejo mi canción y esto se acaba

** INTRO **

            [C]
  Siempre fuiste la buena intención
                     [F]
  de un presentimiento
           [C]
  Como un golpe en el corazón
                   [F]
  algo que va por dentro
         [Dm]                                  [Em]
  Pero siento que te quedas sola viviendo el pasado
         [F]                                       [Gsus4] - [G]
  Y no quiero pagar los errores que otros han causado

  [Coro]

                 [C]                 [C/B]      [Am]
  Y si te digo que voy a cambiar todos tus planes
               [Dm7]                             [Gsus4]  - [G]
  Y si te digo que la vida no es mas que un instante
               [Em]                                 [Am]
  Y si te digo que voy a quitarle el miedo a tu mirada
                [Dm7]                      [Gsus4] - [G]
  Y despertar en ti cosas que nunca imaginabas
                  [F]
  Y si me dices que no es suficiente
        [C]           [Am]
  todo lo que yo te daba
      [Dm7]         [G]              [A] [Asus4]
  Te dejo mi canción y esto se acaba

  [Coro (Sube un tono)]

                [D]                 [D/C#]       [Bm]
  Y si te digo que voy a cambiar todos tus planes
                [Em7]                             [Asus4] - [A]
  Y si te digo que la vida no es mas que un instante
               [F#m]                                [Bm]
  Y si te digo que voy a quitarle el miedo a tu mirada
                 [Em7]                      [Asus4] - [A]
  Y despertar en ti cosas que nunca imaginabas
                 [G]
  Y si me dices que no es suficiente
        [D]            [Bm]
  todo lo que yo te daba
      [Em7]                        [A] [D/B]
  Te dejo mi canción y esto se acaba.

E|--------------| 

Acordes extraños:

[C/B]
\ne|---0---
B|---1---| 
G|---0---| 
D|---0---| 
A|---2---| 
E|---x---| 
/          

[Gsus4]
\ne|---3----
B|---1----| 
G|---0----| 
D|---0----| 
A|---2----| 
E|---3----| 
/           

[D/C#]
\ne|---0----
B|---2----| 
G|---2----| 
D|---0----| 
A|---4----| 
E|---x----| 
/           

[D/B]
\ne|---x----
B|---3----| 
G|---2----| 
D|---0----| 
A|---2----| 
E|---x----| 
/           

E|E|--------------|------|---- 
Bueno esto es todo amigos.', 'Importada de CifraClub (https://www.cifraclub.com/felipe-santos/y-si-te-digo/)', 1792242288, 1792242288, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (39, 1, 'Deus da Minha Vida', 'Thalles Roberto', 'Dm', NULL, '[Intro] [Dm7]  [Bb9(11+)]  [Dm7]  [Bb9(11+)]
        [Dm7]  [Bb9(11+)]  [Dm7]  [Bb9(11+)]



[Primera Parte]

   [C/D]    [Dm7]            [Bb9(11+)]

 [Dm7]  [Bb9(11+)]  [Dm7]  [Bb9(11+)]
Deus meu       Pai  meu
  [Dm7]  [Bb9(11+)]  [Dm7]     [Bb9(11+)]
Amor  meu       Tudo, razão de tudo

 [Dm7]  [Bb9(11+)]  [Dm7]  [Bb9(11+)]
Deus meu        Ar  Meu
   [Dm7]            [Bb9(11+)]  [Dm7]
Farol O farol que eu    preciso
     [Bb9(11+)]
Como eu preciso


       [Dm7]                 [G]
Eu preciso Te sentir todo dia
     [Dm7]                     [G]
E olhar pra Tua luz pra não me perder
        [Dm7]                    [G]
Meu Senhor, Tu és a minha alegria
       [Bb9(11+)]
Eu preciso

[Estribillo]

               [Bb9(11+)]
Deus da minha vida
 [C9]     [Dm7]
Fica comigo
           [Bb9(11+)]
Sou a sua casa
 [C9]      [Dm7]
Mora em mim
               [Bb9(11+)]
Deixa eu Te dizer
    [C9]       [Dm7]
O que eu preciso, Pai
       [Bb9(11+)]
Eu preciso do Senhor

( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )

[Pós-Refrão]

 [Dm7]  [Bb9(11+)]  [Dm7]  [Bb9(11+)]
Deus meu       Pai  meu
  [Dm7]  [Bb9(11+)]  [Dm7]     [Bb9(11+)]
Amor  meu       Tudo, razão de tudo

 [Dm7]  [Bb9(11+)]  [Dm7]  [Bb9(11+)]
Deus meu        Ar  Meu
   [Dm7]            [Bb9(11+)]  [Dm7]
Farol O farol que eu    preciso
     [Bb9(11+)]
Como eu preciso

[Segunda Parte]


       [Dm7]                 [G]
Eu preciso Te sentir todo dia
     [Dm7]                     [G]
E olhar pra Tua luz pra não me perder
        [Dm7]                    [G]
Meu Senhor, Tu és a minha alegria
       [Bb9(11+)]
Eu preciso

[Estribillo]

               [Bb9(11+)]
Deus da minha vida
 [C9]     [Dm7]
Fica comigo
           [Bb9(11+)]
Sou a sua casa
 [C9]      [Dm7]
Mora em mim
               [Bb9(11+)]
Deixa eu Te dizer
    [C9]       [Dm7]
O que eu preciso, Pai
       [Bb9(11+)]
Eu preciso do Senhor

               [Bb9(11+)]
Deus da minha vida
 [C9]     [Dm7]
Fica comigo
           [Bb9(11+)]
Sou a sua casa
 [C9]      [Dm7]
Mora em mim
               [Bb9(11+)]
Deixa eu Te dizer
    [C9]       [Dm7]
O que eu preciso, Pai
       [Bb9(11+)]      [C9]
Eu preciso do Senhor

( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7] )
( [Bb9(11+)]  [C9]  [Dm7]  [Bb9(11+)] )

[Estribillo]

               [Bb9(11+)]
Deus da minha vida
 [C9]     [Dm7]
Fica comigo
           [Bb9(11+)]
Sou a sua casa
 [C9]      [Dm7]
Mora em mim
               [Bb9(11+)]
Deixa eu Te dizer
    [C9]       [Dm7]
O que eu preciso, Pai
       [Bb9(11+)]
Eu preciso do Senhor', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/deus-da-minha-vida/)', 1792242289, 1792246423, 'Dm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (40, 1, 'Arde Outra Vez', 'Thalles Roberto', 'F#m', NULL, '[Intro] [F#m7(9)]  [C#m7(9)]  [F#m7(9)]  [C#m7(9)]

[Tab-Intro]

Parte 1 de 4
                  [F#m7(9)]
E|-x-x---x---x-x--4p2-4--2--4-2----4---4---| 
B|-x-x---x---x-x--2---2--2--2-2----2---2---| 
G|-x-x---x---x-x--2---2--2--2-2----2---2---| 
D|-x-x---x---x-x--2-------------x----------| 
A|-x-x---x---x-x----------------x----------| 
E|-x-x---x---x-x--2-------------x--2-----2-| 

Parte 2 de 4

E|-4--4---4---4p2-4--2--4-2--4-4/5-4-------| 
B|-2--2---2---2---2--2--2-2--2-2---2--5----| 
G|-2--2---2---2---2--2--2-2--2-2---2--2----| 
D|-2--2---2---2--------------2-2-----------| 
A|-----------------------------------------| 
E|------2-----2--------------2-2---2--2----| 

Parte 3 de 4

   [C#m7(9)]
E|-----------------------------------------| 
B|-4--4--x-----4--4-----4--4-----4---------| 
G|-4--4--x-----4--4-----4--4-----4---------| 
D|-x--x--x-x---x--x-----x--x-----x---------| 
A|-4-----x---4-------4--4--4--4------------| 
E|-----------------------------------------| 

Parte 4 de 4

   [C#m7(9)]
E|-----------------------------------------| 
B|-4--4--x---------------------------------| 
G|-4--4--x---------------------------------| 
D|-x--x--x-x------6---2h4/5\4p2------------| 
A|-4-----x-4--2/4---2----------------------| 
E|-----------------------------------------| 

[Primera Parte]

[F#m7]
Eu não quero mais viver

Longe da tua presença,
        [C#m7(9)]
Meu Senhor hoje quero voltar

Voltar ao início de tudo
     [F#m7]
De quando eu era feliz

Sentia a Tua presença
      [C#m7(9)]
Caminhava ali, no seu jardim

Te encontrava todo dia
           [F#m7]
Mas me perdi, Senhor, no caminhar

Tentei andar sozinho na aventura
       [C#m7(9)]
Dessa vida foi só ilusão

Confesso que andei perdido, sim
               [F#m7(9)]
Mas, hoje, eu Te devolvo um coração

Arrependido de tudo o que fez
          [C#m7(9)]
Quero voltar, Senhor

Para os Teus rios

Voltar, Senhor, para os Teus rios

 [F#m7]
E|------------------------2--2---2---------| 
B|------------------------2--2---2---------| 
G|-2----2--x--x-x-------2-2--2---2---------| 
D|-2----2--x--x-x-------2-2--2---2---------| 
A|-4--4-4--x--x-x--4--4-4------------------| 
E|-2----0-2--x--x-x--2--0-2------4---------| 

 [C#m7(9)]
E|------------------------2--2---2---------| 
B|-4----4---------------4-4--4---4---------| 
G|-4----4--x--x-x-------4-4--4---4---------| 
D|-2----2--x--x-x-------2-2--2---2---------| 
A|-4--4-4--x--x-x--4--4-4------4-----------| 
E|-----------------------------------------| 

[Estribillo]

    [A7M(9)]    [G#m7(13-)]  [F#m7(11)]
Me molha, me lava, me ensina
             [A7M(9)]   [G#m7(13-)]
Me inspira e arde outra vez
        [F#m7(11)]
No meu coração

    [A7M(9)]    [G#m7(13-)]  [F#m7(11)]
Me molha, me lava, me ensina
             [A7M(9)]   [G#m7(13-)]
Me inspira e arde outra vez
        [C#m7(9)]
No meu coração

 [A7M(9)]       [G#m7(13-)]     [F#m7(11)]
E|-0---0-0---0--0----0-0---0--0----0-0---0-| 
B|-0---0-0---0--0----0-0---0--0----0-0---0-| 
G|-6---6-6---6--4----4-4---4--2----2-2---2-| 
D|-6---6-6---6--4----4-4---4--2-2--2-2---2-| 
A|-----------------------------------------| 
E|-5-5-----5----4--4-----4----2-2------2---| 

E|-0-----0-0---0---------------------------| 
B|-0-----0-0---0---------------------------| 
G|-2-----2-2---2---------------------------| 
D|-2--2--2-2---2---------------------------| 
A|-----------------------------------------| 
E|-2--2------2-----------------------------| 

 [A7M(9)]         [G#m7(13-)]   [C#m7(9)]
E|-0---0-0---0--0----0-0---0--0-----------| 
B|-0---0-0---0--0----0-0---0--4-----------| 
G|-6---6-6---6--4----4-4---4--4-----------| 
D|-6---6-6---6--4----4-4---4--2-----------| 
A|----------------------------------------| 
E|-5-5-----5----4--4-----4----------------| 

[Segunda Parte]

            [F#m7]
De braços abertos, quero Te receber
             [C#m7(9)]
Filho, Eu estava esperando você
                               [F#m7]
Pra mim você é tudo que Eu sonhei um dia
        [C#m7(9)]
Eu te amo

 [F#m7]
E|-----------------------------------------| 
B|-2--2-x----2-2---2--2--2---2--2-2--------| 
G|-2--2-x----2-2---2--2--2---2--2-2--------| 
D|-2--2-x----2-2---2--2--2---2--2-2-----2--| 
A|-4--4-x----4-4---4--4--4---4--4-4---4----| 
E|-2----x--2-----2---------2--------2------| 

E|-----------------------------------------| 
B|-----------------------------------------| 
G|-----2-----------------------------------| 
D|-----------------------------------------| 
A|-4---------------------------------------| 
E|---2-------------------------------------| 

 [C#m7(9)]
E|-----------------------------------------| 
B|-4--4-x----4-4---4--4--4---4--4-4--------| 
G|-4--4-x----4-4---4--4--4---4--4-4--------| 
D|-2--2-x----2-2---2--2--2---2--2-2-----2--| 
A|-4--4-x--4-----4---------4----------4----| 
E|------x----------------------------------| 

E|-----------------------------------------| 
B|---------4-------------------------------| 
G|--4--------------------------------------| 
D|------2----------------------------------| 
A|----4------------------------------------| 
E|-----------------------------------------| 

 [C#m7(9)]
E|-----------------------------------------| 
B|-4--4-x--------------4-------------4-4---| 
G|-4--4-x--------------4-------------4-4---| 
D|-2--2-x------2\1-----------2\1-----------| 
A|-4--4-x--2-4-----2h4---2-4-----2h4-4-4-4-| 
E|------x----------------------------------| 

E|-----------------------------------------| 
B|-4---------------------------------------| 
G|-4---------------------------------------| 
D|-----------------------------------------| 
A|-4---------------------------------------| 
E|-----------------------------------------| 

 [F#m7(9)] [C#m7(9)]
E|-4-------0---0---------------------------| 
B|-2-------4---4---------------------------| 
G|-2-------4---4---------------------------| 
D|-2-------2---2---------------------------| 
A|-4-------4---4---------------------------| 
E|-2---------------------------------------| 

( [F#m7(9)]  [C#m7(9)]  [F#m7(9)]  [C#m7(9)] )

[Primera Parte]

[F#m7]
Eu não quero mais viver

Longe da tua presença,
        [C#m7(9)]
Meu Senhor hoje quero voltar

Voltar ao início de tudo
     [F#m7]
De quando eu era feliz

Sentia a Tua presença
      [C#m7(9)]
Caminhava ali, no seu jardim

Te encontrava todo dia
           [F#m7]
Mas me perdi, Senhor, no caminhar

Tentei andar sozinho na aventura
       [C#m7(9)]
Dessa vida foi só ilusão

Confesso que andei perdido, sim
               [F#m7(9)]
Mas, hoje, eu Te devolvo um coração

Arrependido de tudo o que fez
          [C#m7(9)]
Quero voltar, Senhor

Para os Teus rios

Voltar, Senhor, para os Teus rios

[Estribillo]

    [A7M(9)]   [G#m7(13-)]   [F#m7(11)]
Me lava, me molha, me ensina
             [A7M(9)]      [G#m7(13-)]
Me inspira e arde outra vez
        [F#m7(11)]
No meu coração

    [A7M(9)]    [G#m7(13-)]  [F#m7(11)]
Me molha, me lava, me ensina
             [A7M(9)]      [G#m7(13-)]
Me inspira e arde outra vez
     [F#m7(11)]
Com fogo, com fogo!

    [A7M(9)]    [G#m7(13-)]
Me molha, me lava
         [F#m7(11)]
A glória          da segunda casa Deus

         [A7M(9)]  [G#m7(13-)]     [F#m7(11)]
A glória                   me molha

 [A7M(9)]  [G#m7(13-)]  [F#m7(11)]
Deus,              Deus

( [A7M(9)]  [G#m7(13-)]  [F#m7(11)] )

  [A7M(9)]  [G#m7(13-)]      [F#m7(11)]
E arde outra vez no meu coração
  [A7M(9)]  [G#m7(13-)]      [F#m7(11)]
E arde outra vez no meu coração
  [A7M(9)]  [G#m7(13-)]      [F#m7(11)]
E arde outra vez no meu coração
  [A7M(9)]  [G#m7(13-)]      [C#m7(9)]
E arde outra vez no meu coração', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/arde-outra-vez/)', 1792242290, 1792242290, 'F#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (41, 1, 'Deus Me Ama', 'Thalles Roberto', 'C', NULL, '[Intro] [C9]  [Bb7M(6)]
        [C9]  [Bb7M(6)]

[Primera Parte]

 [C9]
Mesmo sendo assim pobre e pecador
     [F9]
Deus    me ama
 [C9]
Mesmo sendo falho, mesmo sem merecer
     [F9]
Deus    me ama
 [C9]
Se eu estou forte, se eu estou de pé
     [F9]
Deus    me ama
 [C9]
Se eu estou fraco, se eu estou caído
         [F9]
Ele não deixa de me amar

[Pre-Estribillo]

 [C9]
Sem o seu amor, sem o seu perdão
         [F9]
O que seria de mim
 [C9]
Deus me amou tanto que entregou seu filho
        [F9]
Pra morrer em meu lugar

[Estribillo]

 [C9]
Deus me ama
        [F9]
O seu amor é tão grande, incondicional
 [C9]
Deus me ama
            [F9]
E ele esta sempre de braços abertos pra mim

( [C9]  [Bb7M(6)] )

[Primera Parte]

 [C9]
Mesmo sendo assim pobre e pecador
     [F9]
Deus    me ama
 [C9]
Mesmo sendo falho, mesmo sem merecer
     [F9]
Deus    me ama
 [C9]
Se eu estou forte, se eu estou de pé
     [F9]
Deus    me ama
 [C9]
Se eu estou fraco, se eu estou caído
         [F9]
Ele não deixa de me amar

[Pre-Estribillo]

 [C9]
Sem o seu amor, sem o seu perdão
         [F9]
O que seria de mim
 [C9]
Deus me amou tanto que entregou seu filho
        [F9]
Pra morrer em meu lugar

[Estribillo]

 [C9]
Deus me ama
        [F9]
O seu amor é tão grande, incondicional
 [C9]
Deus me ama
            [F9]
E ele esta sempre de braços abertos pra mim', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/deus-me-ama/)', 1792242290, 1792242290, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (42, 1, 'Eu Escolho Deus', 'Thalles Roberto', 'G', NULL, '[Primera Parte]

    [G5]                             [C9]
Senhor, eu nasci pra te chamar de Deus
                           [Am7]
Eu nasci pra te chamar de pai
                [C9]
E andar do seu lado
    [G5]                          [C9]
Senhor desde o ventre da minha mãe
                       [Am7]
Eu sou povo exclusivo Seu
             [C9]               [G5]
Eu sou abençoado se vivo obediente

[Pre-Estribillo]

[Tab - Pre- Estribillo]

Parte 1 de 2
         [C7M]
E|------------------------------------------| 
B|---------0------------------0-------------| 
G|-----0-------0---------0--------0---------| 
D|---2---2---2---2-----2---2----2---2-------| 
A|-3-----------------3----------------------| 
E|------------------------------------------| 

Parte 2 de 2
         [D6(11)]
E|------------------------------------------| 
B|---------0------------------0-------------| 
G|-----0-------0---------0--------0---------| 
D|---4---4---4---4-----4---4----4---4-------| 
A|-5-----------------5----------------------| 
E|------------------------------------------| 

[C7M]                        [D6(11)]   [C7M]
    Mas todo dia o pecado vem, me chama
                       [D6(11)]     [C7M]
Todo dia as propostas vem, me chamam
                      [D6(11)]      [C7M]
Todo dia vêm as tentações, me chamam
                   [D6(11)]
Todo dia o pecado vem

[Estribillo]

                [G5]
Mas eu escolho Deus
     (Passagem)          [C9]
Eu escolho ser amigo de Deus
                        [Am7]
Eu escolho Cristo todo dia

Já morri pra minha vida e agora eu vivo
   [C9]
A vida de Deus!

                [G5]
Mas eu escolho Deus
     (Passagem)          [C9]
Eu escolho ser amigo de Deus
                        [Am7]
Eu escolho Cristo todo dia

Já morri pra minha vida e agora eu vivo
   [C9]
A vida de Deus!

[Tercera Parte]

    [G5]                              [C9]
Senhor, eu nasci pra te chamar de Amor
                           [Am7]
Eu nasci pra te chamar de pai
                [C9]
E andar do seu lado
    [G]                           [C9]
Senhor desde o ventre da minha mãe
                       [Am7]
Eu sou povo exclusivo Seu
             [C9]               [G5]
Eu sou abençoado se vivo obediente

[Pre-Estribillo]

[Tab - Pre- Estribillo]

Parte 1 de 2
         [C7M]
E|------------------------------------------| 
B|---------0------------------0-------------| 
G|-----0-------0---------0--------0---------| 
D|---2---2---2---2-----2---2----2---2-------| 
A|-3-----------------3----------------------| 
E|------------------------------------------| 

Parte 2 de 2
         [D6(11)]
E|------------------------------------------| 
B|---------0------------------0-------------| 
G|-----0-------0---------0--------0---------| 
D|---4---4---4---4-----4---4----4---4-------| 
A|-5-----------------5----------------------| 
E|------------------------------------------| 

[C7M]                        [D6(11)]   [C7M]
    Mas todo dia o pecado vem, me chama
                       [D6(11)]     [C7M]
Todo dia as propostas vem, me chamam
                      [D6(11)]      [C7M]
Todo dia vêm as tentações, me chamam
                   [D6(11)]
Todo dia o pecado vem

[Estribillo]

                [G5]
Mas eu escolho Deus
     (Passagem)          [C9]
Eu escolho ser amigo de Deus
                        [Am7]
Eu escolho Cristo todo dia

Já morri pra minha vida e agora eu vivo
   [C9]
A vida de Deus!

                [G5]
Mas eu escolho Deus
     (Passagem)          [C9]
Eu escolho ser amigo de Deus
                        [Am7]
Eu escolho Cristo todo dia

Já morri pra minha vida e agora eu vivo
   [C9]
A vida de Deus!

[Pasaje]

   [G5]
E|-3--3--3----------------------------------| 
B|-3--3--3----------------------------------| 
G|-0--0--0----------------------------------| 
D|-0--0--0-----------0----------------------| 
A|-------------0--2-------------------------| 
E|-3--3--3--3-------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/eu-escolho-deus/)', 1792242291, 1792242291, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (43, 1, 'Mesmo Sem Entender', 'Thalles Roberto', 'A', NULL, '[Intro] [A7M(9)]  [C#m7]  [F#m7]  [E]

[Estribillo]

          [A7M(9)]              [G#m7]
Mesmo sem entender, mesmo sem entender
       [A7M(9)]              [G#m7]
Eu confio em ti, mesmo sem entender
                [F#m7(11)]
Eu sei que é o melhor pra mim
[B4]           [A7M(9)]   [G#m7]  [F#m7]  [E]
   Mesmo sem entender

[Primera Parte]

 [A7M(9)]                              [G#m7]
Deus, mesmo que eu não consiga entender

E queira tudo do meu jeito
     [A7M(9)]                            [G#m7]
Eu até choro e às vezes ate chego a dizer
                                 [F#m7(11)]
Por que é que tem que ser tão difícil pra mim?
                      [B4]
Parece que é difícil só pra mim

    [A7M(9)]                                      [G#m7]
Eu sei, seus pensamentos são mais altos que os meus
                                 [A7M(9)]
O teu caminho é melhor do que o meu
                              [G#m7]
Tua visão vai além do que eu vejo
                                     [F#m7(11)]
O Senhor sabe exatamente o que é melhor pra mim
                                    [B4]
E mesmo que eu não entenda o seu caminho eu confio

[Segunda Parte]

   [A7M(9)]                          [G#m7]
E Deus porque sou tão pequenino assim
                                 [F#m7(11)]
Vou ficar quietinho aqui no seu colo
                            [B4]
Esperando o tempo certo de tudo

                       [A7M(9)]
Porque eu sei que vais        cuidar de mim
               [G#m7]
E o seu melhor      está por vir
               [F#m7(11)]                 [B4]
Eu sei que é o          melhor pra mim
          [A7M(9)]    [G#m7]  [F#m7]  [E]
Mesmo sem entender

[Estribillo]

          [A7M(9)]              [G#m7]
Mesmo sem entender, mesmo sem entender
       [A7M(9)]              [G#m7]
Eu confio em ti, mesmo sem entender
             [F#m7(11)]
Eu sei que é o melhor pra mim
[B4]           [A7M(9)]    [G#m7]  [F#m7]  [E]
   Mesmo sem entender

( [A7M(9)]  [G#m7]  [F#m7(11)]  [G#m7] )

             [F#m7(11)]
Eu sei que é o melhor pra mim
[B4]           [A7M(9)]    [G#m7]  [F#m7]  [E]
   Mesmo sem entender', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/mesmo-sem-entender/)', 1792242292, 1792242292, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (44, 1, 'A Resposta', 'Thalles Roberto', 'C#m', NULL, '[Intro] [C#m7(9/11)]  [F#7(4/9)]
        [C#m7(9)]  [F#7(4/9)]
        [C#m7(9)]  [F#7(4/9)]
        [B7M(9)]  [G#7(9-)]  [G#7]
        [C#m7(9/11)]  [F#7(4/9)]
        [B7M(9)]  [G#7(9-/13-)]

[Estribillo]

A resposta é
  [C#m7(9)]
Que eu vivo de milagres
       [F#7(4/9)]
Desta vez, vai ser mais um milagre
        [F#m7]
Eu não sei como Deus irá fazer
        [G#7(9-/13-)]     [C#m7(9)]
Mas eu sei, vai ser perfeito
      [F#7(4/9)]       [B7M(9)]  [G#7(5+)]
Como tudo o que ele faz

[Primera Parte]

               [C#m7(9)]
Não, não há lugar
[F#7(4/9)]                  [C#m7(9)]
         Não há lugar melhor
[F#7(4/9)]                     [C#m7(9)]
         Que o lugar que eu sinto
[F#7(4/9)]                 [B7M(9)]
         Que o Senhor está
[G#7(9-/13-)]             [C#m7(9)]
        Só nesse lugar
[F#7(4/9)]                 [C#m7(9)]
         O medo perde a vez
[F#7(4/9)]               [C#m7(9)]
         E dá lugar a fé
[F#7(4/9)]                [G#7(4/9)]
         Capaz de me levar à paz
       [G#7(9-)]          [C#m7(9)]
Que excede todo entendimento
[F#7(4/9)]                  [G#7(4/9)]  [G#7(13-)]
         Quem vê de fora não  entende
                     [C#m7(9)]
Como é que estão de pé
[F#7(4/9)]                  [G#7(4/9)]  [G#7(13-)]
         Como eles conseguiram

[Estribillo]

A resposta é
  [C#m7(9)]
Que eu vivo de milagres
       [F#7(4/9)]
Desta vez, vai ser mais um milagre
        [F#m7]
Eu não sei como Deus irá fazer
        [G#7(9-/13-)]     [C#m7(9)]
Mas eu sei, vai ser perfeito
      [F#7(4/9)]       [B7M(9)]  [G#7(9-/13-)]
Como tudo o que ele faz

[Primera Parte]

               [C#m7(9)]
Não, não há lugar
[F#7(4/9)]                  [C#m7(9)]
         Não há lugar melhor
[F#7(4/9)]                     [C#m7(9)]
         Que o lugar que eu sinto
[F#7(4/9)]                 [B7M(9)]
         Que o Senhor está
[G#7(9-/13-)]             [C#m7(9)]
            Só nesse lugar
[F#7(4/9)]                 [C#m7(9)]
         O medo perde a vez
[F#7(4/9)]            [G#7(9-/13-)]     [C#m7(9)]
         E dá lugar              a fé
[F#7(4/9)]                [G#7(4/9)]
         Capaz de me levar à paz
       [G#7(9-)]          [C#m7(9)]
Que excede todo entendimento
[F#7(4/9)]                  [G#7(4/9)]  [G#7(13-)]
         Quem vê de fora não  entende
                     [C#m7(9)]
Como ele ainda está de pé?
[F#7(4/9)]                  [G#7(4/9)]  [G#7(13-)]
         Como eles conseguiram

[Estribillo Final]

A resposta é
  [C#m7(9)]
Que eu vivo de milagres
       [F#7(4/9)]
Desta vez, vai ser mais um milagre
        [F#m7]
Eu não sei como Deus irá fazer
        [G#7(9-/13-)]     [C#m7(9)]
Mas eu sei, vai ser perfeito
      [F#7(4/9)]       [B7M(9)]  [G#7(9-/13-)]
Como tudo o que ele faz

A resposta é
  [C#m7(9)]
Que eu vivo de milagres
       [F#7(4/9)]
Desta vez, vai ser mais um milagre
        [F#m7]
Eu não sei como Deus irá fazer
        [G#7(9-/13-)]     [C#m7(9)]
Mas eu sei, vai ser perfeito
      [F#7(4/9)]       [B7M(9)]
Como tudo o que ele faz

        [G#7(9-/13-)]     [C#m7(9)]
Mas eu sei, vai ser perfeito
      [F#7(4/9)]       [B7M(9)]
Como tudo o que ele faz', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/a-resposta/)', 1792242292, 1792242292, 'C#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (45, 1, 'Casa do Pai', 'Thalles Roberto', 'C', NULL, '[Primera Parte]

[C9]                    [G5]     (riff 1)
   Eu sinto falta da Sua voz
[C9]                    (riff 2)  [C9]
   Me chamando pra entrar

[Tab - Frase 1]

E|------------------------------------------| 
B|------------------------------------------| 
G|------------------------------------------| 
D|-----0--0h2-------------------------------| 
A|-0h2--------------------------------------| 
E|------------------------------------------| 

[Tab - Frase 2]

E|------------------------------------------| 
B|------------------------------------------| 
G|---0---0---0------------------------------| 
D|-----4---4---4----------------------------| 
A|------------------------------------------| 
E|-0----------------------------------------| 

[G]                    [Am7(9)]
  Eu sinto tanta saudade
                [C9]
De caminhar Contigo
                  [Am7]
Saudades do meu Amigo
                (riff 2)  [C9]  (riff 2)  [C9]
Saudades do meu Pai

[C9]                        [G5]       (riff 1)
   Pai, eu sei que não mereço, mas
[C9]                      (riff 2)  [C9]
   Eu não tenho pra onde ir
[G]                    [Am7(9)]
  Eu sinto tanta saudade
                 [C9]
De conversar Contigo
                  [Am7]
Saudades do meu Amigo
                 (riff 2)  [C9]
Saudades do meu Pai
       (riff 2)  [C9]
Do meu pai

[Estribillo]

[G]  [G5]  [G5/A]  [G/B]  [C9]
   Eu vou   vol__tar pra casa do Pai
             [G5]       [Am7]  [G/B]  [G5/D]  [C9]
Eu quero o amor da casa   do   meu   Pai
                 [Am7]                   (riff 2)  [C9]
E repousar tranquilo nos braços do meu Pai
       (riff 2)  [C9]
Do meu Pai

[G]  [G5]  [G5/A]  [G/B]  [C9]
   Eu vou   vol__tar pra casa do Pai
             [G5]       [Am7]  [G/B]  [G5/D]   [C9]
Eu quero o amor da casa   do   meu    Pai
                 [Am7]
E repousar tranquilo nos braços do meu Pai

( [Em7(9)]  [C9(11+)] )

        [Em7(9)]  [C9(11+)]  [Em7(9)]  [C9(11+)]
Do meu Pai

[Tab - Estribillo Final]

Parte 1 de 6
   [Em7(9)]          [C9(11+)] [Em7(9)]          [C9(11+)]
E|----------------------------------------------------| 
B|---------3-----------3-----------3-----------3------| 
G|-------0---0-------0-----------0---0-------0--------| 
D|-----4-------4---4-----------4-------4---4----------| 
A|---2-----------2-3---------2-----------2-3----------| 
E|-0-----------------------0--------------------------| 

Parte 2 de 6
   [G]         [Am7] [G/B] [C9]
E|-------------------0-----0-----0-----0--------------| 
B|-0------0--1---3---3-----3-----3-----3--------------| 
G|-0------0--0---0------0-----0-----0-----0-----------| 
D|-0--------------------------------------------------| 
A|-----------0---2---3--------------------------------| 
E|-3------3-------------------------------------------| 

Parte 3 de 6
                          [G]
E|-0----0----0-----0----------------------------------| 
B|-3----3----3-----3------0----0----------------------| 
G|----0----0----0-----0---0----0----------------------| 
D|---------------------------0----0-------------------| 
A|-3--------------------------------------------------| 
E|------------------------3---------------------------| 

Parte 4 de 6
      [Am7] [G/B]     [C9]                      [Am7]
E|------------3---0-----0-----0-----0-----3-----------| 
B|-0--1---3-------3-----3-----3-----3-----1-----------| 
G|-0--0---0----------0-----0-----0-----0--0-----------| 
D|------------0---------------------------2-----------| 
A|----0---2-------3-----------------------0-----------| 
E|-3--------------------------------------------------| 

Parte 5 de 6
   [Em7(9)]          [C9(11+)] [Em7(9)]          [C9(11+)]
E|----------------------------------------------------| 
B|---------3-----------3-----------3-----------3------| 
G|-------0---0-------0-----------0---0-------0--------| 
D|-----4-------4---4-----------4-------4---4----------| 
A|---2-----------2-3---------2-----------2-3----------| 
E|-0-----------------------0--------------------------| 

Parte 5 de 6
   [G6(9)]
E|-0--------------------------------------------------| 
B|-0--------------------------------------------------| 
G|-2--------------------------------------------------| 
D|-0--------------------------------------------------| 
A|-X--------------------------------------------------| 
E|-3--------------------------------------------------| 

[G]     [Am7]   [G/B]  [C9]
  Eu vou   vol__tar pra casa do Pai
             [G]        [Am7]  [G/B]  [G5/D]   [C9]
Eu quero o amor da casa   do   meu    Pai
                 [Am7]                    [Em7(9)]  [C9(11+)]
E repousar tranquilo nos braços do meu Pai

[Final] [Em7(9)]  [C9(11+)]  [G6(9)]', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/casa-do-pai/)', 1792242293, 1792242293, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (46, 1, 'Pai, Eu Não Confio Em Mim', 'Thalles Roberto', 'C#', NULL, 'Intro 2x

            [C#5]  [C#m7]
E|----------4/x-----------------------| 
B|----------5/x-----------------------| 
G|----------6/x-----------------------| 
D|----6~----6/x-----------------------| 
A|----4~----4/x-----------------------| 
E|--------------4-7-4-7---x-x--7-4-7--| 


[C#m7]                               [A7M]
Pai, o mundo me fez mais um convite
                                [F#m]
A proposta é boa e a minha carne quer
             [G#m7]              [C#m7]
Eu preciso tanto segurar sua mão


             [C#m7]                [C#m7]
E|--0---------x---------0----------| 
B|--0---------x---------0----------| 
G|--6---------x---------6----------| 
D|--6---------x---------6----------| 
A|--4---------x------\4-4----------| 
E|----4-7-4-7-x-4-7-4-----4-7-4-7--| 
      Segura em minha mão também

[C#m7]                                   [A7M]
Pai, se eu estiver andando em um caminho
                           [F#m]
E não enxergar as armadilhas
             [G#m7]             [C#m7]
Vem com sua mão e me arranca de lá

[Estribillo]

[C#m7]           [A7M]            [F#m] [G#m7]
Pai eu não confio em mim Uoooh
           [C#m7]  [G#m7]
Eu não confio em mim
[F#m]          [G#m7]         [A7M]              [F#m] [G#m7]
Pai   eu    não          confio em mim Uoooh

[Riff 2]

Eu não confio

[C#m7]                           [A7M]
Pai, o bem que eu quero eu não faço
                                   [F#m]
Mas o mal que eu não quero eu faço
                [G#m7]                 [C#m7]
Eu preciso tanto redobrar a atenção

[Riff 2]

             [C#m7]                [C#m7]
E|--0---------x---------0----------| 
B|--0---------x---------0----------| 
G|--6---------x---------6----------| 
D|--6---------x---------6----------| 
A|--4---------x------\4-4----------| 
E|----4-7-4-7-x-4-7-4-----4-7-4-7--| 
         Já dizia o apóstolo

[C#m7]                                 [A7M]
Pai, se eu estiver andando em um caminho
                       [F#m]
E não enxergar as armadilhas
            [G#m7]                [C#m7]
Vem com sua mão e me arranca de lá

[Estribillo]

              [A7M]               [F#m]   [G#m7]
Pai eu não confio em mim Uoooh
        [C#m7]        [G#m7]
Eu não confio em mim
[F#m]          [G#m7]         [A7M]              [F#m] [G#m7]
Pai   eu    não          confio em mim Uoooh

[B> C# M7 Riff 2]

Eu não confio

              [A7M]
Sabe o que eu sei?

        [G#m7]                  [C#m7]
Que sozinho eu não vou dar em nada
           [A7M]
Sabe o que mais eu sei?

       [G#m7]
Que o pecado me atrasa
       [C#m7]
Que me tira do rumo, do foco das coisas de DEUS

                       [A7M]
E a Vida não flui, não flui
    [G#m7]                [F#m]                      [G#m7]
Não flui, não flui, não flui, não flui, não flui não (2x)

                  [A7M]
Sabe o que eu sei?

       [G#m7]                   [C#m7]
Que sozinho eu não vou dar em nada
           [A7M]
Sabe o que mais eu sei?
      [G#m7]
Que o pecado me atrasa
        [C#m7]
Que me tira do rumo, do foco das coisas de DEUS

             [A7M]
E a Vida não flui, não flui

    [G#m7]                [F#m]
Não flui, não flui, não flui

              [G#m7]
Não flui, não flui não (2x)


                [A7M]
Com você eu sou mais
                [G#m7]
Mais que um dia mais
                [C#m7]
Com você eu sou exclusivamente um propósito
            [A7M]
Com você eu sou
            [G#m7]
Com você eu vou
         [C#m7]
Só com você eu sou quem realmente eu vim pra ser


             [A7M]           [F#m] [G#m7]
Pai eu só confio em Ti Uoooh
          [C#m7]           [G#m7]
Eu só confio em Ti,  Pai
[F#m]      [G#m7]  [A7M]          [F#m] [G#m7]
Pai   eu só confio em Ti Uoooh
            [C#m7] [G#m7]
Eu só confio em Deus


Encerramento
 [A7M]  [F#m]  [G#m7]  [C#m7]  [G#m7] [[F#m]  -  [G#m7]]', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/pai-eu-nao-confio-em-mim/)', 1792242293, 1792242293, 'C#');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (47, 1, 'Eu Sou Blindado', 'Thalles Roberto', 'Em', NULL, '[Em7]
Eu sou blindado pelo Sangue do Cordeiro,
           [Bm7]
E nem o inferno inteiro reunido,

Tem poder contra mim,

       [Em7]
Eu sou invisível na guerra,

Flecha na aljava de Deus,
           [Bm7]
E o inimigo se levanta contra mim,

E eu venço tudo,

tudo, tudo, tudo, tudo...


[Em7]
Eu sou blindado pelo Sangue do Cordeiro,
           [Bm7]
E nem o inferno inteiro reunido,

Tem poder contra mim,

       [Em7]
Eu sou invisível na guerra,

Flecha na aljava de Deus,
           [Bm7]
E o inimigo se levanta contra mim,

E eu venço tudo,

tudo, tudo, tudo, tudo...

[Em7]                     [Bm7]
Só na vigilância, Soldado na posição,
[Em7]
Guerra é guerra Amigo,
            [Bm7]
Joelho firme no chão,
[Em7]                   [Bm7]
O Inimigo foge não aguenta a pressão,
[Em7]                   [Bm7]
Por sete caminhos ele pode escolher.



TABS - Baixo
Recomendavel pra Baixo de 5 cordas, porem, aqui esta uma possivel tablatura pra baixo de 4 
cordas.
Ritmo: Groove

Primeira parte.
(Eu sou blindado...)
G|---7-9h-x------------7-9h-x------------2-4h-x------------2-4h-x---5-7--------------------- 
D|---------x-----------------x-----------------x-----------------x---5-7-------------------- 
A|----------x--5-7------------x--5-7-0-2--------x--------2--------x---3-5------------------- 
E|-0---------0-----3-0---------0-----------------x-3-4-5------------------------------------ 

(Só na vigilância...)

G|---7-9hp7-----------7-9hp7-----------2-4hp2-----------2-4hp2------------------------------ 
D|---------9p7--------------9p7---------------4p2--------------4p2-------------------------- 
A|-7---------------7-----------------2----------------2----------------2-2-3-3-3/12/0------- 
E|-------------7-10-------------3-5---------------3-5--------------3-5---------------------  
Segunda Parte
(Eu sou Blindado...)

G|---7-9h-x------------7-9h-x------------2-4h-x------------2-4h-x---5-7--------------------- 
D|---------x-----------------x-----------------x-----------------x---5-7-------------------- 
A|----------x--5-7------------x--5-7-0-2--------x--------2--------x---3-5------------------- 
E|-0---------0-----3-0---------0-----------------x-3-4-5------------------------------------ 

(Só na vigilância...)

G|---7-9hp7-----------7-9hp7-----------2-4hp2-----------2-4hp2------------------------------ 
D|---------9p7--------------9p7---------------4p2--------------4p2-------------------------- 
A|-7---------------7-----------------2----------------2----------------2-2-3-3-4-4-5-5------ 
E|-------------7-10-------------3-5---------------3-5--------------3-5---------------------- 

Essa parte da tablatura deve ser executada apos chegar o segundo "Eu sou blindado" da segunda 
parte da musica

G|---7-9h-x------12~~14-------x--7-9h-x--------x--2-4h-x------------------------------------ 
D|---------12-14h--------------x-------x--------x-------x----------------------------------- 
A|----------------------7-------x-------x----2---x-------x-0-2h-4-4-5-5--------------------- 
E|-0----------------------3-0------------4-5------------------------------------------------ 

(Só na vigilância...)

G|---7-9hp7-----------7-9hp7-----------2-4hp2-----------2-4hp2------------------------------ 
D|---------9p7--------------9p7---------------4p2--------------4p2-------------------------- 
A|-7---------------7-----------------2----------------2----------------2-2-3-3-4-4-5-5------ 
E|-------------7-10-------------3-5---------------3-5--------------3-5---------------------- 

Essa parte eh somente "O inimigo foge, nao aguenta a pressao."

G|---5/7-------------7-9hp7-----------2-4hp2-----------2-4hp2------------------------------- 
D|--------------------------9p7---------------4p2--------------4p2-------------------------- 
A|-7---------------7-----------------2----------------2----------------2-2-3-3-4-4-5-5------ 
E|------5-7---7-10-------------3-5---------------3-5--------------3-5----------------------- 

"Por 7 caminhos..."

G|---7-9hp7-----------7-9hp7-----------2-4hp2-----------2-4hp2------------------------------ 
D|---------9p7--------------9p7---------------4p2--------------4p2-------------------------- 
A|-7---------------7-----------------2----------------2----------------2-2-3-3-4-4-5-5------ 
E|-------------7-10-------------3-5---------------3-5--------------3-5----------------------', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/eu-sou-blindado/)', 1792242294, 1792242294, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (48, 1, 'Nada Além de Ti', 'Thalles Roberto', 'A', NULL, '[Intro] [A7M]  [D/B]

[Primera Parte]

 [A7M]                 [E/G#]
Se a vitória não consegues enxergar
[F#m7(11)]               [C#m7]             [D7M]  [C#m7]
Espera no Senhor e confia espera Ele vem
            [Bm7]    [D/E]      [A7M]   [D/B]
Confia Ele vem  e faz um milagre
[A7M]
  Se é tão impossível
 [E/G#]                [F#m7(11)]             [C#m7]
Parece que não dá espera no Senhor e confia
            [D7M]  [C#m7]
Espera Ele vem
         [Bm7]   [D/E]         [A7M]  [D/E]
Confia Ele vem e faz um milagre

[Estribillo]

[A7M]               [E9/G#]         [F#m7(4)/C#]
Oh Deus eu vim aqui só pra te dizer
               [Em7]     [A7]    [D7M]
Que minha esperança está em Ti
              [C#m7]       [Em7]   [A7]     [D7M]
Eu não tenho nada além, nada além de Ti
                 [C#m7]             [Bm7]
Nada além da promessa, da Sua promessa
              [A7M]    [Bm7(11)]
Eu não tenho nada,  na_da
              [A7M]  [Bm7(11)]
Eu não tenho nada

[Segunda Parte]

 [A7M]
Se sentindo sozinho
         [E/G#]
Coração cansado de clamar
[F#m7(11)]                [C#m7]
Espera no Senhor e confia
            [D7M]      [C#m7]            [Bm7]  [D/E]
Espera Ele vem (Ele vem), confia ele vem
               [A7M]  [D/E]
E faz um milagre
 [A7M]
Teu choro não é em vão
     [E9/G#]
Seu Deus contigo está
[F#m7(4)/C#]             [C#m7]
Espera no Senhor e confia
            [D7M] [C#m7]             [Bm7]  [D/E]
Espera Ele vem,       confia Ele vem
          [A7M]    [D/E]
E faz um milagre

[Estribillo]

[A7M]               [E9/G#]         [F#m7(4)/C#]
Oh Deus eu vim aqui só pra te dizer
               [Em7]     [A7]    [D7M]
Que minha esperança está em Ti
              [C#m7]       [Em7]  [A7]     [D7M]
Eu não tenho nada além, nada além de Ti
                 [C#m7]             [Bm7]
Nada além da promessa, da Sua promessa
              [A7M]    [Bm7(11)]
Eu não tenho nada,  na_da
              [A7M]  [Bm7(11)]
Eu não tenho nada

[A7M]               [E9/G#]         [F#m7(4)/C#]
Oh Deus eu vim aqui só pra te dizer
               [Em7]     [A7]    [D7M]
Que minha esperança está em Ti
              [C#m7]       [Em7]  [A7]     [D7M]
Eu não tenho nada além, nada além de Ti
                 [C#m7]             [Bm7]
Nada além da promessa, da Sua promessa
              [A7M]    [Bm7(11)]
Eu não tenho nada,  na_da
              [A7M]  [Bm7(11)]
Eu não tenho nada', 'Importada de CifraClub (https://www.cifraclub.com/thalles-roberto/nada-alem-de-ti/)', 1792242295, 1792242295, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (49, 1, 'Abre Mis Ojos Oh Cristo', 'Danilo Montero', 'E', NULL, '[Intro] [E]  [B/D#]  [A]  [E]

[Primera Parte]

[E]
Abre mis ojos oh Cristo
[B/D#]
Abre mis ojos Te pido
           [E/A]  [E]
Yo quiero ver__te
           [E/A]  [E]
Yo quiero ver__te

[E]
Abre mis ojos oh Cristo
[B/D#]
Abre mis ojos Te pido
           [E/A]  [E]
Yo quiero ver__te
           [E/A]  [E]
Yo quiero ver__te

[Estribillo]

          [B]           [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

                      [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

[Puente]

 [E]
Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te


Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te

[Primera Parte]

[E]
Abre mis ojos oh Cristo
[B/D#]
Abre mis ojos Te pido
           [E/A]  [E]
Yo quiero ver__te
           [E/A]  [E]
Yo quiero ver__te

[E]
Abre mis ojos oh Cristo
[B/D#]
Abre mis ojos Te pido
           [E/A]  [E]
Yo quiero ver__te
           [E/A]  [E]
Yo quiero ver__te

[Estribillo]

          [B]           [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

                      [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

[Puente]

 [E]
Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te


Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te

[Estribillo]

          [B]           [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

                      [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

          [B]           [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

          [B]           [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

[Puente]

 [E]
Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te


Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te


Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te

 [E]
Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te

[Estribillo]

          [B]           [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

                      [C#m]
Y contemplar Tu Majestad
[A]                       [B4]
Y el resplandor de Tu Gloria
    [B]                [C#m]
Derrama Tu amor y poder
           [A]
Cuando cantamos
           [B]
Santo, Santo

[Puente]

 [E]
Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo
           [E4]  [E]
Yo quiero ver_te


Santo, Santo, Santo
 [B/D#]
Santo, Santo, Santo
 [A]
Santo, Santo, Santo

Yo quiero verte

Yo quiero verte

Yo quiero verte', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/abre-mis-ojos-oh-cristo/)', 1792242295, 1792242295, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (50, 1, 'Hay Momentos', 'Danilo Montero', 'G', NULL, '[G]
  Hay momentos que
          [F]        [E7]
  No deberian terminar
  [Am7]           [Am/G]
  Hay segundos que
               [C]       [D4]
  Tendrian que ser eternidad
  [B/Eb]             [Em]     [B/Eb]
  Cuando tu espiritu señor
      [Dm]          [G/B]
  Se toca con el mio
  [C]         [Am]                  [C/D]
  Y mi corazon estalla en adoracion

      [G]
  Te amo mi señor
       [F]            [E7]
  Se acaban las palabras
   [Am]                [Cm7]
  Solo me queda mi alma
            [C]    [D]
  Para cantar---te

       [G]
  Te adoro mi señor
           [F]         [E]
  No hay nada alrededor
   [Am7]         [D]    [Em]
  Solo estamos tu y yo
   [Am7]         [D]    [C]   [Bm]  [Am] [C/D]
  Solo estamos tu y yo', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/hay-momentos/)', 1792242296, 1792242296, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (51, 1, 'Al Estar Aquí', 'Danilo Montero', 'F#m', NULL, '[Intro] [F#m7]  [E]  [D]  [A/C#]  [Bm7]  [D]
        [E4]  [E]  [A4]  [A]  [G]  [D/F#]
        [F6]  [E7(4/9)]  [E7(9-)]

[Primera Parte]

      [A]            [E/G#]           [F#m9]
Al estar en la presencia de Tu divinidad
             [D7M]         [Bm7]        [E]       [D/F#]
Y al contemplar la hermosura de Tu santidad
      [A]          [F5-]         [D]       [A/C#]
Mi espíritu se alegra en Tu majestad
     [Bm7]            [E7(4/9)]  [E]
Te adoro a Tí, te adoro a   Tí

[Segunda Parte]

        [A]          [E/G#]       [F#m9]      [C#m]
Cuando veo la grandeza de tu dulce amor
        [D7M]       [Bm7]        [E/G#]   [D/F#]
Y compruebo la pureza de Tu corazón
      [A]          [C#5+]        [D]       [A/C#]
Mi espíritu se alegra en Tu majestad
     [Bm7]            [E7(4/9)]  [E]
Te adoro a Tí, te adoro a   Tí

[Estribillo]

        [A4]    [A]
Y al estar aquí
   [F#m7]            [D4+]  [D]
Delante de Tí te adora_ré
     [A/C#]  [Bm7]
Postrado   ante Tí
                [E7(4/9)]  [E]
Mi corazón te adora oh Dios

             [A4]     [A]
Y siempre quiero estar
     [C#7(4/9-)]  [C#7(9-)]
Para ado_______rar
   [D]      [Bm7]    [Dm/F]
Y contemplar Tu santidad
     [A/E]         [E]        [E9-]
Te adoro a Tí Señor, te adoro a Tí

( [F]  [Dm]  [Am7(9)]  [D/F#]  [E/G#] )

[Primera Parte]

      [A]            [E/G#]           [F#m9]
Al estar en la presencia de Tu divinidad
             [D7M]         [Bm7]        [E]       [D/F#]
Y al contemplar la hermosura de Tu santidad
      [A]          [F5-]         [D]       [A/C#]
Mi espíritu se alegra en Tu majestad
     [Bm7]            [E7(4/9)]  [E]
Te adoro a Tí, te adoro a   Tí

[Segunda Parte]

        [A]          [E/G#]       [F#m9]      [C#m]
Cuando veo la grandeza de tu dulce amor
        [D7M]       [Bm7]        [E/G#]   [D/F#]
Y compruebo la pureza de Tu corazón
      [A]          [C#5+]        [D]       [A/C#]
Mi espíritu se alegra en Tu majestad
     [Bm7]            [E7(4/9)]  [E]
Te adoro a Tí, te adoro a   Tí

[Estribillo]

        [A4]    [A]
Y al estar aquí
   [F#m7]            [D4+]  [D]
Delante de Tí te adora_ré
     [A/C#]  [Bm7]
Postrado   ante Tí
                [E7(4/9)]  [E]
Mi corazón te adora oh Dios

             [A4]     [A]
Y siempre quiero estar
     [C#7(4/9-)]  [C#7(9-)]
Para ado_______rar
   [D]      [Bm7]    [Dm/F]
Y contemplar Tu santidad
     [A/E]         [E]
Te adoro a Tí Señor, te adoro a Tí

        [A4]    [A]
Y al estar aquí
   [F#m7]            [D4+]  [D]
Delante de Tí te adora_ré
     [A/C#]  [Bm7]
Postrado   ante Tí
                [E7(4/9)]  [E]
Mi corazón te adora oh Dios

             [A4]     [A]
Y siempre quiero estar
     [C#7(4/9-)]  [C#7(9-)]
Para ado_______rar
   [D]      [Bm7]    [Dm/F]
Y contemplar Tu santidad
     [A/E]         [E]
Te adoro a Tí Señor

     [E9-]    [F#m7]  [E]
Te adoro a Tí
     [Bm7]         [E]
Te adoro a Tí Señor
     [Bm7]  [Bm5-]      [F#m7]  [E]
Te ado________ro a Tí
     [Bm7]         [E]
Te adoro a Tí Señor
     [Dm]  [E7(4/9-)]  [E7(9)]       [A]
Te ado___________________ro a Tí', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/al-estar-aqui/)', 1792242297, 1792242297, 'F#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (52, 1, 'Bueno es alabar', 'Danilo Montero', 'G', NULL, '[Intro] [G]  [C]  [D]
        [G]  [C]  [D]
        [G]  [C]  [D]  [Am]  [D]

 [G]           [C]         [D]      [C/G]  [D]
Bueno es alabar, oh Señor, tu nombre
[G]             [C]            [D]  [C]       [D]
Darte gloria, honra y honor por siempre
 [G]           [C]       [D]
Bueno es alabarte Jesús
    [Em]            [D]
Y gozarme en tu poder

 [G]           [C]         [D]      [C/G]  [D]
Bueno es alabar, oh Señor, tu nombre
[G]             [C]            [D]  [C]       [D]
Darte gloria, honra y honor por siempre
 [G]           [C]       [D]
Bueno es alabarte Jesús
    [Em]              [D]
Y gozarme en tu poder

         [G]    [C]     [D]  [C/G]  [D]
Porque grande eres tú
  [G]      [C]      [D]     [C/G]
Grandes son tus obras
         [G]    [C]     [D]
Porque grande eres tú
              [Em7]
Grande es tu amor
               [D]
Grande es tu gloria

         [G]    [C]     [D]  [C/G]  [D]
Porque grande eres tú
  [G]      [C]      [D]     [C/G]
Grandes son tus obras
         [G]    [C]     [D]
Porque grande eres tú
              [Em7]
Grande es tu amor
               [D]
Grande es tu gloria

( [G]  [C]  [D] )
( [G]  [C]  [D] )
( [G]  [C]  [D] )
( [Em7]  [D] )

Porque grande eres tú

Grandes son tus obras

Porque grande eres tú

Grande es tu amor

Grande es tu gloria

         [G]    [C]     [D]  [C/G]  [D]
Porque grande eres tú
  [G]      [C]      [D]     [C/G]
Grandes son tus obras
         [G]    [C]     [D]
Porque grande eres tú
              [Em7]
Grande es tu amor
               [D]
Grande es tu gloria
  [G]         [D]          [G]
¡Bueno es alabarte Señor!', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/bueno-es-alabar/)', 1792242297, 1792242297, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (53, 1, 'Celebrad a Cristo', 'Danilo Montero', 'E', NULL, '[E]     [A]      [B]        [E]      [A]  [B] [EE]
Celebrad a Cristo, celebrad
[E]     [A]      [B]        [E]     [CC] [DD]
Celebrad a Cristo, celebrad
[E]     [A]      [B]        [E]     [A]   [B]  [E]
Celebrad a Cristo, celebrad
[E]     [A]      [B]        [E]
Celebrad a Cristo, celebrad

   [B]        [C#m]
Resucito  Resucito
       [B]            [C#m]
Y por siempre El Vivira
   [B]        [C#m]
Resucito  Resucito
         [B]
Vamos a celebrad
          [A]    [B]    [E]  [CC] -- [DD]
Que el Señor resucito

[F]     [Bb]    [C]       [F]       [Bb] [C] [F]
Celebrad a Cristo, celebrad
[F]     [Bb]    [C]       [F]       [Bb] [Eb]
Celebrad a Cristo, celebrad
[F]     [Bb]    [C]       [F]       [Bb] [C] [F]
Celebrad a Cristo, celebrad
[F]     [Bb]    [C]       [F]
Celebrad a Cristo, celebrad

   [C]        [Dm]
Resucito  Resucito
       [C]            [Dm]
Y por siempre El Vivira
   [C]        [Dm]
Resucito  Resucito
         [C]
Vamos a celebrad
          [Bb]    [C]    [F]
Que el Señor resucito', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/celebrad-a-cristo/)', 1792242298, 1792242298, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (54, 1, 'Revelación', 'Danilo Montero', 'E', NULL, '[Intro] [E]  [Bm7]  [D2]  [A2]
        [E]  [Bm7]  [D2]  [A2]

[Primera Parte]

[E]            [Bm7]           [A/C#]
  Digno es el   cordero santo
[D2]         [A2]
   Santo santo es él
[E]           [Bm7]             [A/C#]
  Lévantamos   nuestra alabanza
[D2]                   [A2]
   Al que en el trono está

[Estribillo]

[E]                    [Bm7]            [A/C#]
  Santo, santo, santo   Dios todopoderoso
[D2]                               [A2]
   Quien fue, quien es y quien vendrá
[E]                      [Bm7]                [A/C#]
  La creación hoy canta   y damos gloria a él
[D2]                      [A2]
   Tu eres digno por siempre y siempre

( [E]  [Bm7]  [D2]  [A2] )

[Segunda Parte]

[E]            [Bm7]             [A/C#]
  Digno es el   cordero santo
[D2]               [A2]
   Santo santo es él
[E]           [Bm7]              [A/C#]
  Lévantamos   nuestra alabanza
[D2]                    [A2]
   Al que en el trono está

[Estribillo]

[E]                    [Bm7]            [A/C#]
  Santo, santo, santo   Dios todopoderoso
[D2]                              [A2]
   Quien fue, quien es y quien vendrá
[E]                      [Bm7]                [A/C#]
  La creación hoy canta   y damos gloria a él
[D2]                  [A2]
  Tu eres digno por siempre y siempre

[E]                    [Bm7]            [A/C#]
  Santo, santo, santo   Dios todopoderoso
[D2]                              [A2]
   Quien fue, quien es y quien vendrá
[E]                      [Bm7]                [A/C#]
  La creación hoy canta   y damos gloria a él
[D2]                  [A2]
  Tu eres digno por siempre y siempre

( [F#m7]  [E/G#]  [C7]  [D9] )
( [E]  [D/F#]  [A/C#]  [C7]  [D9] )

[Puente]

[E]           [Bm7]              [A/C#]
  Lévantamos   nuestra alabanza
[D2]                   [A2]
   Al que en el trono está

[E]           [Bm7]              [A/C#]
  Lévantamos   nuestra alabanza
[D2]                   [A2]
   Al que en el trono está

[Estribillo]

[E]                    [Bm7]            [A/C#]
  Santo, santo, santo   Dios todopoderoso
[D2]                              [A2]
   Quien fue, quien es y quien vendrá
[E]                      [Bm7]                [A/C#]
  La creación hoy canta   y damos gloria a él
[D2]                  [A2]
  Tu eres digno por siempre y siempre

[E]                    [Bm7]            [A/C#]
  Santo, santo, santo   Dios todopoderoso
[D2]                              [A2]
   Quien fue, quien es y quien vendrá
[E]                      [Bm7]                [A/C#]
  La creación hoy canta   y damos gloria a él
[D2]                  [A2]
  Tu eres digno por siempre y siempre

[Final] [E]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/revelacion/)', 1792242298, 1792242298, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (55, 1, 'El Es El Rey', 'Danilo Montero', 'G', NULL, '[G]  [C]  [G]  [D]
[Em]                [C]
El es el rey infinito en poder
[Em]                   [C]
El es el rey de los cielos
[Em]            [C]
Sere para el siervo fiel
[G]                        [D]
Pues mi vida compro con su amor

[Em]                  [C]
El es el rey lo confiesa mi ser
[Em]                   [C]
El es el rey de los siglos
[Em]                     [C]
Mi vida la rindo a sus pies
[G]                     [D]
El es rey sobre mi corazon

[Em]            [C]
El es el rey, el es el rey
[G]            [D]
El es el rey de mi vida
[Em]            [C]
El es el rey, el es el rey
[G]             [D]
Reina con autoridad

[C]              [D]
Su reino eterno es
[Em]                [C]
Su trono en el cielo es
[Am]                 [D]                 [Em]
El es el rey que viene a su pueblo a llevar', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/el-es-el-rey/)', 1792242299, 1792242299, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (56, 1, 'Bendito Jesús', 'Danilo Montero', 'B', NULL, '[B]               [F#]                 [G#m]
Por tí es mi clamor, y sin ningun temor
                [F#]   [E]          [B]
En tí puedo confiar, Bendito Jesús
                [F#]                [G#m]
Hoy puedo escuchar, tú voz de sanidad
[F#]          [E]      [F#]            [B]
Restaurando mi ser, Bendito Jesús

[B]             [F#]             [D#/G]  [G#m]
Mi deseo eres tú, mi momento de amor
        [F#]        [E]       [F#]       [B]
La alegria de vivir, Bendito Jesús
                   [F#]                 [D#/G]  [G#m]
Eres mi fuente de amor, eres aire, y eres sol
      [F#]          [E]              [F#]
El latir del corazón, Bendito Jesús
[G#m]         [F#]           [E]
Bendito amor de mi Señor

[B]              [F#]               [G#m]
Tú gracia y favor, conmigo puedo ver
[F#]        [E]      [F#]      [E]         [B]
Llenando hoy mi ser, Bendito Jesús
                [F#]                   [G#m]
Y hoy mi voluntad, se rinde a tu verdad
 [F#]        [E]        [F#]      [E]         [B]
Tú amor y tu bondad, Bendito Jesús

[B]             [F#]             [D#/G]  [G#m]
Mi deseo eres tú, mi momento de amor
        [F#]        [E]       [F#]       [B]
La alegria de vivir, Bendito Jesús
                   [F#]                 [D#/G]  [G#m]
Eres mi fuente de amor, eres aire, y eres sol
      [F#]          [E]              [F#]
El latir del corazón, Bendito Jesús
[G#m]         [F#]           [E]
Bendito amor de mi Señor
[G#m]        [F#]           [E]
Bendito amor de mi Señor', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/bendito-jesus/)', 1792242300, 1792242300, 'B');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (57, 1, 'La Casa de Dios', 'Danilo Montero', 'D', NULL, '[Intro] [D]  [A]  [Bm]  [G]
        [D]  [A]  [G]

[Primera Parte]

[D]           [A]         [Bm]      [G]
Mejor es un día en la casa de Dios
     [D]        [A]       [Bm]    [G]
Que mil años lejos de Él
   [D]            [A]        [Bm]       [G]
Prefiero un rincón en la casa de Dios
     [D]        [A]           [Bm]
Que todo el palacio de un rey
    [D]         [A]           [G]
Que todo el palacio de un rey

[Estribillo]

        [D]                [A]
Ven conmigo a la casa de Dios
       [Bm]              [G]
Celebraremos juntos su amor
         [D]                   [A]           [G]
Haremos fiesta en honor de aquel que nos amó
           [D]               [A]
Estando aquí en la casa de Dios
      [Bm]            [G]
Alegraremos su corazón
         [D]                 [A]            [G]
Le brindaremos ofrendas de obediencia y amor
                 [D]
¡En la casa de Dios!

( [A]  [Bm]  [G] )
( [D]  [A]  [G]  [A] )

[D]        [A]    [Bm]        [G]
Arde mi alma, arde de amor
[D]             [A]         [Bm]   [G]
Porque el que me dio la vida
    [D]        [A]    [Bm]       [G]
Por eso le anhela mi corazón
  [D]        [A]      [Bm]
Anhela de su compañía
  [D]        [A]       [G]
Anhela de su compañía', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/la-casa-de-dios/)', 1792242300, 1792242300, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (58, 1, 'Te Alabare Mi Buen Jesus', 'Danilo Montero', 'E', NULL, '[Intro] [E]  [B]  [C#m7]  [A]
        [E]  [B9]  [C#m/G#]  [A9]

 [E9]            [B]
Eres tú la única razón de mi
 [C#m]  [C#m7]
Adoración
   [A]
Oh Jesús
[E]                  [B]          [C#m]
Eres tú la esperanza que anhele tener
   [A]
Oh Jesús

[F#m]                      [B]
Confié en ti me has ayudado
[F#m7]                    [B9]
Tu salvación me has regalado
[E]                   [B9]
Hoy hay gozo en mi corazón
[C#m7]                 [B]
Con mi canto te alabaré

 [E]       [B]    [C#m]       [A]
Te alabaré, te glorificaré
[E]       [B]    [C#m7]    [A]
Te alabaré mi buen Jesús

[E]        [A]             [E2]  [B]
En todo tiempo te alabaré
[E]        [A]             [B9]
En todo tiempo te adoraré', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/te-alabare-mi-buen-jesus/)', 1792242301, 1792242301, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (59, 1, 'Tu Hijo Soy', 'Barak', 'Em', NULL, '[Intro] [Em]  [C]  [G]

[Primera Parte]

   [Em]      [C]       [G]
Llamado escogido por Ti
   [Em]        [C]      [G]
Marcado yo vivo para Ti

[Pre-Estribillo]

              [Em]            [C]
Y aunque te falle mil veces
    [G]
Tu amor nunca falló
               [Em]           [C]
Y aunque corra muchas veces
         [D]
Tu me llamas y me dices

[Estribillo]

              [Em]  [C]  [G]
Que tu hijo soy
              [Em]  [C]  [G]
Que tu hijo soy

( [Em]  [C]  [G] )

         [Em]
Vuelvo a casa
     [C]
A mi casa
           [G]
Casa de mi Padre

             [Em]
Ya no hay tristeza
             [C]
Ya no hay vergüenza
              [G]
Todo lo haces nuevo

( [Em]  [C]  [G] )

[Final] [G]', 'Importada de CifraClub (https://www.cifraclub.com/barak/tu-hijo-soy/)', 1792242337, 1792242337, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (60, 1, 'Mi Gozo', 'Barak', 'A', NULL, '[Intro] [A/C#]  [D]  [A/C#]  [D]

[Tab - Intro]

Parte 1 de 3
  [A/C#]  [D]
E|-----------------------------------------------------| 
B|--------------------15-12-------------------15-12----| 
G|--------------------------14----------------------14-| 
D|-11-12--12-12-12-12----------12-12-12-12-12----------| 
A|-----------------------------------------------------| 
E|-----------------------------------------------------| 

Parte 2 de 3
E|-----------------------------------------------------| 
B|---------------------15--12--------------------------| 
G|-----------------------------14----------------------| 
D|-12--12--12--12--12---------------12--12--12--12--12-| 
A|-----------------------------------------------------| 
E|-----------------------------------------------------| 

Parte 1 de 3
  [A/C#]  [D]
E|-----------------------------------------------------| 
B|--------------------15-12-------------------15-12----| 
G|--------------------------14----------------------14-| 
D|-11-12--12-12-12-12----------12-12-12-12-12----------| 
A|-----------------------------------------------------| 
E|-----------------------------------------------------| 

Parte 3 de 3
                                               [A/C#]  [D]
E|-----------------------------------------------------| 
B|----------------15-12--------------------------------| 
G|----------------------14-----------------------------| 
D|-12-12-12-12-12-----------12--12--12--12--12--11--12-| 
A|-----------------------------------------------------| 
E|-----------------------------------------------------| 

[Primera Parte]

  [A/C#]    [D]               [Em]  [D]
Quien podrá separarme de ti  Dios
    [Bm]            [A]
Si aún cuando te fallo
        [G]
Aquí estás

     [D]                 [Em]   [D]
Tu amor sobre pasa barreras
     [Bm]
Que aún perdido
    [A]             [G]
Me dices tu hijo soy

[Pre-Estribillo]

      [A]              [Bm]
Ni lo alto ni lo profundo
     [G]
Me pueden alejar de ti

      [A]             [Bm]
Ninguna cosa en el mundo
     [G]
Me puede separar de ti

[Estribillo]

             [D]
Mejor es un día en tu casa
     [G]                 [Bm]
Que mil años lejos de ti Dios
   [F#m]           [G]
Tú eres mi gozo Dios

                [D]
En ti todo es nuevo
             [G]
Borras mi pasado
               [Bm]
Ya no hay tristeza
   [F#m]           [G]
Tú eres mi gozo Dios
   [Em]       [A/C#]  [D]       [A/C#]  [D]
Tú eres mi go____zo, Dios

[Segunda Parte]

[Tab - Riff 1]

E|-----------------------------------------------------| 
B|-----------------------------------------------------| 
G|-----------------------------------------------------| 
D|-----------2--4--5-----4-----------------------------| 
A|-----2--5--------------------5-----------------------| 
E|--5--------------------------------------------------| 

  [A/C#]    [D]               [Em]  [D]
Quien podrá separarme de ti  Dios
    [Bm]            [A]
Si aún cuando te fallo
        [G]
Aquí estás

 [A/C#]  [D/F#] (Riff 1)       [G]  [D]
Tu   amor   sobre pasa barre_ras
     [Bm]
Que aún perdido
    [A]             [G]
Me dices tu hijo soy

[Pre-Estribillo]

      [A]              [Bm]
Ni lo alto ni lo profundo
     [G]
Me pueden alejar de ti

      [A]             [Bm]
Ninguna cosa en el mundo
     [G]
Me puede separar de ti

[Estribillo]

             [D]
Mejor es un día en tu casa
     [G]                 [Bm]
Que mil años lejos de ti Dios
   [F#m]           [G]
Tú eres mi gozo Dios

                [D]
En ti todo es nuevo
             [G]
Borras mi pasado
               [Bm]
Ya no hay tristeza
   [F#m]           [G]
Tú eres mi gozo Dios
   [Em]         [Bm]
Tú eres mi gozo, Dios

[Interludio] [A/C#]  [G]  [Bm]
             [F#m]  [G]  [D]

[Puente]

Levanta tus manos, mueve tus pies
Da vueltas y vueltas, grita amén

Levanta tus manos, mueve tus pies
Da vueltas y vueltas, grita amén

   [A]                 [Bm]
Levanta tus manos, mueve tus pies
     [G]                  [D]
Da vueltas y vueltas, grita amén

   [A]                 [Bm]
Levanta tus manos, mueve tus pies
     [G]                  [D]
Da vueltas y vueltas, grita amén

   [A]                 [Bm]
Levanta tus manos, mueve tus pies
     [G]                  [D]
Da vueltas y vueltas, grita amén

   [A]                 [Bm]
Levanta tus manos, mueve tus pies
     [G]                  [D]
Da vueltas y vueltas, grita amén

[A]  [Bm]         [G]
      Grita amén
        [A]  [Bm]
Grita amén
        [G]
Grita amén

[Estribillo]

[Tab - Riff 2]

                              [G7]                    [D]
E|----------------------------------------------------| 
B|----------------------------5b6-----5b6--3h5--3~--3-| 
G|----------------------------------------------------| 
D|----------2--4--------------------------------------| 
A|----2--5--------5-----------------------------------| 
E|-5--------------------------------------------------| 

             [D]
Mejor es un día en tu casa
     [G]                 [Bm]
Que mil años lejos de ti Dios
   [F#m]           [G]
Tú eres mi gozo Dios

                [D]
En ti todo es nuevo
             [G]
Borras mi pasado
               [Bm]
Ya no hay tristeza
   [F#m]           [G]
Tú eres mi gozo Dios
   [Em]       [A/C#]  [D]       [A/C#]  [D]
Tú eres mi go____zo, Dios
 (Riff 2)  [G7]
Amén
        [D]
Grita amén

[Estribillo]

             [D]
Mejor es un día en tu casa
     [G]                 [Bm]
Que mil años lejos de ti Dios
   [F#m]           [G]
Tú eres mi gozo Dios

                [D]
En ti todo es nuevo
             [G]
Borras mi pasado
               [Bm]
Ya no hay tristeza
   [F#m]           [G]
Tú eres mi gozo Dios
   [Em]                 [D]
Tú eres mi gozo, Dios', 'Importada de CifraClub (https://www.cifraclub.com/barak/mi-gozo/)', 1792242338, 1792242338, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (61, 1, 'La Tierra Canta', 'Barak', 'Bm', NULL, '[Intro] [Bm]  [G]  [D]  [A]
        [Bm]  [G]  [D]  [A]

[Primera Parte]

   [Bm]
Se abren los cielos
      [G]                    [D]    [A]
Se escucha un sonido celestial
 [Bm]
Unido a la voces
       [G]                     [D]     [A]
De un pueblo que te quiere adorar

[Segunda Parte]

     [Bm]
El espíritu de Dios
    [G]                   [D]     [A]
Se mueve libre en este lugar
    [Bm]
El padre alegre esta
    [G]                      [D]      [A]
Al ver la novia unirse a adorar

[Estribillo]

[Bm]
La tierra canta
[G]
El cielo adora
[D]
Y todos gritan
[A]
Que tu eres santo

( [Bm]  [G]  [D]  [A] )

[Puente]

[Bm]
Ángeles se unen hoy
    [G]
Cantamos a una sola voz
 [D]      [A]
Santo, Santo', 'Importada de CifraClub (https://www.cifraclub.com/barak/la-tierra-canta/)', 1792242338, 1792242338, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (62, 1, 'Trae El Cielo Aquí', 'Barak', 'D', NULL, '[D]
Ángeles del cielo vengan a cantar
[Bm]
Se escuchen sus voces en este lugar
[G]
Aunque parezca locura, aunque sé que no es normal
        [Bm]       [A]
Por la fe sucederán

[D]
Cosas invisibles que nadie ha tocado
[Bm]
Sonidos del cielo que nadie ha escuchado
[G]
Cosas que no son normales, cosas sobrenaturales
        [Bm]      [A]
Por la fe sucederán

[G]                             [D]
Abre nuestros ojos como a Eliseo
                  [Bm]                  [A]
 Muéstranos el cielo, muéstranos el cielo

                [D]                       [A]
Inúndanos de tu gloria, inúndanos de tu gloria
            [Bm]                   [G]                [Bm]
Trae aquí el cielo, trae aquí el cielo, uoh-oh-oh

           [D]
Ante tu gloria demonios caen
          [A]                    [Bm]
Huye la muerte, ya no hay enfermedad
           [G]
El cielo aquí esta', 'Importada de CifraClub (https://www.cifraclub.com/barak/trae-el-cielo-aqui/)', 1792242338, 1792242338, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (63, 1, 'Espíritu Santo ven', 'Barak', 'Em', NULL, '[Intro] Em  D  C  B

[Primera Parte]

[Em]                           [D] [D9]
Estoy aquí, desesperado por ti
             [C]        [C9]             [B]
Con un corazón sediento, que espera beber
De ti
[C]
Cuando tu gloria desciende a un lugar
[D]
Toda la tierra tiene que adorar
[C]
Resucitan los muertos se sanan enfermos
[B]
Por tu poder
[C]
Queremos de ti llénanos de ti
[D]
Espíritu santo envuélvenos en ti
[C]                      [B]
Derrama tu gloria, Esperamos por ti

[Estribillo]

[Em]
Ven, ven, ven espíritu santo
[D]
Ven, ven, ven espíritu santo
[C]                            [B]
Ven, ven, ven llena este lugar', 'Importada de CifraClub (https://www.cifraclub.com/barak/espiritu-santo-ven/)', 1792242338, 1792242338, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (64, 1, 'Libre Soy', 'Barak', NULL, NULL, 'Intro

E|--------------------------------------------| 
B|-------10/8-------8-------------------------| 
G|--------------------9-------9-7----10-9-7---| 
D|--7-7--------7-7-------7-7----------0-0-0---| 
A|--------------------------------------------| 
E|--------------------------------------------| 

Intro II

E|------------15-15-15--------------| Esta figura se toca 
B|----------------------13-13-13----| sobre los tonos de  
G|--14-14-14------------------------| Am y F.             

E|------------15-15-15--------------|                      
B|----------------------13-13-13----| Y estos sobre C y G. 
G|--12-12-12------------------------|                      

Verso
...

E|--------------------------------------------| 
B|--10~------6~----8/5~----8/3~----5/8--10----| 
G|--------------------------------------------| 

...

E|--x-5-x-5-x-5-x-5-x-5-x-5-x-5-x-5--| este arreglo tiene ritmo reggae  
B|--x-5-x-5-x-5-x-5-x-6-x-6-x-6-x-6--| cada vez que cambia la figura es 
G|--x-5-x-5-x-5-x-5-x-5-x-5-x-5-x-5--| para un tono diferente           

E|--x-3-x-3-x-3-x-3-x-3-x-3-x-3-x-3--| se toca sobre              
B|--x-5-x-5-x-5-x-5-x-3-x-3-x-3-x-3--| los tonos de Am, F, C y G. 
G|--x-5-x-5-x-5-x-5-x-4-x-4-x-4-x-4--|                            

Pre Coro
Las cadenas...

E|------------------------------------| 
B|------------------------------------| 
G|------------------------------------| 
D|------------------------------------| 
A|--7--7--7-7--7--7--3--3--3-3--3--3--| 
E|--5--5--5-5--5--5--1--1--1-1--1--1--| 

E|------------------------------------| 
B|------------------------------------| 
G|------------------------------------| 
D|--5--5--5-5--5--5-------------------| 
A|--3--3--3-3--3--3--5--5--5-5--5--5--| 
E|-------------------3--3--3-3--3--3--| 

Coro
Me hiciste Libre y hoy puedo danzar...

E|------------15-15-15--------------| 
B|----------------------13-13-13----| 
G|--14-14-14------------------------| 

E|------------15-15-15--------------| 
B|----------------------13-13-13----| 
G|--12-12-12------------------------| 

Coro II
Aquí no se hace la melodía que hacía la guitarra al principio
Aquí solo se hace el ritmo reggae, escuchen la canción para entender

Pre Coro
Se hace lo mismo de hace rato

Coro
Se sigue haciendo la misma figura

Puente
Li Li Li Libre soy...

E|------------------------|                    
B|------------------------| está figura        
G|------------------------| siempre se utiliza 
D|-----------------0h2----| durante el Puente  
A|-----------3--5---------|                    
E|--5--5--5---------------|                    

Instrumental

E|------------15-15-15--------------| 
B|----------------------13-13-13----| 
G|--14-14-14------------------------| 

E|------------15-15-15--------------| 
B|----------------------13-13-13----| 
G|--12-12-12------------------------| 

E|-----------------------------------10--| 
B|--10--10-12-13-12-10------------10-----| 
G|----------------------12--10-12--------| 

E|------------15-15-15--------------| 
B|--13-13-13------------13-13-13----| 
G|----------------------------------| 

E|------------15-15-15--------------| 
B|----------------------13-13-13----| 
G|--12-12-12------------------------| 

Pre Coro
Las cadenas fueron rotas...
Misma figura

Coro
La misma figura

Final

E|------------15-15-15--------------| 
B|----------------------13-13-13----| 
G|--14-14-14------------------------| 

E|------------10---------12-12--17-17--| 
B|---------10-----13-13----------------| 
G|--10-12------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/barak/libre-soy/)', 1792242339, 1792242339, NULL);
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (65, 1, 'Tu eres rey', 'Barak', 'C#m', NULL, '[Intro]

 [C#m]  [A]  [E]  [B/D#]

[Primera Parte]

[C#m]                      [A]
Oh perfecto inigualable Dios
                [E]               [B/D#]
Amor inexplicable, tu reino inigualable
[C#m]                   [A]
Asombroso coronado estas
                   [E]                       [B/D#]
En tu trono de victoria, vestido estas de Gloria

        [C#m]                          [A]
Por los siglos de los siglos, tu reino se establecerá
           [E]                               [B/D#]
Digno De gloria, digno de honor, digno de toda adoración

[Estribillo]

      [C#m]            [A]            [E]            [B/D#]
Tu eres Rey, tu eres Rey, tu eres Reeeeey-

[C#m]                       [A]
Oh perfecto inigualable Dios
                [E]               [B/D#]
Tu amor inexplicable, tu reino incomparable
[C#m]                   [A]
Asombroso coronado estas
                   [E]                        [B/D#]
En tu trono de victoria, vestido estas de Gloria

        [C#m]                          [A]
Por los siglos de los siglos, tu reino se establecerá
           [E]                              [B/D#]
Digno De gloria, digno de honor, digno de toda adoración

[Estribillo]

        [C#m]            [A]            [E]            [B/D#]
Tu eres Rey, tu eres Rey, tu eres Reeeeey-

[Puente]

[C#m]                        [A]
Hoy perfumamos tu trono, hoy perfumamos tu trono
[E]                          [B/D#]
Hoy perfumamos tu trono, recibe alabanza', 'Importada de CifraClub (https://www.cifraclub.com/barak/tu-eres-rey/)', 1792242339, 1792242339, 'C#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (66, 1, 'A Danzar', 'Barak', 'C#m', NULL, '[Intro] [C#m]

      [C#m]   [A]              [E]
A Danzar delante de su presencia
     [B]                   [C#m]
Su amor es quien nos sustenta
        [A]           [E]         [B]
El es Dios El es quien resucito

( [C#m]  [A]  [E]  [B] )
( [C#m]  [A]  [E]  [B] )

[Primera Parte]

                     [C#m]
Da un paso al frente
                   [C#m]
Has algo diferente
                         [A]
Demos toda gloria a Jesús
                 [C#m]                 [C#m]
Levanta tus manos ¡Grita que el es Santo!
                                [A]
Es El gran yo soy murió en la cruz

[Puente]

[B]
Si tu respiras tienes que adorar
[A]
Que nada te impida danzar

[Estribillo]

      [C#m]   [A]              [E]
A Danzar delante de su presencia
     [B]                   [C#m]
Su amor es quien nos sustenta
        [A]           [E]         [B]
El es Dios El es quien resucito

      [C#m]    [A]             [E]
A danzar a Dios vamos adorar
     [B]                 [C#m]
Su amor hay que celebrar
        [A]           [E]         [B]
El es Dios El es quien resucito

( [C#m]  [A]  [E]  [B] )
( [C#m]  [A]  [E]  [B] )
( [C#m]  [A]  [E]  [B] )
( [C#m]  [A]  [E]  [B] )

[Primera Parte]

                     [C#m]
Da un paso al frente
                   [C#m]
Has algo diferente
                         [A]
Demos toda gloria a Jesús
                 [C#m]                 [C#m]
Levanta tus manos ¡Grita que el es Santo!
                                [A]
Es El gran yo soy murió en la cruz

[Puente]

[B]
Si tu respiras tienes que adorar
[A]
Que nada te impida danzar

[Estribillo]

      [C#m]   [A]              [E]
A Danzar delante de su presencia
     [B]                   [C#m]
Su amor es quien nos sustenta
        [A]           [E]         [B]
El es Dios El es quien resucito

      [C#m]    [A]             [E]
A danzar a Dios vamos adorar
     [B]                 [C#m]
Su amor hay que celebrar
        [A]           [E]         [B]
El es Dios El es quien resucito
            [E]
A Danzar delante de su presencia
     [B]                   [C#m]
Su amor es quien nos sustenta
        [A]           [E]         [B]
El es Dios El es quien resucito

      [C#m]    [A]             [E]
A danzar a Dios vamos adorar
     [B]                 [C#m]
Su amor hay que celebrar
        [A]           [E]         [B]
El es Dios El es quien resucito

      [C#m]   [A]              [E]
A Danzar delante de su presencia
     [B]                   [C#m]
Su amor es quien nos sustenta
        [A]           [E]         [B]
El es Dios El es quien resucito', 'Importada de CifraClub (https://www.cifraclub.com/barak/a-danzar/)', 1792242339, 1792242339, 'C#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (67, 1, 'Dios Háblame', 'Barak', 'D', NULL, '[Intro] [D]  [F#m]  [D]  [F#m]  [D]  [F#m]  [E]

   [A]                        [E]
Si notas que aprendí andar solo
    [F#m]                          [D]
Si notas que aprendí a vivir sin ti
         [A]                    [E]
Si notas algo así que solo dependo de mí
   [A]                        [E]
Si notas que las cosas importantes
   [F#m]                      [D]
 Perdí por hacer todo a mi modo
           [A]                  [E]
Si notas algo así que solo dependo de mí
  [F#m]     [A]       [D]  [A] [Bm]     [A]                [E]
Corrígeme y hazme ver, hazme saber que no estoy bien

[Estribillo]

     [A]
Háblame
                [F#m]
No me dejes continuar

                       [D]
Háblame que es por mi bien
                  [F#m]                [E]
Háblame y hazme saber que yo estoy mal
     [A]                    [F#m]                       [D]
Háblame por favor corrígeme y aunque duela hazme volver
                   [F#m]     [E]           [A]              [F#m]
Al camino donde un día camine. "Dios háblame"

 [A]                      [E]        [F#m]
Si me vez preocupado por pensar en tantas cosas
              [D]                [A]                [E]
Que quiero lograr si solo piensó en mi, si ya no pienso en ti
     [A]                        [E]       [F#m]                       [D]
Si notas que la fama me hizo cambiar y ves que no soy el mismo al hablar
              [A]               [E]      [F#m]     [A]           [D]
Si notas algo así no me dejes seguir corrígeme y hazme ver
[Bm]        [A]             [E]
 Hazme saber que no estoy bien

[Estribillo]

     [A]
Háblame
                [F#m]
No me dejes continuar
                       [D]
Háblame que es por mi bien
                  [F#m]                [E]
Háblame y hazme saber que yo estoy mal
     [A]                    [F#m]                       [D]
Háblame por favor corrígeme y aunque duela hazme volver
                       [E]       [A]
Al camino donde un día camine Dios hablame

[Puente]

 [F]                            [G]
Muchos se han olvidado que la gloria es para ti
[F]              [Dm]              [E]
Pero si eso me pasa a mi yo prefiero
                 [F]
No seguir,  no seguir

[Estribillo]

    [Bb]
Háblame
                [Gm]
No me dejes continuar
                       [Eb]
Háblame que es por mi bien
                  [Gm]                [F]
Háblame y hazme saber que yo estoy mal
    [Bb]                 [Gm]                          [Eb]
Háblame por favor corrígeme y aunque duela hazme volver
                  [Gm]    [F]      [Bb]
Al camino donde un día camine Dios hablame', 'Importada de CifraClub (https://www.cifraclub.com/barak/dios-hablame/)', 1792242339, 1792242339, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (68, 1, 'Cantaremos de tu amor', 'Barak', 'Gm', NULL, '[Gm]         [D#]       [A#]
  Me salvaste, me diste vida
[Gm]          [D#]          [A#]
  Mi tristeza en ti es alegria
[Gm]        [D#]        [A#]
  Tu sanaste todas mis heridas
[Gm]          [D#]          [A#]
  A este mundo, tu eres la salida

  [Gm]          [A#]       [D#]    [Gm]
Tu cruz fue el remedio que mi vida salvo
  [Gm]      [A#]     [D#]     [F]       [F]
Con sangre pagaste por mi rebelión .... (DIOS)

[Estribillo]

  [Gm]      [D#]      [A#]
Cantaremos de tu gran amor
  [Gm]      [D#]      [A#]
De tu misericordia, Señor
     [Cm]      [A#/D]         [D#]
Te damos gloria, A ti te adoraremos
  [Gm]        [D#]     [F]
De ti proclamaremos, Que tu eres
    [Gm]       [D#]   [A#]
Se - ñor oooooooh ooooooh

[Gm]        [D#]        [A#]
  Tu sanaste todas mis heridas
[Gm]          [D#]          [A#]
  A este mundo, tu eres la salida

  [Gm]          [A#]       [D#]    [Gm]
Tu cruz fue el remedio que mi vida salvo
  [Gm]      [A#]     [D#]     [F]       [F]
Con sangre pagaste por mi rebelión .... (DIOS)

[Estribillo]

  [Gm]      [D#]      [A#]
Cantaremos de tu gran amor  Uooooh oh Uooooh oh
  [Gm]      [D#]      [A#]
De tu misericordia, Señor   Uooooh oh Uooooh oh
  [Gm]      [D#]      [A#]
Cantaremos de tu gran amor  Uooooh oh Uooooh oh
  [Gm]      [D#]      [A#]
De tu misericordia, Señor   Uooooh oh Uooooh oh
     [Cm]      [A#/D]         [D#]
Te damos gloria, A ti te adoraremos
  [Gm]        [D#]     [F]
De ti proclamaremos, Que tu eres
    [Gm]       [D#]   [A#]
Se - ñor oooooooh ooooooh
 [Dm]
Que tu eres
    [Gm]       [D#]   [Dm]
Se - ñor oooooooh ooooooh

[Interludio] [Gm]  [D#]  [F]

[Estribillo]

    [Cm]      [A#/D]        [D#]
Te damos gloria, A ti te adoraremos
  [Gm]        [D#]     [F]
De ti proclamaremos, Que tu eres  . . . Señor
 [Gm]     [D#]     [A#]
Cantaremos de tu gran amor  ¡Si Señor!
  [Gm]      [D#]      [A#]
De tu misericordia, Señor   ¡Cantaremos por siempre padre!
  [Gm]      [D#]      [A#]
Cantaremos de tu gran amor  Uooooh oh Uooooh oh
  [Gm]      [D#]      [A#]
De tu misericordia, Señor   Uooooh oh Uooooh oh
     [Cm]     [A#/D]         [D#]
Te damos gloria, A ti te adoraremos
  [Gm]        [D#]     [F]
De ti proclamaremos, Que tu eres
    [Gm]       [D#]   [A#]
Se - ñor oooooooh ooooooh
 [Dm]
Que tu eres
    [Gm]       [D#]   [A#]
Se - ñor oooooooh ooooooh
        [Gm]
¡Eres DIGNO SEÑOR Ohh ohhh!', 'Importada de CifraClub (https://www.cifraclub.com/barak/cantaremos-de-tu-amor/)', 1792242340, 1792242340, 'Gm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (69, 1, 'Quién Más (part. Waleska Morales)', 'Gateway Worship Español', 'G', NULL, '[Primera Parte]

          [G]                   [D4]
Un instrumento soy de exaltación
        [Em7]        [D11]         [C9]
Y yo nací para tu nombre levantar
            [G]                     [D4]
Tú escuchas el cantar de la creación
          [Em7]            [D11]      [C9]
Mas hay una canción que yo te puedo dar

[Estribillo]

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

[Segunda Parte]

          [G]           [D9(11)]
Dios infinito, eres eterno
         [Em7]       [D]           [C9]
Mas escogiste habitar en mi interior
         [G]                      [D]
Sanaste mi dolor, tu gloria he visto
          [Em7]         [D]        [C9]
Con gratitud yo cantaré en adoración

[Estribillo]

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

[Tercera Parte]

    [C9]
Cordero ungido, reinará
       [D2]
Quien fue, quien es y quien vendrá
    [Em7]
Sentado en el trono está
 [G]      [D/F#]
Santo, santo

  [C9]
Siendo justo se entregó
       [D2]
Cuán grande amor nos demostró
[Em7]
Exaltado en majestad
 [G]      [D/F#]
Santo, santo

    [C9]
Cordero ungido, reinará
       [D2]
Quien fue, quien es y quien vendrá
    [Em7]
Sentado en el trono está
 [G]      [D/F#]
Santo, santo

  [C9]
Siendo justo se entregó
       [D2]
Cuán grande amor nos demostró
[Em7]
Exaltado en majestad
 [G]      [D/F#]
Santo, santo

    [C9]
Cordero ungido, reinará
       [D2]
Quien fue, quien es y quien vendrá
    [Em7]
Sentado en el trono está
 [G]      [D/F#]
Santo, santo

  [C9]
Siendo justo se entregó
       [D2]
Cuán grande amor nos demostró
[Em7]               [D]
Exaltado en majestad

[Estribillo 2]

[Tab - Refrão 2 - 2x]

   [G]               [Am7]            [Em7]            [C9]
E|-------------------------------------------------| 
B|-8-10-X----------8-10-X----------8-10-X----------| 
G|--------7-5--4----------7-5--4----------7-5--4---| 
D|-------------------------------------------------| 
A|-------------------------------------------------| 
E|-------------------------------------------------| 

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

        [Em7]              [C9]
No hay nadie, solo Tú, Cristo
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

[Interludio] [G]  [Am7]  [Em7]  [C9]

[Tab - Interlúdio - Delay em colcheia - 136 BPM]

E|-8--7--------------------------------------------| 
B|-------10--8-------------------------------------| 
G|--------------9--7-------------------------------| 
D|--------------------10--9------------------------| 
A|-------------------------------------------------| 
E|-------------------------------------------------| 

[Cuarta Parte]

         [C9]             [D2]
Tu eres digno, Tu eres digno
           [Em7]
Y tu eres digno
               [G]            [D/F#]
Te recibí la gloria y el honor

         [C9]             [D2]
Tu eres digno, Tu eres digno
           [Em7]
Y tu eres digno
               [G]            [D/F#]
Te recibí la gloria y el honor

         [C9]             [D2]
Tu eres digno, Tu eres digno
           [Em7]
Y tu eres digno
               [G]            [D/F#]
Te recibí la gloria y el honor

         [C9]             [D2]
Tu eres digno, Tu eres digno
           [Em7]
Y tu eres digno
               [G]            [D/F#]
Te recibí la gloria y el honor

         [C9]             [D2]
Tu eres digno, Tu eres digno
           [Em7]
Y tu eres digno
               [G]            [D/F#]
Te recibí la gloria y el honor

         [C9]             [D2]
Tu eres digno, Tu eres digno
           [Em7]
Y tu eres digno
               [G]            [D/F#]
Te recibí la gloria y el honor

         [C9]
Tu eres digno

Tu eres digno, Tu eres digno
         [D]
Tu eres digno, Tu eres digno
         [Em7]
Tu eres digno
               [G]          [D/F#]
Te recibí la gloria y el honor

[Tercera Parte]

    [C9]
Cordero ungido, reinará
       [D2]
Quien fue, quien es y quien vendrá
    [Em7]
Sentado en el trono está
 [G]      [D/F#]
Santo, santo

  [C9]
Siendo justo se entregó
       [D2]
Cuán grande amor nos demostró
[Em7]
Exaltado en majestad
 [G]      [D/F#]
Santo, santo

    [C9]
Cordero ungido, reinará
       [D2]
Quien fue, quien es y quien vendrá
    [Em7]
Sentado en el trono está
 [G]      [D/F#]
Santo, santo

  [C9]
Siendo justo se entregó
       [D2]
Cuán grande amor nos demostró
[Em7]
Exaltado en majestad
 [G]      [D/F#]
Santo, santo

[Estribillo Final]

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

                 [G]
Quién más es digno
                 [Am7]
Quién más es digno
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo

        [Em7]              [C9]
No hay nadie, solo Tú, Cristo
        [Em7]              [C9]
No hay nadie, solo Tú, Cristo', NULL, 1792246512, 1792246512, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (70, 1, 'Acercame', 'Maverick City Music', 'D', NULL, '[D] [F#m] [E]

[Letra de "Acércame"]


[Intro: Johnny Peña]

 [D] [F#m] [E]
Acércame, Señor
 [D] [F#m] [E]
Quiero sentirte, Cristo
  [D] [F#m] [E]
Acércame, hoy


[Verso 1: Johnny Peña]

        [D]   [F#m]     [E]
Nada quiero si Tú no estás
        [D]    [F#m]     [E]
Mi deseo en Ti habitar
        [D]   [F#m]     [E]
Has cambiado mi corazón
       [C#m]     [D]               [F#m]     [E]
No me puedo alejar
       [D]
Nada quiero
      [F#m]    [E]
Y nada quiero si Tú no estás
                  [D]          [F#m]  [E]
(Mi deseo) Mi deseo en Ti habitar
         [D]     [F#m]   [E]
Has cambiado mi corazón
    [C#m]    [D]       [F#m]  [E]
No me puedo alejar


[Coro: Johnny Peña]

    [A]        [E]
Acércame, Señor
     [F#m]
Quiero sentirte
       [D]
Quiero sentirte
        [A]     [E]
Acércame, Señor
        [F#m]
Quiero oírte
        [D]
Quiero oírte
        [A]
Más y más
     [E]        [F#m]
Quiero sentirte, más y más
             [D]
Oh, Sеñor


[Verso 2: Johnny Peña, Johnny Peña y Laila Olivera]

    [D]           [F#m]  [E]
He probado que Tú erеs bueno
      [D]         [F#m]  [E]
Y he visto que Tú estás aquí
        [D]
Te estás moviendo
       [F#m]     [E]
Me entrego Señor
        [C#m]       [D]
No me puedo alejar
      [F#m]      [E]
No me puedo alejar, oh


[Coro: Johnny Peña y Laila Olivera, (Johnny Peña)]

        [A]     [E]
Acércame, Señor
       [F#m]
Quiero sentirte
         [D]
Quiero sentirte
         [A]     [E]
Acércame, Señor
           [F#m]
(Quiero) Quiero oírte
         [D]
Quiero oírte
              [A]    [E]
(Acércame) Acércame, Señor
             [F#m]
(Quiero) Quiero sentirte
                [D]
(Quiero) Quiero sentirte
               [A]    [E]
(Acércame) Acércame, Señor
     [F#m]
Quiero oírte
       [D]
Quiero oírte
          [A]
Más y más


[Espontánea: Johnny Peña, (Laila Olivera)]

       [E]             [F#m]
Quiero sentirte (Más y más)
         [D]            [A]
Tu presencia (Más y más)
          [E]           [F#m]
Quiero sentir Dios (Más y más)
           [D]            [A]
No hay nada como Tú (Más y más)
         [E]                [F#m]
Oh y quiero, quiero sentirte (Más y más)
          [D]                  [A]
Oh y quiero, quiero oírte (Más y más)
           [E]              [F#m]              [D]
Sí, Señor, sí, Señor (Más y más)


[Puente: Johnny Peña, Johnny Peña y Laila Olivera]

  [D]          [F#m]    [E]
Rindo mi vida hasta el fin
  [D]          [F#m]   [E]
Nada reservo de Ti
     [D]
Toma completo
     [F#m]      [E]       [C#m]    [D]
Lo que yo soy, no me quiero alejar
      [F#m]     [E]
Oh, me rindo
        [D]       [F#m]     [E]
Rindo mi vida hasta el fin
                    [D]       [F#m]   [E]
(Nada reservo) Nada reservo de Ti
                    [Bm]
(Toma, toma) Toma completo
       [F#m]       [E]       [C#m]    [D]     [F#m] [E]
Lo que yo soy, no me quiero alejar
        [D]
Oh, rindo mi vida
         [F#m]   [E]
Rindo mi vida hasta el fin
          [D]      [F#m]      [E]
Nada reservo de Ti (Oh, Señor)
         [D]
Toma completo
          [F#m] [E]      [C#m]        [D]            [F#m] [E]
Lo que yo soy, no me quiero alejar (Oh)
            [D]        [F#m]    [E]
Rindo mi vida hasta el fin
           [D]   [F#m]  [E]
Nada reservo de Ti
          [D]
Toma completo
         [F#m] [E]        [C#m]  [D]
Lo que yo soy, no me quiero alejar
             [F#m]    [E]
No me quiero alejar


[Coro: Johnny Peña y Laila Olivera, (Johnny Peña)]

       [A]       [E]
Acércame, Señor
         [F#m]
Quiero sentirte
          [D]
Quiero sentirte
               [A]      [E]
(Acércame) Acércame, Señor
      [F#m]
Quiero oírte
       [D]
Quiero oírte
       [A]     [E]
Acércame, Señor
        [F#m]
Quiero sentirte
           [D]
Yo quiero sentirte
       [A]    [E]
Acércame, Señor
      [F#m]
Quiero oírte
       [D]          [A]
Quiero oírte, más y más', NULL, 1792246600, 1792246600, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (71, 1, 'Dios de Mi Vida', 'Thalles Roberto', 'Dm', NULL, '[Intro] [Dm]  [Bb]  [Dm]  [Bb]
        [Dm]  [Bb]  [Dm]  [Bb]

[Primera Parte]

[Dm]     [Bb]
Dios mío
[Dm]     [Bb]
Padre mío
[Dm]      [Bb]
Amor mío
[Dm]           [Bb]
Todo, la razón de todo
[Dm]     [Bb]
Dios mío
[Dm]     [Bb]
Aire, mío
[Dm]          [Bb]
Faro, faro que
[Dm]            [Bb]
Necesito, te necesito

[Pre-Estribillo]

     [Dm]                       [G]
Necesito Dios sentirte en mi vida
    [Dm]                           [G]
Y mira hacia tu luz, para no perderme
      [Dm]                  [G]
Mi Señor, tú eres mi alegría
           [Bb]
¡Te necesito!

[Estribillo]

             [Bb]
Dios de mi vida
    [C]       [Dm]
Camina conmigo
            [Bb]       [C]       [Dm]
Soy tu morada ven, vive en mí
          [Bb]      [C]       [Dm]
Déjame decir lo que necesito Dios
      [Bb]
¡Necesito del Señor!

[Solo] [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]

[Primera Parte]

[Dm]     [Bb]
Dios mío
[Dm]     [Bb]
Padre mío
[Dm]      [Bb]
Amor mío
[Dm]           [Bb]
Todo, la razón de todo
[Dm]     [Bb]
Dios mío
[Dm]     [Bb]
Aire, mío
[Dm]          [Bb]
Faro, faro que
[Dm]            [Bb]
Necesito, te necesito

[Pre-Estribillo]

     [Dm]                       [G]
Necesito Dios sentirte en mi vida
    [Dm]                           [G]
Y mira hacia tu luz, para no perderme
      [Dm]                  [G]
Mi Señor, tú eres mi alegría
           [Bb]
¡Te necesito!

[Estribillo]

             [Bb]
Dios de mi vida
    [C]       [Dm]
Camina conmigo
            [Bb]       [C]       [Dm]
Soy tu morada ven, vive en mí
          [Bb]      [C]       [Dm]
Déjame decir lo que necesito Dios
      [Bb]
¡Necesito del Señor!

[Solo] [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]
       [Bb]  [C]  [Dm]  [Bb]

[Estribillo]

             [Bb]
Dios de mi vida
    [C]       [Dm]
Camina conmigo
            [Bb]       [C]       [Dm]
Soy tu morada ven, vive en mí
          [Bb]      [C]       [Dm]
Déjame decir lo que necesito Dios
      [Bb]
¡Necesito del Señor!', NULL, 1792246652, 1792246652, 'Dm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (72, 1, 'Grita! (part. Lakewood Music)', 'Thalles Roberto', 'Dm', NULL, '[Intro] [Dm]  [C]  [Dm]  [C]  [Gm]  [F]
        [Dm]  [C]  [Dm]  [C]  [Gm]  [F]

[Primera Parte]

[Dm]                           [Dm]  [C]  [Dm]  [C]  [Gm]  [F]
Me encontro em frente a Jericó
[Dm]                           [Dm]  [C]  [Dm]  [C]  [Gm]  [F]
Terra que meu pai me entregou

[Pre-Estribillo]

[Bb]
Se me prometeu, eu vou crer
[Gm]
Meu inimigo eu enfrentarei
[Em]
Não me renderei
    [A]
Até a vitória ver

[Estribillo]

[Dm]
Grita e as muralhas cairão
[Dm]
Grita e todas cairão
[Dm]
Grita e as muralhas cairão
[Dm]
Grita e todas cairão

Todas cairão

[Intro] [Dm]  [C]  [Dm]  [C]  [Gm]  [F]
        [Dm]  [C]  [Dm]  [C]  [Gm]  [F]

[Segunda Parte]

[Dm]                           [Dm]  [C]  [Dm]  [C]  [Gm]  [F]
Revestido estou com seu poder
[Dm]                           [Dm]  [C]  [Dm]  [C]  [Gm]  [F]
E a todo gigante eu derrotarei

[Pre-Estribillo]

[Bb]
Deus Luta por mim não temerei
[Gm]
O Meu inimigo eu enfrentarei
[Em]
Não me renderei
    [A]
Até a vitória ver

[Estribillo]

[Dm]
Grita e as muralhas cairão
[Dm]
Grita e todas cairão
[Dm]
Grita e as muralhas cairão
[Dm]
Grita e todas cairão

Todas cairão

( [Dm]  [C]  [F]  [Gm] )

[Puente]

[Dm]        [C]         [F]
Resgatei, resgatei, resgatei
     [Gm]
Tudo que me roubou
[Dm]        [C]         [F]
Resgatei, resgatei, resgatei
     [Gm]
Tudo que me roubou
[Dm]        [C]         [F]
Resgatei, resgatei, resgatei
     [Gm]
Tudo que me roubou
[Dm]        [C]         [F]
Resgatei, resgatei, resgatei
     [Gm]
Tudo que me roubou
[Dm]        [C]         [G/B]
Resgatei, resgatei, resgatei
     [Bb]
Tudo que me roubou
[Dm]        [C]         [G/B]
Resgatei, resgatei, resgatei
     [Bb]
Tudo que me roubou

[Estribillo]

[Dm]
Grita e as muralhas cairão
[Dm]
Grita e todas cairão
[Dm]
Grita e as muralhas cairão
[Dm]
Grita e todas cairão

Todas cairão

[Puente]

[Dm]        [C]         [G/B]
Resgatei, resgatei, resgatei
     [Bb]
Tudo que me roubou
[Dm]        [C]         [G/B]
Resgatei, resgatei, resgatei
     [Bb]
Tudo que me roubou
[Dm]
Grita', NULL, 1792247934, 1792247934, 'Dm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (73, 1, 'Todo Poderoso', 'Danilo Montero', 'Bm', NULL, '[Intro] [Bm]

[Primera Parte]

   [Bm]                [G6]
La unica razon de mi adoracion
[D2]             [A9]
Eres tu mi Jesús
   [Bm]            [G6]
El unico motivo para vivir
[D2]              [A9]
Eres tu mi Señor
      [Bm9]         [G9]
Mi unica verdad esta en ti
        [D2]           [A9]  ([Cb13])
Eres mi luz y salvacion
      [Bm9]          [G6]
Mi unico amor eres tu Señor
        [D2]             [A9]  [A]
Y por siempre te alabare

[Estribillo]

     [Bm9]       [G]
Eres todo poderoso eres
[D]              [A9] ([F/Bb])
Grande y majestuoso
     [Bm]         [G]
Eres fuerte invensible
      [D]          [A]
Y no hay nadie como tu

[Final] [Bm]  [G]  [D]  [A9]
        [Bm/A]  [G6]  [D2]  [D4]  [A9]  [A2]
        [B5]  [Bm]  [G]  [D11/F#]  [A]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/todo-poderoso/)', 1792249441, 1792249441, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (74, 1, 'La Unica Razon', 'Danilo Montero', 'Bm', NULL, '[Intro] [Bm]  [A]  [D]  [G]
        [Bm]  [A]

[Bm]                   [G]          [D]           [A]
La única razón de mi adoración  eres tú mi jesús
[Bm]                   [G]       [D]         [A]
El único motivo para vivir eres tú mi señor
[Bm]              [G]          [D]                 [A]
Mi única verdad está en ti eres mi luz y mi salvación
[Bm]                 [G]              [D]            [A]
Mi único amor eres tu mi señor y por siempre te alabaré

[Bm]           [G]         [D]            [A]
Tú eres todo poderoso eres grande y majestuoso
[Bm]           [G]            [D]            [A]
Eres fuerte invencible y no hay nadie como tú', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/la-unica-razon/)', 1792249442, 1792249442, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (75, 1, 'Te Alabaré', 'Danilo Montero', 'D', NULL, '[Intro] [D]  [A]  [Bm]


[D]          [A]                [Bm]          [G]
Eres tú la única razón de mi adoración oh Jesús
[D]            [A]               [Bm]          [G]
Eres tu la esperanza que anhele tener oh Jesús
[Em]               [A]             [Em]               [A]
Confié en ti me has ayudado    tu salvación me has regalado
[D]                  [A]             [G]        [A]
Hoy hay gozo en mi corazón con mi canto te alabare

[Estribillo]

[E]    [B]         [C#m]         [A]     [E]           [B]       [A]
Te alabare;    te glorificare;   te alabare mi buen Jesús
[E]    [B]         [C#m]         [A]     [E]           [B]       [A]
Te alabare;    te glorificare;   te alabare mi buen Jesús

[D]          [A]                [Bm]          [G]
Eres tú la única razón de mi adoración oh Jesús
[D]            [A]               [Bm]          [G]
Eres tu la esperanza que anhele tener oh Jesús
[Em]               [A]             [Em]               [A]
Confié en ti me has ayudado    tu salvación me has regalado
[D]                  [A]             [G]        [A]
Hoy hay gozo en mi corazón con mi canto te alabare

[Estribillo]

[E]    [B]         [C#m]         [A]     [E]           [B]       [A]
Te alabare;    te glorificare;   te alabare mi buen Jesús

[Puente]

[E]          [A]            [B]   [E]           [A]             [B]
En todo tiempo te alabare, En todo tiempo te adorare

[Estribillo]

[E]    [B]         [C#m]         [A]     [E]           [B]       [A]
Te alabare;    te glorificare;   te alabare mi buen Jesú', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/te-alabare/)', 1792249442, 1792249442, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (76, 1, 'Digno y Santo', 'Danilo Montero', 'D', NULL, 'Intro:  [D]  [Am]  [C]  [G]

[D]           [Am]          [C]
Digno es el Cordero Santo
              [G]
Santo Santo es Él
[D]        [Am]              [C]
Levantamos nuestra alabanza
                    [G]
Al que en el trono esta.

[D]                  [Am]              [C]
Santo, santo, santo Dios Todopoderoso
                             [G]
Quien fue, quien es y quien vendrá
[D]                   [Am]                [C]
La creación hoy canta y damos gloria a Él
               [G]
Tú eres digno por siempre y siempre.

[D]                  [Am]              [C]
Santo, santo, santo Dios Todopoderoso
                             [G]
Quien fue, quien es y quien vendrá
[D]                   [Am]                [C]
La creación hoy canta y damos gloria a Él
               [G]
Tú eres digno por siempre y siempre.

[D]         [Am]             [C]
Levantamos nuestra alabanza
                    [G]
Al que en el trono esta.

[D]                   [Am]                [C]
La creación hoy canta y damos gloria a Él
               [G]
Tú eres digno por siempre y siempre.', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/digno-y-santo/)', 1792249443, 1792249443, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (77, 1, 'Has Aumentado', 'Danilo Montero', 'Em', NULL, '[Intro] [Em]  [G]  [A]  [C]  [D]

[Em]       [G]        [F#m7]          [B7]
Has aumentado ¡oh Dios! tus maravillas
[Em]    [G]         [A] [B7]
Enumerarlas no puedo
[Em]         [G]        [F#m7]     [B7]
Si yo anunciare y hablare de ellas
[C7M]                    [B7]
 No hay tiempo para terminar
[Em]        [G]       [F#m7]          [B7]
Has aumentado ¡oh Dios! tus maravillas
  [Em]     [G]        [A] [B7]
Y ya no puedo contarlas
[Em]     [G]        [F#m7]         [B7]
Misericordia me das día tras día
   [C7M]                  [B7]
Tu canto en mi boca estará

[Em]              [G]
Grandes son tus obras
     [A]          [C]  [D]
Poderío y majestad
[Em]              [G]
Tuyo es todo imperio
       [A]             [C]  [B]
Toda gloria y potestad
 [Em]              [G]
Grande es tu dominio
       [A]             [C]    [D]    [B7]
El universo lleno está de tu poder
[B7]          [Em]
Grande eres Tú', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/has-aumentado/)', 1792249443, 1792249443, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (78, 1, 'El que lavó mis pies', 'Danilo Montero', 'Bb', NULL, '[Bb]        [F]              [Bb] [Bbsus] [Bb]
Con toda gloria  y toda majestad
[Bb]      [F]         [Bb]
diseñador del universo
[Bb]       [F]     [Bb]  [Bbsus] [Bb]
desde su trono nos miro
[Cm]                   [D#] [F]
y vino aqui como cordero

E SMA SECUENCIA

Entre nosotros quiso caminar

buscando al mas necesitado

hasta aun leproso pudo abrazar

llevo mi erida en su costado


[Bb]                [F]
El que lavo mis pies
       [Cm]              [D#]     [F]    [Bb]
siendo rey en su mesa me dio de comer
[Bb]           [F]            [Cm]
me hiso caminar sobre el mar
                [D#]    [F]  [Bb]
al unico que quiero adorar

[Bb]         [F]              [Cm]        [D#]  [F]
Yo quiero adorar yo qiero adorarte', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/el-que-lavo-mis-pies/)', 1792249893, 1792249893, 'Bb');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (79, 1, 'Pausa En La Eternidad', 'Danilo Montero', 'A', NULL, '[A]                     [D6]            [E]       [D2]
 Tu historial celestial    se vio interrumpida
           [A2]
por causa mía
[A]               [D/A]                  [E]      [D/F#]
 Y no puedo explicar tanto amor que vió motivos
           [A]
en un pecador
[A]            [Bm7]       [D2]        [E]
 Por quien fuiste a morir en la cruz

[A2]            [A2/F#]     [D2]          [Bsus4]
Una pausa en la eternidad hizo tu corazón
[A2]               [A2/F#]          [D2]       [Esus4]
Que cambió el destino de un mortal a infinito
        [A2]
Tu corazón

[A/C#]            [D2]            [E]         [Esus4]             [A2]
 Tu decidiste crearnos Señor aún sabiendo que iba a suceder
[A]                     [D/A]       [E/G#]       [D/F#]            [A]
 La consecuencia no te importo y por amarnos fuiste a padecer
[A]         [Bm7]         [D2]        [E]
 Desde el cielo el camino a la cruz

[B9/D#]  [E/D]     [F#]     [G#sus] [G#]   *
Resucitaste en gloria Señor Jesús', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/pausa-en-la-eternidad/)', 1792249893, 1792249893, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (80, 1, 'Eres Tú', 'Danilo Montero', 'G#m', NULL, '[Intro] [G#m]  [B]  [C#]

[Primera Parte]

[G#m]      [E]         [B]          [F#]
Jesús tu eres el amigo que me ama
[G#m]      [E]            [B]           [F#]
Jesús tu eres la esperanza  de mi vida
[G#m]   [E]     [B]    [F#]
Eres, eres, eres tú
[G#m]   [E]    [F#]
Eres, eres tú

[Segunda Parte]

[G#m]      [E]          [B]        [F#]
Jesús tu eres el camino y la vida
[G#m]      [E]           [B]        [F#]
Jesús tu eres salvación y alegría
[G#m]   [E]     [B]    [F#]
Eres, eres, eres tú
[G#m]   [E]    [F#]
Eres, eres tú

[Estribillo]

[G#m]      [C#]         [E]
Tu eres Rey eres Señor
           [B]       [F#]     [G#m]
Y en una cruz fuiste a vencer
        [C#]          [E]
Engrandecido eres Dios
         [B]    [F#]
Te levantaste con poder

( [G#m]  [B]  [C#] )

[Primera Parte]

[G#m]      [E]         [B]          [F#]
Jesús tu eres el amigo que me ama
[G#m]      [E]            [B]           [F#]
Jesús tu eres la esperanza  de mi vida
[G#m]   [E]     [B]    [F#]
Eres, eres, eres tú
[G#m]   [E]    [F#]
Eres, eres tú

[Segunda Parte]

[G#m]      [E]          [B]        [F#]
Jesús tu eres el camino y la vida
[G#m]      [E]           [B]        [F#]
Jesús tu eres salvación y alegría
[G#m]   [E]     [B]    [F#]
Eres, eres, eres tú
[G#m]   [E]    [F#]
Eres, eres tú

[Estribillo]

[G#m]      [C#]         [E]
Tu eres Rey eres Señor
           [B]       [F#]     [G#m]
Y en una cruz fuiste a vencer
        [C#]          [E]
Engrandecido eres Dios
         [B]    [F#]
Te levantaste con poder

[Solo]

 [B]  [C#]  [E]  [F#]

[Estribillo]

[G#m]      [C#]         [E]
Tu eres Rey eres Señor
           [B]       [F#]     [G#m]
Y en una cruz fuiste a vencer
        [C#]          [E]
Engrandecido eres Dios
         [B]    [F#]
Te levantaste con poder

[Final] [G#m]  [B]  [C#]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/eres-tu/)', 1792249894, 1792249894, 'G#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (81, 1, 'Yo Confío', 'Danilo Montero', 'C#m', NULL, '[intro] [C#m]  [B]  [G#m]  [F#m]
        [C#m]  [B]  [G#m]  [F#m]

[A]
He aprendido a verte
         [E/G#]
En los detalles
  [A]
Y en cada milagro
       [E/G#]
Que tú haces
[A]                      [E/G#]
Tu facilidad con lo imposible
[F#m]                 [B7]
Ha erradicado mi temor

      [E]   [G#m]      [A]    [B]
Yo confio solo en ti jesús
     [C#m]     [B]    [A]  [B]
Mi esperanza eres tú
       [E]
Hoy descanso
  [G#m]    [A]
En tú fidelidad
           [F#m]
Y no habra nadie
                     [B7]
Que separe nuestro amor.
(segunda vez del coro)
      [B7]            [C#m]
Que separe nuestro amor

( [C#m]  [B]  [G#m]  [F#m] )
( [C#m]  [B]  [G#m]  [F#m] )

(misma secuencia)
Desde el pricipio
Demostraste
Que a los tuyos
Nunca abandonaste
Y en tú palabra nos dejaste
Las promesas
Que no fallarán

( [C#m]  [B]  [G#m]  [F#m] )
( [C#m]  [B]  [G#m]  [F#m] )

  [C#m]    [G#m]
Jesús, jesús
 [A]            [B]       [E]
Nombre sobre todo nombre.

  [C#m]    [G#m]
Jesús, jesús
 [F#m]          [B]       [E]
Nombre sobre todo nombre

( [C#m]  [B]  [G#m]  [F#m] )
( [C#m]  [B]  [G#m]  [F#m] )', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/yo-confio/)', 1792249894, 1792249894, 'C#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (82, 1, 'Aquí Estoy', 'Danilo Montero', 'D', NULL, '[Intro] [D]  [G]  [C]
        [F]  [Dm]  [C]  [G]
        [D]  [G]  [C]
        [F]  [Bb]  [G]

[Primera Parte]

[C]                  [Am]
Siento tanto en mi corazón
[F]           [Fm]
Deseo tu presencia oh Dios
[C]              [Am]           [F]
Mi anhelo no esconderé, mi hambre
       [Fm]     [D]  [G]       [C]      [F]  [Dm]  [C]    [G]
No la negaré. He oído tu voz decir  acércate
[D]    [G]         [C]      [F]       [Bb]         [G]
Tan fuerte dentro de mi, hoy tengo que decir
Coro
[C]      [F]  [C]  [Dm]       [G]         [C]           [F]
Aquí estoy,   solo quiero escuchar tu corazón
  [C]       [Dm]   [G]                [C]
Espero en ti y no me iré porque muero
     [F]  [C]  [Dm]         [G]         [C]          [F]
Sin ti,    es tu espíritu el que hace vivir
  [C]      [Dm]              [G]            [C]
Soy tuyo por completo por eso aquí estoy

[Solo] [D]  [G]  [C]  [F]
       [Dm]  [C]  [G]

[Segunda Parte]

[C]               [Am]
Aunque yo no te pueda ver
    [F]           [Fm]
Tan sólo en ti puedo creer
[C]             [Am]       [F]
Eres toda mi realidad fuera de ti

Tu amigo de siempre daniel
    [Fm]          [D]     [G]
No hay verdad, no era nadie
    [C]        [F]  [Dm]   [C]      [G]
Y viniste a mi  con tu bondad
[D]         [G]       [C]
Mientras mas de conozco a
F       Bb          G    Coro
Ti mas tengo que clamar
    [G]
Por eso aquí estoy

[Solo] [A]  [Dm]  [Eb]
       [C]  [F]  [D]  [G]
       [E]  [Am]  [G]

[Estribillo Final]

[C]      [F]  [C]  [Dm]      [G]          [C]           [F]
Aquí estoy,   solo quiero escuchar tu corazón
    [C]     [Dm]  [G]                 [C]
Espero en ti y no me iré porque muero
    [F]  [C]  [Dm]          [G]      [C]             [F]
Sin ti,    es tu espíritu el que hace vivir
     [C]    [Dm]             [G]           [C]  [F]  [C]  [Dm]
Soy tuyo por completo por eso aquí estoy
     [G]         [C]  [F]  [C]  [Dm]    [G]           [C]
Por eso aquí estoy,    por eso aquí estoy', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/aqui-estoy/)', 1792249895, 1792249895, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (83, 1, 'Todo Lo Has Cambiado', 'Danilo Montero', 'F', NULL, '[Intro] [F]  [C]  [G]

            [F]       [C]                [G]
Me has enseñado a ver la vida en libertad
            [F]       [C]        [G]
Me has dado una nueva identidad
      [F]          [C]        [G]
Pues todo tú lo has cambiado

            [F]       [C]         [G]      [Am]
Tu amor quitó el temor ahora tengo paz
            [F]       [C]     [G]        [Am]
Ya no hay oscuridad vivo en tu luz
        [F]       [C]       [G]    [Am]
Pues todo tú lo has cambiado

          [F]  [C]       [G]
Me diste vida, cambiaste el llanto en
     [F]  [C]     [G]
Alegría Le diste luz a mi
[F]  [C]   [G]          [F]    [C]  [G]
Día, todo has cambiado

         [F]   [C]  [G]  [Am]
Y no me callaré
             [F]    [C]  [G]  [Am]
Día y noche cantaré
      [F]           [C]        [G]  [Am]
Pues todo tú lo has cambiado
[F]           [C]        [G]
Todo tú lo has cambiado', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/todo-lo-has-cambiado/)', 1792249895, 1792249895, 'F');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (84, 1, 'Unidos por su sangre', 'Danilo Montero', 'Bm', NULL, 'Intro: [Bm]  [A]  [G]  [F#]

Estrofa:
[Bm]                  [A]
Hoy celebraremos la victoria de la cruz
[G]                    [F#]
Juntos cantaremos al que nos dio la luz
[Bm]                [A]
Por su sacrificio hoy tenemos paz
[G]                         [F#]
Fue por sus heridas que tenemos sanidad

Pre Coro:
[Bm]              [A]
Somos hijos redimidos, amados, escogidos
[G]               [F#]
Unidos por su sangre para declarar

Coro:
            [Bm] [Bm] [Bm] [A] [G] [G] [G] [F#]
Somos su pueblo, fruto de su amor
            [Bm] [Bm] [Bm] [A] [G] [G] [G] [F#]
Somos su pueblo, sus manos y su voz
            [Bm] [Bm] [Bm] [A] [G] [G] [G] [F#]    [Em] [Em] [Em] [Em]
Somos su pueblo, proclamemos hoy de su perdón
[F#]  [F#]  [F#]  [F#]
De su libertad

Se Repite la Estrofa y el Pre Coro

Coro:
            [Bm] [Bm] [Bm] [A] [G] [G] [G] [F#]
Somos su pueblo, fruto de su amor
            [Bm] [Bm] [Bm] [A] [G] [G] [G] [F#]
Somos su pueblo, sus manos y su voz
            [Bm] [Bm] [Bm] [A] [G] [G] [G] [F#]   [Em] [Em] [Em] [Em]
Somos su pueblo, proclamemos hoy de su perdón
[F#]  [F#]  [F#]  [F#]
De su libertad', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/unidos-por-su-sangre/)', 1792249896, 1792249896, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (85, 1, 'El Señor Es Mi Pastor', 'Danilo Montero', 'D', NULL, '[D]            [Em]
El Señor es mi pastor
[G].    [A].           [D]
Naaaadáaa me faltará

      [D]            [Em]
El señor es mi pastor
    [G]
En pastos delicados
     [Em]      [G]         [A]
    Él me hará descansar
            [Bm]
  Junto a aguas de reposo
    [G]
Me pastoreará
    [A]            [D]
Confortará mi alma
           [Bm]                   [G]
    Me guiará por sendas de justicia
[Em]   [G].     [D].     [A]
Por amor de su nombre', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/el-senor-es-mi-pastor/)', 1792249896, 1792249896, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (86, 1, 'Vuelvo a tí', 'Danilo Montero', NULL, NULL, 'Intro:
E|--------------------------------------------|    
B|---8--15-13-12-10--10/8--8-13-12-13--12-10--| X3 

despues para entrar al canto se toca:

E|-------------------------------------| 
B|---10-8--12-10-----------------------| 
G|----------------12-------------------| 
D|-------------------10--9-10----------| 
A|-------------------------------------| 
E|-------------------------------------| 


El bridge is similar al intro, nomas que se sube de tono:

E|--------------------------------------------| 
B|---9--16-14-13-11--11/9--9-14-13-14--13-11--| 

para entrar el coro otravez:

E|-------------------------------------| 
B|---11-9--13-11-----------------------| 
G|----------------13-------------------| 
D|-------------------11--10-11---------| 
A|-------------------------------------| 
E|-------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/vuelvo-a-ti/)', 1792249897, 1792249897, NULL);
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (87, 1, 'Mi Dios es refugio', 'Danilo Montero', 'Am', NULL, 'INTRO: //: Am7 - G - Am7 / Am7 - G - Am7 /   F    /    %  :// (2ª Vez Tutti)

[Am7]   [G]    [Am7]    [Am7] [G]  [Am7]     [F]       [Am7]    [F]        [Am7]
   Mi Dios es         refugio,    yo no temeré,   yo no temeré

[Am7]   [G]    [Am7]    [Am7] [G]   [Am7]    [F]        [Am7]       [F]        [Am7]
   Mi Dios es        mi fuerza     Él me sostendrá,   el me sostendrá
[G]           [Dm7]                 [G]            [Dm7]              [F]
  Vida y descanso encuentro en ti. Como un escudo me cubres a mi

                CORO
[C(add9)]
   Eres mi confianza eterna
                    [G/B]
    Esperanza tú me das en medio de tormentas
                      [Dm7]      [C/E]   [F]
    Mi respuesta solo eres tú,       eres tú
[C(add9)]
    Eres guía de mi vida
                     [G/B]
    El camino que me da seguridad divina
                      [Dm7]      [C/E] [F]
    La respuesta solo eres tú,      eres tú
 Desde el comienzo (INTRO X 1 Vez)

               Guitar                         Tutti
INTERMEDIO: //: Am7 - Gm Am7 / Am7 - G/B - C  /   F  / % ://

Voz Femenina:Eres tú ohhhhuoh - tu eres mi refugio
en ti me esconderé. uohoo

CORO: Guitar - Suave
[C(add9)]
   Eres mi confianza eterna
                     G/B (Tutti)
    Esperanza tú me das en medio de tormentas
                      [Dm7]      [C/E]   [F]
    Mi respuesta solo eres tú,       eres tú
[C(add9)]
    Eres guía de mi vida
                     [G/B]
    El camino que me da seguridad divina
                      [Dm7]      [C/E]   [F]
    La respuesta solo eres tú,      eres tú   (SE D PITE 2 VECES)', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/mi-dios-es-refugio/)', 1792249897, 1792249897, 'Am');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (88, 1, 'Dulce Refugio', 'Danilo Montero', 'C', NULL, '[C]     [G]         [F]          [C]
Dulce Refugio en la tormenta
[F]          [C]     [Dm]     [G]
Es Jesucristo el Salvador
[C]     [G]           [F]        [C]
Él me alienta y  alimenta
[F]      [G]       [C]
Con su palabra y su amor

[C]     [F]   [G] [C]
Vengo a Reposar en él
[C]     [F]    [G]  [Am]
Él  es mi amigo fiel
[D]                         [G]
Una poderosa y fresca unción
[C]          [F]
Llenará mi corazón
[C]     [G]          [F]          [C]
Dulce refugio  en la tormenta
[F]      [G]           [C]
Es Jesucristo el Salvador', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/dulce-refugio/)', 1792249898, 1792249898, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (89, 1, 'Cantare de Tu Amor', 'Danilo Montero', 'F', NULL, '[F]                    [C]
Por mucho tiempo busqué
   [F]           [C]
Una razón de vivir
[F]        [G]          [Am]
En medio de mil preguntas
    [Fm]          [G]
Tu amor me respondió

 [F]            [C]
Ahora veo la luz
 [F]               [C]
Y ya no tengo temor
[F]         [G]        [Am]
Tu reino vino a mi vida
        [F]         [G]
Y ahora vivo para tí

      [C]         [G]
Cantaré de tu amor
       [Am]       [G]      [F]
Rendiré mi corazón ante tí
      [C]         [G]
Tu serás mi pasión
        [Am].         [G]          [F]
Y mis pasos se guiarán por tu voz
      [Dm]       [G]
Mi jesús y mi rey
       [F]             [G]
De tu gran amor cantaré

      [D]          [A]
Cantaré de tu amor
          [Bm]           [G]
Rendiré mi corazón ante tí
       [D]          [A]
Tu serás mi pasión
       [Em]       [A]
Mi jesús y mi rey
      [G]              [A]
De tu gran amor cantaré', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/cantare-de-tu-amor/)', 1792249898, 1792249898, 'F');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (90, 1, 'Sentado En Su Trono', 'Danilo Montero', 'G', NULL, '[G]                                [Em]
Sentado en su trono, rodeado de luz
[C]                  [Am]                  [D]  [C]
  A la diestra del Padre, gobierna Jesús
[G]                                   [Em]
  Con ojos de fuego, con rostro de sol
[C]                 [Am]                 [D]  [C]
  Cuando abre su boca, es trueno su voz

[G]    [D]  [Am]              [Em]         [D]
Poderoso  en majestad y reino, Poderoso
[G]    [D]  [Am]               [Em]          [D]
Poderoso  en potestad e imperio, Poderoso

[G]                             [Em]
  Un gran arcoiris corona su ser
[C]             [Am]                [D]
  El es el cordero que pudo vencer
[G]                               [Em]
  El es el primero, El es el postrer
[C]             [Am]               [D]
  Y arrojan coronas delante de El

[C]   [D] [Em]   [C]   [D] [Em]   [C]    [D]   [F]  [D]  [G]
Poderoso,  Poderoso,  Poderoso', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/sentado-en-su-trono/)', 1792249899, 1792249899, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (91, 1, 'Junto a Tus Pies', 'Danilo Montero', 'C', NULL, '[Intro] [C]  [G]  [Em]  [Am]
        [F]  [Em]  [F]  [G]
        [C]  [G]  [Em]  [Am]
        [F]  [Em]  [D]
        [F]  [G]  [C]

[Tab - Intro]

E|-------------------------------------------------------------| 
B|--------3/5--3--1--3--5--3-----0----1/3--1--0--1--3--1-------| 
G|----0--------------------------------------------------------| 
D|-------------------------------------------------------------| 
A|-------------------------------------------------------------| 
E|-------------------------------------------------------------| 

E|-------------------------------------------------------------| 
B|-------------0--1/3-------------------0--1/3-----------------| 
G|----3--2--2----------2--0------2---2-------------------------| 
D|-------------------------------------------------------------| 
A|-------------------------------------------------------------| 
E|-------------------------------------------------------------| 

E|-------------------------5--3--------------------------------| 
B|--------3/5--3--1--3--5-----------0--1/3--5--3--5------------| 
G|----0--------------------------------------------------------| 
D|-------------------------------------------------------------| 
A|-------------------------------------------------------------| 
E|-------------------------------------------------------------| 

E|-------------------------------------------------------------| 
B|-------------0--1/3----------------------------1-------------| 
G|----3--2--2----------2--0------2---4--5--4--5----------------| 
D|-------------------------------------------------------------| 
A|-------------------------------------------------------------| 
E|-------------------------------------------------------------| 

[Primera Parte]

[C]                   [G/B]
Junto a tus pies quiero posar
[Am7]             [Em7]      [G]
Por tu amor dejarme llevar
[C]                   [G/B]
Junto a tus pies no sé articular
[Am7]           [Em7]   [G]
Ninguna voz tiene lugar

[Pre-Estribillo]

[Am7]       [Em7]           [Gm7]      [F]
Junto al  Maestro me quiero sentar
[Dm7]        [Em] [Am] [F]      [G]
Decirle le amo,  en oración

[Estribillo]

 [C]               [G/B]
Tocar tu manto Señor
 [E7/G#]               [Am]  [Gm7]
Lavar los pies de mi Dios
 [F]             [Em]    [F]                 [G]
Saber que mi corona  es estar junto a Ti
 [C]               [G/B]
Tocar tu manto Señor
 [E7/G#]              [Am]   [Gm7]
Lavar los pies de mi Dios
 [F]             [Em] [Am]  [Dm7]   [G]          [C]
Saber que mi corona   es estar junto a Ti

[Segunda Parte]

 [C]                   [G/B]
Junto a Tus pies me envuelve la paz
 [Am7]                 [Em7]     [G]
Cuerdas de amor capturan mi ser
 [C]                   [G/B]
Junto a Tus pies tu voz me atraviesa
  [Am7]                  [Em]       [G]
Mi alma y mi ser que tanto te anhelan

[Pre-Estribillo]

[Am7]       [Em7]           [Gm7]      [F]
Junto al  Maestro me quiero sentar
[Dm7]        [Em] [Am] [F]      [G]
Decirle le amo,  en oración

[Estribillo]

 [C]               [G/B]
Tocar tu manto Señor
 [E7/G#]                [Am]  [Gm7]
Lavar los pies de mi Dios
 [F]             [Em]    [F]               [G]
Saber que mi corona  es estar junto a Ti
 [C]               [G/B]
Tocar tu manto Señor
 [E7/G#]                [Am]   [Gm7]
Lavar los pies de mi Dios
 [F]             [Em] [Am]  [Dm7]   [G]          [C]
Saber que mi corona   es estar junto a Ti', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/junto-tus-pies/)', 1792249899, 1792249899, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (92, 1, 'Con mis manos levantadas', 'Danilo Montero', 'E', NULL, '[E]                          [A]
Con mis manos levantadas hacia el cielo
      [C#m]         [B]           [E]
Me presento ante ti hoy mi señor
      [A]         [B]     [E]              [C#m]
Para recibir de ti la fuerza y el poder
      [F#]    [A]          [B]
Para vivir junto a ti

        [E]                       [F#m7]
Llenas hoy mi corazón con tu presencia
       [B]                        [C#m]
Llenas de alegría y paz todo mi ser
       [A]           [E]            [C#m]
De cualquier necesidad tu me responderás
            [F#m]     [B]
Por que me amas me amas

        [E]                       [F#m7]
Llenas hoy mi corazón con tu presencia
       [B]                        [C#m]
Llenas de alegría y paz todo mi ser
       [A]           [E]            [C#m]
De cualquier necesidad tu me responderás
           [D]     [Am7]     [E]
Por que me amas me amas', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/con-mis-manos-levantadas/)', 1792249900, 1792249900, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (93, 1, 'Yo sé quien soy yo', 'Danilo Montero', 'A', NULL, '[A]          [D]  [A]            [D]  [A]
Extraviado,    me encontraste

             [D]  [A]                 [G6/A]
ciego estaba,       y ahora puedo ver

                        [D]  [E/D] [D] [E/D]
por tu canción yo cantare

    [A]             [D]  [A]              [D]  [A]
uuooo quebrantado,       me sanaste

             [D]  [A]                     [Em7]
muerto estaba         y ahora vivo en ti

                            [D]  [E/D]  [D]
tu identidad has puesto en mi


  [Bm7]      [Esus4] [E]
yo se, yo se

CORO:
   A             E (o tambn Eomit3)
yo se quien soy yo

   [C#m7]          [D]
Yo se quien soy yo

   [A]            [E]
yo se quien soy yo

     [Bm7]        [G]
tuyo soy, tuyo soy//

          [A]  [G6/A]   [Dsus/A]          [A]
tu eres mi Dios,    Cristo eres mi Dios

       [A]  [G6/A]   [Dsus/A]          [A]
eres mi Dios,    Cristo eres mi Dios

[Bm7]               [Dmaj7]
  soy perdonado,    tu hijo soy

[Bm7]       [C#m7]      [Dmaj7]
  soy aceptado, yo se quien soy yo

[Bm7]              [Dmaj7]
  tengo confianza,  seguro estoy

[Bm7]        [C#m7]     [Dmaj7]
  que soy amado, yo se quien soy yo

[Bm7]              [Dmaj7]
  volví a vivir,    ya libre soy

[Bm7]       [C#m7]          [D]          [Esus4]  [E]
  te pertenezco a ti y tu eres mi Dios.

Y vuelve al coro.. pero en la repetición termina asi:

   [A]            [E]       [Bm7]      [C#m7]     [Dmaj7]   [Bm7]  [C#m7]   [Dsus2]
Yo se quien soy yo, tuyo soy, tuyo soy, tuyo soooooooooy tuyo soy

Corrigo unos acordes q pienso, suenan pero no son los correctos.
aqui les escribo los acordes originales del tema.
espero les agrade.

como les dije aqui les escribo como tocar unos acordes q tal vez no
conozcan:

G6/A     (50-45-34-23-10 la sexta no se toca)
Dsus/A   (50-44-32-23-10 la sexta no se toca)
[Esus4]    (60-52-42-32-20-10)
E/D      (40-34-25-14 sexta y quinta no se tocan)
Dsus2    (40-32-23-10 sexta y quinta no se tocan)
Dmaj7    (40-32-22-12 sexta y quinta no se tocan)', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/yo-se-quien-soy-yo/)', 1792249900, 1792249900, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (94, 1, 'Eres Suficiente', 'Danilo Montero', NULL, NULL, 'solo
E|----------------------------------------------------------------| 
B|------------------------------15/17-17/19--15-------------------| 
G|--16-16-16--19--16-16-16--19------------------16-14/16-14h15h14-| 
D|----------------------------------------------------------------| 
A|----------------------------------------------------------------| 
E|----------------------------------------------------------------| 

E|----------------------------------------------------------------| 
B|------------------------------15/17-17/19--20--19---------------| 
G|--16-16-16--19--16-16-16--19------------------------------------| 
D|----------------------------------------------------------------| 
A|----------------------------------------------------------------| 
E|----------------------------------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/eres-suficiente/)', 1792249901, 1792249901, NULL);
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (95, 1, 'Salmo 84', 'Danilo Montero', 'B', NULL, '[Intro] [B]  [Ebm7]  [C#]  [Abm7]  [B]  [Ebm7]  [C#]  [Abm7]

[Ebm7]    [C#]                 [Abm7]      [B]
Es mi delicia estar en tu casa
[Ebm7]         [C#]            [Abm7]
Encuentro refugio bajo tus alas
[B]            [Ebm7]  [B]            [Ebm7]
Dichosos te alaban, los que contemplan
   [C#]         [B]
Tu Gloria, tu Gloria

[Estribillo]

    [B]       [F#]     [C#]      [Ebm7]   [C#]
  Anhelo, deseo, me muero, por estar contigo
  [B]          [F#]    [C#]            [Abm7]
Te busco, hoy ruego, permanecer toda mi vida aquí

[Ebm7]        [C#]             [Abm7]
Buscar un momento de tu sonrisa
[Ebm7]               [C#]              [Abm7]
Vale más que un Tesoro más que una vida
[B]            [Ebm7]  [B]           [Ebm7]
Dichosos te alaban, los que contemplan
   [C#]         [B]
Tu Gloria, tu Gloria

[Estribillo]

    [B]       [F#]     [C#]      [Ebm7]   [C#]
  Anhelo, deseo, me muero, por estar contigo
  [B]          [F#]    [C#]            [Abm7]  [B]
Te busco, hoy ruego, permanecer toda mi vida aquí

[Instrumental]   [B]  [Ebm7]  [B]  [F#]
                 [B]  [Ebm7]  [B]  [C#]

[Puente]

   [B]                  [F#]          [C#]     [Ebm7]
Dichoso el que tiene en ti su Fortaleza
   [B]                  [F#]               [C#]     [Abm7]
En medio de la aflicción renuevas sus fuerzas
En ti

[Estribillo]

  [B]       [F#]     [C#]      [Ebm7]   [C#]
Anhelo, deseo, me muero, por estar contigo
  [B]          [F#]    [C#]            [B]
Te busco, hoy ruego, permanecer toda mi vida aquí', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/salmo-84/)', 1792249901, 1792249901, 'B');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (96, 1, 'Ven a este lugar', 'Danilo Montero', 'F', NULL, 'D INTRO: F - C - Dm - Bb  (x3)

          [F]            [C]
Tú que estás sentado
            [Dm]         [Bb]
Sobre querubines
          [F]               [C]
Tú que estás en el trono
               [Dm]        [Bb]
En medio de serafines
          [F]              [C]
Tú que eres aclamado por ángeles
            [Dm]        [Bb]
Ven a este lugar

          [F]             [C]
Tú que estás sentado
                [Dm]       [Bb]
Sobre un trono de gloria
          [F]              [C]
Tú que estás en el trono
                     [Dm]       [Bb]
De la alabanza de tu pueblo
        [F]                     [C]
Tú que eres aclamado por tu iglesia
             [Dm]       [Bb]
Ven a este lugar


[Refrão :]

              [F]       [C]
//Ven a este lugar
            [Dm]       [Bb]
Ven a este lugar
             [F]       [C]
Ven a este lugar
             [Dm]      [Bb]
Llena hoy mi vida Señor//


D PITE ESTROF  2
D PITE CORO (2 VECES)


Puente (Solo de Guitarra)

│ [Dm]  [C]  [Bb]   │ [Dm]  [Bb]  [F] │

│ [Em]  [C]  │ [G]  [A/C#]  │ [C]  │  [D]

[Refrão :]

              [A]      [E]
//Ven a este lugar
            [F#m]      [D]
Ven a este lugar
              [A]      [E]
Ven a este lugar
              [F#m]    [D]
Llena hoy mi vida Señor//', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/ven-a-este-lugar/)', 1792249902, 1792249902, 'F');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (97, 1, 'Glorificate', 'Danilo Montero', 'Em', NULL, 'Intro: [Em]  [Em(maj7)]  [Em7/D]  [A7]  [C]  [D#°]

[Em]            [Em(maj7)]
    Tu Gloria, presencia
[Em7/D]            [A7]
    Venga hoy aquí
[Em]            [Em(maj7)]
    Honor, dominio
[Em7/D]            [A7]
    Dios, ven a  mí

         [C]        [G/B] [Em]
    Te quiero, te a - mo
       [D#(maj7)]     [Dsus4]
    Yo vivo para adorarte
      Em  (1ª vez)
      C   (2ª vez)
    A ti

          [Em] [D/F#]  [G]        [Em] [D/F#]  [G]
    Glorifí  -  cate, glorifí  -  cate
          [Em] [D/F#]  [G]     [G/B]       [C] [D]
    Glorifí  -  cate por siempre, Rey', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/glorificate/)', 1792249902, 1792249902, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (98, 1, 'Gracia', 'Danilo Montero', 'G', NULL, '[G]                  [Bm/F#]
Perdido yo me encontraste a mí
[Em7]                 [Cmaj7]
Tomaste mi mano me acercaste a ti
[G]                  [Bm/F#]
Torpe soy y me das tu amor
[Em7]                [Cmaj7]
Loco soy para el rey de amor
[G]                  [Bm/F#]
Me diste alas para volar
[Em7]               [Cmaj7]
Hoy pinto el cielo con mi cantar
[G]                  [Bm/F#]
Lo que yo soy viene de ti
[Em7]                 [Cmaj7]
Lo que yo quiero es mas de ti

[Cmaj7]     [G]       [Bm/F#]     [Em7]
Es gracia Dios yo nada soy sin ti
[Cmaj7]      [G]           [D4] [D]
Tu gracia hoy brilla en mi

[G]                  [Bm/F#]
Hubo días que corri de ti
[Em7]               [Cmaj7]
Dificil me fue no supe que decir
[G]                  [Bm/F#]
Perdoname cuando debil soy
[Em7]               [Cmaj7]
Cambiaste el cielo por una cruz de amor
[G]                  [Bm/F#]
Me has sostenido en mi vivir
[Em7]               [Cmaj7]
Fuiste mis ojos cuando ciego fui
[G]                  [Bm/F#]
Tu gloria brilla en mi aflicción
[Em7]               [Cmaj7]
Aceite de gozo en mi dolor

[Cmaj7]     [G]       [Bm/F#]     [Em7]
Es gracia Dios yo nada soy sin ti
[Cmaj7]      [G]           [D4] [D]
Tu gracia hoy brilla en mi
[Cmaj7]                   [G]
Brilla en mi, brilla en mi
[Bm/F#]             [Em7]
Tu gracia brilla en mi
[Cmaj7]           [G]
Brilla en mi, brilla en mi
[D4] [D]
Oh Dios', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/gracia/)', 1792249903, 1792249903, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (99, 1, 'Desde el cielo', 'Danilo Montero', 'A', NULL, 'Intro
[Asus2], [E], [Bsus2],  [F#m7]

VERSO 1
[Asus2]     [E]    [Bsus2]          [F#m7]
Desde el cielo...   hasta una cruz
[Asus2]  [E]     [Bsus2]        [F#m7]
De tu trono...   a mi corazón

VERSO 2
[Asus2]   [E]    [Bsus2]         [F#m7]
Siendo ciego...   yo vi tu luz
[Asus2]  [E]     [Bsus2]         [F#m7]
Soy esclavo...   y tú mi Señor


CORO:
[Asus2]  [C#m7]    [Bsus2] [F#m7]
Eterno amor, te entregaste
[Asus2]    [E]     [Bsus2]  [F#m7]
Me rindo hoy para adorarte

G  O MUBCA L (Asus2, C#m7, Bsus2, F#m7) x2

PUENTE
[Asus2]         [E]
Eterno Amor, Eterno amor
  [Bsus2]   [F#m7]
te entregaste
   [Asus2]         [E]
Me rindo hoy, me rindo hoy
  [Bsus2]    [F#m7]
para adorarte


El orden de toda la cancion segun el CD es lo siguiente:

Intro
Verso 1
Verso 2
Coro
Intro
Verso 1
Verso 2
Coro (2 veces)
Solo musical
Puente (2 veces) el puente se puede hacer cuantas veces
que el lider sienta hacerlo
Coro (2 veces)', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/desde-el-cielo/)', 1792249903, 1792249903, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (100, 1, 'Nada Soy Sin Tí', 'Danilo Montero', 'Em', NULL, '[Em]          [G]        [C]                [Em]
   Tú eres Dios el héroe de toda la historia
[G]       [Em]         [C]            [D]
   Increible,admirable tu eres todo
[Em]          [G]        [C]          [Em]
   Tú eres Santo lleno de misericordia
[G]       [Em]      [C]              [D]
   Soñador creador tu eres dios

Coro
   [G]            [D]     [Am]          [C]
// Nada soy sin ti , Nada soy sin ti
   [G]            [Bm]   [Am]            [C]
   Nada soy sin ti , Nada soy sin ti//

Esta cancion es linda espero que sea de bendicion para tu vida
QDTB..Davicho..', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/nada-soy-sin-ti/)', 1792249904, 1792249904, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (101, 1, 'Desesperado', 'Danilo Montero', 'Bm', NULL, 'Intro:

Gtr Acústica:   // D - G - D - A //
                // [Bm] - [G] - [D] - [A] //

Grt Eléctrica:

E|---------------------------------------| 
B|--10-7~---10------7--7~s3--------------| 
G|--------------9~-----------------------| 
D|---------------------------------------| 
A|---------------------------------------| 
E|---------------------------------------| 

E|----------------------------------------------| 
B|--------------8---8----10----10---------------| 
G|--11-7--11-7----7---7-----7-----7--9-7-9-7----| 
D|----------------------------------------------| 
A|----------------------------------------------| 
E|----------------------------------------------| 
E|----------------------------------------------| 

E|--------------------------------------------------| 
B|--------------8---8----10----10-------------------| 
G|--11-7--11-7----7---7-----7-----7--9-7-9-7--7~s3--| 
D|--------------------------------------------------| 
A|--------------------------------------------------| 
E|--------------------------------------------------| 
E|--------------------------------------------------| 


Interludio para volver a la estrofa:

E|----------------------------------------------| 
B|--------------8---8----10----10---------------| 
G|--11-7--11-7----7---7-----7-----7--9-7-9-7----| 
D|----------------------------------------------| 
A|----------------------------------------------| 
E|----------------------------------------------| 
E|----------------------------------------------| 

E|--------------------------------------------------| 
B|--------------8---8----10----10-------------------| 
G|--11-7--11-7----7---7-----7-----7--9-7-9-7--7~s3--| 
D|--------------------------------------------------| 
A|--------------------------------------------------| 
E|--------------------------------------------------| 
E|--------------------------------------------------| 

Fin de la Canción:

E|----------------------------------------------|     
B|--------------8---8----10----10---------------|     
G|--11-7--11-7----7---7-----7-----7--9-7-9-7----|     
D|----------------------------------------------| X 3 
A|----------------------------------------------|     
E|----------------------------------------------|     
E|----------------------------------------------|     

E|-------------------------------------| 
B|--------------8---8------------------| 
G|--11-7--11-7----7---7--7*----7~--s1--| 
D|-------------------------------------| 
A|-------------------------------------| 
E|-------------------------------------| 
E|-------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/desesperado/)', 1792249904, 1792249904, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (102, 1, 'Todo Es Tuyo', 'Danilo Montero', 'A', NULL, '[A]            [F#m]
//Dime Dios, dimelo
         [D]    [A]           [D]     [E]
Que te puedo dar, que no tengas ya//

           [A]                 [F#m]
Si todo es tuyo, si tu eres dueño
          [D]                  [E]
De todo honor la gloria y adoracion
            [A]                [F#m]
Si todo es tuyo, si tu eres dueño
        [D]  [E]   [A]
De toda adoracion

Puente:
   [D] [A]       [D]      [E]
Lo unico que puedo dar
        [D]
Es mi vida en gratitud
                         [F#m]
Tu me salvaste, tu me compraste
            [D]         [E]
Si todo es tuyo, Oh Dios


Sube a B:
            [B]                [G#m]
Si todo es tuyo, si tu eres dueño
          [E]                  [F#m]
De todo honor la gloria y adoracion
            [B]                [G#m]
Si todo es tuyo, si tu eres dueño
         [E] [F#m] [B]
De toda adoracion', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/todo-es-tuyo/)', 1792249905, 1792249905, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (103, 1, 'Qué Dulce', 'Danilo Montero', NULL, NULL, 'intro:

E|------------------------------------------------------  
B|------------------------------------------10----------  
G|--9------9--11-----------9-----9--11--7---------------  
D|----7------------7--9------7--------------------------  
A|------------------------------------------------------  
E|------------------------------------------------------  

solo:
E|-----------------------------------------------------      
B|-----10-----------------10-------------------------------  
G|--11-----11--9--7----11----11--9--7--11-----------         
D|------------------------------------------------------     
A|------------------------------------------------------     
E|------------------------------------------------------     

E|-------------------------------------------------5-----  
B|----------------------------------------------5--------  
G|---12-11-12-11-12-11--7----10-9-10-9-10-9--5-----------  
D|------------------------------------------------------   
A|------------------------------------------------------   
E|------------------------------------------------------', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/que-dulce/)', 1792249905, 1792249905, NULL);
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (104, 1, 'Padre En Tí', 'Danilo Montero', 'F', NULL, 'Intro: [F/D] [C/E] [Bb]    [F] [C] [Bb]
      [F/D] [C/E] [Bb]    [F] [C/A] [Bb/C]

[F]                [C]
Padre yo vengo ahora hacia a ti
         [Gm]        [Bb]        [C]
Como un niño yo corro a tus brazos
  [F]                 [C/E]
 Tú me recibes con los brazos abiertos
          [Gm]        [C]
Mi buen padre…

          [F]    [Bb]       [C]
Padre en ti estoy en mi casa
         [F]    [Bb]      [C]
Padre en ti seguro estoy
         [F]    [Bb]      [C]
Padre en ti encuentro la paz
    [Dm7]         [Gm]    [C]
    Mi    buen padre,       Mi amor

INTRO

[F]                [C]
Padre contigo nada me faltara
      [Gm]       [Bb]   [C]
Llenas toda mi alma y anhelo
 [F]                     [C/E]
Estoy protegido si a mi lado estas
          [Gm]     [C]
Mi buen padre…

          [F]   [Bb]      [C]
Padre en ti estoy en mi casa
         [F]   [Bb]    [C]
Padre en ti seguro estoy
         [F]    [Bb]      [C]
Padre en ti encuentro la paz
    [Dm7]         [Gm]     [C]
   Mi    buen padre,
         [F]   [Bb]      [C]
Padre en ti estoy en mi casa
         [F/A]   [Bb]    [C]
Padre en ti seguro estoy
          [Gm]               [Am9]
Padre en ti   encuentro la paz
                      [Eb]  [Bb/D]   [C]          [F]
     Mi    buen   padre,           Mi amor', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/padre-en-ti/)', 1792249906, 1792249906, 'F');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (105, 1, 'Es grande', 'Danilo Montero', 'Gm', NULL, '[Gm7]
E|--x--| 
B|--x--| 
G|--3--| 
D|--3--| 
A|--1--| 
E|--3--| 

          v       v
E|--------13-----------------------------------------------------------| 
B|------------16b18----13-15-15-14-13----------------------------------| 
G|--12s14-----------------------------15-17-13-15----------------------| 
D|------------------------------------------------15-------------------| 
A|---------------------------------------------------------------------| 
E|---------------------------------------------------------------------| 



                        (2 notas
                        sonando)  v               v
E|---------------------------------------------------------------------| 
B|----------------------16______---------------------------------------| 
G|--13-15s16s15-13--------15b17---13-----------------------------------| 
D|-----------------15-----------------15--15s17-15s13-15---------------| 
A|--------------------------------------------------------15-13-12-----| 
E|---------------------------------------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/es-grande/)', 1792249906, 1792249906, 'Gm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (106, 1, 'Porque Para Siempre', 'Danilo Montero', 'B', NULL, 'INTRO: Bajo y Guitarra Eléctrica (Sólo notas, no acordes)

[B] - [B] - [C#] - [D]
[E] - [F#] - [G] - [A]
[B] - [B] - [C#] - [D] - [E]

[B] - [B] - [C#] - [D]
[E] - [F#] - [G] - [A] - [D] - [D]

[D]                  [Csus2]                [D]              [C]
Cuando alabamos tu nombre Señor nos sorprenden tus maravillas,
[D]            [Csus2]                [D]            [C]
Así lo hizo Israel cuando sus enemigos le amenazaron,
[Bm]                 [G]                [D]     [G]         [A2]
Y al adorarte escucharon decir: “No teman es mi batalla"
[Bm]                [G]                [D]       [G]        [A2]
Y en la mañana cantando con fe les vencieron al declarar

Coro:
            [Bm]              [G]            [A]   [A7sus4]
    Por que para siempre es tu misericordia
            [Bm]              [G]            [A]     [Bm] [G2]
    Por que para siempre es tu misericordia
            [Bm]              [G]            [A]   [A7sus4]
    Por que para siempre es tu misericordia
            [Bm]              [G]           [Em] [Bm] [G] [A7sus4]
    Por que para siempre es tu misericordia

Inter1 (notas del bajo) A2 D2 B2 D2 x3

A ti clamé en mi angustia Señor y tu mano me extendiste,
Lloré en la noche pero al despertar tu gracia me dio una sonrisa
Y en ti estoy seguro pues tu brazo no se cansara
Por tanto yo te confesaré a las naciones declararé

(Coro)

Inter2 (guitarra)  Fmaj7  G  A   x3

[Fmaj7]                 [G]
  El que habita al abrigo de Dios
[Fmaj7]       [G]
  Morara bajo su sombra
[Fmaj7]         [G]          [A]
  Es el quien te sustentara

Te diré eres mi esperanza
Castillo mío eres tu
Mi Dios en quien confiaré

Inter3 (electrica)  Bm G D A  x2

(Coro)

 [Bm]      [Gmaj7]
Para siempre.    (x7)
 [Bm]       [D]
Para siempre

Entra a mi pagina y descarga el cancionero 2005
con cientos de acordes de cantos cristianos', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/porque-para-siempre/)', 1792249907, 1792249907, 'B');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (107, 1, 'Eres Bueno', 'Danilo Montero', 'G', NULL, 'Intro:  [G]    [Dm7]   [C]   [Ebmaj7]   [G]    [Dm7]   [Ebmaj7]  [D7sus]

     [G]                     [G/F]
//  Hay un canto en mi corazón
[Eb]                [D]
Alabanzas a mi Señor
 [G]                    [G/F]
Con mis labios yo cantaré
[Eb]                   [D]
Las grandezas de mi Rey  //

[Em]                 [Eb]
Tu misericordia me ha alcanzado
[Em/D]          [A/C#]
  Tu perdón me ha liberado
    [C]               [Dsus] [D]
Por eso hoy puedo cantar

Coro:
          [C] - [G]     [C] - [G]
//  Eres bueno,   bueno
      [C] - [G]          [Eb]
Eres bueno     por siempre cantare  //

Sube y Final:
[F#m]                 [F]
 Tu misericordia me ha alcanzado
[F#m/E]         [B/D#]
  Tu perdón me ha liberado
    [D]               [Esus] [E]
Por eso hoy puedo cantar

Coro:
         [D] - [A]     [D] - [A]
//  Eres bueno,   bueno
      [D] - [A]          [F]
Eres bueno     por siempre cantare  //
        [D] - [A]     [D] - [A]
  Eres bueno,   bueno
      [D] - [A]           [C]
Eres bueno     por siempre
 [A]     [G]     [Dmaj7]    [F]     [A]     [G]       [F]      [E]
Cantaré     Cantaré    Cantaré     Cantaré', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/eres-bueno/)', 1792249907, 1792249907, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (108, 1, 'Tu Eres Rey', 'Danilo Montero', 'G', NULL, '[Intro] [G]  [D]  [C]
        [G]  [D]  [C]
        [Em]  [D]  [C]
        [Em]  [D]  [C]

[G]     [D]    [C]    [G]    [D]          [C]
Cuan asombrosas son Dios, tus obras
[Em]     [D]   [C]   [Em]     [D]   [C]
Nadie como tu, nadie como tu
[G]   [D]       [C]    [G]   [D]    [C]
Te proclamamos, Rey soberano
[Em]     [D]    [C]  [Em]     [D]    [C]
Nadie como tu, nadie como tu

       [G]        [C]       [Am]
Porque grandes son tus obras
[G]         [Am]    [C]
Grande es tu poder
[G]              [D]        [Am] [D]   [C]
El cielo y la tierra y debajo de ella
[G]        [D]       [C]
Declaran tu eres Rey

[Estribillo]

         [G] [D] [C]             [G] [D] [C]
Tu eres Rey,      Tu eres Rey
         [G] [D] [C]             [Em] [D] [C]
Tu eres Rey,      Tu eres Rey

[Final] [Em]  [D/F#]  [Am]  [C]  [D]  [Em]  [F]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/tu-eres-rey/)', 1792249908, 1792249908, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (109, 1, 'Fuerza de Vida', 'Danilo Montero', 'Ab', NULL, '[Ab]            [Db]       [Ebsus]  [Ab/C]       [Db]      [Ebsus]
 Cuando dulce son a mi ser         tus palabras Señor
[Ab/C]    [Db]     [Ebsus]  [Ab/C]    [Db]      [Ebsus]
 Avivas mi corazón         al oir tu voz

     [Dbmaj7]     [Cm7]       [Bbm7]
La pasión de mi vida eres tú
     [Dbmaj7]      [Cm7]        [F]        [Ebsus]
La porción de mi alma que renueva mi ser

[Ab]        [Db]   [Ebsus]  [Eb]
Fuerza de vida tú
[Ab]         [Db]     [Csus]    [C]
Mi alma te anhela oh Jesús
    [Fm7]       [Ab/Eb]      [Bb/D]
Llévame en tus alas y háblame de mañana
        [Bbm7]   [Ab/C]  [Db]  [Ebsus]  [Ab]
porque quiero escucharte        Jesús', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/fuerza-de-vida/)', 1792249908, 1792249908, 'Ab');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (110, 1, 'Tu Misericordia', 'Danilo Montero', 'C', NULL, 'Intro:

[C]  [G/B] [Am] [G]  [F] [G] [D]

[Cmaj7]      [D/C]                [Bm]  [Em]
Quien soy yo para que me visites
       [C/A]   [D]               [G]  [F/A]  [G/B]
Y te acuerdes de mi Señor Jesús
[Cmaj7]      [D/C]        [Bm]  [Em]
Que te movió a perdonarme
          [A]       [A/C#]        [Am7]       [C/D]    [D]  [G] [F/A] [G/B]
Tu misericordia oh Dios me abrazo y el pecado olvido

CORO:
          [C]    [D/C]             [Bm7]    [Em]
Tu misericordia es mejor que la vida
          [C]   [D/C]                 [G]  [F/A]  [G/B]
Tu misericordia puso en mi una cancion
          [C]    [D/C]             [Bm7]    [Em]
Tu misericordia vivifica al caido
          [A]       [A/C#]        [Am7]
Tu misericordia oh Dios me alcanzo
      [C/D]  [D]
Y mi vida corono…

Al intro sin repetición
Como segunda vez….. F G  (y puente)

PUENTE:
[C]  [D/C]   [Bm]  [Em]
Am G/B C D : Bm C#m D E : (modula)

         [D]      [E/D]             [C#m]  [F#m]
Tu misericordia es mejor que la vida
         [D]    [D] [E]                  [A]  [G/B] [A/C#]
Tu misericordia puso en mi una cancion
         [D]    [E/D]             [C#m]  [F#m]
Tu misericordia vivifica al caido
            [B]        [B/D#]        [Bm7]
//Tu misericordia oh Dios me alcanzo
     [D/E]   [E]   [F#m] [F#m/E]
Y mi vida corono//

PARA FINE:
         [B]        [B/D#]        [Bm7]
Tu misericordia oh Dios me alcanzo
      [D/E]  [E]
Y mi vida corono

FINE:  D A/C# Bm A G', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/tu-misericordia/)', 1792249909, 1792249909, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (111, 1, 'Te proclamamos rey', 'Danilo Montero', 'D', NULL, 'Intro:   [D]  [F]  [E]     [D] [A] [E]

[D]                  [A]                    [E]
  Hoy quiero proclamar    Tu gloria y majestad
[D]                  [A]                     [E]
  Con fuerza anunciar     que Tú eres   Real

   [C#m7]         [D]
Mía es tu libertad,
    [C#m7]                      [D]     [E]
Tu palabra es imposible de    Comparar
     [D]                  [A]
Roca inconmovible, poderoso Gigante
     [F#m]                [B]
Tú gobiernas en todo lugar

Coro:
        [E]           [A]            [C#m]         [D]
Hoy Te proclamamos Rey,   Que Tu reino y Tu ley
    [F#m]              [A]                [Bsus]  [B]
Sean para siempre en cielo,  Tierra y mar
     [E]         [A]       [C#m]          [D]
Todo ojo Te verá    y a voces cantarán
           [F#m]          [E]           [A]           [B]
Que el verdadero Amor y Padre Eterno solo  eres Tú
           [F#m]          [E]           [A]                   [D]  [A]  [E]
Que el verdadero Amor y Padre Eterno solo  eres       Tú', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/te-proclamamos-rey/)', 1792249909, 1792249909, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (112, 1, 'Dios', 'Danilo Montero', 'C', NULL, 'Intro:  [C] [Am] [Em] [F] [Em] [Dm] [G]

[C]         [B/G]          [C]
De guerra y paz
[Em]                           [F]         [Em]    [G]
Dios fuerte y tierno eres tú
[C]        [B/G]      [C]
Principio y fin
[Em]                [F]         [Em]   [D7]
El dios eterno eres tú

[Am]                 [Am/G]             [F]
Estas tan alto y tan bajo
           [Em]                    [F]        [Em]          [G]
A lo ancho, a lo largo y en mi ser
[Am]                    [Am/G]                   [F]
Creaste el cielo, las estrellas,
  [Em]                       [F]                      [G]
El mar, el universo y el amor.

refrao
[C]                                      [Am]
Dios solo importas tú
[Em]                  [F]  [Em]   [Dm]                [G]
Eres todo tú la razón     la luz.
[C]                               [Am]
Dios te adoro a ti
  em                                 f-em-dm
Pues no encontrare jamás
  [G]                             [F] [Am] [G]  [F] [Am] [G]
A alguien como tú

Repete as duas primeiras estrofes

[C]                                      [Am]
Dios solo importas tú
[Em]                  [F]  [Em]   [Dm]                 [G]
Eres todo tú la razón     la luz.
[C]                              [Am]
Dios te adoro a ti
           em                        f-em-dm
Pues no encontrare jamás
  [G]                             [F] [Am] [G]  [F] [Am] [D7]  [F] [Am] [G]  [F] [Am] [D7]
A alguien como tú

SOLO: [C] [Am] [Em] [F] [Em] [F] [D7]

Sube:
[D]                        [A/C#]     [Bm]
Dios solo importas tú
[F#m]                [G]  [F#m]  [Em]          [A]
Eres todo tú la razón     la luz.
[D]                  [A/C#]   [Bm]
Dios te adoro a ti
           [F#m]              [G-F#m-Em]
Pues no encontrare jamás
  [A]                            [G] [F#m] [G]
A alguien como tú
  [A]                              [G]   [F#m]      [G]
A alguien como tú, nunca habrá
                               [G] [Bm] [A] (6x)
A alguien como tú', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/dios/)', 1792249910, 1792249910, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (113, 1, 'Quiero Proclamar', 'Danilo Montero', 'D', NULL, '(capo en el primer traste)

INTRO:[D] [A] [Bm] [G]

[D]      [A]     [Bm]
Quiero proclamar
[G]      [A]       [Em]  [A]
Que Tú eres mi gozo
[D]      [A]  [Bm]   [G]      [A]     [Em]  [A]
Mi felicidad,  mi mejor sonrisa.

[Bm]         [A]         [G]
Que hoy estoy completo
[Em]       [D]     [A]
Pues llegaste Tú
[Bm]         [A]         [G]
Que hoy estoy  completo
[E]           [G#]
Pues Tú eres.......

      -  CORO -

[D]      [A]        [Bm]       [G]  [Gm]
Mi Señor, mi fuerza, mi guía
[D]      [A]      [Bm]
Mi Señor, mi Padre
     [G]          [D]
El dueño de mi Amor.

(ENTRA EL INTRO: D-A-Bm-G)

           CORO:


Mi Señor, mi fuerza, mi guia
Mi Señor, mi Padre
El dueño de mi Amor

Que hoy estoy  completo

Pues llegaste Tú

Que hoy estoy  completo
[E]          [G]
Pues Tú eres.......
[E]          [G]
Pues Tú eres.......
[E]           [G]
Pues Tú eres.......

CORO:

Mi Señor......Y el intro se repite junto con el coro', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/quiero-proclamar/)', 1792249910, 1792249910, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (114, 1, 'Te Alabo', 'Danilo Montero', 'D', NULL, '[D]
Es la bendicion de saber
    [G]
porque estoy aqui.
[D]
Creado fuí por Tí
            [G]
para estar así ante Tí.

       -CORO-  
   [E]    [B]       [C#m] [A]
Te alabo, te alabo
   [E]    [B]       [C#m] [A]
Te alabo, te alabo.

(misma secuencia)
Sentido diste Tu en aquella cruz
al amor.
Te quiero entregar todo lo que soy
decirte que......

Te amo, te amo
Te amo, te amo.

  [B]      [C#m]        [A]
//Tu eres grande Oh Dios
  [Abm]   [C#m]     [F#m]
  Cuan infinito eres
  [B]       [C#m]  [A]
  Alfa y Omega Tú
  [Abm]      [C#m]    [D]
  El Rey de Reyes Tú.//
 (Eterno siempre Tú)*este se canta cuando se repite.

  (misma secuencia pero aumnetado)
  //Te axalto, te axalto.//         E=F#
  //Ta alabo, te alabo.//           B=C#
  //Te adoro, te adoro.//           C#m Ebm
  //Te amo, te amo.//               A=B', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/te-alabo/)', 1792249911, 1792249911, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (115, 1, 'En Tu Abrazo', 'Danilo Montero', 'Bm', NULL, '[Intro] [Bm]  [A/C#]  [D]  [G]

[D]           [A/C#]
Hoy me acerco
                [Bm]         [G]
Te siento y no puedo resistir
[D]           [A/C#]
Voy corriendo
                [Bm]          [G]
A tus brazos abiertos para mí

[Em]                [D/F#]
Y soy un niño de nuevo
   [G]          [A]
Inocente por tí
[Em]                        [D/F#]
Que ha encontrado en tus brazos
    [G]               [A]
Al Padre que hay en tí

           [D]          [Bm]
Es en Tu abrazo mi Señor
       [G]                [Gm]
Donde sé por fin quien soy
        [D]             [Bm]
En el milagro de Tu amor
          [G]           [A]
Que me ha dado identidad
          [D]           [Bm]
Es en tu abrazo mi Jesús
       [G]              [Gm]
Que recuerdo aquella cruz
          [D]          [Bm]
Donde tu fuiste a morir
     [G]        [A/C#]
Con brazos abiertos para mí

( [Bm]  [A/C#]  [D]  [G] )

[D]       [A/C#]
El pasado
              [Bm]         [G]
Borraste con tinta carmesí
[D]       [A/C#]
Me amaste
                [Bm]          [G]
Con tu herida sanaste mi dolor

[Em]                [D/F#]
Y soy un niño de nuevo
   [G]          [A]
Inocente por tí
[Em]                        [D/F#]
Que ha encontrado en tus brazos
    [G]               [A]
Al padre que hay en tí

           [D]          [Bm]
Es en Tu abrazo mi Señor
       [G]                [Gm]
Donde se por fin quien soy
        [D]             [Bm]
En el milagro de Tu amor
          [G]           [A]
Que me ha dado identidad
          [D]           [Bm]
Es en tu abrazo mi Jesús
       [G]              [Gm]
Que recuerdo aquella cruz
          [D]          [Bm]
Donde tu fuiste a morir
     G        A/C#        PUENTE
Con brazos abiertos para mí

( [F]  [Em]  [Bm]  [D] )

[F]         [Em]    [F]             [Em]
Es en tú abrazo donde esta mi paz
[Bm]        [F#m/D]   [Bm]             [D]
Es en tú abrazo donde esta mi hogar

[Em]                [D/F#]
Y soy un niño de nuevo
   [G]          [A]
Inocente por tí
[Em]                        [D/F#]
Que ha encontrado en tus brazos
    [G]               [A]
Al Padre que hay en tú

           [D]          [Bm]
Es en Tu abrazo mi Señor
       [G]                [Gm]
Donde se por fin quien soy
        [D]             [Bm]
En el milagro de Tu amor
          [G]           [A]
Que me ha dado identidad
          [D]           [Bm]
Es en tu abrazo mi Jesús
       [G]              [Gm]
Que recuerdo aquella cruz
          [D]          [Bm]
Donde tu fuiste a morir
     [G]        [A/C#]
Con brazos abiertos para mí

[Final] [Bm]  [A/C#]  [D]  [G]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/en-tu-abrazo/)', 1792249911, 1792249911, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (116, 1, 'Libre', 'Danilo Montero', 'D', NULL, 'Intro: [D] [C] [D] [C]

  [D]
//En mi Corazón
                 [C]
Hoy agradecido estoy.
[D]
Conocer Tú Amor
                    [C]
Me ha mostrado la verdad.

[G]                   [D]
Culpable fui de Tú dolor
[Em]                  [C]
A cambio recibí Tú Amor
[D]
Y en mi corazón
[C]                 [Em]
Hoy agradecido estoy. //

     -CORO- 
                [Bm]     [C]            [Em] [D]
///Me has hecho libre.....libre por Ti. ///
             [Bm]     [C]            [D]
Me has hecho libre.....libre por Ti.


E|---------------------------------------------------------------------| 
B|--------------2-------------------------3------3----------3--------3-| 
G|-0h2-2--0h2-3--3--0h2-2--0h2---2h4-0---------------0----------0------| 
D|-0---0--0---------0---0--0-----0---0------0h2------0h2s4-------4s2---| 
A|---------------------------------------3--3---3----------------------| 
E|---------------------------------------------------------------------| 

Pre-Coro
E|-7-------2-3-7--------0----------------------------------------| 
B|-8---5-3-----8--------1----------------------------------------| 
G|-------------9--------0----------------------------------------| 
D|---0------------------2----------------------------------------| 

Intro
E|--2h3-------------------------------------------------------| 
B|-------3h5--------------------------------------------------| 
G|------------------------------------------------------------| 
D|------------------------------------------------------------| 
A|------------------------------------------------------------| 


Estrofa

E|--2h3---5h7-----7h8-----------------------------------------| 
B|------------3h5---------------------------------------------| 
G|------------------------------------------------------------| 
D|------------------------------------------------------------| 
A|------------------------------------------------------------| 


Coro

E|-------------------------------------------| 
B|--7s5s3s5---8-8s7--------------------------| 
G|-------------------------------------------| 
D|-------------------------------------------| 
A|-------------------------------------------|', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/libre/)', 1792249912, 1792249912, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (117, 1, 'Directo Al Corazon', 'Danilo Montero', 'D', NULL, '[D]     [A] [Em] [G]           [D]
Fue así    como ver llover
    [C] [G]     [A]      [D]
En un    desierto.
    [A] [Em] [G]          [D]
Igual    al esclavo que
    [C] [G]      [A]         [Em]
Hallo   por fin su libertad.
           [F#m]
Me sorprendí
           [G]             [A]
Al ver que Tú llegaste a mí.

=CORO=

[D]          [C]
Directo al corazón
[G]       [A]         [Bm]
Al último rincón
  [C]                [G]
Entraste con Tú Amor.
[D]          [C]
Directo al corazón
[G]         [A]           [Bm]
Te hiciste mi pasíon
   [C]                [G]
Llenaste todo en mí.

[D]
  [A] [Em] [G]             [D]
Así    como un ciego que
     [C] [G]     [A]      [D]
La luz   descubre.
  [A] [Em] [G]            [D]
Así    como un ave que
    [C] [G]     [A]       [Em]
Hallo   sus alas y bolo
       [F#m]
Me sorprendí
            [G]             [A]
Al ver que Tú llegaste a Mi.

=CORO=

Después

[Em] [F#] [G] [F#]

[Em]       [F#m]          [G]
Eres mi Fé, Mi bendición
   [F#m]          [Em]
De Ti me enamore.
[Em]        [F#m]            [G]
Eres mi Amor, eres mi luz
   [F#m]         [Em]
de Ti me enamore.
[Em]       [F#m]               [G]
Eres mi Dios, mi inspiración
         [A]
Y mi canción.', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/directo-al-corazon/)', 1792249912, 1792249912, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (118, 1, 'Damos Honor A Tí', 'Danilo Montero', 'E', NULL, '[E]  [F#] [G#]  [B] [G#] [F#]
Da-mos ho-nor a ti
 [E]  [F#] [G#]  [C#] [G#] [F#]
Da-mos ho-nor a ti
 [F#] [G#] [A]   [A]  [A]  [G#]
Cre-a-dor de vi-da
[E]  [F#] [G#] [B]
E-res tu-u
 [E]  [F#] [G#]  [B] [G#] [F#]
Da-mos ho-nor a ti
 [E]  [F#] [G#]  [C#] [G#] [F#]
Da-mos ho-nor a ti
 [F#]  [G#]  [A]  [A]  [A]  [G#]   [F#]  [E]  [D#] [E]
Por-que no hay o-tro Dios co-mo tu
 [C#]  [D#] [E]  [C#]
Rey de re-yes
 [C#] [D#] [E]   [B]
Ad-mi-ra-ble
[B]  [B]  [B]    [C#]  [A]  [G#]    [F#]
E-res el prin-ci-pio y fin
 [C#] [D#] [EC#]  [C#] [D#]  [E]  [B]
So-be-ra-no y su-bli-me
[B]  [B]    [B]    [C#] [A]   [G#] [F#]
E-res nues-tro sal-va-dor', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/damos-honor-a-ti/)', 1792249913, 1792249913, 'E');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (119, 1, 'Es Jesús', 'Danilo Montero', 'Em', NULL, '01:46
E|---------------------------------------------------------------------|    
B|---------------------------------------------------------------------|    
G|---------------------------------------------------------------------|    
D|---------------------------------------------------------------------| X3 
A|-------------3---5---2-----------------------------------------------|    
E|-0---2---3-----------------------------------------------------------|    

   02:10               02:18
E|---------------------------12h14-15-17b18--17-15------------------------------| 
B|---------------------12h14-----------------------17--15-17-15-----------------| 
G|------------------------------------------------------------------------------| 
D|---------------------------------------------------------------10s12-13-12-10-| 
A|-------------3----------------------------------------------------------------| 
E|-0---2---3--------------------------------------------------------------------| 
Siempre te exaltaré...



E|------------------------------10s12--10-12s14--12-14h15-14--12-------| 
B|---------------------------------------------------------------------| 
G|--7h9h7---------------7h9s11-----------------------------------------| 
D|---------9-7s5----7s9------------------------------------------------| 
A|---------------------------------------------------------------------| 
E|---------------------------------------------------------------------| 

                                   02:35
E|---------------------------------15----------------------------------| 
B|-13-13s15-13-15s17-17b19b17--15--------------------------------------| 
G|---------------------------------------------------------------------| 
D|---------------------------------------------------------------------| 
A|---------------------------------------------------------------------| 
E|---------------------------------------------------------------------| 
                                        A Jesús mi Señor...




Las Notas son estas (Para que otro instrumento
las toque, mientras te toca el "solo" de guitarra):

[Em]  [D/F#]  [G] [C]  [D] [Bm]
Siempre te amaré
[Em]  [D/F]  [G] [C]  [D] [Bm]
siempre te adoraré
[Em]  [D/F#]  [G] [C]  [D] [Bm]
siempre te cantaré
[Em]  [D/F#]  [G] [C]
siempre te exaltaré...

[Em] [D] [G] [C]
[Em] [D] [G] [C] [D] [Em] [D] [G]
                A Jesús mi Señor...', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/es-jesus/)', 1792249913, 1792249913, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (120, 1, 'Cuanto Amo Tu Ley', 'Danilo Montero', 'Dm', NULL, '[Dm7]           [G7]
Cuanto amo tu ley
[Dm7]            [G7]
mi gozo es tu palabra
[Dm7]                [G7]
lampara es a mis pies
  [A#maj7]            [Am7]
y lumbrera a mi camminar

[Dm7]           [G7]
guardame en tu ley
[Dm7]           [G7]
sustentame en tu palabra
[Dm7]           [G7]
y siempre te alabare
   [A#maj7]            [Am7]
con rectitud de corazon

=CORO=
[Dm7]        [A#]         [A]
Cristo, tu palabra me alienta
[Dm7]        [A#]         [C]
Cristo, tu verdad me sustenta
[Dm7]        [A#]       [Am7]
Cristo, guiame en tu ley
  [Gm]        [A#]       [A]
y perfecto mi cammino sera', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/cuanto-amo-tu-ley/)', 1792249914, 1792249914, 'Dm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (121, 1, 'Fue en la cruz', 'Danilo Montero', 'C', NULL, '[Intro] // [C9]  [Am7]  [F]  [F9] //

[C9]                   [G]             [Am7]   [Am7/G]
   Si  fue en la  cruz   que yo encontré
    [F]
La paz y el gozo que llenan
   [Em7]                  [Am7]
La gracia que lo cambió todo
   [Dm7]               [G5]
Si yo encontré en Jesús

[C9]                   [G]          [Am7]   [Am7/G]
   Si fue en la  cruz   que pude ver
    [F]              [F9]
La condición de mi alma
   [Em7]            [Am7]
Lo lejos que me hallaba
   [Dm7]          [G5]
De su perfecto amor

                [C]                 [Am]
//Si  fue en la  cruz   que el Salvador
           [F]                 [G5]
Me dio su amor   y vida para siempre
             [C9]                 [Am7]
B  fue en A  cruz   que él canceló
       [F9]             [G4]           [G]
Todo deber que   condenaba mi ser//


[C9]                  [G]           [Am7]   [Am7/G]
   Si  fue en La cruz   donde al fin
    [F9]
Se abrió la puerta del cielo
     [Em7]           [Am7]
Y al Padre pude llegar
   [Dm7]       [G5]
En real adoración
[C9]                    [G]           [Am7]   [Am7/G]
   Si  fue en  la  cruz     que pude ver
   [F]               [F9]
La condición de mi alma
   [Em7]            [Am7]
Lo lejos que me hallaba
   [Dm7]         [G4]      [G]
De su perfecto amor



Final
[Am]     [F7M]     [F6(9)]  [F9]        [F]   [G4]
Fue en la             cruz          wu
[Am]      [F9]       [G4]     [G5]
Fue en la        cruz   wu', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/fue-en-la-cruz/)', 1792249914, 1792249914, 'C');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (122, 1, 'Jesucristo', 'Danilo Montero', 'Bm', NULL, '[Bm]          [F#m]            [G]
a)Hay un rio fluyendo del trono de Dios
     [Bm]          [F#m]            [G]
es un canto que sana a toda nación
     [Em]             [G]
es su Espíritu, levantándose
     [C]         [A]
para proclamar que:
          [Em]  [G]  [D]  [A]
b)Coro: Jesucristo es Soberano
          [Em]  [G]  [D]  [A]
        Jesucristo es Dios eterno
          [C#m]             [A]     [D]  [A]  [B]
        Jesucristo es el autor de mi salvación
          [Em]  [G]  [D]  [A]
        Jesucrsito es Torre Fuerte
          [Em]  [G]  [D]  [A]
        Jesucrsito es Rey de Reyes
          [C#m]             [A]     [D]  [A]  [B]
        Jesucristo es el autor de mi salvación.

a)Hay un canto fluyendo de mi corazón
es un celo que tengo del celo de Dios
es mi espíritu, levantándose
para proclamar que:
                       (coro)
       [C#m]         [A]
c)En mi vida siempre habrá
   [C#m]       [A]
un canto a mi Dios
  [F#m]      [A]
alabanza subirá,
  [D]  [A]     [B]
delante de mi Rey.

b)//Es Rey! Jesucristo es Rey!
es Dios! Jesucristo es Dios!//

*Al momento del ''solo'' de la Guitarra tu puedes continuar
con las notas del coro,en la introducción también.

Si kieren los punteos de la guitarra de cualkier canzión
del disco me escriben.
Chao!!God Bless You', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/jesucristo/)', 1792249915, 1792249915, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (123, 1, 'Dulce Amor', 'Danilo Montero', 'A#', NULL, '[A#]         [Dm] [A#7]             [D#]
Tu dulce amor bálsamo es a mi vida
[D#m]     [D#] [A#]               [E#]
se derramó para darme salvación
[A#]       [Dm]    [A#7]              [D#]
Tu hijo fue el precio por mis pecados
[D#m]       [D#]    [A#]              [E#]
su sangre es el sello de mi redención

CORO
[D#]          [E#]        [A#]   [D#]    [Dm]
Y no tengo mas que mi vida para dar
[D#]                    [A#]
mi voluntad y lo que soy
[D#]                 [E#]
ofrenda son en tu altar
  [D#]       [E#]      [A#]       [D#]   [Dm]
y mi decisión es vivir solo para tí
   [D#]          [A#]
y responder a este amor
      [D#]          [E#]  [A#]
que conquistó mi corazón', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/dulce-amor/)', 1792249915, 1792249915, 'A#');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (124, 1, 'Una Vez Más', 'Danilo Montero', 'A', NULL, '[A]                         [D]       [E]          [A]
Cuando estoy en tu presencia me lleno de tu paz

[A]                    [D]         [E]            [A]
Cuando miro tu grandeza  entiendo que eres real

[A]                   [D]          [E]         [A]
Cuando veo tu esencia y comprendo tu bondad

[A]                     [D]        [E]         [A]     [A7]
Cuando admiro tu belleza entiendo tu verdad



[A7]      [D]       [E]          [A]
Y tu amor me llena una vez más

[A7]     [D]    [E]     [A]
al poderte hoy cantar

[A7]      [D]       [E]          [A]
Y tu amor me llena una vez más

[A7]    [D]    [E]    [A]
al poderte adorar.



DESPUES SE D PITE EL CANTO DE NUEVO
Y CAMBIA DE ACORDES DE A  BG UIENTE
MANERA:

[A] = [C]
[A7]= [C7]
[D] = [F]
[E] = [G]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/una-vez-mas/)', 1792249916, 1792249916, 'A');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (125, 1, 'Dia de Jubileo', 'Danilo Montero', 'Bm', NULL, '[Bm]
Alza tu vista hacia el cielo
[F#m]                       [Bm]
celebra la grandeza del Señor
[E9]                           [Em]
con manto de alegría te ha vestido
[F#]                           [Bm]
con gloria en lugar de aflicción
[Bm]
Alza tus manos hacia el cielo
[F#m]                   [Bm] [Bbm] [Am] [Abm]
cercana esta tu redención
[E9]                           [Em]
proclama libertad a los cautivos
[F#]                     [Bm]
declara sanidad del corazón

              [G]                [Bm]
es dia de jubileo, vamos a celebrar
[F#m]                               [Bm] [Bbm] [Am] [Abm]
es tiempo de gozarse en la casa de adonai
              [G]                [Bm]
es dia de jubileo, alegra el corazón
             [Em]              [F#]          [Bm]
hagamos una fiesta en la presencia del Señor', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/dia-de-jubileo/)', 1792249916, 1792249916, 'Bm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (126, 1, 'Todo Lo Que Respira', 'Danilo Montero', 'G', NULL, '[G]                        [C]
Todo lo que respira
[Bb]                        [F]
Alabe al señor de la tierra y el mar
[G]                          [C]
Todo lo que se mueve
[Bb]                        [D]
Alabe al creador de todo lo que hay

[F]         [C]                [G]
Alabale en su santuario
       [F]                       [C]           [G]
Por la majestad de su firmamento
[Bb]                                [F]
Alabale por sus proezas
        [Am]                [D]
Y por todas sus grandezas

[F]                     [C]             [G]
Alabale con salterio y el arpa
              [F]         [C]          [G]
Con pandero y danza alaba
   [Bb]                       [F]
Alabale con cuerdas y flautas
           [Am]                       [D]
Y con gritos de jubilo alabale', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/todo-lo-que-respira/)', 1792249917, 1792249917, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (127, 1, 'Echad La Hoz', 'Danilo Montero', 'Cm', NULL, '[Intro] [Cm9]  [Fm7]  [Cm9]  [Fm7]

[Cm9]                       [Fm7]
Luz en las tinieblas, esperanza quiero ser
[Cm9]                      [Fm7]           [G#7]
Luz en las naciones, un nuevo amanecer
[Cm9]                  [Fm7]
Y como el profeta promesas compartir
[Cm9]                   [Fm7]
A un mundo herido, sediento de amor

     [Ab7M]       [Bb/G]          [Cm9]
Y echad sobre la tierra nuestra hoz
     [Ab7M]         [Bb/G]         [Cm9]
Y segad los campos blancos del Señor
 [Bm7] [Ab7M]         [Bb/G]       [Cm9]   [Ab7M]
Cosechad con gran entrega y pasión
     [Ab7M]    [Ab7M]   [Bb/G]  [Fm7]  [G#7]
El fruto de su amor', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/echad-la-hoz/)', 1792249917, 1792249917, 'Cm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (128, 1, 'Que Tu Río Fluya', 'Danilo Montero', 'D', NULL, '::Intro::

[D]  [G]    [A]  [G]    [D]  [G]    [A]  [G]
[D]  [G]    [A]  [G]    [D]  [G]    [A]  [G]
[D]  [G]    [A]  [G]    [D]  [G]    [A]  [G]
[D]  [G]    [A6/9]

::Verso I::

   [D]  [G]       [A]  [D]     [G]     [A]     [E]
//Refrescanos   con tu agua viva
          [G]              [A]   [D/A]   [G/A]    [D/A]
solo de Tí  tenemos sed
 [D]  [G]    [A]  [D]        [G]  [A]    [E]
bautizanos con tal alegria
            [G]              [A]
que inunde todo nuestro ser//

::Coro::

 [D/A]   [D]     [G]    [A]    [G]
Deja que tu rio fluya
   [D]   [G]       [A]   [G]
a cada corazon
    [D]     [G]      [A]    [G]
Señor manda tu lluvia
[G/A]  [G]                 [A]
  derrama de tu bendicion//

::Verso II::

[A]       [G]       [A/G]    [F#m7]        [Bm7]
  Eres Tú Jesus   el manantial de Vida
     [G]          [A/G]  [Em]     [A7]
la fuente inagotaaable de amor.

::::

[A#7] [A9/B]
[E]  [A]    [B]  [A]    [E]  [A]
B  A    E  A    B  (Modulacion a E)

::Coro:

 [A]     [E]     [A]    [B]    [A]
Deja que tu rio fluya
   [E]    [A]       [B]   [A]
a cada corazón
    [E]     [A]      [B]    [A]
Señor manda tu lluvia
[A/B]  [A]                 [B]
  derrama de tu bendicion//

::Final::
    [E]      [A]      [B]   [A]
(Señor manda tu lluvia
[A/B]  [A]  [C#m]   [A/B]   [B6]    [E]   [B]  [F#/E]
de rra maaa   de Tu Bendición)

Espero que les gustes! con amor.. Eduardo and Roberto.', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/que-tu-rio-fluya/)', 1792249918, 1792249918, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (129, 1, 'Usa mi vida', 'Danilo Montero', 'F#m', NULL, 'INTRO:

          B(B  MAYOR)          C(C  MAYOR)

    LO DE ABAJO ES CON A  ESCAA  DE C S CUERDAS.

E|---2-------2------------3---------3-----------------| 
B|-------4--------4------------5---------5------------| 
G|-------------------------------------------4-6-2-4--| 

  DESPUES DE ESO ES UN  B DISE NUIC  PLUMEAC  Y LUEGO
   EMPIEZA A  CANCION.

           [F#m]     [B]
   USA E  VIDA SEÑOR

             [E]    [E7]
   USA E  VIDA

                [F#m]
   YO QUIERO SERVIRTE

                   [B]
   CON TODAS LOAS FUERZAS,

              [E]       [E7]
    DE E  CORAZON

            [F#m]    [B]
   USA E  VIDA SEÑOR

            [E]     [E7]
   USA E  VIDA

               [F#m]
   YO QUIERO AMARTE

                  [B]             [E]     [E7]
   CON TOC  EL CARIÑO DE E  CORAZON


                   [A]
   AUNQUE INDIGNO SOY


                 [A]
   AUNQUE NADA TENGO


                                [B]
  QUE PUEDA OFDCE RTE DIVINO SEÑOR     SE HACE A  PROGD B ON
                                       DE A  ESCAA  DE C S CUERDAS
                                       PARA CAER A B
                    [B]
   YO QUIERO SERVIRTE


                     [B]
  CON TODAS AA S FUERZAS


               [E]       [E7]
   DE E  CORAZON.


DEPUES DE AQUI BG UE UN D QUINTO Y LUEGO SE D PITE TODA
A  CANCION Y OTRO D QUINTO Y LUEGO SUBE MEDIO TONO Y SE
TERE NA CON EL E SMO INTRO AQUI LES PON GO LOS D  QUINTOS

  M:BG NIFICA MARTLA R.
                        ESTO DE AQUI SE HACE CO A  ESCAA  DE C S CUERDAS
E|----------7---------------------------------------7----------| 
B|--7M9-7-9---9-7-----| 8---7---8---7---8---7-- -7-9---9-------- 
G|----------------9------9---8---9---8---9---8----------9------| 
                      DE AQUI    A        AQUI

E|-------------------------------------------------------------| 
B|------7-----------7-9-11--10-9-------------------------------| 
G|--7-9---9-7-5-7-9--------------------------------------------| 

 DESPUES DE ESTA PARTE SE D  PITE A  CANCION Y BG UE EL OTRO D QUINTO



E|------7-------------------------------9-7----9-7-9-7-9-7------| 
B|--7-9---9-7---9-7-9-7-9-7---7-9--7-9--------------------------| 
G|------------9-------------------------------------------------| 

E|-----------------------------------------------7------------7-10-9-8-7-------| 
B|-----------------------------9-7-9-7-9-7--7-9-----9-------9------------9-8-7-| 
G|-------4--------------------------------------------9---8--------------------| 
D|---4/6---6-4---0--4/6---4/6--------------------------------------------------| 
A|-------------6---------------------------------------------------------------| 


 A  PARTE FINAL DEL D QUINTO ES ALGO RA PIDA AB  QUE HABER B  NO ES DIFICIL
 A  / DIAGONAL BG NIFICA DESLIZARSE HASTA EL ORTO TRASTE ESCUCHENA  CON DETENIEE NTO
 Y SERA MAS FC IL AL  CAB  AL FINAL SUBE MEDIO TONO DE F#m A Gm  ES EN EL ULTIMO CORO:

                  [A]
 AUNQUE INDIGNO SOY

                  [A]
 AUNQUE NADA  TENGO

                            B      SE HACE A  PROGD B O
                                   DE ESCAA
QUE PUEDA OFDCE RTE DIVINO SEÑOR

                  [B]
 YO QUIERO SERVIRTE

                    [B]
 CON TODAS A S FUERZAS

                                 [E]    [E7]  [F7]
 CON TODAS A S FUERZAS DE E  CORAZON


                 [A#]
 AUNQUE INDIGNO SOY


                 [A#]
  AUNQUE NADA TENGO


                               [C]
 QUE PUEDA OFDCE RTE DIVINO SEÑOR


                 [C]
 YO QUIERO SERVIRTE

                     [C]
 CON TODAS A S FUERZAS



 CON TODAS A S FUERZAS DE E  CORAZON.


 SE D PITE EL ITRO DE A  CANCION MEDIO TONO ADEA NTE
 ESO ES TOC  ES UNA AABA NZA MUY BONITA ESPERO ESTEN
 TOC S BIEN LES MANC  UN SALUC  A E  IGLEBA  FUENTE DE
 VIDA A E  PASTOR MANEUL CORRAL Y A TOC S LOS JOVENES
 ETC. EN ESPECIAL DE QUIE ESTOY ENAMORAC  Y PRONTO ME
 CASAD  E  NOVIA TANIA GRACIAS DIO POR PONERA  EN E  VIDA
 ED S LO MAXIMO QUEI EN EL MUNC  PARA E  A E S PAPAS
 BUENO ATOC S DIOS LOS BENDIGA CUALQUIER PETICION DUDA ETC,
 YA SABEN E  E-MAIL. SALUC  A COLOMBIA .', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/usa-mi-vida/)', 1792249918, 1792249918, 'F#m');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (130, 1, 'Admirable', 'Danilo Montero', 'Dm', NULL, '[Dm7]            [Bb]        [F]            [C]
Con poder y autoridad  nuestro Dios venció a
           [Dm7]               [Bb]          [Am7]
La muerte, sobre el trono celestial siempre
        [Dm7]
Reinará

 [Bb]         [C]        [Bb]         [Gm7]
Sentado en majestad suyo es el reino por los
[F]   [C]  [Bb]            [C]     [Bb]          [Gm7]
Siglos  y por la eternidad su luz de gloria
         [Am7]
Brillará

      [C] [Dm7]      [C] [Dm7]  [Bb]
Admirable, conseje-ro   mi  Dios
      [C]    [Dm7] [Am7]      [C] [Dm7]     [C]   [Dm7]
Consolador,       eres dig-no de alabanza
[Bb]   [C]        [Dm7]
Príncipe de paz

[Solo]

 [A]  [E]  [F#m]  [B]
 [A]  [E]  [G#m]', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/admirable/)', 1792249919, 1792249919, 'Dm');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (131, 1, 'Hoy Y Siempre Te Alabaré', 'Danilo Montero', 'Em', NULL, '[Em]                             [D/C]   [Cmaj7]
Por la gracia de tu nombre,te alabare
[Em]                              [C/D]   [Cmaj7]
por la historia del calvario te adorare
[D]
por tu vida,por tu muerte
       [G]      [D/F#]     [Em]
por tu sangre en la cruz
[Am7]            [D]               [Em]
por tu amor inexplicable,te alabare.
(la parte que sigue es igual al principio
solo varia un poco al final)

Con toda la devocion te alabare
con toda mi gratitud te,te exaltare
con mi vida,con mi mente
con mi alma y corazon
[C]               [D]            [Em]
con todas mis fuerzas,te alabare.

        [G]     [D]        [Em]
Te alabare Señor,te alabare//
[C]        [D]     [G]    [D/F#] [Em]
nada ni nadie entre tu y yo
[C2]      [D2]         [Em]
hoy y siempre te alabare.

Bellisima cancion que inspira una verdadera adoracion
y gratitud para nuestro Dios por la obra en la cruz
 del calvario por amor a nosotros.', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/hoy-siempre-te-alabare/)', 1792249919, 1792249919, 'Em');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (132, 1, 'Me Gusta Estar En Tu Casa', 'Danilo Montero', 'G', NULL, '[G]                       [C]
//Me gusta estar en tu casa
     [G]                [D]
Selevrando con tu pueblo
[G]                [C]
Me gusta darte honor
          [G]   [C] [D]  [G]
con mis manos y mi voz//
G                 c
tu eres mi roca firme
G  (No hay acorde)G     C
tu   ^  eres mi roca fuerte
G  (No hay acorde)G
tu   ^  eres mi roca y mi senor

(CORO)
  [C]                       [D]
//Yo te alabo con sinceridad
[Bm]                    [Em]
yo te alabo con fidelidad
[C]                       [D]      [G]
yo te alabo con sinceridad y amor//

En noy hay acorde rapido te debuelbes a G
y Se repite toda la cancion
en la otra pagina esta el requinteo', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/me-gusta-estar-en-tu-casa/)', 1792249920, 1792249920, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (133, 1, 'Dios de Amor', 'Danilo Montero', 'D', NULL, '[Intro] [D]  [Gmaj9]  [D]  [Gmaj9]

          [D]                 [Gmaj9]
Dios de Amor, justo y redentor
               [Bm]           [A]          [Gmaj9]
Perfecto en misericordia, gracia y perdón
            [D]                [Gmaj9]
Me viste a mí siendo un pecador
              [Bm]          [A]              [E7/G#] ([E7]) [Gmaj9]
Con ojos de amor y compasión llegaste a mí

                  [D]
Tú amor me cautivó
               [Gmaj9]
Ahora puedo vivir
                   [Bm]        [A]            [Gmaj9]
En la paz que hoy recibí al encontrarme en ti
                 [D]
Tú amor me cautivo
               [Gmaj9]
Ahora puedo vivir
             [Bm]          [A]           [G]
Solo por tu libertad y gracia sobre mi
[D]
Dios de Amor

( [D]  [Gmaj9] )

Dios de Amor, justo y redentor

Tú amor me cautivó,Ahora puedo vivir

[D]
Dios de Amor

( [Bm]  [A]  [G] )
( [Bm]  [A]  [G] )

          [Bm]
Dios de Amor
[A]              [G]
       De perdón
       [Bm]
Salvador
[A]                 [E7/G#]   [Gmaj9]
        Dios de amor

Tú amor me cautivó,Ahora puedo vivir

       [Bm]  [A]  [E7/G#]  [G]
Sobre mi!

          [D]  [Gmaj9]  [D]  [Gmaj9]
Dios de Amor', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/dios-de-amor/)', 1792249920, 1792249920, 'D');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (134, 1, 'Nadie Como Tú', 'Danilo Montero', 'G', NULL, '[G]        [D/F#]   [Em7]
nadie es como tu
[Cmaj7]    [Am7]         [Dsus4]      [D]
nadie mas llena mi ser como tu
[G]             [D/F#]    [Em7]
por la eternidad podria buscar
[C7]     [Am7]        [D]
mas no hay nadie como tu

se repite varias veces.

despues sigue esto.
[C9]           [D]           [Gsus]    [G]
tu misericordia es como un rio
[C9]         [D]          [G]
tus manos traen sanidad
[C9]          [D]            [Em7]      [G/B]
los niños hayan en ti su refugio
[C]               [Dsus4]     [D]
nadie es como tu.

[G]         [D/F#]   [Em7]
nadie es como tu
[Cmaj7]    [Am7]          [Dsus4]      [D]
nadie mas llena mi ser como tu
[G]             [D/F#]    [Em7]
por la eternidad podria buscar
[C7]     [Am7]         [D]
mas no hay nadie como tu.

(sube un tono.)

[A]       [E/G#]    [F#m7]
nadie es   como tu
[Dmaj7]    [Bm7]        [Esus4]      [E]
nadie mas   llena mi ser como tu
[A]             [E]        [F#m7]
por la eternidad podria buscar
[D]      [Bm7]         [E]
mas no hay nadie como tu.', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/nadie-como-tu/)', 1792249921, 1792249921, 'G');
INSERT OR REPLACE INTO songs (id, owner_id, title, artist, original_key, tempo, content_chordpro, notes, created_at, updated_at, current_key) VALUES (135, 1, 'Canta Al Señor', 'Danilo Montero', 'A', NULL, '[A]        [F#m]       [D]      [E]
  Cante al Señor toda la creación
   [A]        [F#m]       [D]       [E]
  Honra y Poder Majestad sea al Rey
    [F#m]              [D]
  Montes ceran y el mar rugirá
      [E]          [D]   [E]
  al sonar de su nombre.

   [A]        [F#m]       [D]      [E]
  Canto con gozo al mirar su poder
   [A]        [F#m]       [D]      [E]
  Por siempre yo te amaré y diré
    [F#m]          [D]         [E]    [A]
  Incoparables promesas me das Señor.
Puente: A E F#m E A

   [A]        [E]         [F#m]    [E]    [D]
  Mi Cristo,  Mi Rey nadie es como tu
           [A]      [D]      [A]
  Toda mi Vida,  quiero exaltar
 [F#m]             [G]  [Bm]   [E]
  Las maravillas de tu Amor.

   [A]        [E]          [F#m]       [E]        [D]
  Consuelo ,  Refugio,  Torre de fuerza y poder
           [A]    [D]          [A]  [F#m]             [G]  [Bm]  [D]   [E7]
  Toda mi ser,  lo que yo soy nunca cese de adorar', 'Importada de CifraClub (https://www.cifraclub.com/danilo-montero/canta-al-senor/)', 1792249921, 1792249921, 'A');
DELETE FROM setlists;
INSERT OR REPLACE INTO setlists (id, owner_id, group_id, name, event_date, notes) VALUES (1, 1, NULL, 'alabanza domingo', '2026-10-17', NULL);
DELETE FROM setlist_items;
INSERT OR REPLACE INTO setlist_items (id, setlist_id, song_id, position, key_override, notes) VALUES (1, 1, 1, 0, NULL, NULL);
COMMIT;
PRAGMA foreign_keys = ON;
