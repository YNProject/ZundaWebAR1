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

    // パーティクル生成関数（放射状・ゆっくり）
    const createParticles = () => {
        particleContainer.innerHTML = ''; 
        const count = 15; 

        for (let i = 0; i < count; i++) {
            const p = document.createElement('a-image');
            p.setAttribute('src', '#particle-img');
            p.setAttribute('width', '0.12');
            p.setAttribute('height', '0.12');
            
            // 角度の計算
            const angle = (i / count) * Math.PI * 2;
            const distance = 1.2; // 外側への広がりの幅
            
            // 【開始位置】ずんだもんの少し後ろ、かつ中心付近
            const startZ = -0.2;
            p.setAttribute('position', `0 0 ${startZ}`);
            
            // チラつき防止と透過設定
            p.setAttribute('material', 'transparent: true; alphaTest: 0.05; depthWrite: false;');

            // 【アニメーション】外側に広がりつつ、カメラ側（zを大きく）へ移動
            // z: 1.0 にすることで自分の方へ飛んでくる感覚になります
            p.setAttribute('animation__move', {
                property: 'position',
                to: `${Math.cos(angle) * distance} ${Math.sin(angle) * distance} 1.0`,
                dur: 4000, 
                easing: 'easeOutQuad',
                loop: true
            });

            // 消えていくアニメーション
            p.setAttribute('animation__fade', {
                property: 'material.opacity',
                from: 1,
                to: 0,
                dur: 4000,
                easing: 'linear',
                loop: true
            });

            // 飛んでくる間に少しだけ大きくすると迫力がでます
            p.setAttribute('animation__scale', {
                property: 'scale',
                from: '1 1 1',
                to: '1.5 1.5 1.5',
                dur: 4000,
                easing: 'linear',
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
        createParticles(); // 放射状パーティクル開始

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