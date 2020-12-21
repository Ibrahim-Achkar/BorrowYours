import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin Alex',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isDelete: false,
    favouriteThing: '🍌',
  },
  {
    name: 'Cucumber Bob',
    email: 'cucumber@example.com',
    password: bcrypt.hashSync('123456', 10),
    isDelete: false,
    favouriteThing: '🥒',
  },
  {
    name: 'Rumba Rider',
    email: 'rumba@example.com',
    password: bcrypt.hashSync('123456', 10),
    isDelete: false,
    favouriteThing: '🍊',
  },
];

export default users;
