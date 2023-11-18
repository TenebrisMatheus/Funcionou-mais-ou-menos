document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('upload-form');
    const mediaInput = document.getElementById('media');
    const categorySelect = document.getElementById('category');
    const mediaContainer = document.getElementById('media-container');

    // Configurar referências do Firebase
    const storage = firebase.storage();
    const firestore = firebase.firestore();

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const mediaFile = mediaInput.files[0];
        const category = categorySelect.value;

        if (mediaFile && category) {
            // Criar uma referência única para a mídia no Storage
            const mediaRef = storage.ref(`${category}/${mediaFile.name}`);

            // Fazer upload da mídia para o Storage
            mediaRef.put(mediaFile)
                .then((snapshot) => {
                    // Obter a URL da mídia após o upload
                    return snapshot.ref.getDownloadURL();
                })
                .then((downloadURL) => {
                    // Registrar informações da mídia no Firestore
                    return firestore.collection('media').add({
                        category,
                        url: downloadURL,
                    });
                })
                .then(() => {
                    console.log('Mídia enviada com sucesso!');
                    // Limpar formulário após o envio
                    uploadForm.reset();
                })
                .catch((error) => {
                    console.error('Erro no envio da mídia:', error);
                });
        } else {
            console.error('Por favor, escolha uma mídia e uma categoria.');
        }
    });

    // Função para recuperar e exibir mídias da categoria selecionada
    function showMedia(category) {
        mediaContainer.innerHTML = '';

        // Recuperar mídias do Firestore com base na categoria
        firestore.collection('media').where('category', '==', category).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const mediaData = doc.data();
                    const mediaElement = createMediaElement(mediaData.url);

                    mediaContainer.appendChild(mediaElement);
                });
            })
            .catch((error) => {
                console.error('Erro ao recuperar mídias:', error);
            });
    }

    // Adicionar evento de alteração à categoria para exibir mídias correspondentes
    categorySelect.addEventListener('change', function () {
        const selectedCategory = categorySelect.value;
        showMedia(selectedCategory);
    });
});

// Função auxiliar para criar elementos de mídia (imagem, áudio, vídeo)
function createMediaElement(url) {
    const mediaElement = document.createElement('div');

    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        mediaElement.appendChild(audio);
    } else if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
        const video = document.createElement('video');
        video.controls = true;
        video.src = url;
        mediaElement.appendChild(video);
    } else {
        const image = document.createElement('img');
        image.src = url;
        mediaElement.appendChild(image);
    }

    return mediaElement;
}
