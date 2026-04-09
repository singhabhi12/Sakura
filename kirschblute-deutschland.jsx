import { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SPOTS = [
  // ── BONN / NRW ──────────────────────────────────────────────────────────
  { id: 1, name: "Heerstraße", city: "Bonn", state: "NRW", lat: 50.7367, lng: 7.0897, status: "peak", trees: 60, crowd: "busy", gem: false,
    desc: "Germany's most famous cherry blossom tunnel. A complete pink canopy over the entire street.",
    descDE: "Deutschlands berühmtester Kirschblütentunnel. Ein vollständiges rosafarbenes Blätterdach über der gesamten Straße.",
    tags: ["iconic", "photography"], transit: "U-Bahn to Nordstadt" },
  { id: 2, name: "Breite Straße", city: "Bonn", state: "NRW", lat: 50.7355, lng: 7.0985, status: "peak", trees: 40, crowd: "moderate", gem: false,
    desc: "Beautiful blossoms framing the Altstadt sign — slightly less crowded than Heerstraße.",
    descDE: "Wunderschöne Blüten, die das Altstadt-Schild einrahmen — etwas weniger belebt als die Heerstraße.",
    tags: ["historic", "photography"], transit: "Walk from Bonn Hbf" },
  { id: 3, name: "Maxstraße", city: "Bonn", state: "NRW", lat: 50.7360, lng: 7.0960, status: "peak", trees: 25, crowd: "quiet", gem: true,
    desc: "Quieter residential street parallel to Heerstraße with beautiful mature trees.",
    descDE: "Ruhigere Wohnstraße parallel zur Heerstraße mit wunderschönen alten Bäumen.",
    tags: ["hidden gem", "quiet"], transit: "Walk from Heerstraße" },
  { id: 4, name: "Bad Godesberg Villenviertel", city: "Bonn", state: "NRW", lat: 50.6865, lng: 7.1515, status: "peak", trees: 80, crowd: "quiet", gem: true,
    desc: "Elegant villa district in Bonn's former diplomatic quarter with mature cherry trees. Far fewer visitors than Heerstraße.",
    descDE: "Elegantes Villenviertel im ehemaligen Bonner Diplomatenviertel mit alten Kirschbäumen. Weitaus weniger Besucher als die Heerstraße.",
    tags: ["hidden gem", "diplomatic quarter"], transit: "U16/U63 to Bad Godesberg" },
  { id: 5, name: "Hofgarten / Kö-Bogen", city: "Düsseldorf", state: "NRW", lat: 51.2300, lng: 6.7770, status: "peak", trees: 50, crowd: "moderate", gem: false,
    desc: "Large cherry trees against Düsseldorf's contemporary architecture at Kö-Bogen. Continue through the park to the Kunstakademie.",
    descDE: "Große Kirschbäume vor Düsseldorfs zeitgenössischer Architektur am Kö-Bogen. Weiter durch den Park zur Kunstakademie.",
    tags: ["architecture", "park"], transit: "U Steinstr./Königsallee" },
  { id: 6, name: "Japanischer Garten Nordpark", city: "Düsseldorf", state: "NRW", lat: 51.2657, lng: 6.7905, status: "peak", trees: 60, crowd: "moderate", gem: true,
    desc: "Authentic Japanese garden within Nordpark with cherry blossoms over stone lanterns and koi ponds. Fewer crowds than the Hofgarten.",
    descDE: "Authentischer japanischer Garten im Nordpark mit Kirschblüten über Steinlaternen und Koi-Teichen. Weniger Besucher als der Hofgarten.",
    tags: ["japanese garden", "hidden gem"], transit: "U78/U79 to Nordpark/Aquazoo" },
  { id: 7, name: "Schulstraße, Kreuzviertel", city: "Münster", state: "NRW", lat: 51.9570, lng: 7.6195, status: "peak", trees: 30, crowd: "moderate", gem: false,
    desc: "For 30 years, this street has attracted photographers from across Germany. Southern section between Lazarettstraße and 'Mutter Birken'.",
    descDE: "Seit 30 Jahren zieht diese Straße Fotografen aus ganz Deutschland an. Südlicher Abschnitt zwischen Lazarettstraße und 'Mutter Birken'.",
    tags: ["photography", "street"], transit: "Walk from Münster Hbf" },
  { id: 8, name: "Stadtbibliothek Courtyard", city: "Köln", state: "NRW", lat: 50.9415, lng: 6.9500, status: "peak", trees: 20, crowd: "moderate", gem: false,
    desc: "The entire courtyard outside Cologne's city library lined with cherry blossoms. Urban sakura at its best.",
    descDE: "Der gesamte Innenhof der Kölner Stadtbibliothek ist mit Kirschblüten gesäumt. Urbane Sakura vom Feinsten.",
    tags: ["urban", "library"], transit: "U Neumarkt" },
  { id: 9, name: "Rüttenscheider Straße", city: "Essen", state: "NRW", lat: 51.4325, lng: 6.9960, status: "peak", trees: 25, crowd: "quiet", gem: true,
    desc: "Cherry blossoms along Essen's charming shopping street. Cafés and boutiques make it a perfect spring afternoon.",
    descDE: "Kirschblüten entlang Essens charmanter Einkaufsstraße. Cafés und Boutiquen machen es zu einem perfekten Frühlingsnachmittag.",
    tags: ["shopping", "cafes"], transit: "U Rüttenscheid" },
  { id: 10, name: "Gerhard-Malina-Straße", city: "Dinslaken", state: "NRW", lat: 51.5640, lng: 6.7405, status: "peak", trees: 35, crowd: "quiet", gem: true,
    desc: "Pedestrian and cycle path turned into a pink stage. Detour to the nearby listed Lohberg colliery neighbourhood.",
    descDE: "Fuß- und Radweg als rosafarbene Bühne. Abstecher zur nahegelegenen denkmalgeschützten Lohberger Zechensiedlung.",
    tags: ["hidden gem", "pedestrian"], transit: "RE to Dinslaken" },
  { id: 11, name: "Westerwinkel Castle", city: "Ascheberg", state: "NRW", lat: 51.7655, lng: 7.6730, status: "peak", trees: 40, crowd: "quiet", gem: true,
    desc: "Baroque castle in an English garden. Pink flowers against green park and sandstone walls. Outdoor area always accessible.",
    descDE: "Barockes Schloss in einem englischen Garten. Rosa Blüten vor grünem Park und Sandsteinmauern. Außenbereich stets zugänglich.",
    tags: ["hidden gem", "castle", "free"], transit: "Car recommended" },
  { id: 12, name: "Büdericher Allee", city: "Meerbusch", state: "NRW", lat: 51.2800, lng: 6.6800, status: "peak", trees: 150, crowd: "moderate", gem: false,
    desc: "Cherry blossom avenue in the Rhine-side town of Meerbusch — a local alternative to the crowds of Bonn and Düsseldorf.",
    descDE: "Kirschblütenallee in der rheinnahen Stadt Meerbusch — eine lokale Alternative zu den Massen in Bonn und Düsseldorf.",
    tags: ["avenue", "local favourite"], transit: "S6 to Meerbusch-Büderich" },
  { id: 13, name: "Langer Kampe", city: "Bielefeld", state: "NRW", lat: 52.0284, lng: 8.5308, status: "peak", trees: 240, crowd: "busy", gem: false,
    desc: "One of Germany's most beautiful cherry blossom avenues — 240 trees lining over a kilometre of road. A local institution every spring.",
    descDE: "Eine der schönsten Kirschblütenalleen Deutschlands — 240 Bäume säumen über einen Kilometer Straße. Ein frühjahrliches Spektakel.",
    tags: ["avenue", "iconic"], transit: "Bus from Bielefeld Hbf" },
  { id: 14, name: "Frankenberger Viertel", city: "Aachen", state: "NRW", lat: 50.7782, lng: 6.0811, status: "peak", trees: 30, crowd: "quiet", gem: true,
    desc: "Hidden residential quarter in Aachen where ornamental cherry trees line quiet streets — the westernmost cherry gem in Germany.",
    descDE: "Verstecktes Wohnviertel in Aachen, wo Zierkirschen ruhige Straßen säumen — der westlichste Kirschblüten-Geheimtipp Deutschlands.",
    tags: ["hidden gem", "residential"], transit: "Bus from Aachen Hbf to Frankenberger Viertel" },

  // ── BERLIN ───────────────────────────────────────────────────────────────
  { id: 15, name: "Bornholmer Straße", city: "Berlin", state: "Berlin", lat: 52.5502, lng: 13.3895, status: "partial", trees: 215, crowd: "moderate", gem: false,
    desc: "Cherry trees line the former Berlin Wall border strip. History meets blossoms at the first crossing point that opened on Nov 9, 1989.",
    descDE: "Kirschbäume säumen den ehemaligen Berliner Mauerstreifen. Geschichte trifft Blüten am ersten Grenzübergang vom 9. November 1989.",
    tags: ["historic", "berlin wall"], transit: "S-Bahn Bornholmer Str." },
  { id: 16, name: "TV-Asahi-Allee", city: "Berlin/Teltow", state: "Berlin", lat: 52.3975, lng: 13.3160, status: "partial", trees: 1000, crowd: "busy", gem: false,
    desc: "The longest cherry blossom avenue in Berlin — 2km of 1,000+ trees donated by Japanese TV station TV-Asahi after reunification.",
    descDE: "Die längste Kirschblütenallee Berlins — 2 km mit über 1.000 Bäumen, gespendet vom japanischen TV-Sender TV-Asahi nach der Wiedervereinigung.",
    tags: ["iconic", "avenue"], transit: "S Lichterfelde Süd" },
  { id: 17, name: "Gärten der Welt", city: "Berlin", state: "Berlin", lat: 52.5395, lng: 13.5760, status: "budding", trees: 80, crowd: "moderate", gem: false,
    desc: "Japanese garden with 80 cherry trees inside the Gardens of the World. Annual Cherry Blossom Festival in April.",
    descDE: "Japanischer Garten mit 80 Kirschbäumen in den Gärten der Welt. Jährliches Kirschblütenfest im April.",
    tags: ["garden", "festival"], transit: "U5 Kienberg" },
  { id: 18, name: "Ceciliengärten", city: "Berlin", state: "Berlin", lat: 52.4720, lng: 13.3395, status: "partial", trees: 30, crowd: "quiet", gem: true,
    desc: "Hidden 1920s residential garden complex. Hardly anyone ventures here — stunning cherry alleys at both ends of the oval park.",
    descDE: "Versteckter Wohngartenpark aus den 1920er-Jahren. Kaum jemand verirrt sich hierhin — atemberaubende Kirschalleen an beiden Enden.",
    tags: ["hidden gem", "quiet", "historic"], transit: "U Friedenau" },
  { id: 19, name: "Zeiss Planetarium Park", city: "Berlin", state: "Berlin", lat: 52.5382, lng: 13.4285, status: "partial", trees: 20, crowd: "quiet", gem: true,
    desc: "Underrated park surrounding the planetarium dome. Cherry trees against the metallic dome create a surreal spring scene.",
    descDE: "Unterschätzter Park rund um die Planetariumskuppel. Kirschbäume vor der metallischen Kuppel schaffen eine surreale Frühlingsszene.",
    tags: ["hidden gem", "unique"], transit: "Tram Prenzlauer Allee" },
  { id: 20, name: "Ludwigkirchplatz", city: "Berlin", state: "Berlin", lat: 52.4923, lng: 13.3180, status: "budding", trees: 15, crowd: "quiet", gem: true,
    desc: "Charming Wilmersdorf square with manicured gardens and cherry trees. Perfect for a peaceful picnic.",
    descDE: "Charmanter Wilmersdorfer Platz mit gepflegten Gärten und Kirschbäumen. Perfekt für ein friedliches Picknick.",
    tags: ["hidden gem", "picnic"], transit: "U Spichernstr." },
  { id: 21, name: "East Side Gallery Park", city: "Berlin", state: "Berlin", lat: 52.5050, lng: 13.4395, status: "partial", trees: 70, crowd: "moderate", gem: false,
    desc: "70 Japanese Kanzan cherry trees along the Spree behind the East Side Gallery. Planted in 2001.",
    descDE: "70 japanische Kanzan-Kirschbäume entlang der Spree hinter der East Side Gallery. Gepflanzt im Jahr 2001.",
    tags: ["riverside", "historic"], transit: "S Ostbahnhof" },
  { id: 22, name: "Wollankstraße", city: "Berlin", state: "Berlin", lat: 52.5645, lng: 13.3890, status: "partial", trees: 120, crowd: "quiet", gem: true,
    desc: "Former death strip near the train tracks. Bubblegum-pink petals visible from the S-Bahn window.",
    descDE: "Ehemaliger Todesstreifen nahe den Bahngleisen. Knallrosa Blütenblätter, die man aus dem S-Bahn-Fenster sehen kann.",
    tags: ["hidden gem", "berlin wall"], transit: "S Wollankstr." },
  { id: 23, name: "Moritzplatz / Kreuzberg", city: "Berlin", state: "Berlin", lat: 52.5032, lng: 13.4105, status: "partial", trees: 15, crowd: "quiet", gem: true,
    desc: "Local secret near Kommandantenstraße. Grab a gözleme at nearby Backery & Coffee afterward.",
    descDE: "Lokales Geheimnis nahe der Kommandantenstraße. Danach ein Gözleme bei Backery & Coffee in der Nähe genießen.",
    tags: ["hidden gem", "local tip"], transit: "U Moritzplatz" },
  { id: 24, name: "Schwedter Straße", city: "Berlin", state: "Berlin", lat: 52.5457, lng: 13.4075, status: "partial", trees: 80, crowd: "busy", gem: false,
    desc: "Pink canopy avenue in trendy Prenzlauer Berg, running parallel to the Mauerpark. Cherry trees create a full tunnel effect.",
    descDE: "Rosafarbene Allee in Prenzlauer Berg, parallel zum Mauerpark. Kirschbäume schaffen einen vollständigen Tunneleffekt.",
    tags: ["avenue", "prenzlauer berg"], transit: "U2 to Senefelderplatz" },

  // ── HAMBURG ──────────────────────────────────────────────────────────────
  { id: 25, name: "Alster Waterfront", city: "Hamburg", state: "Hamburg", lat: 53.5660, lng: 9.9940, status: "budding", trees: 200, crowd: "moderate", gem: false,
    desc: "Cherry trees lining the Outer Alster create Hamburg's signature spring walk. Waterfront sakura views unique in Germany.",
    descDE: "Kirschbäume entlang der Außenalster schaffen Hamburgs charakteristischen Frühlingsspaziergang. Einzigartige Ufer-Sakura in Deutschland.",
    tags: ["waterfront", "scenic walk"], transit: "U Hallerstr." },
  { id: 26, name: "Planten un Blomen", city: "Hamburg", state: "Hamburg", lat: 53.5612, lng: 9.9810, status: "budding", trees: 100, crowd: "moderate", gem: false,
    desc: "Japanese ornamental cherries in Hamburg's beloved park. The Japanese garden section is especially beautiful.",
    descDE: "Japanische Zierkirschen in Hamburgs beliebtem Park. Der japanische Gartenbereich ist besonders schön.",
    tags: ["park", "japanese garden"], transit: "U St. Pauli" },
  { id: 27, name: "Kennedybrücke", city: "Hamburg", state: "Hamburg", lat: 53.5570, lng: 9.9960, status: "budding", trees: 40, crowd: "quiet", gem: true,
    desc: "Cherry trees on the Kennedy Bridge — a quieter spot with Alster views. Part of the 1968 Japanese planting.",
    descDE: "Kirschbäume auf der Kennedybrücke — ein ruhigerer Ort mit Alsterblick. Teil der japanischen Pflanzung von 1968.",
    tags: ["hidden gem", "bridge"], transit: "Bus Kennedybrücke" },
  { id: 28, name: "Alsterkrugchaussee", city: "Hamburg", state: "Hamburg", lat: 53.6150, lng: 10.0180, status: "budding", trees: 60, crowd: "quiet", gem: true,
    desc: "A 4km walk through several districts surrounded by cherry trees. Gets you away from the city centre crowds.",
    descDE: "Ein 4 km langer Spaziergang durch mehrere Stadtteile, umgeben von Kirschbäumen. Weg vom Stadtzentrumstrubel.",
    tags: ["hidden gem", "long walk"], transit: "Bus Alsterkrugchaussee" },
  { id: 29, name: "Altonaer Balkon", city: "Hamburg", state: "Hamburg", lat: 53.5449, lng: 9.9324, status: "budding", trees: 40, crowd: "moderate", gem: true,
    desc: "Cherry trees at the famous Elbe viewpoint in Altona. Watch container ships pass while surrounded by spring blossoms.",
    descDE: "Kirschbäume am berühmten Elbe-Aussichtspunkt in Altona. Containerschiffe beobachten, umgeben von Frühlingsblüten.",
    tags: ["viewpoint", "elbe", "hidden gem"], transit: "S1/S11 to Altona, walk to Elbufer" },

  // ── SCHLESWIG-HOLSTEIN ───────────────────────────────────────────────────
  { id: 30, name: "Hiroshimapark", city: "Kiel", state: "Schleswig-Holstein", lat: 54.3220, lng: 10.1322, status: "budding", trees: 25, crowd: "quiet", gem: true,
    desc: "Japanese ornamental cherry trees gifted to Kiel as a peace gesture. One of the northernmost public Hanami spots in Germany.",
    descDE: "Japanische Zierkirschen, als Friedensgeste an Kiel geschenkt. Einer der nördlichsten öffentlichen Hanami-Orte Deutschlands.",
    tags: ["peace memorial", "hidden gem"], transit: "Walk from Kiel Hbf" },
  { id: 31, name: "Stadtpark", city: "Flensburg", state: "Schleswig-Holstein", lat: 54.7782, lng: 9.4389, status: "budding", trees: 20, crowd: "quiet", gem: true,
    desc: "Cherry trees in Germany's northernmost large city. Bloom arrives about two weeks later than in the south — a late spring treat near the Danish border.",
    descDE: "Kirschbäume in Deutschlands nördlichster Großstadt. Blüte kommt etwa zwei Wochen später als im Süden — ein Spätfrühlings-Erlebnis nahe der dänischen Grenze.",
    tags: ["northernmost", "hidden gem"], transit: "Train to Flensburg Hbf" },
  { id: 32, name: "Stadtpark Lübeck", city: "Lübeck", state: "Schleswig-Holstein", lat: 53.8694, lng: 10.6866, status: "budding", trees: 30, crowd: "quiet", gem: true,
    desc: "Cherry trees alongside the city's historic brick Gothic buildings. Medieval architecture meets spring blossoms — uniquely Lübeck.",
    descDE: "Kirschbäume neben der historischen Backsteingotik der Stadt. Mittelalterliche Architektur trifft Frühlingsblüten — typisch für Lübeck.",
    tags: ["UNESCO", "historic", "hidden gem"], transit: "Walk from Lübeck Hbf" },

  // ── NIEDERSACHSEN (LOWER SAXONY) ─────────────────────────────────────────
  { id: 33, name: "Altes Land Kirschblüte", city: "Jork", state: "Niedersachsen", lat: 53.5299, lng: 9.6893, status: "budding", trees: 5000, crowd: "moderate", gem: false,
    desc: "Europe's largest fruit cultivation area southwest of Hamburg. Hundreds of kilometres of white cherry blossom roads during the Blütenfest in late April.",
    descDE: "Europas größtes Obstanbaugebiet südwestlich von Hamburg. Hunderte Kilometer weißer Kirschblütenstraßen während des Altländer Blütenfestes Ende April.",
    tags: ["festival", "orchards", "scenic drive"], transit: "S3 to Neugraben, then Bus 257 to Jork" },
  { id: 34, name: "Eilenriede Hiroshima-Gedenkpark", city: "Hannover", state: "Niedersachsen", lat: 52.3749, lng: 9.7606, status: "partial", trees: 110, crowd: "moderate", gem: false,
    desc: "110 Japanese cherry trees gifted by Hiroshima to Hannover as a symbol of peace. Annual Hanami festival held here in mid-April.",
    descDE: "110 japanische Kirschbäume, von Hiroshima als Friedenssymbol an Hannover geschenkt. Jährliches Hanami-Fest Mitte April.",
    tags: ["peace memorial", "festival", "japanese"], transit: "U3/U7 to Andreeplatz" },
  { id: 35, name: "Bürgerpark", city: "Braunschweig", state: "Niedersachsen", lat: 52.2695, lng: 10.5248, status: "partial", trees: 35, crowd: "quiet", gem: true,
    desc: "Ornamental cherry trees in Braunschweig's historic public park, close to the Romanesque cathedral. A quiet gem in Lower Saxony.",
    descDE: "Zierkirschen im historischen Bürgerpark von Braunschweig, nahe dem romanischen Dom. Ein ruhiges Kleinod in Niedersachsen.",
    tags: ["hidden gem", "park", "historic"], transit: "Walk from Braunschweig Hbf" },
  { id: 36, name: "Stadtwall-Promenade", city: "Göttingen", state: "Niedersachsen", lat: 51.5338, lng: 9.9345, status: "partial", trees: 40, crowd: "quiet", gem: true,
    desc: "Cherry trees on the old city wall promenade circling Göttingen's medieval old town. Popular with university students for Hanami picnics.",
    descDE: "Kirschbäume auf der Stadtwall-Promenade rund um Göttingens mittelalterliche Altstadt. Beliebt bei Uni-Studenten für Hanami-Picknicks.",
    tags: ["historic walls", "university", "picnic"], transit: "Walk from Göttingen Hbf" },
  { id: 37, name: "Schlossgarten", city: "Osnabrück", state: "Niedersachsen", lat: 52.2793, lng: 8.0441, status: "partial", trees: 30, crowd: "quiet", gem: true,
    desc: "Baroque palace garden in the Peace of Westphalia city. Cherry blossoms have decorated these grounds for over a century.",
    descDE: "Barockgarten in der Stadt des Westfälischen Friedens. Kirschblüten schmücken diese Anlage seit über einem Jahrhundert.",
    tags: ["palace garden", "historic", "hidden gem"], transit: "Walk from Osnabrück Hbf" },

  // ── BREMEN ───────────────────────────────────────────────────────────────
  { id: 38, name: "Bürgerpark", city: "Bremen", state: "Bremen", lat: 53.1023, lng: 8.8472, status: "partial", trees: 40, crowd: "moderate", gem: false,
    desc: "Cherry trees in one of Germany's oldest and largest public parks. Spring blossoms draw families and cyclists from across the city.",
    descDE: "Kirschbäume in einem der ältesten und größten öffentlichen Parks Deutschlands. Frühlingsblüten ziehen Familien und Radfahrer aus der ganzen Stadt.",
    tags: ["park", "cycling", "family"], transit: "Tram 6 to Bürgerpark" },

  // ── HESSEN ───────────────────────────────────────────────────────────────
  { id: 39, name: "Karlsaue Park", city: "Kassel", state: "Hessen", lat: 51.3050, lng: 9.4960, status: "budding", trees: 35, crowd: "quiet", gem: true,
    desc: "Large baroque park with scattered cherry trees. Peaceful alternative to the famous spots, with almost no crowds.",
    descDE: "Großer Barockpark mit vereinzelten Kirschbäumen. Ruhige Alternative zu den bekannten Spots, mit fast keinen Besuchern.",
    tags: ["hidden gem", "park"], transit: "Tram to Karlsaue" },
  { id: 40, name: "Kirschenland Witzenhausen", city: "Witzenhausen", state: "Hessen", lat: 51.3419, lng: 9.8889, status: "peak", trees: 10000, crowd: "moderate", gem: false,
    desc: "Germany's cherry capital with over 100,000 cherry trees across the Werra valley. Annual 'Cherry Weeks' in April with outdoor cinema, hikes, and tastings.",
    descDE: "Deutschlands Kirschenhauptstadt mit über 100.000 Kirschbäumen im Werratal. Jährliche 'Kirschwochen' im April mit Freiluftkino, Wanderungen und Kostproben.",
    tags: ["cherry capital", "festival", "hiking"], transit: "Train to Witzenhausen" },
  { id: 41, name: "Frauensteiner Kirschgärten", city: "Wiesbaden", state: "Hessen", lat: 50.0783, lng: 8.2283, status: "peak", trees: 1000, crowd: "moderate", gem: false,
    desc: "Over a century of cherry cultivation tradition in Wiesbaden's Frauenstein district. White blossoms carpet the hillside above the Rhine plain.",
    descDE: "Über 100 Jahre Kirschanbautradition im Wiesbadener Stadtteil Frauenstein. Weiße Blüten bedecken den Hang über der Rheinebene.",
    tags: ["orchards", "vineyard", "historic"], transit: "Bus from Wiesbaden Hbf to Frauenstein" },
  { id: 42, name: "Ockstadt Kirschblütenpfad", city: "Friedberg", state: "Hessen", lat: 50.3435, lng: 8.7428, status: "peak", trees: 500, crowd: "quiet", gem: true,
    desc: "The village of Ockstadt has built its identity around cherry cultivation. Annual blossom walk leads through orchards with trees up to 500 years old.",
    descDE: "Das Dorf Ockstadt hat seine Identität rund um den Kirschanbau aufgebaut. Jährlicher Kirschblütenspaziergang durch Obstgärten mit bis zu 500 Jahre alten Bäumen.",
    tags: ["village", "orchards", "hidden gem"], transit: "S6 to Friedberg, bus to Ockstadt" },
  { id: 43, name: "Bethmann Park", city: "Frankfurt am Main", state: "Hessen", lat: 50.1218, lng: 8.6953, status: "peak", trees: 40, crowd: "moderate", gem: false,
    desc: "Frankfurt's most elegant Hanami location — a Chinese garden with red lacquered pavilions framed by Japanese cherry trees.",
    descDE: "Frankfurts elegantester Hanami-Ort — ein chinesischer Garten mit rot lackierten Pavillons, umrahmt von japanischen Kirschbäumen.",
    tags: ["chinese garden", "photography"], transit: "U6/U7 to Ostendstraße" },
  { id: 44, name: "Herrngarten", city: "Darmstadt", state: "Hessen", lat: 49.8728, lng: 8.6567, status: "peak", trees: 30, crowd: "quiet", gem: true,
    desc: "Germany's oldest public park, with cherry trees adding spring colour to the ducal pleasure garden since the 18th century.",
    descDE: "Der älteste öffentliche Park Deutschlands, mit Kirschbäumen, die dem herzoglichen Lustgarten seit dem 18. Jahrhundert Frühlingsfarbe verleihen.",
    tags: ["historic", "hidden gem", "oldest park"], transit: "Tram H/6 to Luisenplatz" },

  // ── RHEINLAND-PFALZ ──────────────────────────────────────────────────────
  { id: 45, name: "Bopparder Kirschblüte", city: "Boppard", state: "Rheinland-Pfalz", lat: 50.2286, lng: 7.5736, status: "peak", trees: 500, crowd: "moderate", gem: false,
    desc: "Cherry orchards cloaking the steep Rhine valley slopes around Boppard since Roman times. A Rhine cruise in April offers views of white blossom above the river.",
    descDE: "Kirschobstgärten bedecken die steilen Rheinhänge um Boppard seit der Römerzeit. Eine Rheinkreuzfahrt im April bietet Blick auf weiße Blüten über dem Fluss.",
    tags: ["rhine valley", "historic", "scenic cruise"], transit: "Train to Boppard Hbf" },
  { id: 46, name: "Stadtpark & Volkspark", city: "Mainz", state: "Rheinland-Pfalz", lat: 49.9929, lng: 8.2473, status: "peak", trees: 40, crowd: "moderate", gem: false,
    desc: "Cherry trees in Mainz's parks along the Rhine. Combined with wine culture and the Gutenberg Museum, makes for a perfect spring day.",
    descDE: "Kirschbäume in Mainzer Rheinparks. Kombiniert mit Weinkultur und Gutenberg-Museum ein perfekter Frühlingstag.",
    tags: ["rhine", "wine city"], transit: "Walk from Mainz Hbf" },
  { id: 47, name: "Palastgarten", city: "Trier", state: "Rheinland-Pfalz", lat: 49.7590, lng: 6.6489, status: "peak", trees: 30, crowd: "quiet", gem: true,
    desc: "Cherry trees in the palace garden adjacent to Trier's ancient Roman imperial baths — the most historically atmospheric Hanami spot in Germany.",
    descDE: "Kirschbäume im Palastgarten neben den antiken römischen Kaiserthermen — der historisch atmosphärischste Hanami-Ort Deutschlands.",
    tags: ["roman", "UNESCO", "hidden gem"], transit: "Walk from Trier Hbf" },
  { id: 48, name: "Schlosspark", city: "Koblenz", state: "Rheinland-Pfalz", lat: 50.3592, lng: 7.5977, status: "peak", trees: 40, crowd: "quiet", gem: true,
    desc: "Cherry trees at the Electoral Palace at the Rhine-Moselle confluence. One of the most romantically situated blossom spots in western Germany.",
    descDE: "Kirschbäume am Kurfürstlichen Schloss am Rhein-Mosel-Zusammenfluss. Einer der romantischsten Blütenorte in Westdeutschland.",
    tags: ["palace", "rhine-moselle", "hidden gem"], transit: "Walk from Koblenz Hbf" },

  // ── SAARLAND ─────────────────────────────────────────────────────────────
  { id: 49, name: "Deutsch-Japanisches Kirschblütenfest", city: "Saarbrücken", state: "Saarland", lat: 49.2312, lng: 6.9973, status: "peak", trees: 30, crowd: "moderate", gem: false,
    desc: "Annual German-Japanese cherry blossom festival with cultural performances, Japanese food, and taiko drums. One of the liveliest Hanami events in western Germany.",
    descDE: "Jährliches deutsch-japanisches Kirschblütenfest mit Kulturprogramm, japanischer Küche und Taiko-Trommeln. Eines der lebendigsten Hanami-Events in Westdeutschland.",
    tags: ["festival", "japanese culture"], transit: "Walk from Saarbrücken Hbf" },

  // ── BRANDENBURG ──────────────────────────────────────────────────────────
  { id: 50, name: "Glienicke Bridge", city: "Potsdam", state: "Brandenburg", lat: 52.4135, lng: 13.0905, status: "partial", trees: 10, crowd: "quiet", gem: true,
    desc: "The famous 'Bridge of Spies' where East and West exchanged agents. Cherry trees on the Potsdam side, first planted in 1990.",
    descDE: "Die berühmte 'Brücke der Spione', wo Ost und West Agenten austauschten. Kirschbäume auf der Potsdamer Seite, erstmals 1990 gepflanzt.",
    tags: ["hidden gem", "historic", "spy bridge"], transit: "Bus 316" },
  { id: 51, name: "Baumblütenfest Werder", city: "Werder (Havel)", state: "Brandenburg", lat: 52.3819, lng: 12.9348, status: "budding", trees: 1000, crowd: "busy", gem: false,
    desc: "Germany's oldest fruit tree blossom festival, held since 1879. Over 500,000 visitors during blossom week in late April — mixed fruit orchards on the island town.",
    descDE: "Deutschlands ältestes Baumblütenfest, seit 1879. Über 500.000 Besucher in der Blütenwoche Ende April — gemischte Obstgärten auf der Inselstadt.",
    tags: ["festival", "historic", "orchards"], transit: "S7 to Werder (Havel)" },
  { id: 52, name: "Schlosspark Oranienburg", city: "Oranienburg", state: "Brandenburg", lat: 52.7533, lng: 13.2367, status: "partial", trees: 30, crowd: "quiet", gem: true,
    desc: "Baroque palace gardens north of Berlin with ornamental cherry trees along the formal garden paths. Rarely visited in early spring.",
    descDE: "Barocke Schlossgärten nördlich von Berlin mit Zierkirschen entlang formaler Gartenwege. Im Frühling kaum besucht.",
    tags: ["palace", "baroque", "hidden gem"], transit: "S1 to Oranienburg" },

  // ── SACHSEN-ANHALT ───────────────────────────────────────────────────────
  { id: 53, name: "Herrenkrug Park", city: "Magdeburg", state: "Sachsen-Anhalt", lat: 52.1490, lng: 11.6580, status: "budding", trees: 45, crowd: "quiet", gem: true,
    desc: "Peaceful cherry blossom spot far from tourist crowds. Magdeburg is one of Germany's most underrated spring destinations.",
    descDE: "Friedlicher Kirschblütenort fernab touristischer Massen. Magdeburg ist eines der unterschätztesten Frühlingsziele Deutschlands.",
    tags: ["hidden gem", "peaceful"], transit: "Tram to Herrenkrug" },
  { id: 54, name: "Peißnitzinsel", city: "Halle (Saale)", state: "Sachsen-Anhalt", lat: 51.4825, lng: 11.9699, status: "budding", trees: 30, crowd: "quiet", gem: true,
    desc: "Cherry trees on the Peißnitz island nature reserve in the Saale river. A beloved local escape for spring walks, unknown outside the city.",
    descDE: "Kirschbäume auf der Peißnitz-Insel im Naturschutzgebiet der Saale. Ein beliebter lokaler Frühlingsausflug, außerhalb der Stadt unbekannt.",
    tags: ["island", "nature reserve", "hidden gem"], transit: "Tram 5/10 to Peißnitzbrücke" },
  { id: 55, name: "Luthergarten", city: "Lutherstadt Wittenberg", state: "Sachsen-Anhalt", lat: 51.8636, lng: 12.6476, status: "budding", trees: 20, crowd: "quiet", gem: true,
    desc: "Cherry trees near the Reformation monument in the birthplace of the Protestant Reformation. A uniquely historic spring setting.",
    descDE: "Kirschbäume nahe dem Reformationsdenkmal in der Geburtsstätte der protestantischen Reformation. Ein einzigartig historisches Frühlingssetting.",
    tags: ["reformation", "UNESCO", "hidden gem"], transit: "Train to Lutherstadt Wittenberg" },

  // ── THÜRINGEN ────────────────────────────────────────────────────────────
  { id: 56, name: "Cyriaksburg / egapark", city: "Erfurt", state: "Thüringen", lat: 50.9651, lng: 11.0273, status: "partial", trees: 40, crowd: "moderate", gem: false,
    desc: "Cherry trees alongside the rose garden at the historic Cyriaksburg castle in Erfurt's garden heritage area. Part of the famous egapark.",
    descDE: "Kirschbäume neben dem Rosengarten an der historischen Cyriaksburg im Gartenerbeland Erfurt. Teil des berühmten egaparks.",
    tags: ["castle", "rose garden", "park"], transit: "Tram 2 to egapark" },
  { id: 57, name: "Park an der Ilm", city: "Weimar", state: "Thüringen", lat: 50.9803, lng: 11.3316, status: "budding", trees: 30, crowd: "quiet", gem: true,
    desc: "UNESCO World Heritage landscape park with cherry trees along the Ilm river. Goethe walked these paths — now framed by spring blossoms.",
    descDE: "UNESCO-Welterbe-Landschaftspark mit Kirschbäumen entlang der Ilm. Goethe spazierte auf diesen Wegen — jetzt im Frühlingsblütenrahmen.",
    tags: ["UNESCO", "goethe", "hidden gem"], transit: "Walk from Weimar Hbf" },
  { id: 58, name: "Paradies Park", city: "Jena", state: "Thüringen", lat: 50.9218, lng: 11.5790, status: "budding", trees: 35, crowd: "quiet", gem: true,
    desc: "Linear park along the Saale river named 'Paradise' — cherry trees above the riverbank justify the name every spring.",
    descDE: "Linearer Park entlang der Saale, 'Paradies' genannt — Kirschbäume über dem Flussufer rechtfertigen den Namen jeden Frühling.",
    tags: ["riverside", "university", "hidden gem"], transit: "Walk from Jena-Paradies S-Bahn" },

  // ── SACHSEN ──────────────────────────────────────────────────────────────
  { id: 59, name: "Johannisplatz", city: "Leipzig", state: "Sachsen", lat: 51.3282, lng: 12.4006, status: "partial", trees: 30, crowd: "busy", gem: false,
    desc: "Densely planted ornamental cherries around the Grassi Museum create Leipzig's most photogenic pink cloud. A favourite for Hanami picnics.",
    descDE: "Dicht gepflanzte Zierkirschen rund um das Grassi-Museum bilden Leipzigs fotogenste rosafarbene Wolke. Beliebt für Hanami-Picknicks.",
    tags: ["photography", "picnic"], transit: "Tram 12/15 to Johannisplatz" },
  { id: 60, name: "Zierkirschenallee Stötteritz", city: "Leipzig", state: "Sachsen", lat: 51.2972, lng: 12.4547, status: "partial", trees: 60, crowd: "quiet", gem: true,
    desc: "A quiet ornamental cherry avenue in Leipzig's Stötteritz district — less visited than Johannisplatz but equally beautiful.",
    descDE: "Eine ruhige Zierkirschenallee in Leipzig-Stötteritz — weniger besucht als der Johannisplatz, aber genauso schön.",
    tags: ["avenue", "hidden gem"], transit: "Tram 15 to Holzhäuser Straße" },
  { id: 61, name: "Apels Garten", city: "Leipzig", state: "Sachsen", lat: 51.3355, lng: 12.3500, status: "partial", trees: 20, crowd: "quiet", gem: true,
    desc: "A nearly hidden park west of Leipzig's new town hall with white, pink, and deep-red cherry varieties. Known almost only to neighbourhood locals.",
    descDE: "Ein fast verborgener Park westlich des Neuen Rathauses mit weißen, rosafarbenen und dunkelroten Kirschsorten. Nur Nachbarn bekannt.",
    tags: ["hidden gem", "local secret"], transit: "Tram 1/3/4 to Goerdelerring" },
  { id: 62, name: "Neustädter Elbufer", city: "Dresden", state: "Sachsen", lat: 51.0641, lng: 13.7527, status: "partial", trees: 70, crowd: "moderate", gem: false,
    desc: "Cherry trees transform Dresden's Neustadt Elbe bank into a sea of pink. With the Baroque skyline across the water, this is Saxony's most scenic blossom spot.",
    descDE: "Kirschbäume verwandeln das Neustädter Elbufer in ein Blütenmeer. Mit Barocksilhouette über das Wasser der malerischste Blütenspot Sachsens.",
    tags: ["elbe", "baroque", "riverside"], transit: "Tram 4/6 to Neustädter Markt" },
  { id: 63, name: "Stadtpark", city: "Chemnitz", state: "Sachsen", lat: 50.8434, lng: 12.9214, status: "partial", trees: 25, crowd: "quiet", gem: true,
    desc: "Ornamental cherry trees in Chemnitz's landscaped city park — an underrated spot in a city known for its industrial heritage.",
    descDE: "Zierkirschen im gestalteten Stadtpark von Chemnitz — ein unterschätzter Ort in einer Stadt, die für ihr industrielles Erbe bekannt ist.",
    tags: ["hidden gem", "park"], transit: "Tram 1/6 to Stadtpark" },

  // ── MECKLENBURG-VORPOMMERN ───────────────────────────────────────────────
  { id: 64, name: "IGA Park Japanischer Garten", city: "Rostock", state: "Mecklenburg-Vorpommern", lat: 54.0885, lng: 12.1161, status: "budding", trees: 40, crowd: "moderate", gem: false,
    desc: "Dedicated Japanese garden in Rostock's IGA Park with authentic cherry varieties. Annual Hanami festival makes this the cherry blossom hub of the Baltic coast.",
    descDE: "Japanischer Garten im Rostocker IGA-Park mit authentischen Kirschsorten. Jährliches Hanami-Fest macht ihn zum Kirschblütenzentrum der Ostseeküste.",
    tags: ["japanese garden", "festival", "baltic"], transit: "Tram 4/6 to IGA Park" },
  { id: 65, name: "Schlossgarten Schwerin", city: "Schwerin", state: "Mecklenburg-Vorpommern", lat: 53.6258, lng: 11.4163, status: "budding", trees: 25, crowd: "quiet", gem: true,
    desc: "Cherry trees in the garden of Schwerin's fairy-tale island palace. Blossoms reflected in the castle lake create one of Germany's most picturesque spring scenes.",
    descDE: "Kirschbäume im Garten des märchenhaften Inselschlosses Schwerin. Im Schlosssee gespiegelte Blüten schaffen eines der malerischsten Frühlingsbilder Deutschlands.",
    tags: ["castle", "lake reflection", "hidden gem"], transit: "Walk from Schwerin Hbf" },

  // ── BAYERN ───────────────────────────────────────────────────────────────
  { id: 66, name: "Fränkische Schweiz", city: "Forchheim", state: "Bayern", lat: 49.7197, lng: 11.0563, status: "peak", trees: 50000, crowd: "busy", gem: false,
    desc: "Europe's largest contiguous sweet cherry cultivation area — 200,000 trees across 2,500 hectares. Villages turn entirely white and pink in mid-April.",
    descDE: "Europas größtes zusammenhängendes Süßkirschenanbaugebiet — 200.000 Bäume auf 2.500 Hektar. Dörfer werden Mitte April vollständig weiß und rosa.",
    tags: ["iconic", "orchards", "hiking", "europe's largest"], transit: "Train to Forchheim, then bus into valley" },
  { id: 67, name: "Kirschlehrpfad Pretzfeld", city: "Pretzfeld", state: "Bayern", lat: 49.8041, lng: 11.2152, status: "peak", trees: 500, crowd: "quiet", gem: true,
    desc: "9 km educational cherry trail through Pretzfeld's orchards with information boards on 65 local varieties. The best way to explore Fränkische Schweiz on foot.",
    descDE: "9 km langer Kirschlehrpfad durch Pretzfelder Obstgärten mit Tafeln zu 65 Kirschsorten. Der beste Weg, die Fränkische Schweiz zu Fuß zu erkunden.",
    tags: ["hiking", "educational", "hidden gem"], transit: "Train to Pretzfeld" },
  { id: 68, name: "Walberla Kirschblüte", city: "Kirchehrenbach", state: "Bayern", lat: 49.7624, lng: 11.2693, status: "peak", trees: 800, crowd: "moderate", gem: false,
    desc: "Cherry orchards covering the slopes beneath Franconia's sacred table mountain. The summit offers a panoramic view across a sea of white blossom.",
    descDE: "Kirschobstgärten an den Hängen unter Frankens heiligem Zeugenberg. Vom Gipfel aus ein Panoramablick über ein weißes Blütenmeer.",
    tags: ["mountain view", "panorama", "hiking"], transit: "Train to Ebermannstadt, bus to Kirchehrenbach" },
  { id: 69, name: "Kalchreuth Kirschendorf", city: "Kalchreuth", state: "Bayern", lat: 49.5558, lng: 11.2247, status: "peak", trees: 400, crowd: "quiet", gem: true,
    desc: "Bavaria's official cherry village, cultivating over 50 varieties for 400 years. Old orchards with gnarled trees surround the village on all sides.",
    descDE: "Bayerns offizielles Kirschendorf mit über 50 Kirschsorten seit 400 Jahren. Alte Obstgärten mit knorrigen Bäumen umgeben das Dorf auf allen Seiten.",
    tags: ["cherry village", "historic", "hidden gem"], transit: "Train to Erlangen, Bus 250 to Kalchreuth" },
  { id: 70, name: "Stadtpark & Altenburg", city: "Bamberg", state: "Bayern", lat: 49.8975, lng: 10.9042, status: "peak", trees: 50, crowd: "moderate", gem: false,
    desc: "Cherry trees bloom against Bamberg's UNESCO-listed Baroque skyline. The rose garden on the Altenburg hill is particularly dramatic in blossom season.",
    descDE: "Kirschbäume blühen vor Bambergs UNESCO-geschützter Barockkulisse. Der Rosengarten auf dem Altenburghügel ist besonders dramatisch in der Blütezeit.",
    tags: ["UNESCO", "historic", "photography"], transit: "Train to Bamberg Hbf" },
  { id: 71, name: "Schlossgarten Erlangen", city: "Erlangen", state: "Bayern", lat: 49.5957, lng: 11.0031, status: "peak", trees: 40, crowd: "quiet", gem: true,
    desc: "Baroque palace garden of the Margrave's residence with ornamental cherry trees. Hidden from most tourists who pass the palace facade and move on.",
    descDE: "Barockgarten der Markgrafenresidenz mit Zierkirschen. Von den meisten Touristen, die an der Fassade vorbeigehen, unbemerkt.",
    tags: ["palace garden", "baroque", "hidden gem"], transit: "Train to Erlangen Hbf, 10 min walk" },
  { id: 72, name: "Olympiapark Kirschblüte", city: "München", state: "Bayern", lat: 48.1729, lng: 11.5454, status: "partial", trees: 80, crowd: "busy", gem: false,
    desc: "Cherry blossom avenue and trees throughout the 1972 Olympic grounds with the iconic tower as backdrop. Best viewed from the eastern lawn.",
    descDE: "Kirschblütenallee auf dem Gelände der Olympischen Spiele 1972 mit dem ikonischen Turm als Kulisse. Beste Aussicht von der Ostwiese.",
    tags: ["olympic park", "avenue", "iconic"], transit: "U3 to Olympiapark" },
  { id: 73, name: "Westpark Japanischer Garten", city: "München", state: "Bayern", lat: 48.1143, lng: 11.5267, status: "partial", trees: 50, crowd: "moderate", gem: false,
    desc: "Japanese garden in Munich's Westpark with over a dozen cherry varieties blooming at staggered intervals from late March through May. Annual Hanami festival.",
    descDE: "Japanischer Garten im Münchner Westpark mit über einem Dutzend Kirschsorten, die von Ende März bis Mai gestaffelt blühen. Jährliches Hanami-Fest.",
    tags: ["japanese garden", "festival"], transit: "U6 to Westpark" },
  { id: 75, name: "Residenzgarten", city: "Würzburg", state: "Bayern", lat: 49.7926, lng: 9.9310, status: "peak", trees: 40, crowd: "moderate", gem: false,
    desc: "Cherry trees in the south garden of Würzburg's UNESCO Baroque Residence. Blossoms frame the palace's ornate facade in extraordinary beauty.",
    descDE: "Kirschbäume im Südgarten der UNESCO-Residenz Würzburg. Blüten rahmen die prächtige Schlossfassade in außerordentlicher Schönheit.",
    tags: ["UNESCO", "baroque", "palace"], transit: "Walk from Würzburg Hbf" },
  { id: 76, name: "Stadtpark & Donaupromenade", city: "Regensburg", state: "Bayern", lat: 49.0215, lng: 12.1097, status: "peak", trees: 35, crowd: "quiet", gem: true,
    desc: "Ornamental cherry trees along the Danube promenade and city park. Regensburg's UNESCO old town provides one of Bavaria's most romantic spring backdrops.",
    descDE: "Zierkirschen entlang der Donaupromenade und im Stadtpark. Regensburgs UNESCO-Altstadt bietet eine der romantischsten Frühlingskulissen Bayerns.",
    tags: ["UNESCO", "danube", "hidden gem"], transit: "Walk from Regensburg Hbf" },

  // ── BADEN-WÜRTTEMBERG ────────────────────────────────────────────────────
  { id: 77, name: "Schwetzingen Palace Gardens", city: "Schwetzingen", state: "Baden-Württemberg", lat: 49.3830, lng: 8.5725, status: "peak", trees: 100, crowd: "moderate", gem: false,
    desc: "Cherry blossoms against an 18th-century mosque in a baroque-English hybrid garden. Documented with a live 'blossom barometer'.",
    descDE: "Kirschblüten vor einer Moschee aus dem 18. Jahrhundert in einem barock-englischen Hybridgarten. Dokumentiert mit einem Live-'Blütenbarometer'.",
    tags: ["palace", "historic", "unique"], transit: "S-Bahn to Schwetzingen" },
  { id: 78, name: "Lichtentaler Allee", city: "Baden-Baden", state: "Baden-Württemberg", lat: 48.7540, lng: 8.2420, status: "peak", trees: 80, crowd: "moderate", gem: false,
    desc: "Elegant spa town boulevard with cherry blossoms in front of the Trinkhalle. One of Baden-Württemberg's most photographed spring scenes.",
    descDE: "Eleganter Kurort-Boulevard mit Kirschblüten vor der Trinkhalle. Eines der meistfotografierten Frühlingsmotive Baden-Württembergs.",
    tags: ["elegant", "photography"], transit: "Bus Lichtentaler Allee" },
  { id: 79, name: "Rintheimer Straße", city: "Karlsruhe", state: "Baden-Württemberg", lat: 49.0194, lng: 8.4264, status: "peak", trees: 300, crowd: "busy", gem: false,
    desc: "One of the most spectacular cherry blossom avenues in southwest Germany — hundreds of trees creating an unbroken pink tunnel over 1.5 kilometres.",
    descDE: "Eine der spektakulärsten Kirschblütenalleen in Südwestdeutschland — Hunderte Bäume bilden einen ununterbrochenen rosafarbenen Tunnel über 1,5 Kilometer.",
    tags: ["avenue", "iconic", "southwest"], transit: "Tram 2/6 to Rintheim" },
  { id: 80, name: "Marienbader Straße", city: "Stuttgart", state: "Baden-Württemberg", lat: 48.8035, lng: 9.2235, status: "peak", trees: 80, crowd: "busy", gem: false,
    desc: "Stuttgart's most Instagram-famous cherry blossom street in Bad Cannstatt — a complete pink canopy reminiscent of Tokyo's famous Hanami spots.",
    descDE: "Stuttgarts berühmteste Kirschblütenstraße in Bad Cannstatt — ein vollständiges rosafarbenes Dach, das an Tokios berühmte Hanami-Orte erinnert.",
    tags: ["iconic", "instagram", "photography"], transit: "U14 to Wilhelma" },
  { id: 81, name: "Hohenzollernplatz Feuerbach", city: "Stuttgart", state: "Baden-Württemberg", lat: 48.8109, lng: 9.1453, status: "peak", trees: 40, crowd: "quiet", gem: true,
    desc: "Stuttgart's best-kept cherry blossom secret — a residential square ringed by mature cherry trees, packed with local picnickers but unknown to tourists.",
    descDE: "Stuttgarts bestgehütetes Kirschblütengeheimnis — ein Wohnplatz mit alten Kirschbäumen, beliebt bei Einheimischen, aber touristisch unbekannt.",
    tags: ["hidden gem", "local favourite"], transit: "S4/S5 to Feuerbach" },
  { id: 82, name: "Burg & Altstadthang", city: "Esslingen am Neckar", state: "Baden-Württemberg", lat: 48.7398, lng: 9.3134, status: "peak", trees: 50, crowd: "moderate", gem: false,
    desc: "Cherry trees on the vineyard slopes beneath Esslingen's medieval castle. The view of blossoms over half-timbered rooftops is among Baden-Württemberg's best.",
    descDE: "Kirschbäume auf den Weinberghängen unter der mittelalterlichen Burg Esslingen. Der Blick auf Blüten über Fachwerkhäuser gehört zu den schönsten im Land.",
    tags: ["castle", "medieval", "photography"], transit: "S1 to Esslingen, walk up castle hill" },
  { id: 83, name: "Kirschgärten Erligheim", city: "Erligheim", state: "Baden-Württemberg", lat: 49.0992, lng: 9.0255, status: "peak", trees: 1200, crowd: "quiet", gem: true,
    desc: "1,200 white cherry trees on the Vogelsang hillside — the second largest contiguous cherry orchard in Baden-Württemberg, with spectacular panoramic views.",
    descDE: "1.200 weiße Kirschbäume am Vogelsang-Hang — das zweitgrößte zusammenhängende Kirschobstgebiet in Baden-Württemberg mit Panoramaaussichten.",
    tags: ["orchards", "panorama", "hidden gem"], transit: "Train to Erligheim" },
  { id: 84, name: "Nehren Streuobstwiesen", city: "Tübingen", state: "Baden-Württemberg", lat: 48.4553, lng: 9.0427, status: "peak", trees: 800, crowd: "quiet", gem: true,
    desc: "105 hectares of traditional orchards preserved since the Middle Ages. A biennial cherry festival celebrates the landscape every April.",
    descDE: "105 Hektar traditionelle Streuobstwiesen, seit dem Mittelalter erhalten. Ein zweijährliches Kirschfest feiert die Landschaft jeden April.",
    tags: ["orchard landscape", "medieval", "hidden gem"], transit: "Bus 7 from Tübingen to Nehren" },
  { id: 85, name: "Kirschblütenweg Strümpfelbach", city: "Weinstadt", state: "Baden-Württemberg", lat: 48.8319, lng: 9.3752, status: "peak", trees: 500, crowd: "quiet", gem: true,
    desc: "Cherry blossom path through Weinstadt's Remstal wine valley with art installations along the route — one of Germany's most creative blossom walks.",
    descDE: "Kirschblütenweg durch das Remstal mit Kunstinstallationen entlang der Route — einer der kreativsten Kirschblütenspaziergänge Deutschlands.",
    tags: ["wine valley", "art trail", "hidden gem"], transit: "S2 to Weinstadt-Endersbach, walk" },
  { id: 86, name: "Stadtgarten", city: "Freiburg im Breisgau", state: "Baden-Württemberg", lat: 47.9946, lng: 7.8484, status: "partial", trees: 60, crowd: "moderate", gem: false,
    desc: "Cherry trees in Freiburg's historic city garden, backed by the Black Forest hills. The mild Upper Rhine climate brings one of Germany's earliest blooms.",
    descDE: "Kirschbäume im historischen Stadtgarten Freiburgs, mit den Schwarzwaldhügeln im Hintergrund. Das milde Klima der Oberrheinebene sorgt für frühe Blüte.",
    tags: ["black forest", "early bloom"], transit: "Tram 1 to Stadttheater/Stadtgarten" },
  { id: 87, name: "Philosophenweg", city: "Heidelberg", state: "Baden-Württemberg", lat: 49.4138, lng: 8.7137, status: "peak", trees: 100, crowd: "busy", gem: false,
    desc: "Cherry trees line the famous Philosophers' Walk above Heidelberg's old town. Castle ruins, Neckar river, and blossoms — an unforgettable combination.",
    descDE: "Kirschbäume säumen den berühmten Philosophenweg über Heidelbergs Altstadt. Schlossruine, Neckar und Blüten — eine unvergessliche Kombination.",
    tags: ["historic", "iconic", "riverside"], transit: "Walk from Heidelberg Hbf via Neuenheimer Feld" },
  { id: 88, name: "Luisenpark Japanischer Garten", city: "Mannheim", state: "Baden-Württemberg", lat: 49.4883, lng: 8.4932, status: "peak", trees: 50, crowd: "moderate", gem: false,
    desc: "Japanese garden within Luisenpark with Yoshino and Kanzan cherry varieties. Annual cherry blossom event draws visitors from across the Rhine-Neckar region.",
    descDE: "Japanischer Garten im Luisenpark mit Yoshino- und Kanzan-Kirschsorten. Jährliche Kirschblütenveranstaltung zieht Besucher aus der gesamten Rhein-Neckar-Region.",
    tags: ["japanese garden", "festival"], transit: "Tram 6 to Luisenpark" },
];

const STATUS_CONFIG = {
  peak:    { en: "Peak bloom",    de: "Vollblüte",    color: "#E24B4A" },
  partial: { en: "Partial bloom", de: "Teilblüte",    color: "#D85A30" },
  budding: { en: "Budding",       de: "Knospen",      color: "#639922" },
  fading:  { en: "Fading",        de: "Verblühend",   color: "#888780" },
  done:    { en: "Season over",   de: "Saison vorbei",color: "#5F5E5A" },
};

const CROWD_CONFIG = {
  quiet:    { en: "Quiet",    de: "Ruhig",    color: "#0F6E56" },
  moderate: { en: "Moderate", de: "Mäßig",    color: "#BA7517" },
  busy:     { en: "Busy",     de: "Belebt",   color: "#A32D2D" },
};

const STATES = [...new Set(SPOTS.map(s => s.state))].sort();

const T = {
  en: {
    title: ["Cherry Blossom", "Germany"],
    subtitle: (n) => `${n} cherry blossom spots across Germany · Spring 2026`,
    tabAll: (n) => `ALL SPOTS (${n})`,
    tabGems: (n) => `HIDDEN GEMS (${n})`,
    filterBloom: "FILTER BY BLOOM",
    filterRegion: "REGION",
    all: "ALL",
    peak: "PEAK",
    partial: "PARTIAL",
    budding: "BUDDING",
    searchPlaceholder: "Search spots or cities...",
    spotCount: (n) => `${n} spot${n !== 1 ? "s" : ""}`,
    noResults: "No spots match your filters",
    trees: "trees",
    crowds: "crowds",
    gem: "Gem",
    directions: "Get Directions",
    showSpots: "Show Spots",
  },
  de: {
    title: ["Kirschblüte", "Deutschland"],
    subtitle: (n) => `${n} Kirschblüten-Spots in Deutschland · Frühjahr 2026`,
    tabAll: (n) => `ALLE SPOTS (${n})`,
    tabGems: (n) => `GEHEIMTIPPS (${n})`,
    filterBloom: "NACH BLÜTE FILTERN",
    filterRegion: "REGION",
    all: "ALLE",
    peak: "VOLLBLÜTE",
    partial: "TEILBLÜTE",
    budding: "KNOSPEN",
    searchPlaceholder: "Spots oder Städte suchen...",
    spotCount: (n) => `${n} Spot${n !== 1 ? "s" : ""}`,
    noResults: "Keine Spots gefunden",
    trees: "Bäume",
    crowds: "Besucher",
    gem: "Geheimtipp",
    directions: "Route berechnen",
    showSpots: "Spots anzeigen",
  },
};

// Map component
function BlossomMap({ spots, selectedSpot, onSelectSpot }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [51.1657, 10.4515],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Germany border + fill overlay
    fetch("https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/1_deutschland/4_niedrig.geo.json")
      .then(r => r.json())
      .then(geojson => {
        L.geoJSON(geojson, {
          interactive: false,
          style: {
            color: "#D4607A",       // blossom-pink border
            weight: 2.5,
            opacity: 0.75,
            fillColor: "#FDE8EC",   // very light petal-pink fill
            fillOpacity: 0.28,
          },
        }).addTo(map);
      })
      .catch(() => {});

    spots.forEach(spot => {
      const sc = STATUS_CONFIG[spot.status];
      const size = spot.gem ? 12 : 16;
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${sc.color};
          border:2.5px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
          cursor:pointer;
          transition:transform 0.2s;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(map);
      marker.on("click", () => onSelectSpot(spot));
      marker.bindTooltip(
        `<div style="font-family:inherit;font-size:12px;font-weight:600;padding:2px 4px;">${spot.name}<br/><span style="font-weight:400;color:#888;">${spot.city}</span></div>`,
        { direction: "top", offset: [0, -8] }
      );
      markersRef.current.push({ marker, spot });
    });

    mapInstanceRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSpot) return;
    mapInstanceRef.current.flyTo([selectedSpot.lat, selectedSpot.lng], 13, { duration: 0.8 });
  }, [selectedSpot]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

