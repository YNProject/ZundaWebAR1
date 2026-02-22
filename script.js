window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 300; // 1000から300に変更（パラパラ漫画感を出すため）
    let isArEnabled = false;

    // 起動時に認識のみ停止
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    startButton.addEventListener('click', () => {
        isArEnabled = true;
        
        // システム再開
        sceneEl.systems['mindar-image-system'].unpause();

        // CSSでスキャンラインを表示させる準備
        document.body.classList.add('ar-active');

        // 音声ロック解除
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
    });

    const startShow = () => {
        if (!isArEnabled) return;

        // 【追加】認識されたらスキャンUIを隠すクラスを付与
        document.body.classList.add('scanning-hidden');

        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Audio Play Error:", e));
    };

    const stopShow = () => {
        // 【追加】認識が外れたらスキャンUIを隠すクラスを除去（再び表示される）
        document.body.classList.remove('scanning-hidden');

        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        frames.forEach(f => f.setAttribute('visible', false));
        audio.pause();
        audio.currentTime = 0;
    };

    targetEl.addEventListener("targetFound", startShow);
    targetEl.addEventListener("targetLost", stopShow);
});