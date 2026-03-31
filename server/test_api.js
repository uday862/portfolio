const fs = require('fs');
const jwt = require('jsonwebtoken');

async function testUpload() {
   try {
     const token = jwt.sign({ user: { role: 'admin' } }, 'uday_super_secret_jwt_key_2026', { expiresIn: '10h' });

     const form = new FormData();
     const blob = new Blob(['helloworld'], { type: 'image/png' });
     form.append('image', blob, 'test.png');
     form.append('title', 'Test Cert');
     form.append('description', 'This is a test');

     const res = await fetch('http://localhost:5000/api/admin/certificate', {
       method: 'POST',
       headers: { 'x-auth-token': token },
       body: form
     });
     
     const text = await res.text();
     console.log("STATUS:", res.status);
     console.log("BODY:", text);
   } catch (e) {
     console.log("ERROR:", e);
   }
}
testUpload();