// Spot card
function SpotCard({ spot, isSelected, lang, onClick }) {
  const sc = STATUS_CONFIG[spot.status];
  const crowd = CROWD_CONFIG[spot.crowd];
  const t = T[lang];
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        border: isSelected ? "1.5px solid #1A1A1A" : "1px solid #E8E5DC",
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 3 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.35 }}>{spot.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: sc.color }} />
          <span style={{ fontSize: 10, color: sc.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {sc[lang]}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>{spot.city} · {spot.state}</div>
      <div style={{
        fontSize: 12, color: "#666", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {lang === "de" ? spot.descDE : spot.desc}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "#AAA" }}>
        <span>~{spot.trees} {t.trees}</span>
        <span>·</span>
        <span style={{ color: crowd.color }}>{crowd[lang]}</span>
        {spot.gem && <><span>·</span><span style={{ color: "#9B7226", fontWeight: 500 }}>✦ {t.gem}</span></>}
      </div>
    </div>
  );
}

// Selected spot detail overlay on the map
function SpotDetail({ spot, lang, onClose, isMobile }) {
  const sc = STATUS_CONFIG[spot.status];
  const crowd = CROWD_CONFIG[spot.crowd];
  const t = T[lang];
  return (
    <div style={{
      position: isMobile ? "fixed" : "absolute",
      bottom: 0, left: isMobile ? 0 : 24, right: isMobile ? 0 : 24,
      zIndex: 1200,
      background: "white",
      borderRadius: isMobile ? "16px 16px 0 0" : 16,
      padding: isMobile ? "20px 20px 36px" : "20px 22px",
      boxShadow: "0 -4px 40px rgba(0,0,0,0.12)",
      border: "1px solid #E8E5DC",
      animation: "slideUp 0.2s ease-out",
      maxHeight: isMobile ? "70vh" : "none",
      overflowY: isMobile ? "auto" : "visible",
    }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: sc.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {sc[lang]}
              </span>
              {spot.gem && <span style={{ fontSize: 10, color: "#9B7226", fontWeight: 600 }}>· ✦ {t.gem}</span>}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{spot.name}</div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>{spot.city} · {spot.state}</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55, marginBottom: 12 }}>
              {lang === "de" ? spot.descDE : spot.desc}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#888" }}>
              <span>~{spot.trees} {t.trees}</span>
              <span style={{ color: crowd.color }}>{crowd[lang]} {t.crowds}</span>
              <span>🚇 {spot.transit}</span>
            </div>
            {spot.tags.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                {spot.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, padding: "3px 9px", borderRadius: 100,
                    background: "#F5F4EF", color: "#666", fontWeight: 500,
                    textTransform: "uppercase", letterSpacing: 0.3,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
                padding: "8px 18px", borderRadius: 100, background: "#1A1A1A",
                color: "white", textDecoration: "none", fontSize: 12, fontWeight: 600,
                letterSpacing: 0.3, transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#333"}
              onMouseLeave={e => e.currentTarget.style.background = "#1A1A1A"}
            >
              ↗ {t.directions}
            </a>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%", border: "1px solid #E8E5DC",
              background: "white", cursor: "pointer", fontSize: 16, color: "#999", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

// Music player — streams via YouTube IFrame API (video ID: IUxgb_qinNE)
function MusicPlayer() {
  const playerRef = useRef(null);
  const playerId = useRef("yt-" + Math.random().toString(36).slice(2, 8));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(18);
  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < 768);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let destroyed = false;

    function createPlayer() {
      if (destroyed || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(playerId.current, {
        videoId: "IUxgb_qinNE",
        width: 0, height: 0,
        playerVars: { controls: 0, disablekb: 1, rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady(e) {
            if (destroyed) return;
            e.target.setVolume(18);
            setDuration(e.target.getDuration() || 0);
            setReady(true);
          },
          onStateChange(e) {
            if (destroyed) return;
            setIsPlaying(e.data === 1); // 1 = PLAYING
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); createPlayer(); };
    }

    return () => { destroyed = true; playerRef.current?.destroy?.(); };
  }, []);

  // Poll currentTime while playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.();
      if (t != null) setCurrentTime(t);
    }, 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  function fmt(s) {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }

  function togglePlay() {
    if (!ready) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  }

  function seek(e) {
    if (!ready || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = pct * duration;
    playerRef.current.seekTo(t, true);
    setCurrentTime(t);
  }

  function changeVolume(e) {
    const v = Number(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      position: "absolute", top: 16, right: 16, zIndex: 900,
      width: window.innerWidth < 768 ? "calc(100% - 32px)" : 310,
      maxWidth: 310,
      borderRadius: 16,
      background: "#F5F4EF", border: "1px solid #E8E5DC",
      boxShadow: "0 4px 28px rgba(0,0,0,0.10)",
      fontFamily: "'DM Sans', sans-serif",
      overflow: "hidden",
    }}>
      {/* Hidden YouTube player mount point */}
      <div id={playerId.current} style={{ display: "none" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>🌸</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, color: "#999", textTransform: "uppercase" }}>Music</span>
        </div>
        <button
          onClick={() => setIsCollapsed(c => !c)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#C0BDB5", fontSize: 13, padding: 0, lineHeight: 1 }}
        >
          {isCollapsed ? "∨" : "∧"}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Dark player card */}
          <div style={{ margin: "0 12px 10px", borderRadius: 10, background: "#1C1C1C", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div onClick={togglePlay} style={{
                width: 11, height: 11, borderRadius: 2,
                background: "#C05878", cursor: "pointer", flexShrink: 0,
              }} />
              <span style={{ fontSize: 30, fontWeight: 700, color: "white", letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
                {fmt(currentTime)}
              </span>
            </div>

            {/* Progress bar */}
            <div onClick={seek} style={{
              position: "relative", height: 4, borderRadius: 2,
              background: "#3A3A3A", cursor: "pointer", marginBottom: 14,
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`,
                background: "linear-gradient(to right, #A03558, #D96080)",
                borderRadius: 2, transition: "width 0.5s linear",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: `${progress}%`,
                transform: "translate(-50%, -50%)",
                width: 12, height: 12, borderRadius: "50%", background: "white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.5)", pointerEvents: "none",
              }} />
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500, lineHeight: 1.4 }}>
              Lofi Chill at a Sakura Café
            </div>
          </div>

          {/* Attribution */}
          <div style={{ padding: "2px 16px 10px", display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#AAA" }}>
            <span style={{ fontSize: 11 }}>▶</span>
            <span style={{ letterSpacing: 0.3 }}>MUSIC BY</span>
            <a href="https://youtu.be/IUxgb_qinNE?si=u7Wb_xo_SsWxEHpF"
              target="_blank" rel="noopener noreferrer"
              style={{ color: "#B04060", fontWeight: 700, textDecoration: "none" }}
            >LoFi Tokyo</a>
            <span>on YouTube</span>
          </div>

          {/* Controls */}
          <div style={{ padding: "4px 16px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => { playerRef.current?.seekTo(0, true); setCurrentTime(0); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, padding: 0, lineHeight: 1 }}
            >⏮</button>
            <button
              onClick={togglePlay}
              style={{
                width: 44, height: 44, borderRadius: "50%", background: "#B04060",
                border: "none", cursor: "pointer", color: "white", fontSize: 17,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#C35070"}
              onMouseLeave={e => e.currentTarget.style.background = "#B04060"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={() => { playerRef.current?.seekTo(0, true); playerRef.current?.stopVideo(); setCurrentTime(0); setIsPlaying(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, padding: 0, lineHeight: 1 }}
            >⏹</button>

            <div style={{ flex: 1 }} />

            <span style={{ fontSize: 14, color: "#AAA" }}>🔈</span>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={changeVolume}
              style={{ width: 78, accentColor: "#B04060", cursor: "pointer" }}
            />
            <span style={{ fontSize: 11, color: "#AAA", minWidth: 20, textAlign: "right" }}>{volume}</span>
          </div>
        </>
      )}
    </div>
  );
}

// Falling sakura petals canvas — loops indefinitely until the component unmounts
function FallingPetals() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const COLORS = ["#F4B8C1", "#FDE8EC", "#F9D0D7", "#FBDDE2", "#F0C0C8"];

    // Seed petals spread across the full canvas so it looks full immediately
    const petals = Array.from({ length: 90 }, () => ({
      baseX: Math.random() * (W + 100) - 50,
      y: Math.random() * (H + 200) - 100,   // already mid-fall on first frame
      size: 6 + Math.random() * 8,
      vy: 70 + Math.random() * 90,           // px/s
      vx: (Math.random() - 0.5) * 30,        // px/s horizontal drift
      sway: Math.random() * Math.PI * 2,
      swayAmp: 18 + Math.random() * 24,
      swayFreq: 0.8 + Math.random() * 0.8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2.5,
      opacity: 0.6 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let lastTime = null;
    let rafId;

    function drawPetal(x, y, size, rot, color, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.55, -size * 0.7, size * 0.55, size * 0.3, 0, size * 0.5);
      ctx.bezierCurveTo(-size * 0.55, size * 0.3, -size * 0.55, -size * 0.7, 0, -size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function frame(now) {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      ctx.clearRect(0, 0, W, H);

      for (const p of petals) {
        p.sway += p.swayFreq * dt;
        p.y += p.vy * dt;
        p.baseX += p.vx * dt;
        p.rot += p.rotSpeed * dt;

        // Loop petal back to top when it exits the bottom
        if (p.y > H + 40) {
          p.baseX = Math.random() * (W + 100) - 50;
          p.y = -20 - Math.random() * 60;
          p.vy = 70 + Math.random() * 90;
          p.vx = (Math.random() - 0.5) * 30;
          p.sway = Math.random() * Math.PI * 2;
        }

        const x = p.baseX + Math.sin(p.sway) * p.swayAmp;
        // Fade in as the petal enters from the top
        let alpha = p.opacity;
        if (p.y < 20) alpha *= Math.max(0, (p.y + 60) / 80);
        if (alpha <= 0.01) continue;
        drawPetal(x, p.y, p.size, p.rot, p.color, alpha);
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 600,
      }}
    />
  );
}

export default function KirschbluteDeutschland() {
  const [lang, setLang] = useState("de");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [petalId, setPetalId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [showPanel, setShowPanel] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowPanel(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const t = T[lang];

  const filtered = useMemo(() => {
    return SPOTS.filter(s => {
      if (activeTab === "gems" && !s.gem) return false;
      if (filterStatus !== "all" && s.status !== filterStatus) return false;
      if (filterState !== "all" && s.state !== filterState) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${s.name} ${s.city} ${s.desc} ${s.descDE}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [activeTab, filterStatus, filterState, search]);

  const gemCount = SPOTS.filter(s => s.gem).length;

  function toggleSpot(spot) {
    const mobile = window.innerWidth < 768;
    const isDeselecting = selectedSpot?.id === spot.id;
    setSelectedSpot(isDeselecting ? null : spot);
    if (!isDeselecting && spot.status === "peak") {
      setPetalId(Date.now());
    } else {
      setPetalId(null);
    }
    if (mobile) setShowPanel(false);
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#F5F4EF",
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spot-card-item:hover > div { border-color: #C0BDB5 !important; }
        .leaflet-tile-pane { filter: saturate(0.85) brightness(1.03); }
        input::placeholder { color: #C0BDB5; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        .filter-chip {
          padding: 5px 13px; border-radius: 100px; font-size: 11px; font-weight: 500;
          border: 1px solid #E0DDCF; background: white; cursor: pointer;
          color: #555; white-space: nowrap; transition: all 0.15s;
          letter-spacing: 0.2px; display: inline-flex; align-items: center; gap: 5px;
        }
        .filter-chip:hover { border-color: #B0ADA5; }
        .filter-chip.active { background: #1A1A1A; border-color: #1A1A1A; color: white; }
        @keyframes slideUpPanel {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .leaflet-control-zoom { bottom: 90px !important; right: 12px !important; }
        }
      `}</style>

      {/* LEFT PANEL */}
      {(showPanel) && (
      <div style={{
        width: isMobile ? "100%" : 370,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "#F5F4EF",
        borderRight: isMobile ? "none" : "1px solid #E8E5DC",
        height: "100%",
        ...(isMobile ? {
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1100,
          animation: "slideUpPanel 0.28s ease-out",
        } : {}),
      }}>

        {/* Header */}
        <div style={{ padding: "24px 24px 0" }}>
          {/* Title row + controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.2, flex: 1, minWidth: 0,
            }}>
              {t.title[0]}<br />{t.title[1]}
            </div>
            {/* Lang toggle + mobile close stacked on the right */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
              <div style={{ display: "flex", background: "#EBE9E3", borderRadius: 8, padding: 2 }}>
                {["de", "en"].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    style={{
                      padding: "5px 10px", borderRadius: 6,
                      fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      border: "none", cursor: "pointer", transition: "all 0.15s",
                      background: lang === l ? "white" : "transparent",
                      color: lang === l ? "#1A1A1A" : "#AAA",
                      boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                      textTransform: "uppercase",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {isMobile && (
                <button
                  onClick={() => setShowPanel(false)}
                  style={{
                    padding: "6px 14px", borderRadius: 100, border: "1px solid #E0DDCF",
                    background: "white", cursor: "pointer", fontSize: 11,
                    fontWeight: 600, color: "#888", letterSpacing: 0.3,
                  }}
                >
                  ✕ Close
                </button>
              )}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#AAA", lineHeight: 1.5, marginBottom: 20 }}>
            {t.subtitle(SPOTS.length)}
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", background: "#EBE9E3", borderRadius: 100,
            padding: 3, marginBottom: 20,
          }}>
            {[
              { key: "all", label: t.tabAll(SPOTS.length) },
              { key: "gems", label: t.tabGems(gemCount) },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: "8px 10px", borderRadius: 100,
                  fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                  border: "none", cursor: "pointer", transition: "all 0.15s",
                  background: activeTab === tab.key ? "#1A1A1A" : "transparent",
                  color: activeTab === tab.key ? "white" : "#999",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: "0 24px 16px", borderBottom: "1px solid #E8E5DC" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#BBB", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            {t.filterBloom}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
            {[
              { key: "all",     label: t.all },
              { key: "peak",    label: t.peak },
              { key: "partial", label: t.partial },
              { key: "budding", label: t.budding },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filter-chip ${filterStatus === key ? "active" : ""}`}
                onClick={() => setFilterStatus(key)}
              >
                {key !== "all" && (
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: filterStatus === key ? "rgba(255,255,255,0.6)" : STATUS_CONFIG[key].color,
                  }} />
                )}
                {label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: "#BBB", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            {t.filterRegion}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            <button
              className={`filter-chip ${filterState === "all" ? "active" : ""}`}
              onClick={() => setFilterState("all")}
            >
              {t.all}
            </button>
            {STATES.map(st => (
              <button
                key={st}
                className={`filter-chip ${filterState === st ? "active" : ""}`}
                onClick={() => setFilterState(st)}
              >
                {st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search + count */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid #E8E5DC" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "9px 14px 9px 32px",
                borderRadius: 100, border: "1px solid #E0DDCF",
                background: "white", fontSize: 12, outline: "none",
                color: "#1A1A1A", transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#AAA"}
              onBlur={e => e.target.style.borderColor = "#E0DDCF"}
            />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#C0BDB5" }}>
              ⌕
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#C0BDB5", marginTop: 6 }}>
            {t.spotCount(filtered.length)}
          </div>
        </div>

        {/* Spot list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px 24px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#C0BDB5" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🌸</div>
              <div style={{ fontSize: 13 }}>{t.noResults}</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {filtered.map(spot => (
                <div key={spot.id} className="spot-card-item" onClick={() => toggleSpot(spot)}>
                  <SpotCard
                    spot={spot}
                    isSelected={selectedSpot?.id === spot.id}
                    lang={lang}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )} {/* end showPanel */}

      {/* MAP */}
      <div style={{ flex: 1, position: "relative", height: isMobile ? "100vh" : "100%" }}>
        <BlossomMap
          spots={SPOTS}
          selectedSpot={selectedSpot}
          onSelectSpot={toggleSpot}
        />
        <MusicPlayer />
        {petalId !== null && <FallingPetals key={petalId} />}
        {/* Show Spots FAB on mobile when panel is hidden */}
        {isMobile && !showPanel && !selectedSpot && (
          <button
            onClick={() => setShowPanel(true)}
            style={{
              position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
              zIndex: 850, background: "#1A1A1A", color: "white",
              border: "none", borderRadius: 100, padding: "13px 26px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.28)", whiteSpace: "nowrap",
            }}
          >
            🌸 {t.showSpots}
          </button>
        )}
        {selectedSpot && (
          <SpotDetail spot={selectedSpot} lang={lang} onClose={() => setSelectedSpot(null)} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}
