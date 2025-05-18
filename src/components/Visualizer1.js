import React from "react";
import { Button, Container } from "react-bootstrap";
import PI from "../pi_million.js";
import NumberContainer from "./NumberContainer.js";

export default class Visualizer1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasWidth:1200,
            canvasHeight:800,
            speed:50,
            iterations:0,
            isPlaying:false,

            // drawing settings
            distance:10,
            
            // translations
            scale:1,
            offset:{
                x:0,
                y:0,
            },
            isDragging:false,
            dragStartPos:{
                x:0,
                y:0,
            },

            // storage
            lines:[],
        };

        this.canvasRef = React.createRef();
    }

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

        // set the states for centerPos after the canvas is mounted
        this.setState({
            currentPos: {
                x: this.state.canvasWidth / 2,
                y: this.state.canvasHeight / 2,
            },
        });
    }

    componentWillUnmount() {
        const canvas = this.canvasRef.current;
        canvas.removeEventListener("wheel", this.handleWheel);
        canvas.removeEventListener("mousedown", this.handleMouseDown);
        canvas.removeEventListener("mousemove", this.handleMouseMove);
        canvas.removeEventListener("mouseup", this.handleMouseUp);
        canvas.removeEventListener("mouseleave", this.handleMouseUp);
    }

    drawLine = (digit) => {
        if (typeof digit !== "number" || isNaN(digit)) {
            console.error("Invalid digit:", digit);
            return;
        }
    
        const angle = (digit / 10) * Math.PI * 2;
        const { x, y } = this.state.currentPos;
        const newX = x + this.state.distance * Math.cos(angle);
        const newY = y + this.state.distance * Math.sin(angle);
        const color = "hsl(" + digit*36 + ", 100%, 50%)";

        this.setState((prevState) => ({
            lines: [...prevState.lines, { startX: x, startY: y, endX: newX, endY: newY, color }],
            currentPos: { x: newX, y: newY },
        }), this.renderCanvas);
    }

    renderCanvas = () => {
        const ctx = this.canvasRef.current.getContext("2d");

        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        
        ctx.translate(this.state.offset.x, this.state.offset.y);
        ctx.scale(this.state.scale, this.state.scale);

        this.state.lines.forEach((line) => {
            ctx.beginPath();
            ctx.moveTo(line.startX, line.startY);
            ctx.lineTo(line.endX, line.endY);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.closePath();
        })
    }

    startIterations = () => {
        this.setState({isPlaying:true});
        // const ctx = this.canvasRef.current.getContext('2d');
        // ctx.fillStyle = "white";
        // ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
        // ctx.strokeStyle = "black";
        // ctx.lineWidth = 1;
        // ctx.strokeRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        this.interval = setInterval(() => {
            if (this.state.iterations >= 1000000) {
                clearInterval(this.interval);
                this.setState({isPlaying:false});
                return;
            }
            this.drawLine(parseInt(PI[this.state.iterations]));
            this.setState((prevState) => ({
                iterations: prevState.iterations + 1,
            }));
        }, this.state.speed);
    }

    reset = () => {
        const ctx = this.canvasRef.current.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        this.setState({
            currentPos: {
                x: this.state.canvasWidth / 2,
                y: this.state.canvasHeight / 2,
            },
            scale: 1,
            offset: { x: 0, y: 0 },
            isPlaying: false,
            iterations: 0,
            lines: [],
        });
    }
    pauseOrPlay = () => {
        if (this.state.isPlaying) {
            // pause the interval
            clearInterval(this.interval);
            this.interval = null;
            this.setState({ isPlaying: false });
        } else {
            // resume the interval
            this.startIterations();
        }
    };

    render() {
        return (
            <Container>
                <h3>Click on 'Play' to start the visualization!</h3>
                <canvas style={{
                    border: "2px solid black",
                    width:"100%",
                    cursor: this.state.isDragging ? "grabbing" : "grab",
                }} width={this.state.canvasWidth} height={this.state.canvasHeight} ref={this.canvasRef}></canvas>
                <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
                    <NumberContainer title={"Current Digit"} number={PI[this.state.iterations]}></NumberContainer>
                    <NumberContainer title={"Digit Position"} number={this.state.iterations}></NumberContainer>
                </div>
                <div width="100%" style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
                    {/* <Button onClick={this.startIterations} disabled={this.state.isPlaying}>Start Iterations</Button> */}
                    <Button onClick={this.pauseOrPlay}>
                        {this.state.isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button onClick={this.reset}>Reset</Button>
                </div>
            </Container>
        )
    }
}