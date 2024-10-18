const jwt = require('jsonwebtoken');

const token = jwt.sign({ username: 'user' }, 'secret', { expiresIn: '5m' });
console.log('Generated Token:', token);

jwt.verify(token, 'secret', (err, user) => {
    if (err) {
        return console.error('Token verification failed:', err);
    }
    console.log('Verified User:', user);
});
