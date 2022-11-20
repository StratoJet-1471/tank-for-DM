class StyleData {
    constructor(styleDataObj) {
        for(let key in styleDataObj) {
            this[key] = styleDataObj[key];
        }        
    }
    toString() {
        let styleStr = "";
        for(let key in this) {
            const cssProperty = key + ": " + this[key] + "; ";
            styleStr += cssProperty;
        }
        return styleStr;
    }
}

class TracksWheel {
    constructor(radius = 25, startRotationAngle = 0) {
        this._radius = radius;
        this._rotationAngle = startRotationAngle;
        this._wheelBorderInPx = 3;

        this._styleData = new StyleData({
            position: "absolute",

            display: "flex",
            "justify-content": "center",
            border: `${this._wheelBorderInPx}px solid rgb(47, 79, 79)`,
            "border-radius": "50%",
            background: "radial-gradient(rgb(200, 130, 35), rgb(213, 180, 77))",
        
            "box-sizing": "border-box",
        
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,

            transform: `rotate(${this._rotationAngle}deg)`
        });

        this._node = document.createElement("div");

        const rotationIndicatorStyleData = new StyleData({
            width: 0,
            height: `${radius - this._wheelBorderInPx}px`,            
            border: "1px solid rgb(170, 108, 21)"
        });
        const rotationIndicator = document.createElement("div");
        this._node.appendChild(rotationIndicator);
        rotationIndicator.setAttribute("style", rotationIndicatorStyleData);
        this._node.setAttribute("style", this._styleData);

    }

    render({parentNode, top, left, bottom, right}) {
        if(top !== undefined) this._styleData.top = top;
        if(bottom !== undefined) this._styleData.bottom = bottom;
        if(left !== undefined) this._styleData.left = left;
        if(right !== undefined) this._styleData.right = right;

        this._node.setAttribute("style", this._styleData);
                 
        if(!this._node.parentNode) parentNode.appendChild(this._node);
    }

    rotate(deltaAngle) {        
        this._rotationAngle += deltaAngle;
        if(this._rotationAngle >= 360) this._rotationAngle -= 360;
        else if(this._rotationAngle <= -360) this._rotationAngle += 360;
        //tankHead.setAttribute("style", `transform: rotate(${tankHeadRotationAngle}deg);`)
        this._styleData.transform = `rotate(${this._rotationAngle}deg)`;
        this._node.setAttribute("style", this._styleData);
    }
}

class Tank {
    constructor() {
        this._styleData = new StyleData({
            display: "flex",
            "flex-direction": "column",
        });   
        
        this._node = document.createElement("div");
        this._node.setAttribute("style", this._styleData);

        this._node.innerHTML = `
            <div class="tank__head-container">
                <div class="tank__head-turret" style="z-index: 1"></div>
                <div class="tank__head" style="z-index: 2"></div>
                <div class="tank__gun-container" style="z-index: 1">
                    <div class="gun__mask"></div>
                    <div class="gun"></div>
                    <div class="gun__muzzle-brake"></div>
                </div>
            </div>
            <div class="tank__body-container">
                <div class="body__body"></div>
                <div class="body__tracks-container">
                    <div class="body__tracks-half-container">
                        <div class="body__tracks-left"></div>
                    </div>
                    <div class="body__tracks-half-container">
                        <div class="body__tracks-right"></div>
                    </div>
                </div>
            </div>
        `;

        this._tankBodyContainerWidth = 400;
        this._tankHeadContainerMarginLeft = Math.floor(this._tankBodyContainerWidth / 3);
        this._tankHeadWidth = 150;
        this._gunLeft = Math.floor(this._tankHeadWidth * 0.8);
        this._fullGunWidth = 200;
        
        this._gunAngleInGrad = 0;

        this._fullTankWidth = this._tankHeadContainerMarginLeft + this._gunLeft + this._fullGunWidth*Math.cos(this._gunAngleInGrad * Math.PI/180);

        this._wheelRadius = 25;
        this._wheelsCount = 7;
        this._wheelStartRotationAngle = 10;
        this._wheelsBottomInPx = 6;
        this._firstLeftWheelLeftInPx = 19;
        this._wheelsXCoordsDeltaInPx = 50;
        this._wheels = [];

        for(let i = 0; i < this._wheelsCount; i++) {
            const newWheel = new TracksWheel(this._wheelRadius, this._wheelStartRotationAngle);
            this._wheels.push(newWheel);
    
            newWheel.render({
                parentNode: this._node,
                left: `${this._firstLeftWheelLeftInPx + i*this._wheelsXCoordsDeltaInPx}px`,
                bottom: `${this._wheelsBottomInPx}px`            
            })
        }
    }
    get fullTankWidth() {
        return this._fullTankWidth;
    }
    get trackWheelRadius() {
        return this._wheelRadius;
    }
    render({parentNode}) {
        this._node.setAttribute("style", this._styleData);

        if(!this._node.parentNode) parentNode.appendChild(this._node);
    }
    moveTank(deltaLeftCoord) {
        const deltaAngle = (deltaLeftCoord * 180) / (Math.PI * this._wheelRadius);
        this._styleData.left += deltaLeftCoord;
        this._wheels.forEach((wheel) => wheel.rotate(deltaAngle));
        this._node.setAttribute("style", this._styleData);
    }
    rotateWheels(deltaAngle) {
        this._wheels.forEach((wheel) => wheel.rotate(deltaAngle));
    }
}