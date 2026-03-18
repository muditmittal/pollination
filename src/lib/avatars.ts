export interface Avatar {
  name: string;
  svg: string; // complete <svg>...</svg> string
}

export const AVATARS: Avatar[] = [
  {
    name: "Fox",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Body -->
  <ellipse cx="32" cy="40" rx="16" ry="14" fill="#E8622A"/>
  <!-- Head -->
  <circle cx="32" cy="24" r="14" fill="#E8622A"/>
  <!-- Ears -->
  <polygon points="18,14 12,2 24,10" fill="#E8622A"/>
  <polygon points="46,14 52,2 40,10" fill="#E8622A"/>
  <!-- Inner ears -->
  <polygon points="18,13 14,5 22,10" fill="#F5A88A"/>
  <polygon points="46,13 50,5 42,10" fill="#F5A88A"/>
  <!-- Face mask -->
  <ellipse cx="32" cy="27" rx="9" ry="7" fill="#F5D0B0"/>
  <!-- Eyes -->
  <circle cx="27" cy="22" r="2.5" fill="#2D1A0E"/>
  <circle cx="37" cy="22" r="2.5" fill="#2D1A0E"/>
  <circle cx="28" cy="21" r="0.8" fill="white"/>
  <circle cx="38" cy="21" r="0.8" fill="white"/>
  <!-- Nose -->
  <ellipse cx="32" cy="27" rx="2" ry="1.2" fill="#C14E20"/>
  <!-- Tail tip -->
  <ellipse cx="48" cy="50" rx="5" ry="4" fill="white" transform="rotate(-20 48 50)"/>
</svg>`,
  },
  {
    name: "Octopus",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Tentacles -->
  <ellipse cx="16" cy="50" rx="4" ry="7" fill="#9B4FC8" transform="rotate(-15 16 50)"/>
  <ellipse cx="24" cy="54" rx="4" ry="7" fill="#9B4FC8" transform="rotate(-5 24 54)"/>
  <ellipse cx="32" cy="55" rx="4" ry="7" fill="#9B4FC8"/>
  <ellipse cx="40" cy="54" rx="4" ry="7" fill="#9B4FC8" transform="rotate(5 40 54)"/>
  <ellipse cx="48" cy="50" rx="4" ry="7" fill="#9B4FC8" transform="rotate(15 48 50)"/>
  <!-- Body -->
  <ellipse cx="32" cy="30" rx="20" ry="22" fill="#C06EF0"/>
  <!-- Eyes -->
  <circle cx="25" cy="26" r="5" fill="white"/>
  <circle cx="39" cy="26" r="5" fill="white"/>
  <circle cx="26" cy="27" r="3" fill="#2D0A4E"/>
  <circle cx="40" cy="27" r="3" fill="#2D0A4E"/>
  <circle cx="27" cy="26" r="1" fill="white"/>
  <circle cx="41" cy="26" r="1" fill="white"/>
  <!-- Smile -->
  <path d="M26 36 Q32 41 38 36" stroke="#9B4FC8" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Robot",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Antenna -->
  <rect x="30" y="2" width="4" height="8" rx="2" fill="#7EC8E3"/>
  <circle cx="32" cy="2" r="3" fill="#F0C040"/>
  <!-- Head -->
  <rect x="14" y="10" width="36" height="28" rx="6" fill="#7EC8E3"/>
  <!-- Eye panels -->
  <rect x="18" y="18" width="11" height="9" rx="2" fill="#1A3A4A"/>
  <rect x="35" y="18" width="11" height="9" rx="2" fill="#1A3A4A"/>
  <!-- Eyes glow -->
  <circle cx="23" cy="22" r="3" fill="#00E5FF"/>
  <circle cx="40" cy="22" r="3" fill="#00E5FF"/>
  <!-- Mouth panel -->
  <rect x="20" y="31" width="24" height="5" rx="2" fill="#1A3A4A"/>
  <rect x="22" y="32.5" width="4" height="2" rx="1" fill="#00E5FF"/>
  <rect x="28" y="32.5" width="4" height="2" rx="1" fill="#00E5FF"/>
  <rect x="34" y="32.5" width="4" height="2" rx="1" fill="#00E5FF"/>
  <!-- Body -->
  <rect x="18" y="40" width="28" height="20" rx="4" fill="#5BA8C2"/>
  <!-- Chest light -->
  <circle cx="32" cy="50" r="4" fill="#F0C040"/>
  <!-- Arms -->
  <rect x="8" y="40" width="8" height="16" rx="4" fill="#5BA8C2"/>
  <rect x="48" y="40" width="8" height="16" rx="4" fill="#5BA8C2"/>
</svg>`,
  },
  {
    name: "Cactus",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Pot -->
  <path d="M20 52 L24 64 L40 64 L44 52 Z" fill="#C4622D"/>
  <rect x="18" y="48" width="28" height="6" rx="2" fill="#D4732E"/>
  <!-- Main body -->
  <rect x="26" y="14" width="12" height="38" rx="6" fill="#4CAF50"/>
  <!-- Left arm -->
  <rect x="14" y="22" width="12" height="8" rx="4" fill="#4CAF50"/>
  <rect x="14" y="18" width="8" height="12" rx="4" fill="#4CAF50"/>
  <!-- Right arm -->
  <rect x="38" y="28" width="12" height="8" rx="4" fill="#4CAF50"/>
  <rect x="42" y="24" width="8" height="12" rx="4" fill="#4CAF50"/>
  <!-- Spines -->
  <line x1="28" y1="20" x2="24" y2="17" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="32" y1="18" x2="32" y2="14" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="36" y1="20" x2="40" y2="17" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Face -->
  <circle cx="29" cy="28" r="2" fill="#1B5E20"/>
  <circle cx="35" cy="28" r="2" fill="#1B5E20"/>
  <path d="M28 34 Q32 37 36 34" stroke="#1B5E20" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Flower on top -->
  <circle cx="32" cy="12" r="4" fill="#FF6B9D"/>
  <circle cx="32" cy="12" r="2" fill="#FFD700"/>
</svg>`,
  },
  {
    name: "Pizza",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Pizza slice body -->
  <polygon points="32,4 6,58 58,58" fill="#F5C842"/>
  <!-- Sauce -->
  <polygon points="32,10 10,54 54,54" fill="#E84040"/>
  <!-- Cheese -->
  <polygon points="32,14 13,52 51,52" fill="#F5C842"/>
  <!-- Crust -->
  <path d="M6 58 Q32 68 58 58" fill="#D4922A" stroke="none"/>
  <!-- Pepperoni -->
  <circle cx="32" cy="32" r="5" fill="#C0392B"/>
  <circle cx="22" cy="44" r="4" fill="#C0392B"/>
  <circle cx="42" cy="44" r="4" fill="#C0392B"/>
  <circle cx="32" cy="46" r="3" fill="#C0392B"/>
  <!-- Cheese bubbles -->
  <circle cx="26" cy="28" r="2" fill="#FFE680"/>
  <circle cx="38" cy="30" r="2.5" fill="#FFE680"/>
  <circle cx="32" cy="22" r="2" fill="#FFE680"/>
  <!-- Face on pepperoni -->
  <circle cx="30" cy="31" r="0.8" fill="white"/>
  <circle cx="34" cy="31" r="0.8" fill="white"/>
  <path d="M30 34 Q32 36 34 34" stroke="white" stroke-width="1" fill="none"/>
</svg>`,
  },
  {
    name: "Penguin",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Body -->
  <ellipse cx="32" cy="42" rx="18" ry="20" fill="#1A1A2E"/>
  <!-- Belly -->
  <ellipse cx="32" cy="44" rx="11" ry="14" fill="white"/>
  <!-- Head -->
  <circle cx="32" cy="20" r="14" fill="#1A1A2E"/>
  <!-- Face white -->
  <ellipse cx="32" cy="22" rx="9" ry="8" fill="white"/>
  <!-- Eyes -->
  <circle cx="28" cy="19" r="3" fill="white"/>
  <circle cx="36" cy="19" r="3" fill="white"/>
  <circle cx="29" cy="19" r="2" fill="#1A1A2E"/>
  <circle cx="37" cy="19" r="2" fill="#1A1A2E"/>
  <circle cx="29.5" cy="18.5" r="0.7" fill="white"/>
  <circle cx="37.5" cy="18.5" r="0.7" fill="white"/>
  <!-- Beak -->
  <polygon points="32,25 29,28 35,28" fill="#FF9800"/>
  <!-- Wings -->
  <ellipse cx="14" cy="40" rx="5" ry="12" fill="#1A1A2E" transform="rotate(-10 14 40)"/>
  <ellipse cx="50" cy="40" rx="5" ry="12" fill="#1A1A2E" transform="rotate(10 50 40)"/>
  <!-- Feet -->
  <ellipse cx="25" cy="61" rx="6" ry="3" fill="#FF9800"/>
  <ellipse cx="39" cy="61" rx="6" ry="3" fill="#FF9800"/>
  <!-- Bow tie -->
  <polygon points="29,32 32,34 29,36" fill="#E84040"/>
  <polygon points="35,32 32,34 35,36" fill="#E84040"/>
  <circle cx="32" cy="34" r="1.5" fill="#C0392B"/>
</svg>`,
  },
  {
    name: "Ghost",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Ghost body -->
  <path d="M10 56 Q10 20 32 8 Q54 20 54 56 Q48 50 42 56 Q36 50 32 56 Q28 50 22 56 Q16 50 10 56 Z" fill="#E8E8F0"/>
  <!-- Eyes -->
  <ellipse cx="24" cy="32" rx="5" ry="6" fill="#5C5C8A"/>
  <ellipse cx="40" cy="32" rx="5" ry="6" fill="#5C5C8A"/>
  <circle cx="24" cy="32" r="3" fill="#1A1A3E"/>
  <circle cx="40" cy="32" r="3" fill="#1A1A3E"/>
  <circle cx="25" cy="31" r="1" fill="white"/>
  <circle cx="41" cy="31" r="1" fill="white"/>
  <!-- Mouth -->
  <path d="M24 44 Q28 48 32 44 Q36 48 40 44" stroke="#5C5C8A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Blush -->
  <ellipse cx="19" cy="40" rx="4" ry="2.5" fill="#FFB3C6" opacity="0.6"/>
  <ellipse cx="45" cy="40" rx="4" ry="2.5" fill="#FFB3C6" opacity="0.6"/>
  <!-- Glow outline -->
  <path d="M10 56 Q10 20 32 8 Q54 20 54 56 Q48 50 42 56 Q36 50 32 56 Q28 50 22 56 Q16 50 10 56 Z" fill="none" stroke="#C8C8E8" stroke-width="1.5"/>
</svg>`,
  },
  {
    name: "Unicorn",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Mane back -->
  <ellipse cx="44" cy="18" rx="6" ry="10" fill="#FF6B9D" transform="rotate(20 44 18)"/>
  <!-- Body -->
  <ellipse cx="32" cy="44" rx="18" ry="14" fill="white"/>
  <!-- Legs -->
  <rect x="18" y="52" width="7" height="12" rx="3" fill="white"/>
  <rect x="28" y="54" width="7" height="10" rx="3" fill="white"/>
  <rect x="38" y="54" width="7" height="10" rx="3" fill="white"/>
  <!-- Hooves -->
  <rect x="18" y="61" width="7" height="4" rx="2" fill="#FFB3D9"/>
  <rect x="28" y="61" width="7" height="4" rx="2" fill="#FFB3D9"/>
  <rect x="38" y="61" width="7" height="4" rx="2" fill="#FFB3D9"/>
  <!-- Head -->
  <ellipse cx="22" cy="24" rx="13" ry="12" fill="white"/>
  <!-- Horn -->
  <polygon points="16,14 19,2 22,14" fill="#FFD700"/>
  <line x1="17.5" y1="11" x2="20.5" y2="5" stroke="#FFA000" stroke-width="0.8"/>
  <line x1="19" y1="13" x2="21.5" y2="7" stroke="#FFA000" stroke-width="0.8"/>
  <!-- Mane front -->
  <ellipse cx="30" cy="16" rx="5" ry="9" fill="#A78BFA" transform="rotate(10 30 16)"/>
  <ellipse cx="34" cy="20" rx="4" ry="7" fill="#FF6B9D" transform="rotate(5 34 20)"/>
  <!-- Eye -->
  <circle cx="18" cy="26" r="3.5" fill="#2D1A4E"/>
  <circle cx="19" cy="25" r="1.2" fill="white"/>
  <!-- Nostril -->
  <ellipse cx="12" cy="30" rx="1.5" ry="1" fill="#FFB3D9"/>
  <!-- Tail -->
  <path d="M50 44 Q60 36 56 52 Q62 44 54 56" stroke="#A78BFA" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Alien",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Antennae -->
  <line x1="24" y1="8" x2="18" y2="2" stroke="#5EE8A0" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="8" x2="46" y2="2" stroke="#5EE8A0" stroke-width="2" stroke-linecap="round"/>
  <circle cx="17" cy="1" r="2.5" fill="#FF6B6B"/>
  <circle cx="47" cy="1" r="2.5" fill="#FF6B6B"/>
  <!-- Body -->
  <ellipse cx="32" cy="46" rx="14" ry="16" fill="#5EE8A0"/>
  <!-- Head -->
  <ellipse cx="32" cy="24" rx="18" ry="17" fill="#5EE8A0"/>
  <!-- Eyes -->
  <ellipse cx="24" cy="22" rx="6" ry="8" fill="#1A0A2E"/>
  <ellipse cx="40" cy="22" rx="6" ry="8" fill="#1A0A2E"/>
  <ellipse cx="24" cy="22" rx="4" ry="6" fill="#7B2FBE"/>
  <ellipse cx="40" cy="22" rx="4" ry="6" fill="#7B2FBE"/>
  <circle cx="24" cy="21" r="2" fill="white"/>
  <circle cx="40" cy="21" r="2" fill="white"/>
  <!-- Mouth -->
  <path d="M24 34 Q32 38 40 34" stroke="#2E7D32" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Nose slits -->
  <line x1="30" y1="30" x2="30" y2="33" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="34" y1="30" x2="34" y2="33" stroke="#2E7D32" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Belly button -->
  <circle cx="32" cy="48" r="3" fill="#3EC87A"/>
</svg>`,
  },
  {
    name: "Taco",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Shell -->
  <path d="M8 40 Q32 10 56 40 Q44 56 20 56 Z" fill="#D4922A"/>
  <!-- Shell inner -->
  <path d="M12 40 Q32 14 52 40 Q41 53 23 53 Z" fill="#F5C842"/>
  <!-- Lettuce -->
  <path d="M14 42 Q20 36 26 42 Q32 36 38 42 Q44 36 50 42" stroke="#4CAF50" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Meat -->
  <ellipse cx="32" cy="44" rx="14" ry="6" fill="#8B4513"/>
  <!-- Tomato -->
  <circle cx="24" cy="42" r="4" fill="#E84040"/>
  <circle cx="40" cy="42" r="4" fill="#E84040"/>
  <!-- Cheese -->
  <path d="M20 46 Q32 42 44 46" stroke="#F5C842" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Sour cream -->
  <path d="M24 48 Q32 45 40 48" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Face on shell -->
  <circle cx="26" cy="26" r="2" fill="#C4822A"/>
  <circle cx="38" cy="26" r="2" fill="#C4822A"/>
  <path d="M28 30 Q32 33 36 30" stroke="#C4822A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Cat",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Body -->
  <ellipse cx="32" cy="46" rx="16" ry="14" fill="#FF8C00"/>
  <!-- Head -->
  <circle cx="32" cy="26" r="16" fill="#FF8C00"/>
  <!-- Ears -->
  <polygon points="16,14 10,2 24,12" fill="#FF8C00"/>
  <polygon points="48,14 54,2 40,12" fill="#FF8C00"/>
  <polygon points="17,13 13,5 22,11" fill="#FFB3C6"/>
  <polygon points="47,13 51,5 42,11" fill="#FFB3C6"/>
  <!-- Face stripes -->
  <line x1="14" y1="24" x2="20" y2="26" stroke="#E07000" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="14" y1="28" x2="20" y2="29" stroke="#E07000" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="44" y1="24" x2="50" y2="26" stroke="#E07000" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="44" y1="28" x2="50" y2="29" stroke="#E07000" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Eyes -->
  <ellipse cx="26" cy="24" rx="4" ry="5" fill="#2D1A0E"/>
  <ellipse cx="38" cy="24" rx="4" ry="5" fill="#2D1A0E"/>
  <circle cx="27" cy="23" r="1.5" fill="white"/>
  <circle cx="39" cy="23" r="1.5" fill="white"/>
  <!-- Nose -->
  <polygon points="32,30 30,32 34,32" fill="#FF6B9D"/>
  <!-- Mouth -->
  <path d="M30 32 Q32 35 34 32" stroke="#8B4513" stroke-width="1.2" fill="none"/>
  <!-- Whiskers -->
  <line x1="16" y1="31" x2="28" y2="31" stroke="#8B4513" stroke-width="1" stroke-linecap="round"/>
  <line x1="16" y1="33" x2="28" y2="34" stroke="#8B4513" stroke-width="1" stroke-linecap="round"/>
  <line x1="36" y1="31" x2="48" y2="31" stroke="#8B4513" stroke-width="1" stroke-linecap="round"/>
  <line x1="36" y1="34" x2="48" y2="33" stroke="#8B4513" stroke-width="1" stroke-linecap="round"/>
  <!-- Tail -->
  <path d="M48 54 Q60 44 56 34" stroke="#FF8C00" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Panda",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Body -->
  <ellipse cx="32" cy="46" rx="18" ry="16" fill="white"/>
  <!-- Head -->
  <circle cx="32" cy="24" r="16" fill="white"/>
  <!-- Ears -->
  <circle cx="16" cy="10" r="7" fill="#1A1A2E"/>
  <circle cx="48" cy="10" r="7" fill="#1A1A2E"/>
  <!-- Eye patches -->
  <ellipse cx="24" cy="23" rx="7" ry="6" fill="#1A1A2E" transform="rotate(-10 24 23)"/>
  <ellipse cx="40" cy="23" rx="7" ry="6" fill="#1A1A2E" transform="rotate(10 40 23)"/>
  <!-- Eyes -->
  <circle cx="24" cy="23" r="3.5" fill="white"/>
  <circle cx="40" cy="23" r="3.5" fill="white"/>
  <circle cx="24.5" cy="23.5" r="2.2" fill="#1A1A2E"/>
  <circle cx="40.5" cy="23.5" r="2.2" fill="#1A1A2E"/>
  <circle cx="25" cy="23" r="0.8" fill="white"/>
  <circle cx="41" cy="23" r="0.8" fill="white"/>
  <!-- Nose -->
  <ellipse cx="32" cy="30" rx="3" ry="2" fill="#1A1A2E"/>
  <!-- Mouth -->
  <path d="M29 33 Q32 37 35 33" stroke="#1A1A2E" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Arms -->
  <ellipse cx="14" cy="44" rx="6" ry="10" fill="#1A1A2E" transform="rotate(-15 14 44)"/>
  <ellipse cx="50" cy="44" rx="6" ry="10" fill="#1A1A2E" transform="rotate(15 50 44)"/>
  <!-- Bamboo -->
  <rect x="44" y="30" width="3" height="20" rx="1.5" fill="#4CAF50"/>
  <line x1="40" y1="36" x2="47" y2="38" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="44" x2="47" y2="46" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Rocket",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Flame -->
  <ellipse cx="32" cy="58" rx="6" ry="8" fill="#FF6B00" opacity="0.8"/>
  <ellipse cx="32" cy="56" rx="4" ry="6" fill="#FFD700"/>
  <!-- Body -->
  <path d="M20 46 Q20 20 32 6 Q44 20 44 46 Z" fill="#E84040"/>
  <!-- Nose cone -->
  <path d="M24 26 Q32 6 40 26 Z" fill="#C0392B"/>
  <!-- Window -->
  <circle cx="32" cy="30" r="6" fill="#7EC8E3"/>
  <circle cx="32" cy="30" r="4" fill="#B3E5FC"/>
  <circle cx="31" cy="29" r="1.5" fill="white" opacity="0.7"/>
  <!-- Fins -->
  <polygon points="20,46 10,58 22,52" fill="#C0392B"/>
  <polygon points="44,46 54,58 42,52" fill="#C0392B"/>
  <!-- Stripe -->
  <rect x="20" y="38" width="24" height="5" fill="#FFD700"/>
  <!-- Stars -->
  <circle cx="10" cy="12" r="1.5" fill="white"/>
  <circle cx="52" cy="20" r="1.5" fill="white"/>
  <circle cx="8" cy="28" r="1" fill="white"/>
  <circle cx="56" cy="36" r="1" fill="white"/>
</svg>`,
  },
  {
    name: "Donut",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Donut body -->
  <circle cx="32" cy="32" r="26" fill="#D4922A"/>
  <!-- Hole -->
  <circle cx="32" cy="32" r="10" fill="#1A0A00"/>
  <!-- Icing -->
  <path d="M10 26 Q12 12 26 8 Q40 4 52 14 Q58 20 56 28 Q48 20 40 22 Q32 8 24 20 Q16 22 10 26 Z" fill="#FF6B9D"/>
  <!-- Sprinkles -->
  <rect x="22" y="12" width="5" height="2" rx="1" fill="#FF6B00" transform="rotate(30 22 12)"/>
  <rect x="34" y="10" width="5" height="2" rx="1" fill="#7EC8E3" transform="rotate(-20 34 10)"/>
  <rect x="44" y="16" width="5" height="2" rx="1" fill="#5EE8A0" transform="rotate(45 44 16)"/>
  <rect x="18" y="20" width="5" height="2" rx="1" fill="#F5C842" transform="rotate(-30 18 20)"/>
  <rect x="38" y="14" width="5" height="2" rx="1" fill="#C06EF0" transform="rotate(15 38 14)"/>
  <rect x="28" y="8" width="5" height="2" rx="1" fill="#FF6B9D" transform="rotate(60 28 8)"/>
  <!-- Face -->
  <circle cx="27" cy="34" r="2.5" fill="#8B4513"/>
  <circle cx="37" cy="34" r="2.5" fill="#8B4513"/>
  <path d="M26 40 Q32 44 38 40" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Owl",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Body -->
  <ellipse cx="32" cy="44" rx="18" ry="18" fill="#8B6914"/>
  <!-- Wing pattern -->
  <ellipse cx="18" cy="46" rx="8" ry="12" fill="#6B4F10" transform="rotate(-10 18 46)"/>
  <ellipse cx="46" cy="46" rx="8" ry="12" fill="#6B4F10" transform="rotate(10 46 46)"/>
  <!-- Head -->
  <circle cx="32" cy="22" r="16" fill="#A07820"/>
  <!-- Ear tufts -->
  <polygon points="22,8 18,2 26,8" fill="#8B6914"/>
  <polygon points="42,8 46,2 38,8" fill="#8B6914"/>
  <!-- Facial disc -->
  <ellipse cx="32" cy="24" rx="12" ry="11" fill="#C4A050"/>
  <!-- Eyes -->
  <circle cx="26" cy="22" r="6" fill="white"/>
  <circle cx="38" cy="22" r="6" fill="white"/>
  <circle cx="26" cy="22" r="4" fill="#1A3A00"/>
  <circle cx="38" cy="22" r="4" fill="#1A3A00"/>
  <circle cx="26" cy="22" r="2.5" fill="#2D5A00"/>
  <circle cx="38" cy="22" r="2.5" fill="#2D5A00"/>
  <circle cx="27" cy="21" r="1" fill="white"/>
  <circle cx="39" cy="21" r="1" fill="white"/>
  <!-- Beak -->
  <polygon points="32,27 29,32 35,32" fill="#E8A020"/>
  <!-- Breast feather pattern -->
  <path d="M22 38 Q28 34 34 38 Q40 34 44 38" stroke="#6B4F10" stroke-width="1.5" fill="none"/>
  <path d="M20 44 Q26 40 32 44 Q38 40 44 44" stroke="#6B4F10" stroke-width="1.5" fill="none"/>
  <!-- Feet -->
  <path d="M24 62 L20 62 M24 62 L24 58 M24 62 L28 62" stroke="#E8A020" stroke-width="2" stroke-linecap="round"/>
  <path d="M40 62 L36 62 M40 62 L40 58 M40 62 L44 62" stroke="#E8A020" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Mushroom",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Stem -->
  <rect x="22" y="40" width="20" height="22" rx="6" fill="#F5E6C8"/>
  <!-- Stem lines -->
  <line x1="28" y1="44" x2="28" y2="58" stroke="#E0C8A0" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="36" y1="44" x2="36" y2="58" stroke="#E0C8A0" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Cap -->
  <path d="M6 42 Q6 14 32 10 Q58 14 58 42 Z" fill="#E84040"/>
  <!-- Cap underside -->
  <ellipse cx="32" cy="42" rx="26" ry="6" fill="#F5E6C8"/>
  <!-- White spots -->
  <circle cx="20" cy="24" r="5" fill="white"/>
  <circle cx="38" cy="20" r="6" fill="white"/>
  <circle cx="50" cy="30" r="4" fill="white"/>
  <circle cx="14" cy="34" r="3.5" fill="white"/>
  <circle cx="32" cy="16" r="4" fill="white"/>
  <!-- Face -->
  <circle cx="27" cy="36" r="2" fill="#C0392B"/>
  <circle cx="37" cy="36" r="2" fill="#C0392B"/>
  <path d="M26 40 Q32 44 38 40" stroke="#C0392B" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`,
  },
  {
    name: "Dinosaur",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Tail -->
  <ellipse cx="54" cy="50" rx="10" ry="5" fill="#4CAF50" transform="rotate(-20 54 50)"/>
  <!-- Body -->
  <ellipse cx="34" cy="46" rx="18" ry="14" fill="#4CAF50"/>
  <!-- Spines on back -->
  <polygon points="20,36 18,28 24,34" fill="#2E7D32"/>
  <polygon points="28,32 26,22 32,30" fill="#2E7D32"/>
  <polygon points="36,30 34,20 40,28" fill="#2E7D32"/>
  <!-- Neck -->
  <rect x="22" y="28" width="14" height="16" rx="7" fill="#4CAF50"/>
  <!-- Head -->
  <ellipse cx="22" cy="22" rx="14" ry="10" fill="#4CAF50"/>
  <!-- Snout -->
  <ellipse cx="12" cy="24" rx="8" ry="6" fill="#5CB85C"/>
  <!-- Nostrils -->
  <circle cx="8" cy="22" r="1.5" fill="#2E7D32"/>
  <circle cx="13" cy="21" r="1.5" fill="#2E7D32"/>
  <!-- Eye -->
  <circle cx="24" cy="18" r="4" fill="white"/>
  <circle cx="25" cy="18" r="2.5" fill="#1A1A2E"/>
  <circle cx="25.5" cy="17.5" r="0.8" fill="white"/>
  <!-- Teeth -->
  <polygon points="10,26 12,30 14,26" fill="white"/>
  <polygon points="14,26 16,30 18,26" fill="white"/>
  <!-- Arms -->
  <ellipse cx="22" cy="42" rx="5" ry="7" fill="#4CAF50" transform="rotate(-30 22 42)"/>
  <!-- Legs -->
  <rect x="24" y="54" width="8" height="10" rx="4" fill="#4CAF50"/>
  <rect x="36" y="54" width="8" height="10" rx="4" fill="#4CAF50"/>
</svg>`,
  },
  {
    name: "Cloud",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Cloud body -->
  <circle cx="20" cy="34" r="12" fill="#B3D9FF"/>
  <circle cx="32" cy="28" r="15" fill="#B3D9FF"/>
  <circle cx="46" cy="34" r="11" fill="#B3D9FF"/>
  <rect x="10" y="34" width="44" height="16" rx="4" fill="#B3D9FF"/>
  <!-- Highlight puffs -->
  <circle cx="20" cy="32" r="10" fill="#D6ECFF"/>
  <circle cx="30" cy="26" r="13" fill="#D6ECFF"/>
  <!-- Rain drops -->
  <ellipse cx="20" cy="56" rx="2" ry="3.5" fill="#7EC8E3"/>
  <ellipse cx="28" cy="58" rx="2" ry="3.5" fill="#7EC8E3"/>
  <ellipse cx="36" cy="56" rx="2" ry="3.5" fill="#7EC8E3"/>
  <ellipse cx="44" cy="58" rx="2" ry="3.5" fill="#7EC8E3"/>
  <!-- Face -->
  <circle cx="26" cy="36" r="2.5" fill="#5C9ED4"/>
  <circle cx="38" cy="36" r="2.5" fill="#5C9ED4"/>
  <path d="M25 42 Q32 47 39 42" stroke="#5C9ED4" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Blush -->
  <ellipse cx="20" cy="40" rx="3.5" ry="2" fill="#FFB3C6" opacity="0.5"/>
  <ellipse cx="44" cy="40" rx="3.5" ry="2" fill="#FFB3C6" opacity="0.5"/>
</svg>`,
  },
  {
    name: "Avocado",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Outer skin -->
  <path d="M32 4 Q52 16 52 38 Q52 58 32 62 Q12 58 12 38 Q12 16 32 4 Z" fill="#4A7C59"/>
  <!-- Inner flesh -->
  <path d="M32 10 Q48 20 48 38 Q48 56 32 58 Q16 56 16 38 Q16 20 32 10 Z" fill="#9DC183"/>
  <!-- Pit -->
  <ellipse cx="32" cy="38" rx="12" ry="14" fill="#C4822A"/>
  <ellipse cx="32" cy="37" rx="9" ry="11" fill="#8B5E20"/>
  <ellipse cx="30" cy="35" rx="3" ry="4" fill="#A07030" opacity="0.5"/>
  <!-- Face on flesh area -->
  <circle cx="26" cy="28" r="2.5" fill="#2E5E3E"/>
  <circle cx="38" cy="28" r="2.5" fill="#2E5E3E"/>
  <path d="M26 33 Q32 37 38 33" stroke="#2E5E3E" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Shine on pit -->
  <ellipse cx="35" cy="33" rx="2" ry="3" fill="#C4922A" opacity="0.4"/>
</svg>`,
  },
  {
    name: "Bee",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Wings -->
  <ellipse cx="18" cy="24" rx="12" ry="8" fill="#B3E5FC" opacity="0.85" transform="rotate(-20 18 24)"/>
  <ellipse cx="46" cy="24" rx="12" ry="8" fill="#B3E5FC" opacity="0.85" transform="rotate(20 46 24)"/>
  <ellipse cx="16" cy="32" rx="10" ry="6" fill="#B3E5FC" opacity="0.7" transform="rotate(-10 16 32)"/>
  <ellipse cx="48" cy="32" rx="10" ry="6" fill="#B3E5FC" opacity="0.7" transform="rotate(10 48 32)"/>
  <!-- Body -->
  <ellipse cx="32" cy="42" rx="14" ry="18" fill="#F5C842"/>
  <!-- Stripes -->
  <rect x="18" y="36" width="28" height="6" rx="3" fill="#1A1A2E"/>
  <rect x="18" y="46" width="28" height="6" rx="3" fill="#1A1A2E"/>
  <rect x="20" y="56" width="24" height="5" rx="2.5" fill="#1A1A2E"/>
  <!-- Stinger -->
  <polygon points="32,60 29,64 35,64" fill="#E8A020"/>
  <!-- Head -->
  <circle cx="32" cy="22" r="12" fill="#F5C842"/>
  <!-- Antennae -->
  <line x1="26" y1="12" x2="20" y2="4" stroke="#1A1A2E" stroke-width="2" stroke-linecap="round"/>
  <line x1="38" y1="12" x2="44" y2="4" stroke="#1A1A2E" stroke-width="2" stroke-linecap="round"/>
  <circle cx="20" cy="3" r="2.5" fill="#1A1A2E"/>
  <circle cx="44" cy="3" r="2.5" fill="#1A1A2E"/>
  <!-- Eyes -->
  <circle cx="27" cy="21" r="3.5" fill="#1A1A2E"/>
  <circle cx="37" cy="21" r="3.5" fill="#1A1A2E"/>
  <circle cx="28" cy="20" r="1.2" fill="white"/>
  <circle cx="38" cy="20" r="1.2" fill="white"/>
  <!-- Smile -->
  <path d="M26 27 Q32 32 38 27" stroke="#1A1A2E" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`,
  },
];

export function getAvatar(index: number): Avatar {
  return AVATARS[index % AVATARS.length];
}
