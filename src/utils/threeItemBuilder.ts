import * as THREE from 'three';

/**
 * Procedural 3D model generator for DreamHome items using Three.js primitives
 */
export function create3DItemMesh(
  type: string,
  name: string,
  colorHex: string
): THREE.Group {
  const group = new THREE.Group();
  const normType = type.toLowerCase();
  const normName = name.toLowerCase();

  const parseColor = (hex: string, fallback = 0x4a5568): number => {
    try {
      const c = new THREE.Color(hex);
      return c.getHex();
    } catch {
      return fallback;
    }
  };

  const itemColor = parseColor(colorHex);
  const darkerColor = new THREE.Color(itemColor).multiplyScalar(0.75).getHex();
  const lighterColor = new THREE.Color(itemColor).offsetHSL(0, 0, 0.1).getHex();
  const woodColor = 0x8a5a36;
  const darkWood = 0x5a381e;
  const metalGold = 0xd4af37;
  const metalBlack = 0x222222;

  // 1. SOFA
  if (normType === 'sofa') {
    const isSectional = normName.includes('sectional');
    const isCurved = normName.includes('curved');
    const isLoveseat = normName.includes('loveseat');

    const width = isSectional ? 2.6 : isLoveseat ? 1.5 : 2.0;
    const depth = 0.9;
    const seatHeight = 0.42;

    const fabricMat = new THREE.MeshStandardMaterial({
      color: itemColor,
      roughness: 0.85,
      metalness: 0.05,
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: lighterColor,
      roughness: 0.8,
    });
    const woodLegMat = new THREE.MeshStandardMaterial({
      color: darkWood,
      roughness: 0.5,
    });

    // Base frame
    const baseGeo = new THREE.BoxGeometry(width, 0.18, depth);
    const base = new THREE.Mesh(baseGeo, fabricMat);
    base.position.y = 0.22;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Backrest
    const backHeight = 0.55;
    const backGeo = new THREE.BoxGeometry(width, backHeight, 0.22);
    const back = new THREE.Mesh(backGeo, fabricMat);
    back.position.set(0, 0.22 + 0.09 + backHeight / 2, -depth / 2 + 0.11);
    back.castShadow = true;
    group.add(back);

    // Armrests
    const armWidth = 0.18;
    const armHeight = 0.42;
    const armGeo = new THREE.BoxGeometry(armWidth, armHeight, depth);
    const leftArm = new THREE.Mesh(armGeo, fabricMat);
    leftArm.position.set(-width / 2 + armWidth / 2, 0.22 + armHeight / 2 - 0.05, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    if (!isSectional) {
      const rightArm = new THREE.Mesh(armGeo, fabricMat);
      rightArm.position.set(width / 2 - armWidth / 2, 0.22 + armHeight / 2 - 0.05, 0);
      rightArm.castShadow = true;
      group.add(rightArm);
    }

    // Cushions
    const numCushions = isLoveseat ? 2 : isSectional ? 3 : 2;
    const availWidth = width - armWidth * (isSectional ? 1 : 2);
    const cWidth = availWidth / numCushions;
    for (let i = 0; i < numCushions; i++) {
      const cGeo = new THREE.BoxGeometry(cWidth - 0.04, 0.16, depth - 0.24);
      const cMesh = new THREE.Mesh(cGeo, cushionMat);
      const cx = -width / 2 + (isSectional ? 0 : armWidth) + cWidth * (i + 0.5);
      cMesh.position.set(cx, 0.38, 0.04);
      cMesh.castShadow = true;
      group.add(cMesh);

      // Back cushions
      const bcGeo = new THREE.BoxGeometry(cWidth - 0.04, 0.38, 0.15);
      const bcMesh = new THREE.Mesh(bcGeo, cushionMat);
      bcMesh.position.set(cx, 0.6, -depth / 2 + 0.22);
      bcMesh.rotation.x = 0.08;
      bcMesh.castShadow = true;
      group.add(bcMesh);
    }

    // Sectional chaise extension
    if (isSectional) {
      const chaiseGeo = new THREE.BoxGeometry(0.85, 0.34, 1.1);
      const chaise = new THREE.Mesh(chaiseGeo, fabricMat);
      chaise.position.set(width / 2 - 0.42, 0.26, depth / 2 + 0.45);
      chaise.castShadow = true;
      chaise.receiveShadow = true;
      group.add(chaise);
    }

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.018, 0.14, 8);
    const legPositions = [
      [-width / 2 + 0.1, -depth / 2 + 0.1],
      [width / 2 - 0.1, -depth / 2 + 0.1],
      [-width / 2 + 0.1, depth / 2 - 0.1],
      [width / 2 - 0.1, depth / 2 - 0.1],
    ];
    legPositions.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, woodLegMat);
      leg.position.set(lx, 0.07, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    // Accent Pillows
    const pillowGeo = new THREE.BoxGeometry(0.28, 0.28, 0.1);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xc89b6a, roughness: 0.9 });
    const p1 = new THREE.Mesh(pillowGeo, pillowMat);
    p1.position.set(-width / 2 + 0.35, 0.52, -0.15);
    p1.rotation.y = 0.4;
    p1.rotation.z = -0.1;
    group.add(p1);
  }

  // 2. BED
  else if (normType === 'bed') {
    const isCanopy = normName.includes('canopy');
    const bWidth = 1.9;
    const bLength = 2.1;

    const woodMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.6 });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xf4f0ea, roughness: 0.9 });
    const duvetMat = new THREE.MeshStandardMaterial({
      color: lighterColor,
      roughness: 0.85,
    });
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

    // Platform Base
    const baseGeo = new THREE.BoxGeometry(bWidth, 0.28, bLength);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = 0.14;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Headboard
    const headHeight = 1.1;
    const headGeo = new THREE.BoxGeometry(bWidth + 0.08, headHeight, 0.14);
    const headboard = new THREE.Mesh(headGeo, woodMat);
    headboard.position.set(0, headHeight / 2, -bLength / 2 + 0.07);
    headboard.castShadow = true;
    group.add(headboard);

    // Mattress
    const matGeo = new THREE.BoxGeometry(bWidth - 0.12, 0.26, bLength - 0.2);
    const mattress = new THREE.Mesh(matGeo, mattressMat);
    mattress.position.set(0, 0.4, 0.06);
    mattress.castShadow = true;
    group.add(mattress);

    // Duvet / Blanket (covering bottom 2/3 of bed)
    const duvetGeo = new THREE.BoxGeometry(bWidth - 0.08, 0.08, (bLength - 0.2) * 0.72);
    const duvet = new THREE.Mesh(duvetGeo, duvetMat);
    duvet.position.set(0, 0.54, 0.25);
    duvet.castShadow = true;
    group.add(duvet);

    // Pillows (2 left and right)
    [-0.45, 0.45].forEach((px) => {
      const pGeo = new THREE.BoxGeometry(0.48, 0.14, 0.32);
      const pillow = new THREE.Mesh(pGeo, pillowMat);
      pillow.position.set(px, 0.58, -bLength / 2 + 0.45);
      pillow.rotation.x = -0.2;
      pillow.castShadow = true;
      group.add(pillow);
    });

    // Canopy 4 posts if canopy bed
    if (isCanopy) {
      const postGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8);
      const corners = [
        [-bWidth / 2 + 0.05, -bLength / 2 + 0.05],
        [bWidth / 2 - 0.05, -bLength / 2 + 0.05],
        [-bWidth / 2 + 0.05, bLength / 2 - 0.05],
        [bWidth / 2 - 0.05, bLength / 2 - 0.05],
      ];
      corners.forEach(([cx, cz]) => {
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(cx, 1.1, cz);
        group.add(post);
      });
      // Canopy top rails
      const topBarXGeo = new THREE.BoxGeometry(bWidth, 0.04, 0.04);
      const top1 = new THREE.Mesh(topBarXGeo, woodMat);
      top1.position.set(0, 2.2, -bLength / 2 + 0.05);
      group.add(top1);
      const top2 = new THREE.Mesh(topBarXGeo, woodMat);
      top2.position.set(0, 2.2, bLength / 2 - 0.05);
      group.add(top2);
    }
  }

  // 3. CHAIR
  else if (normType === 'chair') {
    const isArmchair = normName.includes('armchair') || normName.includes('accent') || normName.includes('lounge');
    const fabricMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.8 });
    const legMat = new THREE.MeshStandardMaterial({ color: darkWood, roughness: 0.5 });

    if (isArmchair) {
      // Accent armchair
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.16, 0.75), fabricMat);
      seat.position.y = 0.38;
      seat.castShadow = true;
      group.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.52, 0.14), fabricMat);
      back.position.set(0, 0.65, -0.32);
      back.rotation.x = 0.1;
      back.castShadow = true;
      group.add(back);

      // Armrests
      const armGeo = new THREE.BoxGeometry(0.12, 0.28, 0.7);
      const leftArm = new THREE.Mesh(armGeo, fabricMat);
      leftArm.position.set(-0.35, 0.5, 0);
      group.add(leftArm);
      const rightArm = new THREE.Mesh(armGeo, fabricMat);
      rightArm.position.set(0.35, 0.5, 0);
      group.add(rightArm);
    } else {
      // Dining chair
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.48), fabricMat);
      seat.position.y = 0.44;
      seat.castShadow = true;
      group.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.45, 0.04), fabricMat);
      back.position.set(0, 0.68, -0.22);
      group.add(back);
    }

    // 4 legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.35, 8);
    [
      [-0.26, -0.26],
      [0.26, -0.26],
      [-0.26, 0.26],
      [0.26, 0.26],
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.18, lz);
      leg.castShadow = true;
      group.add(leg);
    });
  }

  // 4. TABLE
  else if (normType === 'table') {
    const isCoffee = normName.includes('coffee') || normName.includes('side') || normName.includes('round');
    const tableMat = new THREE.MeshStandardMaterial({
      color: itemColor,
      roughness: 0.4,
      metalness: 0.1,
    });
    const legMat = new THREE.MeshStandardMaterial({ color: darkWood, roughness: 0.5 });

    if (normName.includes('round')) {
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32), tableMat);
      top.position.y = isCoffee ? 0.42 : 0.74;
      top.castShadow = true;
      group.add(top);

      // Central base pedestal or 3 legs
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.18, isCoffee ? 0.4 : 0.72, 16),
        tableMat
      );
      pedestal.position.y = (isCoffee ? 0.4 : 0.72) / 2;
      pedestal.castShadow = true;
      group.add(pedestal);
    } else {
      const w = isCoffee ? 1.2 : 1.7;
      const d = isCoffee ? 0.65 : 0.85;
      const h = isCoffee ? 0.42 : 0.75;

      const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), tableMat);
      top.position.y = h;
      top.castShadow = true;
      group.add(top);

      const legGeo = new THREE.CylinderGeometry(0.025, 0.02, h - 0.05, 8);
      [
        [-w / 2 + 0.08, -d / 2 + 0.08],
        [w / 2 - 0.08, -d / 2 + 0.08],
        [-w / 2 + 0.08, d / 2 - 0.08],
        [w / 2 - 0.08, d / 2 - 0.08],
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, (h - 0.05) / 2, lz);
        leg.castShadow = true;
        group.add(leg);
      });
    }
  }

  // 5. DESK
  else if (normType === 'desk') {
    const deskMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: metalBlack, roughness: 0.3 });

    // Desktop top
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.7), deskMat);
    top.position.y = 0.74;
    top.castShadow = true;
    group.add(top);

    // Left drawers cabinet
    const drawerGeo = new THREE.BoxGeometry(0.35, 0.5, 0.6);
    const drawer = new THREE.Mesh(drawerGeo, deskMat);
    drawer.position.set(-0.45, 0.46, 0);
    drawer.castShadow = true;
    group.add(drawer);

    // Metal legs on right
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.72, 8);
    const leg1 = new THREE.Mesh(legGeo, metalMat);
    leg1.position.set(0.6, 0.36, -0.28);
    group.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, metalMat);
    leg2.position.set(0.6, 0.36, 0.28);
    group.add(leg2);

    // Desk laptop accessory
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.01, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
    );
    laptopBase.position.set(0.05, 0.77, 0.05);
    group.add(laptopBase);
    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.2, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 })
    );
    laptopScreen.position.set(0.05, 0.87, -0.05);
    laptopScreen.rotation.x = -0.15;
    group.add(laptopScreen);
  }

  // 6. BOOKSHELF / WARDROBE
  else if (normType === 'bookshelf' || normType === 'wardrobe') {
    const isBookshelf = normType === 'bookshelf';
    const w = 1.0;
    const h = 1.85;
    const d = isBookshelf ? 0.38 : 0.55;

    const woodMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.6 });

    // Outer cabinet box
    const outerGeo = new THREE.BoxGeometry(w, h, d);
    const outer = new THREE.Mesh(outerGeo, woodMat);
    outer.position.y = h / 2;
    outer.castShadow = true;
    outer.receiveShadow = true;
    group.add(outer);

    if (isBookshelf) {
      // Books rows in bright colors
      const bookColors = [0xb45a46, 0x4a5568, 0x718574, 0xd4af37, 0x222222];
      for (let shelf = 0; shelf < 4; shelf++) {
        const sy = 0.3 + shelf * 0.42;
        for (let b = 0; b < 6; b++) {
          const bMat = new THREE.MeshStandardMaterial({
            color: bookColors[(shelf + b) % bookColors.length],
            roughness: 0.7,
          });
          const book = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.24, d - 0.08),
            bMat
          );
          book.position.set(-0.35 + b * 0.065, sy + 0.12, 0.02);
          group.add(book);
        }
      }
    } else {
      // Wardrobe handles
      const handleMat = new THREE.MeshStandardMaterial({ color: metalGold, metalness: 0.9, roughness: 0.2 });
      const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16), handleMat);
      h1.position.set(-0.04, 1.0, d / 2 + 0.015);
      group.add(h1);
      const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16), handleMat);
      h2.position.set(0.04, 1.0, d / 2 + 0.015);
      group.add(h2);
    }
  }

  // 7. NIGHTSTAND
  else if (normType === 'nightstand') {
    const woodMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.55 });
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.45), woodMat);
    stand.position.y = 0.32;
    stand.castShadow = true;
    group.add(stand);

    // Little golden drawer pull knob
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 12, 12),
      new THREE.MeshStandardMaterial({ color: metalGold, metalness: 0.8, roughness: 0.2 })
    );
    knob.position.set(0, 0.38, 0.24);
    group.add(knob);
  }

  // 8. TV STAND
  else if (normType === 'tv stand' || normType === 'tvstand') {
    const standMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.6 });
    const tvBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 0.45), standMat);
    tvBase.position.y = 0.24;
    tvBase.castShadow = true;
    group.add(tvBase);

    // Big TV Screen
    const screenGeo = new THREE.BoxGeometry(1.3, 0.74, 0.04);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.6,
    });
    const tv = new THREE.Mesh(screenGeo, screenMat);
    tv.position.set(0, 0.85, 0);
    tv.castShadow = true;
    group.add(tv);

    // TV Stand legs
    const standLeg = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.04, 0.25),
      new THREE.MeshStandardMaterial({ color: metalBlack, roughness: 0.4 })
    );
    standLeg.position.set(0, 0.46, 0);
    group.add(standLeg);
  }

  // 9. OTTOMAN / POUF / BENCH
  else if (normType === 'ottoman' || normType === 'poufs' || normType === 'pouf' || normType === 'bench') {
    const isPouf = normType.includes('pouf') || normName.includes('round');
    const fabricMat = new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.9 });

    if (isPouf) {
      const pouf = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.38, 24), fabricMat);
      pouf.position.y = 0.2;
      pouf.castShadow = true;
      group.add(pouf);
    } else {
      const w = normType === 'bench' ? 1.2 : 0.8;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 0.18, 0.46), fabricMat);
      seat.position.y = 0.38;
      seat.castShadow = true;
      group.add(seat);

      const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.28, 8);
      const legMat = new THREE.MeshStandardMaterial({ color: darkWood, roughness: 0.5 });
      [
        [-w / 2 + 0.08, -0.16],
        [w / 2 - 0.08, -0.16],
        [-w / 2 + 0.08, 0.16],
        [w / 2 - 0.08, 0.16],
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, 0.14, lz);
        group.add(leg);
      });
    }
  }

  // 10. RUG
  else if (normType === 'rug') {
    const rugGeo = new THREE.BoxGeometry(2.4, 0.015, 1.8);
    const rugMat = new THREE.MeshStandardMaterial({
      color: itemColor,
      roughness: 0.95,
      metalness: 0.0,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.y = 0.008;
    rug.receiveShadow = true;
    group.add(rug);

    // Border fringe trim
    const borderGeo = new THREE.BoxGeometry(2.46, 0.016, 1.86);
    const borderMat = new THREE.MeshStandardMaterial({
      color: lighterColor,
      roughness: 0.9,
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = 0.006;
    border.receiveShadow = true;
    group.add(border);
  }

  // 11. PLANT
  else if (normType === 'plant') {
    const potMat = new THREE.MeshStandardMaterial({
      color: itemColor,
      roughness: 0.5,
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e6f40,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });

    // Ceramic pot
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.42, 20), potMat);
    pot.position.y = 0.22;
    pot.castShadow = true;
    group.add(pot);

    // Lush plant foliage leaves
    const numLeaves = normName.includes('monstera') ? 9 : 14;
    for (let i = 0; i < numLeaves; i++) {
      const angle = (i / numLeaves) * Math.PI * 2;
      const leafGeo = new THREE.SphereGeometry(0.18, 8, 8);
      leafGeo.scale(1.2, 0.1, 0.6);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(
        Math.cos(angle) * 0.24,
        0.45 + (i % 3) * 0.15,
        Math.sin(angle) * 0.24
      );
      leaf.rotation.set(0.35, angle, 0.3);
      leaf.castShadow = true;
      group.add(leaf);
    }
  }

  // 12. LAMP (Floor or Table)
  else if (normType === 'lamp') {
    const isFloor = normName.includes('floor') || normName.includes('arc');
    const metalMat = new THREE.MeshStandardMaterial({ color: metalGold, metalness: 0.8, roughness: 0.2 });
    const shadeMat = new THREE.MeshStandardMaterial({
      color: itemColor,
      roughness: 0.3,
      emissive: new THREE.Color(0xffeedd),
      emissiveIntensity: 0.3,
    });

    if (isFloor) {
      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 24), metalMat);
      base.position.y = 0.015;
      group.add(base);

      // Tall pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.45, 12), metalMat);
      pole.position.y = 0.74;
      pole.castShadow = true;
      group.add(pole);

      // Shade
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.32, 24, 1, true), shadeMat);
      shade.position.y = 1.45;
      shade.castShadow = true;
      group.add(shade);

      // Small point light inside shade
      const lampPoint = new THREE.PointLight(0xffecd2, 0.8, 4);
      lampPoint.position.y = 1.42;
      group.add(lampPoint);
    } else {
      // Table lamp
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.18, 16), metalMat);
      base.position.y = 0.1;
      group.add(base);

      const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.22, 20), shadeMat);
      shade.position.y = 0.26;
      group.add(shade);
    }
  }

  // 13. WALL ITEMS (Mirror, Wall Art, Clock)
  else if (normType === 'mirror') {
    const frameMat = new THREE.MeshStandardMaterial({ color: metalGold, metalness: 0.9, roughness: 0.1 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xddedfa,
      metalness: 0.95,
      roughness: 0.05,
    });

    const isRound = normName.includes('round') || normName.includes('oval');
    if (isRound) {
      const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 32), frameMat);
      frame.rotation.x = Math.PI / 2;
      group.add(frame);
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.045, 32), glassMat);
      glass.rotation.x = Math.PI / 2;
      group.add(glass);
    } else {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.04), frameMat);
      group.add(frame);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.02, 0.045), glassMat);
      group.add(glass);
    }
  } else if (normType === 'wall art') {
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.65, 0.03),
      new THREE.MeshStandardMaterial({ color: darkWood, roughness: 0.6 })
    );
    group.add(frame);
    const canvas = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.57, 0.035),
      new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.8 })
    );
    group.add(canvas);
  } else if (normType === 'clock') {
    const frame = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.03, 32),
      new THREE.MeshStandardMaterial({ color: darkWood, roughness: 0.6 })
    );
    frame.rotation.x = Math.PI / 2;
    group.add(frame);
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.035, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    dial.rotation.x = Math.PI / 2;
    group.add(dial);
  }

  // Fallback generic box
  else {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: itemColor, roughness: 0.7 })
    );
    box.position.y = 0.3;
    box.castShadow = true;
    group.add(box);
  }

  return group;
}
