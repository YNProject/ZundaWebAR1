window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 300; 

    // 1. 起動時に認識のみ停止
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    // 2. ボタン押下：スキャン開始
    startButton.addEventListener('click', () => {
        document.body.classList.add('ar-active'); // CSSでスキャンUIを許可
        sceneEl.systems['mindar-image-system'].unpause(); // 認識再開
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none'; // 初期画面を消す
        window.dispatchEvent(new Event('resize'));
    });

    // 3. ターゲット発見
    targetEl.addEventListener("targetFound", () => {
        document.body.classList.add('target-found'); // ラインを強制消去
        
        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        audio.currentTime = 0;
        audio.play();
    });

    // 4. ターゲット紛失
    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found'); // ラインを復活
        
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        frames.forEach(f => f.setAttribute('visible', false));
        audio.pause();
    });
});