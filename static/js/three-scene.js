class ThreeScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('three-canvas'),
            alpha: true,
            antialias: true
        });
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        this.particles = null;
        this.particlesData = [];

        this.init();
    }

    init() {
        // レンダラーの設定
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // カメラの設定
        this.camera.position.set(0, 0, 5);

        // ライティングの設定
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 2, 5);
        this.scene.add(directionalLight);

        // パーティクルシステムの作成
        this.createParticles();

        // マウスイベントの追加
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // アニメーションループの開始
        this.animate();

        // リサイズイベントの設定
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2500;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        const sizes = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            // ランダムな位置を設定
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            // パーティクルの色を設定
            colors[i3] = Math.random() * 0.5 + 0.5;     // R
            colors[i3 + 1] = Math.random() * 0.5 + 0.5; // G
            colors[i3 + 2] = Math.random() * 0.5 + 0.5; // B

            // パーティクルのサイズを設定
            sizes[i] = Math.random() * 2;

            // パーティクルの動きのデータを保存
            this.particlesData.push({
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                ),
                initialPosition: new THREE.Vector3(
                    positions[i3],
                    positions[i3 + 1],
                    positions[i3 + 2]
                )
            });
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            sizeAttenuation: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // マウス位置に基づいて回転目標を更新
        this.targetRotation.x = this.mouse.y * 0.3;
        this.targetRotation.y = this.mouse.x * 0.3;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        if (this.particles) {
            // パーティクルの回転を更新
            this.particles.rotation.x += (this.targetRotation.x - this.particles.rotation.x) * 0.05;
            this.particles.rotation.y += (this.targetRotation.y - this.particles.rotation.y) * 0.05;

            // パーティクルの位置を更新
            const positions = this.particles.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                const index = i / 3;
                const data = this.particlesData[index];

                // 現在の位置を更新
                positions[i] += data.velocity.x;
                positions[i + 1] += data.velocity.y;
                positions[i + 2] += data.velocity.z;

                // 波のような動きを追加
                positions[i] += Math.sin(time * 0.5 + index) * 0.005;
                positions[i + 1] += Math.cos(time * 0.5 + index) * 0.005;

                // 範囲外に出たパーティクルを元の位置に戻す
                const distance = Math.sqrt(
                    positions[i] ** 2 +
                    positions[i + 1] ** 2 +
                    positions[i + 2] ** 2
                );

                if (distance > 15) {
                    positions[i] = data.initialPosition.x;
                    positions[i + 1] = data.initialPosition.y;
                    positions[i + 2] = data.initialPosition.z;
                }
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.threeScene = new ThreeScene();
});