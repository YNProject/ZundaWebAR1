window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let timer = null;
    let isScannerActive = false; // ★スキャン許可フラグ
    const intervalTime = 300; 

    // シーン準備完了時に念のため停止命令を送る
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true);
    });

    // ボタン押下時の処理
    startButton.addEventListener('click', () => {
        isScannerActive = true; // ★ここで初めてスキャンを許可する
        sceneEl.systems['mindar-image-system'].unpause();

        document.body.classList.add('ar-active');
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });

    // ターゲット発見
    targetEl.addEventListener("targetFound", () => {
        // ★ボタンが押されていない場合は、認識しても無視する
        if (!isScannerActive) return;

        document.body.classList.add('target-found');
        const frames = document.querySelectorAll('.zunda-frame');
        let currentIndex = 0;

        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            for (let i = 0; i < frames.length; i++) {
                if (i === currentIndex) {
                    frames[i].setAttribute('visible', 'true');
                } else {
                    frames[i].setAttribute('visible', 'false');
                }
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