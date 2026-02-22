window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let timer = null;
    const intervalTime = 300; 

    // ★修正ポイント：ARの準備が整うのを待たず、
    // シーンが読み込まれた直後の最も早い段階で「スキャン一時停止」を予約します
    sceneEl.addEventListener("renderstart", () => {
        const arSystem = sceneEl.systems['mindar-image-system'];
        if (arSystem) {
            arSystem.pause(true); // スキャン機能のみを強制停止
        }
    });

    // ボタン押下時の処理
    startButton.addEventListener('click', () => {
        // ボタンを押した時だけスキャンを「再開」
        const arSystem = sceneEl.systems['mindar-image-system'];
        if (arSystem) {
            arSystem.unpause(); 
        }

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

    // --- targetFound / targetLost のロジックは変更なし ---
    targetEl.addEventListener("targetFound", () => {
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