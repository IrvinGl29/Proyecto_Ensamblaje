const token = localStorage.getItem('token');  // Asegúrate de que el nombre coincida con el token guardado

// Si no hay token, redirige al login
if (!token) {
    window.location.href = '/login';
}

async function fetchProtectedData() {
    const response = await fetch('https://18.117.224.244:80/api/inventory', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Asegúrate de usar el prefijo 'Bearer'
        }
    });

    const data = await response.json();

    if (response.status === 200) {
        console.log('Protected data:', data);
    } else {
        console.log('Error:', data);
    }
}

// Llamada a la función para obtener los datos protegidos
fetchProtectedData();