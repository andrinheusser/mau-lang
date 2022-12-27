#include <stdio.h>
int main(void) {
float turnsSinceFeeding;
float turnsSincePlaying;
float turnsIgnored;
float playOrIgnore;
float actionTaken;
turnsSinceFeeding = 0;
turnsSincePlaying = 1;
turnsIgnored = 0;
playOrIgnore = 0;
while (turnsIgnored < 3) {
Startofloop:
actionTaken = 0;
if (turnsSincePlaying > turnsSinceFeeding) {
printf("Cat wants to play\n");
printf("Play (1) or ignore (2)\n");
if(0 == scanf("%f", &playOrIgnore)) {
playOrIgnore = 0;
scanf("%*s");
}
if (playOrIgnore == 1) {
printf("Cat is happy\n");
turnsSincePlaying = 0;
turnsSinceFeeding = turnsSinceFeeding+1;
actionTaken = 1;
}
if (playOrIgnore == 2) {
printf("Cat is not happy\n");
turnsIgnored = turnsIgnored+1;
turnsSinceFeeding = turnsSinceFeeding+1;
turnsSincePlaying = turnsSincePlaying+1;
actionTaken = 1;
}
printf("...\n");
printf("Time passes...\n");
printf("...\n");
}
if (turnsSincePlaying <= turnsSinceFeeding) {
printf("Cat is hungry\n");
printf("Feed (1) or ignore (2)\n");
if(0 == scanf("%f", &playOrIgnore)) {
playOrIgnore = 0;
scanf("%*s");
}
if (playOrIgnore == 1) {
printf("Cat is happy\n");
turnsSinceFeeding = 0;
turnsSincePlaying = turnsSincePlaying+1;
actionTaken = 1;
}
if (playOrIgnore == 2) {
printf("Cat is not happy\n");
turnsIgnored = turnsIgnored+1;
turnsSinceFeeding = turnsSinceFeeding+1;
turnsSincePlaying = turnsSincePlaying+1;
actionTaken = 1;
}
printf("...\n");
printf("Time passes...\n");
printf("...\n");
}
if (actionTaken == 0) {
printf("Invalid input. Use 1 or 2\n");
}
}
printf("GAME OVER: Cat left.\n");
return 0;
}
