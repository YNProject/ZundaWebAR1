window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    const particleContainer = document.querySelector('#particle-container');
    
    let timer = null;
    let isScannerActive = false; 
    const intervalTime = 300; 

    // パーティクル生成関数
    const createParticles = () => {
        particleContainer.innerHTML = ''; // リセット
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('a-image');
            p.setAttribute('src', '#particle-img');
            p.setAttribute('width', '0.15');
            p.setAttribute('height', '0.15');
            
            // ランダムな開始位置
            const x = (Math.random() - 0.5) * 0.8;
            const y = (Math.random() - 0.5) * 0.5 - 0.3;
            p.setAttribute('position', `${x} ${y} 0.1`);

            // 舞い上がるアニメーション
            p.setAttribute('animation__move', {
                property: 'position',
                to: `${x + (Math.random() - 0.5) * 0.4} ${y + 1.2} 0.1`,
                dur: 1500 + Math.random() * 1000,
                easing: 'easeOutQuad',
                loop: true
            });

            // 消えていくアニメーション
            p.setAttribute('animation__fade', {
                property: 'material.opacity',
                from: 1,
                to: 0,
                dur: 1500 + Math.random() * 1000,
                easing: 'easeInQuad',
                loop: true
            });

            particleContainer.appendChild(p);
        }
    };

    startButton.addEventListener('click', () => {
        isScannerActive = true; 
        document.body.classList.add('ar-active');
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
    });

    targetEl.addEventListener("targetFound", () => {
        if (!isScannerActive) return;

        document.body.classList.add('target-found');
        createParticles(); // パーティクル開始

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

    targetEl.addEventListener("targetLost", () => {
        document.body.classList.remove('target-found');
        particleContainer.innerHTML = ''; // パーティクル消去

        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        const frames = document.querySelectorAll('.zunda-frame');
        frames.forEach(f => f.setAttribute('visible', 'false'));
        if (audio) audio.pause();
    });
});