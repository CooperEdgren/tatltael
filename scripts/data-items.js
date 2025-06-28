/**
 * data-items.js
 * This file contains all the structured data for the "Items" view.
 */

export const itemsData = {
  inventory: [
    {
      id: 'ocarina-of-time',
      name: "Ocarina of Time",
      image: 'images/items/inventory/Ocarina_of_Time_3D.png',
      description: 'A mystical instrument passed down by the Royal Family of Hyrule. It is required to play magical songs that have a variety of effects on the world and time itself.',
      location: 'Retrieved from Skull Kid in the Clock Tower after the first three-day cycle.',
      use: 'Play songs to alter time, call Epona, awaken spirits, and more.'
    },
    {
      id: 'heros-bow',
      name: "Hero's Bow",
      image: 'images/items/inventory/Heros_Bow_3D.png',
      description: 'A standard bow used for firing arrows. It can be upgraded with a larger quiver and can fire special arrows (Fire, Ice, Light).',
      location: 'Found in the Woodfall Temple after defeating a Dinolfos miniboss.',
      use: 'Used to hit distant targets, solve puzzles, and attack enemies from a range.'
    },
    {
      id: 'fire-arrow',
      name: 'Fire Arrow',
      image: 'images/items/inventory/Fire_Arrow_3D.png',
      description: 'Magical arrows imbued with the power of fire. They can melt ice, light torches, and burn certain enemies. Consumes magic power.',
      location: 'Obtained as a reward for completing the Snowhead Temple.',
      use: 'Select while using the Hero\'s Bow to shoot flaming projectiles.'
    },
    {
      id: 'ice-arrow',
      name: 'Ice Arrow',
      image: 'images/items/inventory/Ice_Arrow_3D.png',
      description: 'Magical arrows imbued with the power of frost. They can freeze enemies and create temporary ice platforms on water surfaces.',
      location: 'Obtained as a reward for completing the Great Bay Temple.',
      use: 'Select while using the Hero\'s Bow to shoot freezing projectiles. Useful for crossing water and disabling enemies.'
    },
    {
      id: 'bomb',
      name: 'Bomb',
      image: 'images/items/inventory/Bomb_3D.png',
      description: 'A powerful explosive that can destroy cracked walls and large boulders. Link must first acquire a Bomb Bag to carry them.',
      location: 'Bomb Bags are sold at the Bomb Shop in West Clock Town for 50 Rupees after helping the old lady at night on the first day.',
      use: 'Place on the ground to detonate after a short fuse. Be careful not to get caught in the blast!'
    },
  ],
  equipment: [
    {
      id: 'kokiri-sword',
      name: "Kokiri Sword",
      image: 'images/items/equipment/Kokiri_Sword_3D.png',
      description: 'Link\'s initial sword. While reliable, it is the weakest of the available swords and cannot be upgraded.',
      location: 'Default equipment for Link.'
    },
    {
      id: 'razor-sword',
      name: 'Razor Sword',
      image: 'images/items/equipment/Razor_Sword_3D.png',
      description: 'An upgraded, more powerful version of the Kokiri Sword. However, its edge is fragile and will revert back to the Kokiri Sword after 100 strikes or after turning back time.',
      location: 'Forged at the Mountain Smithy for 100 Rupees. The forging process takes one full day.'
    },
     {
      id: 'gilded-sword',
      name: 'Gilded Sword',
      image: 'images/items/equipment/Gilded_Sword_3D.png',
      description: 'The strongest and most durable sword available. It is a permanent upgrade and will not break or revert.',
      location: 'Forged at the Mountain Smithy after winning the Goron Race and obtaining Gold Dust. Requires the Razor Sword and the Gold Dust.'
    },
    {
      id: 'heros-shield',
      name: "Hero's Shield",
      image: 'images/items/equipment/Heros_Shield_3D.png',
      description: 'A standard shield that can protect Link from most simple projectiles and enemy attacks. It can be destroyed by Like Likes and certain powerful attacks.',
      location: 'Available for purchase at the Trading Post in West Clock Town for 80 Rupees. It is also Link\'s default shield at the start of a 3-day cycle if he has previously acquired it.'
    },
    {
      id: 'mirror-shield',
      name: "Mirror Shield",
      image: 'images/items/equipment/Mirror_Shield_3D.png',
      description: 'A magical shield that can reflect light and certain magical projectiles. It is indestructible.',
      location: 'Found within a chest in the Ancient Castle of Ikana, after the "Beneath the Well" section.'
    },
  ],
  masks: [
    {
      id: 'deku-mask',
      name: 'Deku Mask',
      image: 'images/items/masks/Deku_Mask_3D.png',
      description: 'A magical mask that transforms Link into a Deku Scrub. As a Deku Scrub, Link can shoot bubbles, spin attack, skip on water, and use Deku Flowers to fly for a short period. He is vulnerable to fire.',
      location: 'Obtained from the Happy Mask Salesman in the Clock Tower at the beginning of the game after retrieving the Ocarina of Time from Skull Kid.'
    },
    {
      id: 'goron-mask',
      name: 'Goron Mask',
      image: 'images/items/masks/Goron_Mask_3D.png',
      description: 'Transforms Link into Darmani, the Goron hero. As a Goron, Link can punch, curl into a powerful, rolling ball, and perform a ground pound. He is immune to lava but sinks in water.',
      location: 'Received after playing the Song of Healing for the spirit of Darmani in the Goron Graveyard.'
    },
     {
      id: 'zora-mask',
      name: 'Zora Mask',
      image: 'images/items/masks/Zora_Mask_3D.png',
      description: 'Transforms Link into Mikau, the Zora guitarist. As a Zora, Link can swim with great speed, create a magical barrier, and use his fins as boomerangs. ',
      location: 'Received after playing the Song of Healing for the spirit of Mikau, found floating in the waters of Great Bay Coast.'
    },
     {
      id: 'fierce-deity-mask',
      name: 'Fierce Deity\'s Mask',
      image: 'images/items/masks/Fierce_Deitys_Mask_3D.png',
      description: 'An immensely powerful mask that transforms Link into Fierce Deity Link, a god-like warrior. Can only be used during boss battles.',
      location: 'Given by the Moon Children on The Moon after giving them all 20 non-transforming masks.'
    },
  ],
  bottledItems: [
    {
      id: 'bottle',
      name: 'Empty Bottle',
      image: 'images/items/bottled/Empty_Bottle_3D.png',
      description: 'A versatile container that can hold a variety of liquids and items, such as Potions, Milk, Fairies, and more.',
      location: 'There are six bottles to find in total. One is obtained by helping the Koume and Kotake sisters in the Southern Swamp.'
    },
    {
      id: 'red-potion',
      name: 'Red Potion',
      image: 'images/items/bottled/Red_Potion_3D.png',
      description: 'A common potion that restores Link\'s health.',
      location: 'Can be purchased at the Clock Town Potion Shop or from the Deku Scrub in Southern Swamp.'
    },
     {
      id: 'milk',
      name: 'Milk',
      image: 'images/items/bottled/Milk_Bottle_3D.png',
      description: 'Fresh milk from the finest cows at Romani Ranch. Restores five hearts. Each bottle contains two servings.',
      location: 'Obtained by playing Epona\'s Song for a cow. The first bottle is given for helping defend the barn at Romani Ranch.'
    },
  ],
};
