export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const menuData: MenuItem[] = [
  {
    id: "60d5ecb8b3118835942488d1",
    name: "Gourmet Pepperoni Pizza",
    description: "Authentic wood-fired pizza with melted mozzarella, premium pepperoni, and fresh basil.",
    price: 18.99,
    image: "/pizza.png"
  },
  {
    id: "60d5ecb8b3118835942488d2",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melting cheddar, fresh lettuce, and tomatoes on a toasted brioche bun.",
    price: 14.49,
    image: "/burger.png"
  },
  {
    id: "60d5ecb8b3118835942488d3",
    name: "Fresh Sushi Platter",
    description: "A beautifully arranged selection of fresh salmon, tuna nigiri, and avocado rolls.",
    price: 24.00,
    image: "/sushi.png"
  }
];
