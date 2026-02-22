window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const frames = document.querySelectorAll('.zunda-frame');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    
    let currentIndex = 0;
    let timer = null;
    const intervalTime = 200; // アニメーションを少し速くして滑らかに

    // 起動時に画像認識を止める
    sceneEl.addEventListener("arReady", () => {
        sceneEl.systems['mindar-image-system'].pause(true); 
    });

    // スキャン開始
    startButton.addEventListener('click', () => {
        document.body.classList.add('ar-active');
        sceneEl.systems['mindar-image-system'].unpause();
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
    });

    // 認識した！
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

    // 見失った...
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