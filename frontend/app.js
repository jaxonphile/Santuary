async function muatLayanan() {
    const respons = await fetch('https://localhost:3000/api/layanan');
    const hasil = await respons.json();

    console.log('status:', hasil.status);
    console.log('data:', hasil.data);
}

muatLayanan();