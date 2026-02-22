window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let timer = null;
    let isReadyToScan = false; // スキャン許可フラグ
    const intervalTime = 300; 

    // ボタン押下時の処理
    startButton.addEventListener('click', () => {
        isReadyToScan = true; // ここでスキャンを許可
        document.body.classList.add('ar-active');
        
        // 音声制限解除
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        
        // レイアウト崩れ防止
        window.dispatchEvent(new Event('resize'));
    });

    // ターゲット発見
    targetEl.addEventListener("targetFound", () => {
        // フラグが立っていない（ボタンを押してない）なら何もしない
        if (!isReadyToScan) return;

        document.body.classList.add('target-found');
        const frames = document.querySelectorAll('.zunda-frame');
        let currentIndex = 0;

        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            for (let i = 0; i < frames.length; i++) {
                frames[i].setAttribute('visible', i === currentIndex ? 'true' : 'false');
            }
            currentIndex = (currentIndex + 1) % frames.length;
        }, intervalTime);

        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log(e));
        }
    });

    // ターゲット紛失
    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found');
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        const frames = document.querySelectorAll('.zunda-frame');
        frames.forEach(f => f.setAttribute('visible', 'false'));
        if (audio) audio.pause();
    });
});