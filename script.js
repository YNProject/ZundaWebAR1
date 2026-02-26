window.addEventListener("load", () => {
    const sceneEl = document.querySelector('a-scene');
    const audio = document.querySelector('#zunda-audio');
    const startScreen = document.querySelector('#start-screen');
    const startButton = document.querySelector('#start-button');
    const targetEl = document.querySelector('#zunda-target');
    const particleContainer = document.querySelector('#particle-container');
    
    // 【追加】ARボタン要素
    const arButtons = document.querySelector('#ar-buttons');
    const backToTitleBtn = document.querySelector('#back-to-title');
    
    let timer = null;
    let isScannerActive = false;
    const intervalTime = 300;

    const createParticles = () => {
        particleContainer.innerHTML = '';
        const count = 15;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('a-image');
            p.setAttribute('src', '#particle-img');
            p.setAttribute('width', '0.12');
            p.setAttribute('height', '0.12');
            p.setAttribute('material', 'transparent: true; alphaTest: 0.05; depthTest: false;');
            
            const angle = (i / count) * Math.PI * 2;
            const distance = 0.8;
            p.setAttribute('position', '0 0 0');

            p.setAttribute('animation__move', {
                property: 'position',
                to: `${Math.cos(angle) * distance} ${Math.sin(angle) * distance} 0`,
                dur: 4000,
                easing: 'easeOutQuad',
                loop: true
            });

            p.setAttribute('animation__fade', {
                property: 'material.opacity',
                from: 1,
                to: 0,
                dur: 4000,
                easing: 'linear',
                loop: true
            });
            particleContainer.appendChild(p);
        }
    };

    // スタートボタンクリック
    startButton.addEventListener('click', () => {
        isScannerActive = true;
        document.body.classList.add('ar-active');
        
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
        }).catch(e => console.log(e));

        startScreen.style.display = 'none';
        arButtons.style.display = 'flex'; // 【追加】ボタンを表示
        window.dispatchEvent(new Event('resize'));
    });

    // 【追加】タイトルに戻るボタン（ページリロード）
    backToTitleBtn.addEventListener('click', () => {
        location.reload();
    });

    targetEl.addEventListener("targetFound", () => {
        if (!isScannerActive) return;
        document.body.classList.add('target-found');
        createParticles();

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
        particleContainer.innerHTML = '';
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        const frames = document.querySelectorAll('.zunda-frame');
        frames.forEach(f => f.setAttribute('visible', 'false'));
        if (audio) audio.pause();
    });
});