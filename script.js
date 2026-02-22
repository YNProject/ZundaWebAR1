window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 300;

    startButton.addEventListener('click', () => {
        // 画像認識機能を有効化
        const arSystem = sceneEl.systems['mindar-image-system'];
        arSystem.unpause(); // paused状態から復帰

        // 音声ロック解除
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        });

        // 案内画面を非表示
        startScreen.style.display = 'none';
    });

    const startShow = () => {
        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        audio.currentTime = 0;
        audio.play().catch(e => console.log(e));
    };

    const stopShow = () => {
        clearInterval(timer);
        timer = null;
        frames.forEach(f => f.setAttribute('visible', false));
        audio.pause();
        audio.currentTime = 0;
    };

    const targetEl = document.querySelector('#zunda-target');
    targetEl.addEventListener("targetFound", startShow);
    targetEl.addEventListener("targetLost", stopShow);
});