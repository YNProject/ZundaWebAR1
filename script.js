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

    // 起動時に認識を一時停止
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    startButton.addEventListener('click', () => {
        document.body.classList.add('ar-active');
        sceneEl.systems['mindar-image-system'].unpause();
        
        // 音声初期化
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';

        // 画面サイズの再計算を強制（これでカメラ映像のズレを直す）
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // ターゲット発見
    targetEl.addEventListener("targetFound", () => {
        document.body.classList.add('target-found');
        
        if (!timer) {
            timer = setInterval(() => {
                frames.forEach(f => f.setAttribute('visible', false));
                frames[currentIndex].setAttribute('visible', true);
                currentIndex = (currentIndex + 1) % frames.length;
            }, intervalTime);
        }
        audio.currentTime = 0;
        audio.play().catch(e => console.log(e));
    });

    // ターゲット紛失
    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found');
        
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        frames.forEach(f => f.setAttribute('visible', false));
        audio.pause();
    });
});