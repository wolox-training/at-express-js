exports.welcomeEmail = user => ({
  from: 'SuperDooper Api',
  to: user.email,
  subject: 'Welcome to the most amazing api in the wo... lox!',
  text: `Welcome, ${user.firstName}!`,
  html: `<b>Welcome, ${user.firstName}!</b>`
});
