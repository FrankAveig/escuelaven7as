(function () {
    var canvas = document.getElementById('infernoCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var EMBERS = 5000;
    var SMOKE = 500;
    var TOTAL = EMBERS + SMOKE;

    // Intensidad global 0→1. El scroll la ajusta desde programs.js
    window.infernoIntensity = 1;

    var w = window.innerWidth;
    var h = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 1000);
    camera.position.z = 500;

    // Ember texture
    function makeEmberTex() {
        var s = 64, c = document.createElement('canvas');
        c.width = s; c.height = s;
        var ctx = c.getContext('2d');
        var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.1, 'rgba(255,230,120,0.9)');
        g.addColorStop(0.35, 'rgba(255,150,30,0.5)');
        g.addColorStop(0.65, 'rgba(200,50,5,0.15)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        return new THREE.CanvasTexture(c);
    }

    // Smoke texture
    function makeSmokeTex() {
        var s = 128, c = document.createElement('canvas');
        c.width = s; c.height = s;
        var ctx = c.getContext('2d');
        var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, 'rgba(50,25,8,0.3)');
        g.addColorStop(0.3, 'rgba(35,12,4,0.18)');
        g.addColorStop(0.7, 'rgba(15,5,2,0.06)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        return new THREE.CanvasTexture(c);
    }

    var emberTex = makeEmberTex();
    var smokeTex = makeSmokeTex();

    // Shader
    var vs =
        'attribute float size;\n' +
        'attribute float alpha;\n' +
        'attribute vec3 customColor;\n' +
        'varying float vAlpha;\n' +
        'varying vec3 vColor;\n' +
        'void main() {\n' +
        '  vAlpha = alpha;\n' +
        '  vColor = customColor;\n' +
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);\n' +
        '  gl_PointSize = size;\n' +
        '  gl_Position = projectionMatrix * mv;\n' +
        '}\n';

    var fs =
        'uniform sampler2D pointTexture;\n' +
        'varying float vAlpha;\n' +
        'varying vec3 vColor;\n' +
        'void main() {\n' +
        '  vec4 t = texture2D(pointTexture, gl_PointCoord);\n' +
        '  gl_FragColor = vec4(vColor, vAlpha * t.a);\n' +
        '}\n';

    var emberMat = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: emberTex } },
        vertexShader: vs, fragmentShader: fs,
        blending: THREE.AdditiveBlending,
        depthWrite: false, transparent: true
    });

    var smokeMat = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: smokeTex } },
        vertexShader: vs, fragmentShader: fs,
        blending: THREE.NormalBlending,
        depthWrite: false, transparent: true
    });

    // Ember buffers
    var ePos = new Float32Array(EMBERS * 3);
    var eCol = new Float32Array(EMBERS * 3);
    var eSiz = new Float32Array(EMBERS);
    var eAlp = new Float32Array(EMBERS);
    var embers = [];

    // Smoke buffers
    var sPos = new Float32Array(SMOKE * 3);
    var sCol = new Float32Array(SMOKE * 3);
    var sSiz = new Float32Array(SMOKE);
    var sAlp = new Float32Array(SMOKE);
    var smokes = [];

    var warmColors = [
        { r: 1.0, g: 0.95, b: 0.7 },
        { r: 1.0, g: 0.78, b: 0.3 },
        { r: 1.0, g: 0.55, b: 0.08 },
        { r: 0.9, g: 0.35, b: 0.02 },
        { r: 0.7, g: 0.18, b: 0.0 },
        { r: 0.35, g: 0.06, b: 0.0 }
    ];

    function initEmber(i) {
        var isBig = Math.random() < 0.15;
        embers[i] = {
            x: (Math.random() - 0.5) * w * 1.6,
            y: -h / 2 - Math.random() * 400,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 0.6 + Math.random() * 3.0,
            life: 0,
            maxLife: 120 + Math.random() * 280,
            size: isBig ? (8 + Math.random() * 14) : (2 + Math.random() * 7),
            wobbleSpeed: 1 + Math.random() * 4,
            wobbleAmp: 0.2 + Math.random() * 0.8,
            phase: Math.random() * 6.28,
            bright: isBig ? (0.7 + Math.random() * 0.3) : (0.5 + Math.random() * 0.5)
        };
    }

    function initSmoke(i) {
        smokes[i] = {
            x: (Math.random() - 0.5) * w * 1.4,
            y: -h / 2 - Math.random() * 300,
            vx: (Math.random() - 0.5) * 0.4,
            vy: 0.3 + Math.random() * 0.9,
            life: 0,
            maxLife: 250 + Math.random() * 400,
            size: 100 + Math.random() * 200,
            phase: Math.random() * 6.28
        };
    }

    for (var i = 0; i < EMBERS; i++) {
        initEmber(i);
        embers[i].life = Math.random() * embers[i].maxLife;
        embers[i].y = -h / 2 + Math.random() * h * 1.5;
    }
    for (var j = 0; j < SMOKE; j++) {
        initSmoke(j);
        smokes[j].life = Math.random() * smokes[j].maxLife;
        smokes[j].y = -h / 2 + Math.random() * h * 1.5;
    }

    var eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    eGeo.setAttribute('customColor', new THREE.BufferAttribute(eCol, 3));
    eGeo.setAttribute('size', new THREE.BufferAttribute(eSiz, 1));
    eGeo.setAttribute('alpha', new THREE.BufferAttribute(eAlp, 1));
    scene.add(new THREE.Points(eGeo, emberMat));

    var sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute('customColor', new THREE.BufferAttribute(sCol, 3));
    sGeo.setAttribute('size', new THREE.BufferAttribute(sSiz, 1));
    sGeo.setAttribute('alpha', new THREE.BufferAttribute(sAlp, 1));
    scene.add(new THREE.Points(sGeo, smokeMat));

    var time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        for (var i = 0; i < EMBERS; i++) {
            var e = embers[i];
            e.life++;
            if (e.life >= e.maxLife) { initEmber(i); continue; }

            var lr = e.life / e.maxLife;
            e.vx += Math.sin(time * e.wobbleSpeed + e.phase) * e.wobbleAmp * 0.025;
            e.x += e.vx * 0.7;
            e.y += e.vy * 0.8;

            ePos[i * 3] = e.x;
            ePos[i * 3 + 1] = e.y;
            ePos[i * 3 + 2] = 0;

            var ci = Math.min(warmColors.length - 1, Math.floor(lr * warmColors.length));
            var ni = Math.min(warmColors.length - 1, ci + 1);
            var t = (lr * warmColors.length) - ci;
            var c1 = warmColors[ci], c2 = warmColors[ni];
            eCol[i * 3] = c1.r + (c2.r - c1.r) * t;
            eCol[i * 3 + 1] = c1.g + (c2.g - c1.g) * t;
            eCol[i * 3 + 2] = c1.b + (c2.b - c1.b) * t;

            var a;
            if (lr < 0.1) a = lr / 0.1;
            else if (lr > 0.55) a = 1 - (lr - 0.55) / 0.45;
            else a = 1;
            var flicker = 0.8 + Math.sin(time * 12 + i * 1.7) * 0.2;
            var intensity = window.infernoIntensity !== undefined ? window.infernoIntensity : 1;
            eAlp[i] = a * e.bright * flicker * 0.85 * intensity;
            eSiz[i] = e.size * (1 + lr * 0.8) * renderer.getPixelRatio() * intensity;
        }

        for (var j = 0; j < SMOKE; j++) {
            var s = smokes[j];
            s.life++;
            if (s.life >= s.maxLife) { initSmoke(j); continue; }

            var slr = s.life / s.maxLife;
            s.vx += Math.sin(time * 0.5 + s.phase) * 0.015;
            s.x += s.vx * 0.4;
            s.y += s.vy * 0.5;

            sPos[j * 3] = s.x;
            sPos[j * 3 + 1] = s.y;
            sPos[j * 3 + 2] = -1;

            sCol[j * 3] = 0.1;
            sCol[j * 3 + 1] = 0.04;
            sCol[j * 3 + 2] = 0.015;

            var sa;
            if (slr < 0.15) sa = slr / 0.15;
            else if (slr > 0.55) sa = 1 - (slr - 0.55) / 0.45;
            else sa = 1;
            var sIntensity = window.infernoIntensity !== undefined ? window.infernoIntensity : 1;
            sAlp[j] = sa * 0.4 * sIntensity;
            sSiz[j] = s.size * (1 + slr * 1.5) * renderer.getPixelRatio() * sIntensity;
        }

        eGeo.attributes.position.needsUpdate = true;
        eGeo.attributes.customColor.needsUpdate = true;
        eGeo.attributes.size.needsUpdate = true;
        eGeo.attributes.alpha.needsUpdate = true;

        sGeo.attributes.position.needsUpdate = true;
        sGeo.attributes.customColor.needsUpdate = true;
        sGeo.attributes.size.needsUpdate = true;
        sGeo.attributes.alpha.needsUpdate = true;

        renderer.render(scene, camera);
    }

    function onResize() {
        w = window.innerWidth;
        h = window.innerHeight;
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
    }

    var rt;
    window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(onResize, 200);
    });

    animate();
})();
