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
        // ARシステムの開始
        const arSystem = sceneEl.systems['mindar-image-system'];
        arSystem.start(); 

        // 音声のアンロック
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        });

        startScreen.style.display = 'none';

        // 真っ白対策：少し遅れてリサイズイベントを発火させ、カメラ描画を強制する
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
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