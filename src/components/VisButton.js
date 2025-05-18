import React from "react";
import "../styles/VisButton.css";

export default class VisButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentIndex: 0,
            isRunning: false,
            speed: 1000,
        };
    }

    render() {
        return (
            <button className={`visbtn ${this.props.disabled ? "btn-disabled" : ""}`} onClick={
                this.props.disabled ? null : this.props.onClick
            }>
                <img alt={this.props.src} src={this.props.src}></img>
                <h4>{this.props.title}</h4>
            </button>
        );
    }
}