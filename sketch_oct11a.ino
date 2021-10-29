#include <Firebase.h>
#include <FirebaseArduino.h>
#include <FirebaseCloudMessaging.h>
#include <FirebaseError.h>
#include <FirebaseHttpClient.h>
#include <FirebaseObject.h>

#include <ESP8266WiFi.h>
#include <DHT.h>

#define FIREBASE_HOST "car-assistant-project-default-rtdb.firebaseio.com" 
#define FIREBASE_AUTH "aYPfhD6rlFYPmHVAxRJ7nH7CTKNGwOi8M50CTVEe" 
#define WIFI_SSID "TP-LINK" 
#define WIFI_PASSWORD "Shree@123"
#define DHTPIN 14
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

int n = 0;

void loop() {

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float f = dht.readTemperature(true);

  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  float hif = dht.computeHeatIndex(f, h);
  float hic = dht.computeHeatIndex(t, h, false);

  Firebase.setFloat("carOwners/cpRmCzRLNrMIf83kPXDqqwtVsUc2/allCars/MH05DH5667/allStatus/engineTemp/currentValue", t);
  if (Firebase.failed()) {
    Serial.print("setting /number failed:");
    Serial.println(Firebase.error());
    return;
  }
  Firebase.setFloat("carOwners/cpRmCzRLNrMIf83kPXDqqwtVsUc2/allCars/MH05DH5667/allStatus/engineTemp/previousValue/13", t);
  if (Firebase.failed()) {
    Serial.print("setting /number failed:");
    Serial.println(Firebase.error());
    return;
  }

//  Firebase.setFloat("carOwners/cpRmCzRLNrMIf83kPXDqqwtVsUc2/allCars/MH05DH5667/allStatus/humidity", h);
//  if (Firebase.failed()) {
//    Serial.print("setting /number failed:");
//    Serial.println(Firebase.error());
//    return;
//  }
  delay(10000);

  Serial.print("number: ");
  Serial.println(Firebase.getFloat("number"));
  delay(10000);
}
