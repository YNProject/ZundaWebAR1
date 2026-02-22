window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 300;

    // --- 【重要】起動直後に一旦ポーズをかける ---
    sceneEl.addEventListener("arReady", () => {
        // カメラは動いているが認識処理（スキャン）だけを止める
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    startButton.addEventListener('click', () => {
        // スキャン（認識）を再開
        sceneEl.systems['mindar-image-system'].unpause();

        // 音声のブラウザロック解除
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        });

        // 案内画面を消す
        startScreen.style.display = 'none';
        
        // レイアウト崩れ防止のリサイズ発火
        window.dispatchEvent(new Event('resize'));
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
        audio.play().catch(e => console.log("Audio play error:", e));
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