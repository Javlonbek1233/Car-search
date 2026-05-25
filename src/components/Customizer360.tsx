import React, { useState, useRef, useEffect } from 'react';
import { Car, CarColor } from '../types';
import { Shield, Sparkles, Zap, Radio, CircleAlert } from 'lucide-react';

interface Customizer360Props {
  car: Car;
  activeColor: CarColor;
  setActiveColor: (color: CarColor) => void;
}

export default function Customizer360({ car, activeColor, setActiveColor }: Customizer360Props) {
  const [rotation, setRotation] = useState<number>(45); // 0 to 360 degrees
  const [glowOn, setGlowOn] = useState<boolean>(true);
  const [spoilerMode, setSpoilerMode] = useState<'stealth' | 'active' | 'track'>('active');
  const [wheelType, setWheelType] = useState<'aero' | 'forged' | 'carbon'>('forged');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-rotating idle effect
  const [isIdleRotate, setIsIdleRotate] = useState<boolean>(true);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const tick = (time: number) => {
      if (isIdleRotate && !isRotating) {
        if (time - lastTime > 40) {
          setRotation((prev) => (prev + 1) % 360);
          lastTime = time;
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isIdleRotate, isRotating]);

  // Handle canvas drawing for procedural vector preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and support high-PPI resizing
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Setup color palettes
    const bodyColor = activeColor.hex;
    const glowColor = activeColor.glowHex;

    // Center of drawing
    const cx = width / 2;
    const cy = height / 2 + 10;
    
    // Convert rotation state to radians for isometric distortion
    const rad = (rotation * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    // Draw grid shadow underglow
    const shadowGrad = ctx.createRadialGradient(cx, cy + 30, 20, cx, cy + 30, 140);
    shadowGrad.addColorStop(0, glowOn ? `${glowColor}30` : '#00000060');
    shadowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 30, 160, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw active glowing neon tubes
    if (glowOn) {
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 130 + sinR * 10, 40 + cosR * 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset
    }

    // Grid Floor ticks
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy + 35 + i * 15);
      ctx.lineTo(cx + 200, cy + 35 + i * 15);
      ctx.stroke();
    }

    // Dynamic rotation-based coordinate helpers
    // Draw sleek car wireframe chassis
    // Base structural coordinates
    const length = 140;
    const widthOffset = 55;
    const carHeight = 45;

    // Points projected onto 3D space with rotation
    const getProjectedPoint = (x3d: number, y3d: number, z3d: number) => {
      // Rotate x & z around vertical Y axis
      const rx = x3d * cosR - z3d * sinR;
      const rz = x3d * sinR + z3d * cosR;
      
      // Basic perspective flat matrix mapping
      const perspectiveShear = 1 - (rz * 0.001);
      return {
        x: cx + rx * perspectiveShear,
        y: cy + y3d * perspectiveShear + rz * 0.25 // angle shear
      };
    };

    // Define vertices
    const frontLeft = getProjectedPoint(length / 2, 10, -widthOffset / 2);
    const frontRight = getProjectedPoint(length / 2, 10, widthOffset / 2);
    const rearLeft = getProjectedPoint(-length / 2, 12, -widthOffset / 2);
    const rearRight = getProjectedPoint(-length / 2, 12, widthOffset / 2);

    const roofFrontLeft = getProjectedPoint(length * 0.08, -carHeight, -widthOffset * 0.38);
    const roofFrontRight = getProjectedPoint(length * 0.08, -carHeight, widthOffset * 0.38);
    const roofRearLeft = getProjectedPoint(-length * 0.28, -carHeight + 2, -widthOffset * 0.42);
    const roofRearRight = getProjectedPoint(-length * 0.28, -carHeight + 2, widthOffset * 0.42);

    const windshieldLeadLeft = getProjectedPoint(length * 0.28, 0, -widthOffset * 0.45);
    const windshieldLeadRight = getProjectedPoint(length * 0.28, 0, widthOffset * 0.45);

    // DRAW VEHICLE BODY SHAPE (Solid glassmorphism fill)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(frontLeft.x, frontLeft.y);
    ctx.lineTo(frontRight.x, frontRight.y);
    ctx.lineTo(windshieldLeadRight.x, windshieldLeadRight.y);
    ctx.lineTo(roofFrontRight.x, roofFrontRight.y);
    ctx.lineTo(roofRearRight.x, roofRearRight.y);
    ctx.lineTo(rearRight.x, rearRight.y);
    ctx.lineTo(rearLeft.x, rearLeft.y);
    ctx.lineTo(roofRearLeft.x, roofRearLeft.y);
    ctx.lineTo(roofFrontLeft.x, roofFrontLeft.y);
    ctx.lineTo(windshieldLeadLeft.x, windshieldLeadLeft.y);
    ctx.closePath();
    
    // Shiny carbon coat overlay
    const gradientFill = ctx.createLinearGradient(0, 0, width, height);
    gradientFill.addColorStop(0, `${bodyColor}f0`);
    gradientFill.addColorStop(0.5, `${bodyColor}90`);
    gradientFill.addColorStop(1, '#111827e0');
    ctx.fillStyle = gradientFill;
    ctx.fill();

    // Outlining the sports lines (Neon light boundaries)
    ctx.strokeStyle = '#ffffff50';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(frontLeft.x, frontLeft.y);
    ctx.lineTo(frontRight.x, frontRight.y);
    ctx.lineTo(windshieldLeadRight.x, windshieldLeadRight.y);
    ctx.lineTo(roofFrontRight.x, roofFrontRight.y);
    ctx.lineTo(roofRearRight.x, roofRearRight.y);
    ctx.lineTo(rearRight.x, rearRight.y);
    ctx.moveTo(rearLeft.x, rearLeft.y);
    ctx.lineTo(roofRearLeft.x, roofRearLeft.y);
    ctx.lineTo(roofFrontLeft.x, roofFrontLeft.y);
    ctx.lineTo(windshieldLeadLeft.x, windshieldLeadLeft.y);
    ctx.lineTo(frontLeft.x, frontLeft.y);
    ctx.stroke();

    // Draw Windshield
    ctx.fillStyle = '#0f172a99';
    ctx.beginPath();
    ctx.moveTo(windshieldLeadLeft.x, windshieldLeadLeft.y);
    ctx.lineTo(windshieldLeadRight.x, windshieldLeadRight.y);
    ctx.lineTo(roofFrontRight.x, roofFrontRight.y);
    ctx.lineTo(roofFrontLeft.x, roofFrontLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffffa0';
    ctx.stroke();

    // Side window panel
    ctx.fillStyle = '#1e293b77';
    ctx.beginPath();
    ctx.moveTo(roofFrontRight.x, roofFrontRight.y);
    ctx.lineTo(roofRearRight.x, roofRearRight.y);
    ctx.lineTo(rearRight.x, rearRight.y - 8);
    ctx.lineTo(windshieldLeadRight.x, windshieldLeadRight.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Headlight Laser beams (Front)
    const bulbLeft = getProjectedPoint(length * 0.48, 2, -widthOffset * 0.38);
    const bulbRight = getProjectedPoint(length * 0.48, 2, widthOffset * 0.38);

    // Projection beams if lights are active
    if (glowOn) {
      // Glow bulb
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(bulbLeft.x, bulbLeft.y, 4, 0, Math.PI * 2);
      ctx.arc(bulbRight.x, bulbRight.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Laser lines forward
      const beamTargetLeft = getProjectedPoint(length * 0.85, 20, -widthOffset * 0.55);
      const beamTargetRight = getProjectedPoint(length * 0.85, 20, widthOffset * 0.55);

      const lightGlowGrad = ctx.createLinearGradient(bulbLeft.x, bulbLeft.y, beamTargetLeft.x, beamTargetLeft.y);
      lightGlowGrad.addColorStop(0, `${glowColor}d0`);
      lightGlowGrad.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = lightGlowGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bulbLeft.x, bulbLeft.y);
      ctx.lineTo(beamTargetLeft.x, beamTargetLeft.y);
      ctx.moveTo(bulbRight.x, bulbRight.y);
      ctx.lineTo(beamTargetRight.x, beamTargetRight.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(bulbLeft.x, bulbLeft.y, 3, 0, Math.PI * 2);
      ctx.arc(bulbRight.x, bulbRight.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // DRAW REAR SPOILER (Depends on selection)
    const spoilerLeftAnchor = getProjectedPoint(-length * 0.45, -3, -widthOffset * 0.32);
    const spoilerRightAnchor = getProjectedPoint(-length * 0.45, -3, widthOffset * 0.32);
    
    let spoilerH = spoilerMode === 'track' ? 24 : spoilerMode === 'active' ? 12 : 3;
    const spoilerLeftWing = getProjectedPoint(-length * 0.48, -3 - spoilerH, -widthOffset * 0.48);
    const spoilerRightWing = getProjectedPoint(-length * 0.48, -3 - spoilerH, widthOffset * 0.48);

    ctx.strokeStyle = '#0f172a';
    ctx.fillStyle = '#1e293b';
    ctx.lineWidth = 3;
    
    // Aero struts
    ctx.beginPath();
    ctx.moveTo(spoilerLeftAnchor.x, spoilerLeftAnchor.y);
    ctx.lineTo(spoilerLeftWing.x, spoilerLeftWing.y);
    ctx.moveTo(spoilerRightAnchor.x, spoilerRightAnchor.y);
    ctx.lineTo(spoilerRightWing.x, spoilerRightWing.y);
    ctx.stroke();

    // Wing board
    ctx.strokeStyle = activeColor.hex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(spoilerLeftWing.x, spoilerLeftWing.y);
    ctx.lineTo(spoilerRightWing.x, spoilerRightWing.y);
    ctx.stroke();

    // DRAW INTERACTIVE WHEELS (Spinning animation matching rotation)
    const wheelCenterFrontLeft = getProjectedPoint(length * 0.3, 16, -widthOffset * 0.52);
    const wheelCenterFrontRight = getProjectedPoint(length * 0.3, 16, widthOffset * 0.52);
    const wheelCenterRearLeft = getProjectedPoint(-length * 0.3, 16, -widthOffset * 0.52);
    const wheelCenterRearRight = getProjectedPoint(-length * 0.3, 16, widthOffset * 0.52);

    const drawWheel = (center: { x: number; y: number }, r: number) => {
      // Wheel tyre
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Rim detailing based on configuration
      ctx.strokeStyle = wheelType === 'carbon' ? '#ef4444' : wheelType === 'aero' ? activeColor.glowHex : '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(center.x, center.y, r - 4, 0, Math.PI * 2);
      ctx.stroke();

      // Spokes spinning
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      const spokeCount = wheelType === 'aero' ? 5 : 8;
      for (let s = 0; s < spokeCount; s++) {
        const spokeRad = (s * (360 / spokeCount) * Math.PI) / 180 + rad * 1.5;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(center.x + Math.cos(spokeRad) * (r - 4), center.y + Math.sin(spokeRad) * (r - 4));
        ctx.stroke();
      }
    };

    // Draw wheels in dynamic Z order depending on rotation hemisphere
    if (sinR > 0) {
      // Front side visible
      drawWheel(wheelCenterRearLeft, 14);
      drawWheel(wheelCenterFrontLeft, 14);
      drawWheel(wheelCenterRearRight, 14);
      drawWheel(wheelCenterFrontRight, 14);
    } else {
      // Opposite side visible
      drawWheel(wheelCenterRearRight, 14);
      drawWheel(wheelCenterFrontRight, 14);
      drawWheel(wheelCenterRearLeft, 14);
      drawWheel(wheelCenterFrontLeft, 14);
    }

    // Dynamic brand stamp on floor
    ctx.fillStyle = '#ffffff10';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(car.model, cx, cy - 60);

  }, [rotation, activeColor, glowOn, spoilerMode, wheelType, car]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(true);
    setIsIdleRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRotating) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(x / rect.width, 1));
    setRotation(Math.round(percent * 360));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    setIsIdleRotate(false);
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = Math.max(0, Math.min(x / rect.width, 1));
    setRotation(Math.round(percent * 360));
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
      {/* Decorative Neon Halo Background */}
      <div 
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: activeColor.glowHex }}
      />
      <div 
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: activeColor.glowHex }}
      />

      {/* Title & Badge */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold px-2.5 py-1 bg-slate-800/80 rounded-full inline-flex items-center gap-1.5 border border-slate-700 mb-2">
            <Radio size={12} className="text-red-500 animate-pulse" />
            Interactive 360° Studio
          </span>
          <h3 className="text-xl font-bold font-sans text-white tracking-tight">
            Chassis Customizer
          </h3>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-xs block font-mono">DRAG STAGE TO ROLL</span>
          <span className="text-xs text-emerald-400 font-semibold inline-flex items-center gap-1">
            <Zap size={14} /> Spec. Ready
          </span>
        </div>
      </div>

      {/* Canvas Viewport Space */}
      <div 
        className="relative w-full aspect-[16/10] bg-slate-950/40 rounded-2xl border border-slate-800/50 flex justify-center items-center cursor-ew-resize select-none touch-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsRotating(false)}
        onMouseLeave={() => setIsRotating(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsRotating(true)}
        onTouchEnd={() => setIsRotating(false)}
        onTouchMove={handleTouchMove}
      >
        <canvas 
          ref={canvasRef}
          width={480}
          height={300}
          className="w-full h-full max-w-[485px] max-h-[305px] object-contain"
        />

        {/* Dynamic Rotation Angle Display */}
        <div className="absolute top-4 left-4 font-mono text-xs text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
          HEADING: <span className="text-emerald-400">{rotation}°</span>
        </div>

        {/* LED Toggle quick key */}
        <button
          id="customizer-glow-btn"
          onClick={() => setGlowOn(!glowOn)}
          className={`absolute bottom-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-1.5 ${
            glowOn 
              ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-900/80 text-slate-500 border-slate-800'
          }`}
        >
          <Sparkles size={13} style={{ color: glowOn ? activeColor.glowHex : 'currentColor' }} />
          Laser Lights {glowOn ? 'ON' : 'OFF'}
        </button>

        {/* Play Pause button */}
        <button
          id="customizer-idle-btn"
          onClick={() => setIsIdleRotate(!isIdleRotate)}
          className={`absolute bottom-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-300 ${
            isIdleRotate 
              ? 'bg-slate-900/80 text-emerald-400 border-emerald-500/20' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800'
          }`}
        >
          {isIdleRotate ? '■ Lock Orbit' : '▶ Automate Orbit'}
        </button>
      </div>

      {/* Customizer Subpanels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-slate-800/50">
        
        {/* Paint Customizer */}
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 block mb-2 font-semibold">Body Coat Paint</label>
          <div className="flex flex-wrap gap-2.5">
            {car.colors.map((color) => (
              <button
                id={`color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={color.name}
                onClick={() => {
                  setActiveColor(color);
                  setIsIdleRotate(false);
                }}
                className={`relative w-9 h-9 rounded-full transition-all duration-300 flex justify-center items-center ${
                  activeColor.name === color.name ? 'scale-110 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {activeColor.name === color.name && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow" />
                )}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 block mt-2 font-mono uppercase">{activeColor.name}</span>
        </div>

        {/* Spoiler Selection */}
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 block mb-2 font-semibold font-mono">Spoiler Physics</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
            {(['stealth', 'active', 'track'] as const).map((mode) => (
              <button
                id={`spoiler-${mode}`}
                key={mode}
                onClick={() => {
                  setSpoilerMode(mode);
                  setIsIdleRotate(false);
                }}
                className={`text-[10px] uppercase font-bold py-2 rounded-lg transition-all duration-200 ${
                  spoilerMode === mode 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Rim Selection */}
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 block mb-2 font-semibold font-mono">Forged Wheels</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
            {(['aero', 'forged', 'carbon'] as const).map((type) => (
              <button
                id={`wheels-${type}`}
                key={type}
                onClick={() => {
                  setWheelType(type);
                  setIsIdleRotate(false);
                }}
                className={`text-[10px] uppercase font-bold py-2 rounded-lg transition-all duration-200 ${
                  wheelType === type 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-4 text-[11px] text-slate-500 bg-slate-950/30 border border-slate-800/40 p-2.5 rounded-xl flex items-start gap-2">
        <CircleAlert size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <span>Rotating the coordinates triggers responsive real-time isometric rendering. Try dragging the presentation screen above to configure headlight spotlights.</span>
      </div>
    </div>
  );
}
