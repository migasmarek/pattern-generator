export function spCode() {
    return `
        setStepSize(.85);
        setMaxIterations(3)
        let s = getSpace();

        let pointerDown = input();
        let scale = input();
        let size = input();

        let n = vectorContourNoise(s*scale+time*0.14, .05, 6)*.5+.5;
        n = pow(n, vec3(2))

        let color1r = input();
        let color1g = input();
        let color1b = input();
        let color2r = input();
        let color2g = input();
        let color2b = input();
        let color3r = input();
        let color3g = input();
        let color3b = input();
        let rcr = input();
        let rcg = input();
        let rcb = input();

        let color1 = vec3(color1r, color1g, color1b); // #6EDCFF
        let color2 = vec3(color2r, color2g, color2b); // #0ABEFF
        let color3 = vec3(color3r, color3g, color3b);   // #004EFF

        // Interpolate between the colors based on noise value
        let blendedColor = mix(color1, color2, n);
        blendedColor = mix(blendedColor, color3, n);

        // Set the color
        color(blendedColor);

        let metalAmount = input();

        metal(metalAmount);
        setMaxReflections(.2)
        occlusion(-100)

        let displaceX = input();
        let displaceY = input();

        displace(displaceX, displaceY);
        let conto = getRayDirection().x * 10 * sin(time + scale * 1);

        let col = vec3(0, 1, conto);
        reflectiveColor(rcr, rcg, rcb)
        torus(0.4,0.5);
        expand(n.z* (scale /1.5) )

        reset();

        //box(vec3(size));
    `;
  }