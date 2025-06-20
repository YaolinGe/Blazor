// High-performance live data rendering with Canvas and Web Workers
class LiveDataRenderer {
    constructor(canvasId, dotNetRef) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dotNetRef = dotNetRef;
        
        // Performance settings
        this.maxDataPoints = 4000; // Maximum points to display
        this.dataBuffer = [];
        this.renderBuffer = new Float32Array(this.maxDataPoints * 2); // x,y pairs
        
        // Rendering state
        this.animationId = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fpsCounter = 0;
        this.lastFpsUpdate = 0;
        this.currentFps = 0;
        
        // Chart configuration
        this.padding = { top: 20, right: 20, bottom: 40, left: 60 };
        this.chartWidth = this.canvas.width - this.padding.left - this.padding.right;
        this.chartHeight = this.canvas.height - this.padding.top - this.padding.bottom;
        
        // Data range
        this.yMin = -1.5;
        this.yMax = 1.5;
        this.xRange = 2000; // Show last 2000 samples
        
        // Initialize
        this.setupCanvas();
        this.startRenderLoop();
        
        console.log('LiveDataRenderer initialized');
    }
    
    setupCanvas() {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Optimize canvas for animations
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
    
    addDataPoints(newData) {
        // Add new data to buffer
        this.dataBuffer.push(...newData);
        
        // Keep only the last maxDataPoints
        if (this.dataBuffer.length > this.maxDataPoints) {
            const excess = this.dataBuffer.length - this.maxDataPoints;
            this.dataBuffer.splice(0, excess);
        }
        
        // Prepare render buffer for next frame
        this.updateRenderBuffer();
    }
    
    updateRenderBuffer() {
        const dataLength = this.dataBuffer.length;
        const startIndex = Math.max(0, dataLength - this.xRange);
        const visibleData = this.dataBuffer.slice(startIndex);
        
        // Convert to screen coordinates
        for (let i = 0; i < visibleData.length; i++) {
            const x = this.padding.left + (i / (this.xRange - 1)) * this.chartWidth;
            const y = this.padding.top + this.chartHeight - 
                     ((visibleData[i] - this.yMin) / (this.yMax - this.yMin)) * this.chartHeight;
            
            this.renderBuffer[i * 2] = x;
            this.renderBuffer[i * 2 + 1] = y;
        }
        
        this.visibleDataLength = visibleData.length;
    }
    
    startRenderLoop() {
        const render = (timestamp) => {
            this.updateFps(timestamp);
            this.draw();
            this.animationId = requestAnimationFrame(render);
        };
        
        this.animationId = requestAnimationFrame(render);
    }
    
    updateFps(timestamp) {
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = timestamp;
            
            // Notify Blazor component of FPS update
            if (this.dotNetRef) {
                this.dotNetRef.invokeMethodAsync('OnChartUpdated', this.currentFps);
            }
        }
        this.frameCount++;
    }
    
    draw() {
        // Clear canvas with dark background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw axes
        this.drawAxes();
        
        // Draw data line
        if (this.visibleDataLength > 1) {
            this.drawDataLine();
        }
        
        // Draw real-time info
        this.drawInfo();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        
        // Horizontal grid lines
        const ySteps = 10;
        for (let i = 0; i <= ySteps; i++) {
            const y = this.padding.top + (i / ySteps) * this.chartHeight;
            this.ctx.moveTo(this.padding.left, y);
            this.ctx.lineTo(this.padding.left + this.chartWidth, y);
        }
        
        // Vertical grid lines
        const xSteps = 10;
        for (let i = 0; i <= xSteps; i++) {
            const x = this.padding.left + (i / xSteps) * this.chartWidth;
            this.ctx.moveTo(x, this.padding.top);
            this.ctx.lineTo(x, this.padding.top + this.chartHeight);
        }
        
        this.ctx.stroke();
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding.left, this.padding.top);
        this.ctx.lineTo(this.padding.left, this.padding.top + this.chartHeight);
        this.ctx.stroke();
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding.left, this.padding.top + this.chartHeight);
        this.ctx.lineTo(this.padding.left + this.chartWidth, this.padding.top + this.chartHeight);
        this.ctx.stroke();
        
        // Y-axis labels
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const value = this.yMax - (i / ySteps) * (this.yMax - this.yMin);
            const y = this.padding.top + (i / ySteps) * this.chartHeight;
            this.ctx.fillText(value.toFixed(1), 10, y + 4);
        }
        
        // X-axis label
        this.ctx.fillText('Samples', this.padding.left + this.chartWidth / 2 - 30, 
                         this.canvas.height - 10);
        
        // Y-axis label
        this.ctx.save();
        this.ctx.translate(15, this.padding.top + this.chartHeight / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Amplitude', -30, 0);
        this.ctx.restore();
    }
    
    drawDataLine() {
        // Use optimized path drawing
        this.ctx.strokeStyle = '#00ff41'; // Matrix green
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        // Start path
        this.ctx.moveTo(this.renderBuffer[0], this.renderBuffer[1]);
        
        // Draw line segments
        for (let i = 1; i < this.visibleDataLength; i++) {
            this.ctx.lineTo(this.renderBuffer[i * 2], this.renderBuffer[i * 2 + 1]);
        }
        
        this.ctx.stroke();
        
        // Draw current value indicator
        if (this.visibleDataLength > 0) {
            const lastIndex = (this.visibleDataLength - 1) * 2;
            const lastX = this.renderBuffer[lastIndex];
            const lastY = this.renderBuffer[lastIndex + 1];
            
            this.ctx.fillStyle = '#ff4444';
            this.ctx.beginPath();
            this.ctx.arc(lastX, lastY, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    drawInfo() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px monospace';
        
        const info = [
            `FPS: ${this.currentFps}`,
            `Data Points: ${this.dataBuffer.length}`,
            `Visible: ${this.visibleDataLength}`
        ];
        
        info.forEach((text, index) => {
            this.ctx.fillText(text, this.canvas.width - 150, 20 + (index * 20));
        });
    }
    
    clear() {
        this.dataBuffer = [];
        this.visibleDataLength = 0;
        this.draw();
    }
    
    getCurrentFps() {
        return this.currentFps;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Module exports
let renderer = null;

export function initializeChart(canvasId, dotNetRef) {
    if (renderer) {
        renderer.destroy();
    }
    renderer = new LiveDataRenderer(canvasId, dotNetRef);
    console.log('Chart initialized');
}

export function addDataPoints(data) {
    if (renderer) {
        renderer.addDataPoints(data);
    }
}

export function clearChart() {
    if (renderer) {
        renderer.clear();
    }
}

export function getCurrentFps() {
    return renderer ? renderer.getCurrentFps() : 0;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.destroy();
    }
});
