import React from "react";
import "../styles/NumberContainer.css";

export default class NumberContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: this.props.number,
        };
    }

    render() {
        return (
            <div className="number-container">
                <h6>{this.props.title}</h6>
                <div className="number-display">
                    <h3>{this.props.number}</h3>
                </div>
            </div>
        );
    }
}