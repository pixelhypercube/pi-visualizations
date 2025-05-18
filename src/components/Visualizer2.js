import React from "react";
import { Container,Button } from "react-bootstrap";
import NumberContainer from "./NumberContainer";
import PI from "../pi_million";

export default class Visualizer2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth: 1200,
            canvasHeight: 800,
            speed: 50,
            iterations: 0,
            isPlaying: false,
            currentPos: {
                x: 0,
                y: 0,
            },

            // drawing settings
            distance: 300,

            // translations
            scale: 1,
            offset: {
                x: 0,
                y: 0,
            },
            isDragging: false,
            dragStartPos: {
                x: 0,
                y: 0,
            },

            // permanent storage
            digitPos:[

            ],

            // storage
            lines:[],
        };

        this.canvasRef = React.createRef();
    }

    // listener inputs

    handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        const scaleChange = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;

        this.setState((prevState) => ({
            scale: Math.max(0.1, prevState.scale * scaleChange),
        }), this.renderCanvas); 
    }

    handleMouseDown = (e) => {
        e.preventDefault();
        this.setState({
            isDragging: true,
            dragStartPos: {
                x: e.clientX,
                y: e.clientY,
            },
        });
    };

    handleMouseMove = (e) => {
        e.preventDefault();
        if (!this.state.isDragging) return;

        const dx = e.clientX - this.state.dragStartPos.x;
        const dy = e.clientY - this.state.dragStartPos.y;

        this.setState((prevState) => ({
            offset: {
                x: prevState.offset.x + dx,
                y: prevState.offset.y + dy,
            },
            dragStartPos: {
                x: e.clientX,
                y: e.clientY,
            },
        }), this.renderCanvas); 
    };

    handleMouseUp = (e) => {
        e.preventDefault();
        this.setState({ isDragging: false });
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.translate(this.state.offset.x, this.state.offset.y);
        ctx.scale(this.state.scale, this.state.scale);

        canvas.addEventListener('wheel', this.handleWheel);
        canvas.addEventListener('mousedown', this.handleMouseDown);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseup', this.handleMouseUp);
        canvas.addEventListener('mouseleave', this.handleMouseUp);

        // fill in the digitPos array
        for (let i = 0; i <= 9; i++) {
            const angle = (i * Math.PI) / 5;
            const x = this.state.canvasWidth / 2 + Math.cos(angle) * this.state.distance;
            const y = this.state.canvasHeight / 2 + Math.sin(angle) * this.state.distance;
            this.state.digitPos.push({ x, y });
        }

        // Initialize the canvas
        this.renderCanvas();
    }

    componentWillUnmount() {
        const canvas = this.canvasRef.current;
        canvas.removeEventListener("wheel", this.handleWheel);
        canvas.removeEventListener("mousedown", this.handleMouseDown);
        canvas.removeEventListener("mousemove", this.handleMouseMove);
        canvas.removeEventListener("mouseup", this.handleMouseUp);
        canvas.removeEventListener("mouseleave", this.handleMouseUp);
    }

    // BEIZER

    insertLine1 = (digit) => {
        if (typeof digit !== "number" || isNaN(digit)) {
            console.error("Invalid digit:", digit);
            return;
        }
    
        const { x, y } = this.state.currentPos;
        const { digitPos } = this.state;
        const newX = digitPos[digit].x;
        const newY = digitPos[digit].y;
        
        const controlX = (x + newX) / 2 + (Math.random() - 0.5) * 150; 
        const controlY = (y + newY) / 2 + (Math.random() - 0.5) * 150;
    
        const color = "hsl(" + digit * 36 + ", 100%, 50%)";
    
        this.setState((prevState) => ({
            lines: [
                ...prevState.lines,
                { start: { x, y }, control: { x: controlX, y: controlY }, end: { x: newX, y: newY }, color },
            ],
            currentPos: { x: newX, y: newY },
        }), this.renderCanvas);
    }

    insertLine2 = (digit) => {
        if (typeof digit !== "number" || isNaN(digit)) {
            console.error("Invalid digit:", digit);
            return;
        }
    
        const { x, y } = this.state.currentPos;
        const { digitPos } = this.state;
        const newX = digitPos[digit].x;
        const newY = digitPos[digit].y;
    
        const dx = newX - x;
        const dy = newY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        const angle = Math.atan2(dy, dx);
    
        const controlX = (x + newX) / 2 + Math.cos(angle + Math.PI / 2) * (Math.random() * 0.1 + 0.5) * distance;
        const controlY = (y + newY) / 2 + Math.sin(angle + Math.PI / 2) * (Math.random() * 0.1 + 0.5) * distance;
    
        const color = "hsl(" + digit * 36 + ", 100%, 50%)";
    
        this.setState((prevState) => ({
            lines: [
                ...prevState.lines,
                { start: { x, y }, control: { x: controlX, y: controlY }, end: { x: newX, y: newY }, color },
            ],
            currentPos: { x: newX, y: newY },
        }), this.renderCanvas);
    };

    // STRAIGHT LINE
    // insertLine1 = (digit,prevDigit) => {
    //     if (typeof digit !== "number" || isNaN(digit)) {
    //         console.error("Invalid digit:", digit);
    //         return;
    //     }
    
    //     const { x, y } = this.state.currentPos;
    //     const { digitPos } = this.state;
    //     const newX = digitPos[digit].x;
    //     const newY = digitPos[digit].y;
    //     const prevColor = "hsl(" + prevDigit*36 + ", 100%, 50%)";
    //     const color = "hsl(" + digit*36 + ", 100%, 50%)";
    
    //     this.setState((prevState) => ({
    //         lines: [...prevState.lines, [{ x, y, color:prevColor }, { x: newX, y: newY, color }]],
    //         currentPos: { x: newX, y: newY },
    //     }), this.renderCanvas);
    // }

    renderCanvas = () => {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        ctx.save();
        ctx.scale(this.state.scale, this.state.scale);
        ctx.translate(this.state.offset.x, this.state.offset.y);

        // draw main circle
        ctx.beginPath();
        ctx.arc(this.state.canvasWidth / 2, this.state.canvasHeight / 2, this.state.distance, 0, Math.PI * 2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = "white";

        for (let i = 0; i <= 9; i++) {
            ctx.beginPath();
            const angle = (i * Math.PI) / 5;
            const x = this.state.canvasWidth / 2 + Math.cos(angle) * this.state.distance;
            const y = this.state.canvasHeight / 2 + Math.sin(angle) * this.state.distance;
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
            
            ctx.font = "20px Arial";
            ctx.textAlign = "center"
            ctx.textBaseline = "middle";

            const textX = x + Math.cos(angle) * 20;
            const textY = y + Math.sin(angle) * 20;
            ctx.fillText(i.toString(), textX, textY);
        }

        // draw lines
        for (const line of this.state.lines) {
            ctx.beginPath();
            ctx.moveTo(line.start.x, line.start.y);
            ctx.quadraticCurveTo(line.control.x, line.control.y, line.end.x, line.end.y);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }

    startIterations = () => {
        this.setState({isPlaying:true});
        this.interval = setInterval(() => {
            if (this.state.iterations >= 1000) {
                clearInterval(this.interval);
                this.setState({isPlaying:false});
                return;
            }
            this.insertLine1(parseInt(PI[this.state.iterations]));
            this.setState((prevState) => ({
                iterations: prevState.iterations + 1,
            }));
        }, this.state.speed);
    }

    reset = () => {
        const ctx = this.canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
        this.setState({
            iterations: 0,
            lines: [],
            currentPos: {
                x: this.state.digitPos[3].x,
                y: this.state.digitPos[3].y,
            },
        },this.renderCanvas);
        
    }

    pauseOrPlay1 = () => {
        if (this.state.isPlaying) {
            clearInterval(this.interval);
            this.setState({ isPlaying: false });
        } else {
            this.startIterations();
        }
    }

    pauseOrPlay2 = () => {
        if (this.state.isPlaying) {
            clearInterval(this.interval);
            this.setState({ isPlaying: false });
        } else {
            this.startIterations();
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <h3>Click on 'Play' to start the visualization!</h3>
                    <canvas
                        ref={this.canvasRef}
                        width={this.state.canvasWidth}
                        height={this.state.canvasHeight}
                        style={{
                            border: "2px solid black",
                            width:"100%",
                            cursor: this.state.isDragging ? "grabbing" : "grab",
                        }}
                    />
                    <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
                        <NumberContainer title={"Current Digit"} number={PI[this.state.iterations]}></NumberContainer>
                        <NumberContainer title={"Digit Position"} number={this.state.iterations}></NumberContainer>
                    </div>
                    <div width="100%" style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
                        {/* <Button onClick={this.startIterations} disabled={this.state.isPlaying}>Start Iterations</Button> */}
                        <Button onClick={this.pauseOrPlay1}>
                            {this.state.isPlaying ? "Pause" : "Play"}
                        </Button>
                        <Button onClick={this.reset}>Reset</Button>
                    </div>
                </Container>
            </div>
        );
    }
}