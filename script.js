window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    // アニメーション用のフレームをその都度取得するように変更
    let timer = null;
    const intervalTime = 300; 

    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    startButton.addEventListener('click', () => {
        document.body.classList.add('ar-active');
        sceneEl.systems['mindar-image-system'].unpause();
        
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
        document.body.classList.add('target-found');
        
        const frames = document.querySelectorAll('.zunda-frame');
        let currentIndex = 0;

        if (timer) clearInterval(timer);
        
        timer = setInterval(() => {
            // A-Frameの表示・非表示を確実に切り替える
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