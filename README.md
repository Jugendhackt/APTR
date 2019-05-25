# APTR-Elescore-IFOPTifier
## Nutzen:
Der APTR-Elescore-IFOPTifier ist ein express.js Server in node.js, der Daten aus den diversen Quellen wie den DB APIs mit anderen Daten verknüpft und anschließend in Form einer API bereitstellt. 

## APTR Allgemein:
APTR, oder Accessible Public Transport Routing, ist eine Progressive-Web-App, die es Rollstuhlfahrern und allen, die auf die Aufzüge an Bahnsteigen angewiesen sind, vereinfacht mit der Bahn zu reisen. 
Hierbei wird bei der Auswahl der Route, die gefahren werden soll, nicht nur die Dauer der Verbindung in Betracht gezogen, sondern auch Live-Aufzugdaten. So können Bahnhöfe, die zwar in der Theorie barrierefrei sind, es aber zurzeit aufgrund von defekten Aufzügen nicht sind, umfahren werden.
Diese Daten werden aus der FaSta und der StaDa API der Deutschen Bahn sowie aus Datensätzen des VRS gesammelt und über eine eigene Express-API in zusammengefasster, verarbeiteter Form zur Verfügung gestellt.
Daraufhin werden diese Daten gemeinsam mit Fahrplaninformationen des VRS in OpenTripPlanner zusammengefügt, um so Routen zu generieren.