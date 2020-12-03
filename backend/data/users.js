import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin Alex',
    email: 'admin@example.com',
    password: '123456',
    isAdmin: true,
  },
  {
    name: 'Cucumber Bob',
    email: 'cucumber@example.com',
    password: '123456',
  },
  {
    name: 'Rumba Rider',
    email: 'rumba@example.com',
    password: '123456',
  },
];

export default users;
