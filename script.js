const urlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const preview = document.getElementById('previewVideo');
const downloadLink = document.getElementById('downloadLink');
const errorDiv = document.getElementById('error');

downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
        showError('Masukkan URL terlebih dahulu!');
        return;
    }

    // Sembunyikan hasil lama
    result.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Gagal mengambil video.');
        }

        // Tampilkan video
        preview.src = data.videoUrl;
        downloadLink.href = data.videoUrl;
        // Generate nama file dari URL
        const fileName = data.videoUrl.split('/').pop().split('?')[0] || 'video.mp4';
        downloadLink.download = fileName;

        result.classList.remove('hidden');
        loading.classList.add('hidden');
        // Scroll ke hasil
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
        showError(err.message);
        loading.classList.add('hidden');
    }
});

function showError(msg) {
    errorDiv.textContent = '❌ ' + msg;
    errorDiv.classList.remove('hidden');
}